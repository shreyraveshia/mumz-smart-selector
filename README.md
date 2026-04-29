# Mumz Smart Selector ✨

> AI-powered baby product decision engine for Mumzworld — turns confused browsing into instant, reasoned recommendations.

## Live Demo

🔗 **[mumz-smart-selector.vercel.app](https://mumz-smart-selector.vercel.app)** *(deploy link — update after Vercel deploy)*

## What It Does

A mother types what she needs in plain English or Arabic:
> *"Best stroller for a 1-year-old under AED 800"*

The AI reads the product catalog, reasons about age, budget, and features, and returns exactly 3 ranked picks — each with a one-line personalised reason, a safety note, and a budget badge.

All 25 products are always visible on screen. When results arrive, the 3 AI-picked cards **glow gold** while the other 22 dim — making the AI feel like it's scanning a shelf and pointing.

## Features

- 🤖 **Natural language search** — no dropdowns, no filters, just describe what you need
- 🌐 **Bilingual EN/AR** — all AI output in both languages
- 🔄 **RTL layout** — full Arabic right-to-left support
- ☀️🌙 **Light / Dark mode** — system preference default, persisted to localStorage
- 🎯 **AI spotlight effect** — 3 picked cards glow, rest dim
- 🗂️ **Category filter tabs** — browse all 25 products by category
- 🚫 **Smart edge cases** — handles vague, conflicting, out-of-scope, and no-match queries
- 💰 **Hard budget enforcement** — no product above your stated budget ever shown

## How It Works

```
User types query (EN or AR)
        ↓
Client-side relevance gate (blocks non-product queries)
        ↓
Client-side pre-filter (selects top 10 relevant from 25 products)
        ↓
OpenRouter API → google/gemma-3-4b-it:free (LLM)
        ↓
LLM reasons across catalog → returns structured bilingual JSON
        ↓
Post-processing: hard budget enforcement
        ↓
3 ranked recommendation cards + catalog spotlight effect
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system, dark glassmorphism) |
| AI | OpenRouter API → `google/gemma-3-4b-it:free` |
| i18n | Custom EN/AR translation system + dynamic RTL |
| Data | 25 mock products (hand-crafted, not scraped) |
| Deployment | Vercel |

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/mumz-smart-selector.git
cd mumz-smart-selector

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_OPENROUTER_API_KEY=your_key_here" > .env

# 4. Run dev server
npm run dev
# → http://localhost:5173
```

Get a free OpenRouter API key at [openrouter.ai](https://openrouter.ai)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Logo, language toggle, theme toggle
│   ├── SearchInput.jsx     # Natural language input + example chips
│   ├── ProductCard.jsx     # Detailed AI recommendation card
│   ├── ResultsGrid.jsx     # 3-card result layout
│   ├── MiniProductCard.jsx # Compact catalog card (normal/spotlight/dimmed)
│   ├── CatalogGrid.jsx     # 25-product grid with category tabs
│   ├── EdgeCaseMessage.jsx # 5 edge case displays
│   └── LoadingState.jsx    # Animated loading indicator
├── services/
│   └── llmService.js       # OpenRouter API + pre-filter + prompt + post-processing
├── data/
│   └── products.js         # 25 mock bilingual products
├── i18n/
│   └── translations.js     # EN + AR UI strings
├── App.jsx                 # State machine + layout
└── index.css               # Full design system + light/dark/RTL
```

## Built for Mumzworld Product Challenge

This prototype was built as a solution to decision fatigue on Mumzworld — the problem where users still face overwhelming choice even after filtering. See the [full discovery write-up and show-your-work documentation](./DISCOVERY.md).
