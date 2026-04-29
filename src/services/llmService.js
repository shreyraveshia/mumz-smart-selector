import { products } from '../data/products';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openrouter/auto:free';

// ── BUDGET EXTRACTION ─────────────────────────────────────────────────────────
// Shared by preFilter (scoring) and getRecommendations (post-processing).
function extractBudget(query) {
  const q = query.toLowerCase();
  const m =
    q.match(/(?:under|below|max|أقل من|بأقل من)\s*(?:aed|درهم)?\s*(\d+)/i) ||
    q.match(/(?:aed|درهم)\s*(\d+)/i) ||
    q.match(/(\d+)\s*(?:aed|درهم)/i);
  return m ? parseInt(m[1], 10) : null;
}

// ── CATEGORY KEYWORDS ─────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  stroller: ['stroller', 'pram', 'buggy', 'pushchair', 'عربة', 'عربة أطفال'],
  car_seat: ['car seat', 'carseat', 'booster', 'isofix', 'مقعد سيارة', 'مقعد'],
  carrier: ['carrier', 'sling', 'wrap', 'babywear', 'حامل', 'حمالة'],
  feeding: ['bottle', 'feeding', 'high chair', 'warmer', 'food', 'weaning', 'زجاجة', 'تغذية', 'كرسي'],
  toys: ['toy', 'play', 'learn', 'tablet', 'blocks', 'noise', 'sleep', 'لعبة', 'تعلم', 'نوم'],
};

// ── RELEVANCE GATE ────────────────────────────────────────────────────────────
// If none of these intent words appear in the query AND no category keyword
// matches, the query is not about baby products — block before LLM call.
const RELEVANCE_WORDS = [
  // English — must indicate actual baby/product intent
  'baby', 'infant', 'newborn', 'toddler', 'child', 'kid', 'mother', 'mom',
  'mum', 'parent', 'gift', 'safe', 'safety', 'month', 'year',
  'product', 'buy', 'best', 'recommend', 'looking',
  'stroller', 'pram', 'seat', 'carrier', 'bottle', 'toy', 'feeding', 'play',
  'sleep', 'travel', 'fold', 'harness', 'ergonomic', 'lightweight',
  // Arabic
  'طفل', 'رضيع', 'مولود', 'هدية', 'آمن', 'سلامة', 'عمر',
  'شهر', 'سنة', 'منتج', 'أفضل',
];


function isRelevantQuery(query, detectedCat) {
  const q = query.toLowerCase();
  // Pass if a category keyword was already matched
  if (detectedCat) return true;
  // Pass if at least one relevance word appears
  return RELEVANCE_WORDS.some(w => q.includes(w));
}


// ── CLIENT-SIDE PRE-FILTER ────────────────────────────────────────────────────
function preFilter(query) {
  const q = query.toLowerCase();
  const budget = extractBudget(query);

  // Detect category from keywords
  let detectedCat = null;
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some(k => q.includes(k))) { detectedCat = cat; break; }
  }

  // Score every product
  const scored = products.map(p => {
    let score = 0;
    if (detectedCat && p.category === detectedCat) score += 10;
    if (budget) {
      if (p.price <= budget) score += 5;
      else if (p.price <= budget * 1.3) score += 2;
    }
    const allText = [p.name, ...p.features, ...p.best_for].join(' ').toLowerCase();
    const queryWords = q.split(/\s+/).filter(w => w.length > 3);
    queryWords.forEach(w => { if (allText.includes(w)) score += 1; });
    return { ...p, _score: score };
  });

  const top = scored.sort((a, b) => b._score - a._score).slice(0, 10);
  if (top.length < 5) {
    const rest = products.filter(p => !top.find(t => t.id === p.id));
    top.push(...rest.slice(0, 5 - top.length));
  }
  // Return top products + metadata for the relevance gate
  return { products: top, detectedCat };

}

// ── COMPACT PRODUCT ───────────────────────────────────────────────────────────
function compact(p) {
  return {
    id: p.id,
    name: p.name,
    name_ar: p.name_ar,
    cat: p.category,
    price: p.price,
    age: p.age_range,
    feat: p.features.slice(0, 4),
    for: p.best_for.slice(0, 3),
  };
}

// ── PROMPT BUILDER ────────────────────────────────────────────────────────────
function buildPrompt(userQuery, filteredProducts) {
  return `You are Mumz Smart Selector — a baby product AI for Mumzworld UAE.
Output ONLY valid JSON. No markdown, no extra text.

PRODUCTS (${filteredProducts.length} pre-selected):
${JSON.stringify(filteredProducts.map(compact))}

QUERY: "${userQuery}"

RULES:
- Return the most relevant products (up to 3) → "recommendations" format
- IMPORTANT: Only recommend products that truly match the core intent. If only one product fits (e.g. only one "warmer" exists), only return that one. Do not recommend unrelated items just to fill the list.
- Budget too low / no fit → edge_type "no_match"
- Too vague (e.g. "something good") → edge_type "vague_query"
- Conflicting (e.g. "premium under AED 50") → edge_type "conflicting"
- Out of scope (medicine, legal) → edge_type "out_of_scope"
- IMPORTANT: Only recommend products whose price is at or below the user's stated budget.

FORMAT A:
{"type":"recommendations","query_understood_en":"...","query_understood_ar":"...","recommendations":[{"rank":1,"product_id":"...","name":"...","name_ar":"...","price":0,"currency":"AED","reason_en":"one sentence","reason_ar":"جملة واحدة","safety_note_en":"...","safety_note_ar":"...","budget_fit":"within_budget","match_highlights":["f1","f2"],"match_highlights_ar":["م1","م2"]}]} // Array can be 1, 2, or 3 items

FORMAT B:
{"type":"edge_case","edge_type":"no_match","message_en":"...","message_ar":"...","suggestion_en":"...","suggestion_ar":"...","closest_price_en":"AED X or null","closest_price_ar":"null"}

JSON:`;
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export async function getRecommendations(userQuery) {
  const { products: filtered, detectedCat } = preFilter(userQuery);

  // ── RELEVANCE GATE (client-side, no LLM call needed) ─────────────────────
  // Blocks queries like "virat kohli under 500 AED" that have a budget but
  // no recognizable baby product intent — the small LLM would just pick
  // random in-budget products otherwise.
  if (!isRelevantQuery(userQuery, detectedCat)) {
    return {
      type: 'edge_case',
      edge_type: 'out_of_scope',
      message_en: `I couldn’t find any baby product intent in your query. I’m a baby product selector — try something like "stroller for 1-year-old" or "gift for newborn".`,
      message_ar: 'لم أجد أي قصد لمنتج أطفال في طلبك. أنا مخصص لمنتجات الأطفال — جرب مثلاً: “عربة لطفل عمره سنة”.',
      suggestion_en: 'Try: "Best stroller for 1-year-old under AED 800" or "Gift for newborn under AED 200"',
      suggestion_ar: 'جرب: “أفضل عربة لطفل عمره سنة بأقل من 800 درهم”',
      closest_price_en: null,
      closest_price_ar: null,
    };
  }

  // ── CATEGORY-BUDGET MISMATCH GATE (client-side) ───────────────────────────
  const budget = extractBudget(userQuery);
  if (detectedCat && budget) {
    const catProducts = products.filter(p => p.category === detectedCat);
    const withinBudget = catProducts.filter(p => p.price <= budget);

    if (withinBudget.length === 0 && catProducts.length > 0) {
      const closest = catProducts.sort((a, b) => a.price - b.price)[0];
      return {
        type: 'edge_case',
        edge_type: 'no_match',
        message_en: `No products in this category found within AED ${budget}. Closest is ${closest.name} at AED ${closest.price}.`,
        message_ar: `لم يتم العثور على منتجات في هذه الفئة ضمن ${budget} درهم. الأقرب هو ${closest.name_ar} بسعر ${closest.price} درهم.`,
        suggestion_en: `Try raising your budget to at least AED ${closest.price}.`,
        suggestion_ar: `حاول رفع ميزانيتك إلى ${closest.price} درهم على الأقل.`,
        closest_price_en: `AED ${closest.price}`,
        closest_price_ar: `${closest.price} درهم`,
      };
    }
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mumz-smart-selector.demo',
      'X-Title': 'Mumz Smart Selector',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: buildPrompt(userQuery, filtered) }],
      temperature: 0.2,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `API error ${response.status}`;
    if (msg.includes('Provider returned error') || response.status === 429) {
      throw new Error('The AI model is busy (free tier limit). Please wait 10–15 seconds and try again.');
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from AI');

  // Strip markdown code fences if the model wraps the JSON
  const cleaned = content
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/\s*```$/im, '')
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in AI response');

  let parsed;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new Error('Could not parse AI response as JSON');
  }

  // ── POST-PROCESSING: hard budget enforcement ──────────────────────────────
  // The LLM sometimes recommends products slightly above the stated budget.
  // We remove them deterministically here — the user's budget is a hard cap.
  // Having 1–2 results is perfectly fine (user confirmed this).
  // Note: `budget` is already extracted above.
  if (budget && parsed.type === 'recommendations' && parsed.recommendations?.length) {
    parsed.recommendations = parsed.recommendations
      .filter(r => r.price <= budget)         // hard cutoff — no exceptions
      .map((r, i) => ({ ...r, rank: i + 1 })); // re-rank sequentially

    // If no products survive the budget filter → return a no_match edge case
    if (parsed.recommendations.length === 0) {
      // Find closest price from products that actually fit the category
      const targetProducts = detectedCat 
        ? products.filter(p => p.category === detectedCat)
        : filtered;
      
      const minPrice = Math.min(...targetProducts.map(p => p.price));
      return {
        type: 'edge_case',
        edge_type: 'no_match',
        message_en: `No products found within AED ${budget}. Closest options in this category start from AED ${minPrice}.`,
        message_ar: `لم يتم العثور على منتجات ضمن ${budget} درهم. أقرب خياراتنا في هذه الفئة تبدأ من ${minPrice} درهم.`,
        suggestion_en: 'Try raising your budget slightly or broadening the product type.',
        suggestion_ar: 'حاول رفع ميزانيتك قليلاً أو توسيع نطاق بحثك.',
        closest_price_en: `AED ${minPrice}`,
        closest_price_ar: `${minPrice} درهم`,
      };
    }
  }

  return parsed;
}
