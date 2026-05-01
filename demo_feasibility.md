# WanderVoice — Demo Feasibility Analysis

## 1. Feasibility Overview
The current "Hanoi Prototype" codebase is **highly feasible** for the proposed storyboard. The core navigation and state management (AppContext) are already wired to handle the screen flow. However, to make the "Elena" journey feel realistic and seamless for a video, several "simulated triggers" and data fixes are required.

---

## 2. Required Code Adjustments

### A. Data Initialization (The "Elena" Profile)
*   **Problem:** The app currently starts with a blank user name and hardcoded default stats.
*   **Fix:** Modify `INITIAL_STATE` in `app-context.tsx` to initialize with:
    *   `userName: 'Elena'`
    *   `distanceKm: 1.2`, `gemsCollected: 4`
    *   `screen: 'splash'`

### B. Interactive Transitions
*   **Problem:** `page.tsx` swaps screens instantly. The storyboard requires a "Wander tempo" (slide animations).
*   **Fix:** Implement a CSS transition in `AppShell` (page.tsx) that uses the `direction` from context to slide screens in from the right (`forward`) or left (`back`).

### C. Simulated "Approach" Trigger
*   **Problem:** The `ApproachBanner` is a static primitive. In the demo, we need it to appear "dynamically" as Elena walks.
*   **Fix:** In `screen-smart-walk.tsx`, add a `useEffect` that triggers the `ApproachBanner` to slide in after 5 seconds of the walk being active.
*   **Mock Data:** Use "The Golden Stupa" and "12m" as the data points for this trigger.

### D. Voice AI Mocking (Scene 4)
*   **Problem:** The Voice Chat screen (`s2c`) needs to show the specific conversation from the storyboard.
*   **Fix:** Pre-load `chatHistory` in `INITIAL_STATE` or add a specific "Demo Trigger" that adds Elena's question ("What do the giant demons guard?") and the AI's answer about "Yaksha and Ramakien" with a realistic 1.5s delay.

### E. Map "Pulsing"
*   **Problem:** The map placeholder is static.
*   **Fix:** Add a simple CSS keyframe animation to the "Current Location" dot in `map-placeholder.tsx` to make it pulse, giving the illusion of a live GPS feed.

---

## 3. Scene Editing Requirements (Premiere Pro / Capcut)

To turn these screen recordings into a premium demo video, the following editing steps are required:

### A. Sound Design (The "Audio Guide" Experience)
*   **Ambient Layer:** High-quality field recordings of Hanoi (motorbike horns, distant street vendors, wind).
*   **Interaction Layer:** Soft, nature-inspired UI sounds (chimes for permissions, "tack" sounds for tab changes).
*   **The Voice:** Use a high-quality AI voice generator (like ElevenLabs) with a "Warm, Local, Cultured" profile. Do NOT use the default system voice.

### B. Green Screen / Screen Replacement
*   **Technique:** Record Elena (or an actor) holding a phone with a green screen (or a flat tracking marker). 
*   **Replacement:** Superimpose the WanderVoice screen recordings onto the phone. Add "Finger Tap" overlays (small circular highlights) to show where she is touching.

### C. Color Grading
*   **Palette Match:** Grade the real-world footage to match the "Jungle Mist" palette. Lower the saturation of reds/blues, and enhance the "Jungle Teal" and "Leaf Green" tones.
*   **Atmosphere:** Add a subtle "Golden Hour" glow to the edges of the screen recordings to blend them into the environment.

### D. Callouts & Text Overlays
*   **Minimalist Captions:** Use the "Inter" or "LINE Seed Sans" font for clean, minimal text overlays that explain what is happening (e.g., *"Context-aware narration starts automatically"*).

---

## 4. Feasibility Score: 85%
The foundation is solid. The remaining 15% is "The Magic"—the specific mock data and transitions that turn a design prototype into a believable product story.
