# WanderVoice — Implementation Plan

## Status Key
- ✅ Done & clean
- ⚠️ Done, needs fix
- 🔧 Fix in progress
- 🆕 Not yet built
- ❌ Cut — do not build

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 6 |
| Styling | Tailwind v4 — layout classes only; inline `style` for all token values |
| Validation | Zod v4 — prop schemas on all primitives |
| Runtime | Bun + Turborepo |
| UI base | shadcn/ui via `@wandervoice/ui` |
| Type check | `./node_modules/.bin/turbo check-types --filter=web` |

---

## Design Rules (non-negotiable)

1. All color values come from `tokens.ts` — no inline hex strings in component files
2. All gem/diamond markers use `DiamondMarker` from `icons.tsx` — no inline `transform: rotate(45deg)` divs
3. Every screen that uses `NavBar` must export or import `NAV_HEIGHT` and apply it as bottom padding
4. Text in single-line elements gets `overflow: hidden, textOverflow: ellipsis, whiteSpace: nowrap`
5. `turbo check-types` must pass with zero errors before any screen is considered done

---

## What Got Cut and Why

| Cut | Reason |
|-----|--------|
| **S1C (third map variant)** | Nearly identical to S1A — same bg, same structure, only difference is `MetricStrip` added at top. Not worth a separate variant slot in the sidebar |
| **Screen 0c — Value Prop** | Adds a full screen to explain what the narrative style picker already demonstrates. Friction before the user has experienced anything. |
| **Screen 9 — Saved Gems (standalone)** | Saved gems belong in Profile, not as a standalone destination. A separate screen fragments the nav. Merged into Profile. |
| **Screen 10 — Full Map View (separate screen)** | Placeholder SVG map adds nothing at full screen. The Map pill in Screen 4 should toggle map-expanded state in-place. Not a new screen. |
| **Screen 12 — Session Summary** | WanderVoice has no session concept — you wander, you don't "complete a walk". Summary/confetti is a fitness app pattern that conflicts with the product's tone. |
| **Screen 14 — Audio Player Expanded** | The Narrative tab in POI Detail handles playback. Full-screen player is Spotify UX; this app's audio is ambient, not the focus. |

---

## File Structure

```
apps/web/src/
├── app/
│   ├── layout.tsx               ✅  bare h-svh wrapper
│   ├── page.tsx                 ⚠️  shell needs fixes (see below)
│   └── favicon.ico
│
├── components/wandervoice/
│   ├── tokens.ts                ✅
│   ├── icons.tsx                ✅
│   ├── phone-frame.tsx          ✅  (kept for reference only)
│   │
│   ├── primitives/
│   │   ├── waveform.tsx         ✅
│   │   ├── map-placeholder.tsx  ⚠️  FIX: h='auto' support
│   │   ├── narrative-toggle.tsx ✅
│   │   ├── mode-pills.tsx       ✅
│   │   ├── nav-bar.tsx          ⚠️  FIX: export NAV_HEIGHT, shadow clip
│   │   ├── bottom-sheet.tsx     ⚠️  FIX: bottomOffset prop
│   │   ├── approach-banner.tsx  ✅
│   │   ├── sub-place-chip.tsx   ✅
│   │   ├── metric-strip.tsx     ✅
│   │   └── toggle-switch.tsx    ✅
│   │
│   ├── tabs/
│   │   ├── info-tab.tsx         ✅
│   │   ├── narrative-tab.tsx    ✅
│   │   └── history-tab.tsx      ✅
│   │
│   └── screens/
│       ├── screen-splash.tsx    🆕  Splash (was screen0)
│       ├── screen-perms.tsx     🆕  Permissions (was screen0b)
│       ├── screen1.tsx          ⚠️  FIX: cut S1C, fix WithNav padding
│       ├── screen2.tsx          ⚠️  FIX: remove "last answer" from S2B, text overflow
│       ├── screen3.tsx          ⚠️  FIX: NavBar relative container
│       ├── screen4.tsx          ⚠️  FIX: "to walk all" stat copy, map pill = state change
│       ├── screen5.tsx          ✅
│       ├── screen6.tsx          ✅
│       ├── screen7.tsx          ✅
│       ├── screen8.tsx          ✅
│       └── screen-profile.tsx   🆕  Profile (history + saved + settings)
```

---

## Bug Fixes

### FIX 1 — `nav-bar.tsx`: export NAV_HEIGHT + shadow clip
**Problem:** NavBar uses `position: absolute`. No exported height constant, so every screen hard-codes `paddingBottom: 72` as a magic number. Shadow is clipped by parent `overflow: hidden`.
**Fix:**
```ts
export const NAV_HEIGHT = 72

// Change box-shadow to filter to escape overflow clipping:
filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.38))'
// Remove: boxShadow: '0 4px 24px rgba(0,0,0,0.38)'
```

### FIX 2 — `bottom-sheet.tsx`: bottomOffset prop
**Problem:** BottomSheet fills `flex: 1` but doesn't account for the floating NavBar below. Inner scroll content slides under the NavBar.
**Fix:**
```ts
// Add prop:
bottomOffset?: number  // default 0

// Apply to scroll container:
paddingBottom: bottomOffset
```
Callers above a NavBar pass `bottomOffset={NAV_HEIGHT}`.

### FIX 3 — `map-placeholder.tsx`: flexible height
**Problem:** `h` prop is always a fixed pixel number. Map can't fill a flex container.
**Fix:** Accept `h: number | 'auto'`. When `'auto'`, apply `height: '100%'` instead of a fixed pixel value.

### FIX 4 — `screen1.tsx`: WithNav double padding + cut S1C
**Problem:** `WithNav` applies `paddingBottom: 72` inside a `height: 100%` container that also holds the NavBar, creating excess whitespace on some variants.
**Fix:** Remove `paddingBottom` from `WithNav`'s scrollable div. Add `<div style={{ height: NAV_HEIGHT }} />` as the last child of each screen's scrollable content list. Delete `S1C` export and its registration in `page.tsx`.

### FIX 5 — `screen2.tsx`: S2B cleanup + text overflow
**Problem (a):** S2B "LAST ANSWER" section duplicates the History tab. Clutters a screen whose job is to prompt the user to ask something.
**Fix:** Remove the "LAST ANSWER" block from S2B. The section below the suggested questions becomes the mic input bar directly.
**Problem (b):** Long question text in S2A has no overflow guard.
**Fix:** Add `overflow: 'hidden', textOverflow: 'ellipsis'` to question text spans. Body text bubbles get `WebkitLineClamp: 3`.

### FIX 6 — `screen3.tsx`: NavBar container
**Problem:** NavBar is `position: absolute` but screen3's root div may not establish a reliable containing block in the full-page viewport.
**Fix:** Ensure the root div of S3A has `position: 'relative', height: '100%', overflow: 'hidden'`. Wrap scrollable content (everything below the title row) in a div with `flex: 1, overflow: 'auto', paddingBottom: NAV_HEIGHT`.

### FIX 7 — `screen4.tsx`: misleading stat copy
**Problem:** "1.4km to walk all" implies route planning. The play button on unheard gems implies previewing — but there's no audio player state connected.
**Fix:** Change stat label to "1.4km radius". The play button becomes a visual affordance only (no state change required for prototype — it's a static demo).

### FIX 8 — `page.tsx`: maxHeight not responsive
**Problem:** `maxHeight: 932` clips content on viewports shorter than 932px.
**Fix:**
```ts
// Replace:
maxHeight: 932,
// With:
maxHeight: 'min(932px, 100dvh)',
height: '100%',
```

### FIX 9 — All screens: DiamondMarker consistency
**Problem:** Diamond/gem markers are implemented 3 ways across the codebase: `DiamondMarker` component, inline rotated div, and inline in `map-placeholder.tsx`.
**Fix:** Grep all `rotate(45deg)` occurrences outside `icons.tsx`. Replace with `<DiamondMarker>`. The `map-placeholder.tsx` internal markers can stay as divs since they're part of the map SVG composition, but all screen-level markers must use the component.

---

## New Screens

### Splash ← `screen-splash.tsx` 🆕
**Theme:** Dark (canopy)
**One job:** Brand moment. User sees the product name and identity before anything asks of them.

```
Layout (centered, full height):
  ┌─────────────────────────┐
  │                         │
  │   [LogoMark, large]     │  ← SVG circles + bars, ~60px
  │   WanderVoice           │  ← 28px, weight 700, mist
  │   ─────────────────     │  ← thin teal rule
  │   The city has          │  ← 15px, bark, centered
  │   stories. Listen.      │
  │                         │
  │   [Begin your walk]     │  ← teal full-width pill button
  │   Already explored?     │  ← bark text link, 11px
  └─────────────────────────┘
```

**Variants:** 1
**No NavBar.** No back button.

---

### Permissions ← `screen-perms.tsx` 🆕
**Theme:** Dark (leaf)
**One job:** Explain and request location access (required) and mic access (optional). Show status honestly.

```
Layout:
  ┌─────────────────────────┐
  │  ← back                 │
  │  Before you go          │  ← 18px 700 mist
  │  Two things WanderVoice │  ← 12px bark
  │  needs from you.        │
  │                         │
  │  ┌─────────────────┐    │
  │  │ 📍 Location     │    │  ← card, teal border if granted
  │  │ Required        │    │  ← gold badge
  │  │ Detects gems as │    │
  │  │ you walk.       │    │
  │  │ [Allow]  or ✓   │    │  ← toggle state
  │  └─────────────────┘    │
  │                         │
  │  ┌─────────────────┐    │
  │  │ 🎙 Microphone   │    │
  │  │ Optional        │    │  ← bark badge
  │  │ Ask questions   │    │
  │  │ while walking.  │    │
  │  │ [Allow]  or ✓   │    │
  │  └─────────────────┘    │
  │                         │
  │  [Continue →]           │  ← disabled (bark) until location granted
  │  Location only active   │  ← 10px bark footnote
  │  while app is open.     │
  └─────────────────────────┘
```

**Variants:**
- A: Both permissions ungranted (default state)
- B: Both granted (CTA enabled, cards show ✓)

---

### Profile ← `screen-profile.tsx` 🆕
**Theme:** Light (mist)
**One job:** Everything the Person nav icon leads to. Tabbed: History / Saved / Settings.
**Replaces:** The planned standalone Saved Gems (screen9) and Settings (screen11).

```
Layout:
  ┌─────────────────────────┐
  │  Profile                │  ← 15px 700 leaf
  │  [History] [Saved] [⚙]  │  ← tab row, same as BottomSheet tabs
  ├─────────────────────────┤
  │                         │
  │  HISTORY TAB            │
  │  ─────────────────────  │
  │  Today · 1.2km · 4 gems │  ← walk summary row
  │  ┌─────────────────┐    │
  │  │ ◈ Hàng Bạc      │    │  ← gem card: name, mode badge, snippet
  │  │ Story · 9:44    │    │
  │  │ "The smiths…"   │    │
  │  └─────────────────┘    │
  │  [+ 3 more gems]        │
  │                         │
  │  SAVED TAB              │
  │  ─────────────────────  │
  │  ┌─────────────────┐    │
  │  │ ◈ Bach Ma Temple│    │  ← saved gem card with unsave (heart)
  │  │ Saved 3 days ago│    │
  │  └─────────────────┘    │
  │  Empty state if none    │
  │                         │
  │  SETTINGS TAB           │
  │  ─────────────────────  │
  │  NARRATIVE              │
  │  Default mode  Story ›  │  ← tap to change (inline pills)
  │  ─────────────────────  │
  │  WALKING                │
  │  Auto-audio      ○      │  ← ToggleSwitch
  │  Leading cues    ●      │  ← ToggleSwitch
  │  ─────────────────────  │
  │  AUDIO                  │
  │  Auto-pause on call ●   │
  │  ─────────────────────  │
  │  Sign out               │  ← bark destructive link
  └─────────────────────────┘
```

**Variants:** 1 (tabs are interactive — History default)
**NavBar** at bottom, Person icon active.

---

## Updated Screen Registry for `page.tsx`

```ts
// Onboarding (not in main nav — shown once)
{ id: 'splash',  title: 'Splash',              short: 'Splash', noNav: true }
{ id: 'perms',   title: 'Permissions',          short: 'Perms',  noNav: true }
{ id: 'perms-b', title: 'Permissions (granted)',short: 'Perms✓', noNav: true }
{ id: 's5',      title: 'Narrative Style',      short: 'Style',  noNav: true }
{ id: 's7',      title: 'Walking Setup',         short: 'Setup',  noNav: true }

// Core app (in main nav)
{ id: 's6a',  title: 'Walking Mode · Dark toggle',   short: 'Walk' }
{ id: 's6b',  title: 'Walking Mode · Light chips',   short: 'Walk' }
{ id: 's6c',  title: 'Walking Mode · Minimal dark',  short: 'Walk' }
{ id: 's3a',  title: 'POI Detail',                   short: 'POI'  }
{ id: 's2a',  title: 'Voice Input · Mic',            short: 'Voice'}
{ id: 's2b',  title: 'Voice Input · Suggestions',    short: 'Voice'}
{ id: 's2c',  title: 'Voice Input · Chat',           short: 'Voice'}
{ id: 's4a',  title: 'Gem Discovery',                short: 'Gems' }
{ id: 's8a',  title: 'Sub-Place Selection',          short: 'Place'}
{ id: 's1a',  title: 'Main Map · Light',             short: 'Map'  }
{ id: 's1b',  title: 'Main Map · Dark',              short: 'Map'  }
// s1c — CUT

// Secondary
{ id: 'profile', title: 'Profile',    short: 'Profile' }
```

Sidebar groups in the showcase: **Onboarding** / **Walking** / **Discovery** / **Voice** / **Profile**

---

## Implementation Order

### Round 1 — Fixes (unblock everything else)
- [ ] FIX 1: `nav-bar.tsx` — `NAV_HEIGHT` export + drop-shadow
- [ ] FIX 2: `bottom-sheet.tsx` — `bottomOffset` prop
- [ ] FIX 3: `map-placeholder.tsx` — `h='auto'` support
- [ ] FIX 4: `screen1.tsx` — remove S1C, fix WithNav padding
- [ ] FIX 5: `screen2.tsx` — cut S2B last answer block, text overflow
- [ ] FIX 6: `screen3.tsx` — NavBar container fix
- [ ] FIX 7: `screen4.tsx` — copy fix ("radius" not "to walk all")
- [ ] FIX 8: `page.tsx` — responsive maxHeight
- [ ] FIX 9: all screens — DiamondMarker consistency
- [ ] Run `turbo check-types` — must be 0 errors

### Round 2 — New screens
- [ ] `screen-splash.tsx` — 1 variant
- [ ] `screen-perms.tsx` — 2 variants (A: requesting, B: granted)
- [ ] `screen-profile.tsx` — 1 screen, 3 interactive tabs

### Round 3 — Integrate
- [ ] Register all new screens in `page.tsx` SCREENS array
- [ ] Update sidebar grouping: Onboarding / Walking / Discovery / Voice / Profile
- [ ] Remove S1C from sidebar
- [ ] Verify all 17 variants render without TypeScript errors

---

## Quality Gate (per screen)

- [ ] Zero TypeScript errors
- [ ] No inline hex values (all from `tokens.ts`)
- [ ] No inline `rotate(45deg)` diamonds (all use `DiamondMarker`)
- [ ] NavBar screens: `paddingBottom: NAV_HEIGHT` applied to scrollable content
- [ ] BottomSheet screens: `bottomOffset={NAV_HEIGHT}` passed where NavBar is present
- [ ] Single-line text: `overflow: hidden, textOverflow: ellipsis, whiteSpace: nowrap`
- [ ] Multi-line text caps: `WebkitLineClamp` applied
