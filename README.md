# Submission: Track B - Mumz Smart Selector ✨

## 1. Executive Summary
**Mumz Smart Selector** is an AI-powered baby product decision engine built as a standalone web app. It solves a real problem on Mumzworld: users still face overwhelming choice even after filtering. A mother types what she needs in plain language (English or Arabic) — *"best stroller for a 1-year-old under AED 800"* — and the AI reads through a curated product catalog, reasons about age fit, budget, and features, then surfaces exactly 3 ranked picks with a one-line personalised reason, a safety note, and a budget badge. The product catalog is always visible on screen; when results arrive, the 3 AI-picked cards glow gold while the other 22 dim — making the AI feel like it's scanning a physical shelf and pointing.

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

### The Pick: Decision Fatigue after Filtering
I chose to solve **Decision Fatigue**. While standard filters narrow the catalog, they don't lead to a *decision*. For baby products, this is acute because:
*   Parents are first-timers with zero prior knowledge.
*   Stakes feel high (safety, child wellbeing).
*   Category terminology is confusing (ISOFIX, travel system).

### Why AI?
AI is the right tool because this problem **cannot be solved with a button**. A button can filter, but only an AI can understand Fatima's *specific situation* (age, budget, use case, priority) and reason across multiple product dimensions simultaneously to provide a "Why this fits you" explanation.

---

## 4. Show Your Work: Technical Journey

### Tools Used
*   **React + Vite:** Frontend framework for instant HMR and rapid prototyping.
*   **OpenRouter:** API gateway using `openrouter/auto:free` for resilient model fallback.
*   **Antigravity AI:** Used for pair-programming, UI architecture, and real-time debugging.
*   **Vanilla CSS:** Custom design system for the "AI Spotlight" and Dark/Light mode glassmorphism.

### Timeline Log (30-Minute Increments)
*   **0:00 - 1:00:** Discovery: Shopping as "Fatima," identifying the filter-fatigue bottleneck, and crafting the bilingual dataset.
*   **1:00 - 1:30:** Initial LLM integration. Tackled context limits by implementing client-side pre-filtering (78% token reduction).
*   **1:30 - 2:00:** UI Development: Responsive grid, Dark/Light mode, and full Arabic RTL support.
*   **2:00 - 2:30:** Logic Hardening: Implemented relevance gates and deterministic budget enforcement.
*   **2:30 - 3:00:** Bug fixing: Solved the "Silicone Spoon" hallucination by implementing keyword-level budget gating.
*   **3:00 - 4:00:** API Crisis: Phi-3 and Gemini 2.0 Free endpoints were busy/deprecated. Spent 60 mins rotating models and fixing duplicate variable bugs.
*   **4:00 - 4:30:** Resolution: Switched to `openrouter/auto:free` for stability and polished the "Precision" logic.
*   **4:30 - 5:00:** Documentation, Final QA across themes, and Vercel deployment.

### Prompts That Mattered
*   **Prompt 1 (The Context Shave):** "Here are the top 10 most relevant products..." (Revised from "Here are all 25...") to save tokens and stay within free-tier limits.
*   **Prompt 2 (The Math Fix):** "Return UP TO 3 products... do not recommend unrelated items just to fill the list." (Revised to stop the AI from calling a spoon a 'warmer').
*   **Prompt 3 (The Precision Rule):** Added `Only return products that truly match the intent.` This builds trust by showing only 1 result if only 1 exists.

### Dead Ends
1.  **System Role:** Gemma 3 4B on OpenRouter ignored system instructions. **Lesson:** Move all rules to the user prompt for small models.
2.  **LLM Math:** Tried letting AI do price comparisons. It failed. **Lesson:** Math belongs in JavaScript, reasoning belongs in the LLM.
3.  **Specific Model IDs:** Attempted to hardcode `phi-3` and `gemini-2.0`. Both were unstable during build. **Lesson:** Use an auto-router (`openrouter/auto:free`) for mission-critical free-tier apps.

### Cuts from Scope
*   **Voice-to-Search:** Cut to focus on reasoning logic.
*   **Compare Table:** Cut in favor of the "Spotlight" UI to reduce visual clutter.

---

## 5. Measurement Plan
*   **Leading Indicator:** Search-to-Add-to-Cart Conversion Rate (Week 1).
*   **5% Experiment:** Deploy to 5% of stroller category traffic. Success = 10% lift in "Add to Cart." Flatline = High engagement but users revert to traditional filters.

---

## 6. AI Usage Note & Time Log
*   **AI Usage:** Used `openrouter/auto:free` for bilingual reasoning. Built with Antigravity AI for scaffolding and debugging.
*   **Time Log:** Total 5 Hours. (1h Discovery, 2.5h Building/Debugging, 1.5h Polishing/Docs).
