# Submission: Track B - Mumz Smart Selector ✨

## 1. Executive Summary
**Mumz Smart Selector** is an AI-powered baby product decision engine built as a standalone web app. It solves a real problem on Mumzworld: users still face overwhelming choice even after filtering. A mother types what she needs in plain language (English or Arabic) — *"best stroller for a 1-year-old under AED 800"* — and the AI reasons across a curated catalog, surfaces exactly 3 ranked picks with personalized justifications, and highlights them using an interactive "AI Spotlight" visual effect.

## 2. Prototype Access
*   **Live URL:** [https://mumz-smart-selector.vercel.app](https://mumz-smart-selector.vercel.app)
*   **Video Walkthrough:** [Google Drive Link](https://drive.google.com/file/d/1Mg7vKCEFzm1Z_oKiv11yWWf5fwaEJmrP/view?usp=drive_link)

---

## 3. Discovery & Strategy: The Real Problem

### Persona: Fatima, 29, Dubai
*   **Situation:** First-time mother, 8 months pregnant, speaks Arabic at home.
*   **Goal:** Needs a stroller but is overwhelmed by technical jargon (ISOFIX, 5-point harness, i-Size).
*   **What Fatima Experiences Today:**
    1. She searches "stroller" and gets 200+ results.
    2. She uses filters (age, price, brand) but is still left with 40+ products.
    3. She opens 10 tabs, reads 10 descriptions, and realizes she still doesn't know which is "best" for her specific use case.
    4. She closes her laptop overwhelmed and asks her sister.
*   **What felt broken:** Shopping as Fatima, I found that filters tell you **what** a product is (Price, Brand), but not **if it's right for you**. I was surprised that even after filtering for "Travel Strollers," I still had to read 15 descriptions to find one that was "cabin approved." It felt like the burden of research was entirely on me.

### Why AI? (The reasoning over filtering)

| Solution | Why it fails for this problem |
|----------|-------------------------------|
| **Better filters** | Fatima doesn't know *what* to filter for (e.g. ISOFIX vs 5-point). |
| **"Top Picks"** | Static and generic; doesn't know her specific budget or age gap. |
| **Rule-based system** | Cannot understand natural phrases like "I have a narrow hallway." |
| **LLM Selector** | **Understands intent, reasons across criteria, and explains the "Why."** |

**Why this problem matters most:** Other problems seen (like slow loads or search quality) are UX/Ops fixes. **Decision fatigue** is a cognitive burden. It is the one problem that a "button" cannot solve because it requires understanding the user's *specific situation* and reasoning across multiple product dimensions simultaneously. That is exactly what language models are designed to do.

---

## 4. Show Your Work: Technical Journey

### The Stack
```
Browser → React (Vite) → Client-side Pre-filter → OpenRouter → LLM (Gemini/Gemma) → Deterministic Post-filter → UI
```

### Technical "Hybrid" Architecture
We used a **Hybrid Intelligence** approach to overcome the limitations of free-tier LLMs:
1.  **Pre-filter (JS):** Scans the catalog and extracts the top 10 relevant products. This reduced our prompt size by **78%**, preventing context-window errors.
2.  **Relevance Gate:** A client-side "bouncer" that blocks non-baby queries (e.g., "Virat Kohli") before calling the API, saving tokens.
3.  **LLM Reasoning:** The model handles the "soft" reasoning (why a specific stroller is good for city life).
4.  **Post-filter (JS):** Deterministically enforces hard budget caps. AI treats budget as a suggestion; code treats it as a rule.

### Problems Tackled (The Messy Reality)

| Problem | Root Cause | Solution |
|---------|-----------|---------|
| **"No endpoints found"** | Specific free models were deprecated during the build. | Switched to `openrouter/auto:free` for resilient auto-routing. |
| **"Provider error"** | Catalog size exceeded the small model's context limit. | Built a JS-based scoring engine to only send the top 10 relevant products. |
| **"Spoon is a warmer"** | Forced the AI to return 3 results, causing hallucinations. | Updated prompt to allow 1-3 results based on *true* relevance. |
| **Math Failures** | AI recommended an AED 850 stroller for an 800 budget. | Implemented a deterministic budget cutoff in the post-processing layer. |

### Prompts That Mattered
*   **Prompt 1 (The Context Shave):** "Here are the top 10 most relevant products..." (Revised from "Here are all 25...") to save tokens and stay within free-tier limits.
*   **Prompt 2 (The Math Fix):** "Return UP TO 3 products... do not recommend unrelated items just to fill the list." (Revised to stop the AI from calling a spoon a 'warmer').
*   **Prompt 3 (The Precision Rule):** Added `Only return products that truly match the intent.` This builds trust by showing only 1 result if only 1 exists.

### Dead Ends
1.  **System Role:** Gemma 3 4B on OpenRouter ignored system instructions. **Lesson:** Move all rules to the user prompt for small models.
2.  **LLM Math:** Tried letting AI do price comparisons. It failed. **Lesson:** Math belongs in JavaScript, reasoning belongs in the LLM.
3.  **Specific Model IDs:** Attempted to hardcode `phi-3` and `gemini-2.0`. Both were unstable during build. **Lesson:** Use an auto-router (`openrouter/auto:free`) for mission-critical free-tier apps.

### Reflection
*   **Surprise:** Small models (4B-7B) are surprisingly good at Arabic reasoning but terrible at keeping track of numbers (prices).
*   **Next 5 Hours:** I would implement "Comparison Mode" and a "Safety Score" derived from cross-referencing multiple safety certifications.

---

## 5. Measurement Plan
*   **Leading Indicator:** Search-to-Add-to-Cart Conversion Rate for Smart Selector users vs. traditional filter users.
*   **5% Experiment:** Success = 10% lift in "Add to Cart" in the stroller category. Flatline = High engagement with AI but users return to filters to "verify," indicating a lack of trust.

## 6. Submission Details

**Track:** B (Product Challenge)

**AI Usage Note (Max 5 Lines):**
*   **OpenRouter (auto:free):** Performed bilingual product reasoning and safety justifications.
*   **Antigravity AI:** Handled React UI scaffolding, logic state management, and real-time debugging.
*   **Claude, ChatGPT, Google Gemini:** Used during the Discovery phase for persona brainstorming and data synthesis.

**Time Log (Max 5 Lines):**
*   **Discovery:** 1 Hour (Persona research & data synthesis).
*   **Building:** 2.5 Hours (React scaffolding, LLM integration, Crisis management).
*   **Polishing:** 1.5 Hours (RTL layout, Dark mode, Documentation & Deploy).
*   **Total Time:** 5 Hours (Honest log: including 60 mins of API endpoint troubleshooting).
