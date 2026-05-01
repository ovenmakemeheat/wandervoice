# WanderVoice — User Journey

## What This App Actually Is

WanderVoice is a **walking companion, not a tour app**. The distinction matters for every design decision:

- A tour app has a schedule, a route, a guide you follow
- WanderVoice has no fixed route — you wander, it reacts
- The AI narrates what you're physically near, in the mode you chose
- You can ask it anything; it answers in character as your guide
- Gems are discovered, not assigned

The core loop is: **walk → approach something → hear its story → ask if curious → keep walking**. Everything else is support infrastructure for that loop.

---

## Personas (3, not more)

| Persona | One-line | What they need most |
|---------|----------|---------------------|
| **The First-Timer** | Tourist in an unfamiliar city, overwhelmed by options | Quick start, minimal setup, auto-narration |
| **The Deep-Diver** | History enthusiast or researcher, repeat visitor | Dense Facts mode, voice Q&A, History tab |
| **The Flaneur** | Local or repeat traveller exploring differently | Secrets mode, low-friction, no hand-holding |

---

## The Real Flow (opinionated)

### First Launch

```
Open app
  └─► Splash (brand moment, 1 screen)
        └─► Permissions (location required, mic optional)
              └─► Narrative Style picker (Step 1 of 2)
                    └─► Walking Setup: auto-audio + leading cues (Step 2 of 2)
                          └─► Walking Mode (app's home screen)
```

**Why this onboarding, not more:**
- 3-step onboarding (splash + permissions + 2 preference screens) is already on the longer side for a walking app
- A separate "value prop" screen (screen0c) adds friction before the user has experienced anything — cut it
- Users understand what the app does from the narrative style picker itself ("History as a place remembers it")
- Permissions must come before preferences so the user understands *why* they're setting location-based preferences

---

### Returning User

```
Open app
  └─► Walking Mode directly (home screen — no re-onboarding)
```

---

### Core Loop (happens every ~5 minutes while walking)

```
Walking Mode
  │
  ├─► Gem approached within 50m
  │     ├─► [auto-audio ON]  → Narrative plays automatically
  │     └─► [auto-audio OFF] → Approach banner appears, user taps to start
  │
  ├─► Narrative plays
  │     ├─► User pauses (NarrativeToggle)
  │     ├─► User asks a question → Voice Input
  │     └─► User wants to read/save → POI Detail
  │
  └─► User initiates
        ├─► Tap "Coming Up" gem → POI Detail
        ├─► Tap Gems nav icon → Gem Discovery
        └─► Enter large venue → Sub-Place Selection (auto-triggered)
```

---

### Voice Interaction (the differentiating feature)

The three variants of Screen 2 represent **three moments in the same conversation**, not three separate features:

- **S2A** (full-screen mic): first question, no history yet — user is starting a conversation
- **S2B** (suggestions): user hasn't asked yet but has context — suggest good questions, show last answer
- **S2C** (chat): user has already asked once — show thread, continue naturally

These are states of a single screen, not separate screens. In the real app they'd be one screen. For the prototype they're shown separately. **Keep all three as variants of one screen.**

---

## Screens — Keep, Modify, Cut

### ✅ Keep as-is

| Screen | Why |
|--------|-----|
| S5 — Narrative Style | Core preference, well-designed, progress bar fits 2-step onboarding |
| S7 — Walking Setup | Auto-audio toggle is the most important behavioural choice; worth its own screen |
| S6 — Walking Mode (A/B/C) | The home screen. All three variants are valid explorations |
| S3 — POI Detail | The "read more" destination; Info/Narrative/History tabs are all justified |
| S8 — Sub-Place Selection | Clever feature, genuinely needed for large venues; clean design |

### ⚠️ Keep but simplify

| Screen | Problem | Fix |
|--------|---------|-----|
| S1 — Main Map | 3 variants is too many for one concept — A and C are nearly identical (both light, both show map + bottom sheet). Variant B (dark + metrics) is distinct. | **Keep A (default light) and B (dark/metrics). Cut C.** |
| S2 — Voice Input | S2B has a "last answer" section that duplicates what the History tab already shows. | **Remove "last answer" from S2B; keep suggestions + input bar only.** |
| S4 — Gem Discovery | The "Map" pill button in the header leads nowhere (screen10 was planned for this). The stats strip (12 gems / 4 unheard / 1.4km) is valuable but the "1.4km to walk all" implies route planning the app doesn't support. | **Replace "to walk all" stat with "this area". Remove route planning implication.** |

### ❌ Cut entirely

| Planned Screen | Why cut |
|---------------|---------|
| **Screen 0c — Onboarding Value Prop** | Adds a full screen to explain what users will discover in 10 seconds of use. The narrative style picker *is* the value prop. Cut. |
| **Screen 9 — Saved Gems** | Heart/save is a valid feature but a list of saved gems is a Profile concern. A walking app's primary value is in-the-moment. Saved gems belong inside a Profile/History screen, not standalone. Merge into Profile (screen11 below). |
| **Screen 10 — Full Map View** | The "Map" pill in Screen 4 should expand the existing mini-map in-place (a state change, not a new screen). A full-screen map needs real map tiles to be useful — with a placeholder SVG it adds nothing. Cut as a separate screen. |
| **Screen 12 — Session Summary** | Premature. WanderVoice has no concept of a "session" — you don't start and end a walk, you just walk. A summary screen implies a fitness-app mental model that conflicts with the "wander" concept. Cut. Confetti is especially wrong for this tone. |
| **Screen 14 — Audio Player Expanded** | The Narrative tab in POI Detail already handles audio playback. A full-screen audio player is a Spotify pattern that doesn't fit a walking app. The audio is ambient, not the focus. Cut. |

### 🆕 Add (justified additions only)

| Screen | Justification |
|--------|--------------|
| **Splash** | Every app needs a brand moment on first launch. 1 screen, no interaction complexity. |
| **Permissions** | iOS/Android require explicit permission requests. This is non-negotiable infrastructure, not a feature. 2 variants: requesting and granted. |
| **Profile / History** | The Person nav icon currently leads nowhere. This is where: past walks (simple list), saved gems, and settings live. One screen handles all three through tabs — not three separate screens. |

---

## Final Screen List

| # | Screen | Theme | Variants | Status | In Nav |
|---|--------|-------|----------|--------|--------|
| Splash | First launch brand | Dark | 1 | 🆕 Build | No |
| Permissions | Location + mic | Dark | 2 | 🆕 Build | No |
| S5 | Narrative Style | Dark | 1 | ✅ Done | No (onboarding) |
| S7 | Walking Setup | Dark | 1 | ✅ Done | No (onboarding) |
| S6 | Walking Mode | Dark/Light/Dark | 3 | ✅ Done | Home (icon 1) |
| S2 | Voice Input | Dark/Light/Dark | 3 | ✅ Done | Modal |
| S3 | POI Detail | Light | 1 | ✅ Done | Icon 2 |
| S4 | Gem Discovery | Light | 1 | ✅ Done | Icon 2 |
| S8 | Sub-Place Selection | Light | 1 | ✅ Done | Auto-triggered |
| S1 | Main Map | Light + Dark | 2 | ⚠️ Cut variant C | Icon 1 alt |
| Profile | History + Saved + Settings | Light | 1 | 🆕 Build | Icon 4 |

**Total: 11 distinct screens, 17 variants**
Previously planned: 14+ screens. **Cut 5, merged 3 into 1.**

---

## Navigation Structure

The bottom nav has 4 icons. Here's what they actually do:

| Icon | Label | Destination | Notes |
|------|-------|-------------|-------|
| Home | Walk | Walking Mode (S6) | Always returns to active walk |
| Gem | Gems | Gem Discovery (S4) | Browse + tap → POI Detail (S3) |
| Bars | — | *Remove or repurpose* | Currently unused; could be "Now Playing" mini-player |
| Person | Profile | Profile screen | History, saved gems, settings in one place |

**The Bars icon needs a purpose.** Options:
- Make it the **active narrative mini-player** — shows current gem name, waveform, pause button. Tapping expands to Walking Mode.
- Or remove one icon entirely and make the nav 3-icon (Home / Gems / Profile). Cleaner.

**Recommendation: 3-icon nav** — Home / Gems / Profile. The Walking Mode is the home screen; a dedicated walking icon is redundant. The Bars icon as audio player creates confusion with the mode switcher (S/F/X) already called "bars" visually.

---

## State That Matters

### Audio state (global)
```
silent → narrating → paused → silent
              ↓
          listening (voice Q&A)
              ↓
          generating
              ↓
          answering
```

### Onboarding state (one-time)
```
new user: splash → permissions → style → setup → walk
returning: walk (skip everything)
```

### Narrative mode (persisted preference)
`Story | Facts | Secrets` — set in onboarding, changeable any time from walking mode or POI detail.
