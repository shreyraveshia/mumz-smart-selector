# Submission: Track B - Mumz Smart Selector ✨

## 1. Executive Summary
I built **Mumz Smart Selector**, an AI-powered decision engine for first-time parents. It solves the problem of "Decision Fatigue after Filtering" by allowing users to describe their specific needs in natural language (English or Arabic). The system reasons across a curated catalog of 25 products, enforcing hard budget constraints and safety rules, and surfaces exactly 3 ranked recommendations with personalized justifications and an "AI Spotlight" visual effect in the catalog.

## 2. Prototype Access
*   **Live URL:** [https://mumz-smart-selector.vercel.app](https://mumz-smart-selector.vercel.app)
*   **Video Walkthrough (Loom):** [PASTE_YOUR_LOOM_LINK_HERE]

---

## 3. Discovery & Strategy

### The Persona: Fatima, 29, Dubai
*   **Situation:** First-time mother, 8 months pregnant, setting up her baby registry.
*   **Goal:** Needs a stroller but is overwhelmed by technical jargon (ISOFIX, 5-point harness, i-Size).
*   **The Problem:** Even after filtering for "Age" and "Price," she is left with 40+ products. She has to open every single page to see if it's "lightweight" or "cabin approved."

### The "High-Leverage" Pick
I chose to solve **Decision Fatigue after Filtering**. While most e-commerce problems are UI-based, helping a mother choose between three very similar strollers is a cognitive burden that filters cannot solve. This requires reasoning, not just filtering.

### Why AI?
AI is the right tool because the solution requires **reasoning over unstructured intent**.
*   **Filters:** Fatima doesn't know *what* to filter for.
*   **AI Solution:** An LLM can "read" product features like a human assistant, understand that "urban use" implies a need for "shock absorbers," and explain *why* it fits in her language.

---

## 4. Show Your Work: Technical Journey

### Timeline Log (Total Time: ~4.5 Hours)
*   **0:00 - 1:00:** Discovery, Persona definition, and hand-crafting the 25-product bilingual dataset.
*   **1:00 - 2:00:** Initial LLM integration. Tackled context limits by implementing client-side pre-filtering (78% token reduction).
*   **2:00 - 3:00:** UI Development: Responsive grid, Dark/Light mode, and full Arabic RTL support.
*   **3:00 - 4:00:** Logic Hardening: Implemented relevance gates and deterministic budget enforcement.
*   **4:00 - 4:30:** Bug fixing (Hallucination prevention) and Vercel deployment.

### Prompts That Mattered
*   **Evolution 1 (Context Overflow):** Initially sent 25 products. Failed. **Revision:** Switched to a "Top 10" pre-filtered list sent to the LLM.
*   **Evolution 2 (Budget Hallucination):** Initially asked LLM to stay under budget. It failed. **Revision:** Moved budget enforcement to a hard JavaScript filter after the LLM call.
*   **Evolution 3 (Arabic Formatting):** Initially got mixed prose. **Revision:** Defined a strict JSON schema with `reason_en` and `reason_ar` keys.

### Dead Ends
1.  **System Role:** Gemma 3 4B rejected system messages. Moved everything to the `user` message.
2.  **Category-only Gating:** Blocking by category was too broad. Switched to **Keyword-level gating** for accuracy.
3.  **LLM Math:** Tried letting AI do price comparisons. It's too unreliable for hard caps.

### Cuts from Scope
*   **Dynamic Model Switching:** Originally planned a fallback to Llama 3. Cut for time/complexity.
*   **Product Comparison Table:** Cut in favor of the "Spotlight" effect in the main catalog to keep the UI clean.

---

## 5. Measurement Plan
*   **Leading Indicator:** Search-to-Add-to-Cart Conversion Rate for users of the Smart Selector.
*   **5% Experiment:** Show the selector to 5% of users. Success = 10% conversion lift. Flatline = Users engage but return to traditional filters.

---

## 6. AI Usage Note & Time Log
*   **Models:** `google/gemma-2-9b-it:free` via OpenRouter.
*   **Builders:** Built with React/Vite using Antigravity AI for UI architecture.
*   **Workflow:** AI for scaffolding and translations; Manual engineering for deterministic gates and filters.
*   **Total Time:** 4.5 Hours (Honest log: Discovery 1h, Build 2h, Polish 1h, Docs 0.5h).

---

### Technical Highlights
*   **Bilingual & RTL:** Full support for Arabic language and right-to-left layouts.
*   **Context Optimized:** Uses client-side pre-filtering to reduce prompt size by 78%.
*   **Zero Hallucination Guard:** Deterministic JS gates block out-of-scope queries and enforce hard budget caps.
*   **Premium UX:** Dark/Light mode glassmorphism with an interactive "Spotlight" effect.
