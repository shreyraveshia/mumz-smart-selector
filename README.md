# Submission: Track B - Mumz Smart Selector ✨

## 1. Executive Summary
I built **Mumz Smart Selector**, an AI-powered decision engine for first-time parents. It solves the problem of "Decision Fatigue after Filtering" by allowing users to describe their specific needs in natural language (English or Arabic). The system reasons across a curated catalog of 25 products, enforcing hard budget constraints and safety rules, and surfaces exactly 3 ranked recommendations with personalized justifications and an "AI Spotlight" visual effect in the catalog.

## 2. Prototype Access
*   **Live URL:** [https://mumz-smart-selector.vercel.app](https://mumz-smart-selector.vercel.app)
*   **Video Walkthrough:** [Google Drive Link](https://drive.google.com/file/d/1Mg7vKCEFzm1Z_oKiv11yWWf5fwaEJmrP/view?usp=drive_link)

---

## 3. Discovery & Strategy

### The Persona: Fatima, 29, Dubai
*   **Situation:** First-time mother, 8 months pregnant, setting up her baby registry.
*   **Goal:** Needs a stroller but is overwhelmed by technical jargon (ISOFIX, 5-point harness, i-Size).
*   **What felt broken:** Shopping on Mumzworld as Fatima, I found that filters tell you **what** a product is (Price, Brand), but not **if it's right for you**. I was surprised that even after filtering for "Travel Strollers," I still had to read 15 descriptions to find one that was "cabin approved." It felt like the burden of research was entirely on me.
*   **The Choice:** I chose to solve **Decision Fatigue**. It’s high-leverage because this is the point where a customer leaves the site to "ask a friend on WhatsApp." If I can be that "friend" on-site, I save the sale.

### Why AI?
AI is the right tool because the solution requires **reasoning over unstructured intent**.
*   **Filters:** Fatima doesn't know she needs "EVA wheels" for urban sidewalks.
*   **AI Solution:** An LLM can "read" product features like a human assistant, understand that "urban use" implies a need for "shock absorbers," and explain *why* it fits in her language.

---

## 4. Show Your Work: Technical Journey

### Tools Used
*   **React + Vite:** Frontend framework for instant HMR and rapid prototyping.
*   **OpenRouter:** API gateway used to access the `openrouter/auto:free` routing engine.
*   **Antigravity AI:** Used for pair-programming, UI architecture, and debugging.
*   **Vanilla CSS:** Custom design system for the "AI Spotlight" and Dark/Light mode glassmorphism.

### Timeline Log (30-Minute Increments)
*   **0:00 - 1:00:** Discovery: Shopping as "Fatima," identifying the filter-fatigue problem, and hand-crafting the 25-product bilingual dataset.
*   **1:00 - 1:30:** Initial LLM integration. Tackled context limits by implementing client-side pre-filtering (78% token reduction).
*   **1:30 - 2:00:** UI Development: Responsive grid, Dark/Light mode, and full Arabic RTL support.
*   **2:00 - 2:30:** Logic Hardening: Implemented relevance gates and deterministic budget enforcement.
*   **2:30 - 3:00:** Bug fixing: Solved the "Silicone Spoon" hallucination by implementing keyword-level budget gating.
*   **3:00 - 3:30:** API Crisis: Phi-3 and Gemini 2.0 Free endpoints were deprecated/busy. Spent 30 mins rotating models.
*   **3:30 - 4:00:** Resolution: Switched to `openrouter/auto:free` for stability and simplified the budget gate for better precision.
*   **4:00 - 5:00:** Documentation, Final QA across Light/Dark modes, and Vercel deployment.

### Prompts That Mattered
*   **Prompt 1 (The Context Shave):** "Here are the top 10 most relevant products..." (Revised from "Here are all 25...") to save tokens and stay within free-tier limits.
*   **Prompt 2 (The Math Fix):** "Return UP TO 3 products... do not recommend unrelated items just to fill the list." (Revised to stop the AI from calling a spoon a 'warmer').
*   **Prompt 3 (The Bilingual Bridge):** Used strict JSON schema with `reason_en` and `reason_ar` to prevent the UI from breaking during RTL flips.

### Dead Ends
1.  **System Role:** Gemma 3 4B on OpenRouter ignored system instructions. **Lesson:** Move all rules to the user prompt for small models.
2.  **LLM Budgeting:** Tried letting AI do price comparisons. It failed. **Lesson:** Math belongs in JavaScript, reasoning belongs in the LLM.
3.  **Specific Model IDs:** Attempted to hardcode `phi-3` and `gemini-2.0`. Both were busy or deprecated during build. **Lesson:** Use an auto-router (`openrouter/auto:free`) for mission-critical free-tier apps.

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
