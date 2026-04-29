# Submission: Track B - Mumz Smart Selector ✨

## 1. Executive Summary
**Mumz Smart Selector** is an AI-powered baby product decision engine built as a standalone web app. It solves a real problem on Mumzworld: users still face overwhelming choice even after filtering. A mother types what she needs in plain language (English or Arabic) — *"best stroller for a 1-year-old under AED 800"* — and the AI reasons across a curated catalog, surfaces exactly 3 ranked picks with personalized justifications, and highlights them using an interactive "AI Spotlight" visual effect.

## 2. Prototype Access
*   **Live URL:** [https://mumz-smart-selector.vercel.app](https://mumz-smart-selector.vercel.app)
*   **Video Walkthrough:** [Google Drive Link](https://drive.google.com/file/d/1Mg7vKCEFzm1Z_oKiv11yWWf5fwaEJmrP/view?usp=drive_link)

---

## 3. Discovery & Strategy: The Real Problem

### Persona: Fatima, 29, Dubai
*   **Situation:** First-time mother, 8 months pregnant, overwhelmed by technical jargon.
*   **What felt broken:** Shopping as Fatima, I realized that Mumzworld's filters tell you **what** a product is, but not **if it fits your life**. After filtering, Fatima is still left with 40+ products and closes her laptop in frustration.

### Why AI? (The reasoning over filtering)

| Solution | Why it fails for this problem |
|----------|-------------------------------|
| **Better filters** | Fatima doesn't know *what* to filter for (e.g. ISOFIX vs 5-point). |
| **"Top Picks"** | Static and generic; doesn't know her specific budget or age gap. |
| **Rule-based system** | Cannot understand natural phrases like "I have a narrow hallway." |
| **LLM Selector** | **Understands intent, reasons across criteria, and explains the "Why."** |

---

## 4. Show Your Work: Technical Journey

### The Stack
```
Browser → React (Vite) → Client-side Pre-filter → OpenRouter → LLM (Gemini/Gemma) → Deterministic Post-filter → UI
```

### Technical "Hybrid" Architecture
We used a **Hybrid Intelligence** approach to overcome the limitations of free-tier LLMs:
1.  **Pre-filter (JS):** Scans the catalog and extracts the top 10 relevant products based on category and budget. This reduced our prompt size by **78%**, preventing context-window errors.
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
*   **The Precision Fix:** *"Return UP TO 3 products. Do not recommend unrelated items just to fill the list. Precision is better than quantity."*
*   **The Schema Rule:** Provided a strict JSON schema with `reason_en` and `reason_ar` to ensure the UI never broke during RTL flips.

### Reflection
*   **Surprise:** Small models (4B-7B) are surprisingly good at Arabic reasoning but terrible at keeping track of numbers (prices).
*   **Next 5 Hours:** I would implement "Comparison Mode" and a "Safety Score" derived from cross-referencing multiple safety certifications.

---

## 5. Measurement Plan
*   **Leading Indicator:** Search-to-Add-to-Cart Conversion Rate for Smart Selector users vs. traditional filter users.
*   **5% Experiment:** Success = 10% lift in "Add to Cart" in the stroller category. Flatline = High engagement with AI but users return to filters to "verify," indicating a lack of trust.

---

## 6. AI Usage Note & Time Log
*   **AI Usage:** Used `openrouter/auto:free`. Built with Antigravity AI for UI scaffolding and logic debugging.
*   **Time Log:** Total 5 Hours. (1h Discovery, 2.5h Building/Crisis Mgmt, 1.5h Polishing/Docs).
