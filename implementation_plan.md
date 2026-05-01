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
- [x] FIX 1: `nav-bar.tsx` — `NAV_HEIGHT` export + drop-shadow
- [x] FIX 2: `bottom-sheet.tsx` — `bottomOffset` prop
- [x] FIX 3: `map-placeholder.tsx` — `h='auto'` support
- [x] FIX 4: `screen1.tsx` — remove S1C, fix WithNav padding
- [x] FIX 5: `screen2.tsx` — cut S2B last answer block, text overflow
- [x] FIX 6: `screen3.tsx` — NavBar container fix
- [x] FIX 7: `screen4.tsx` — copy fix ("radius" not "to walk all")
- [x] FIX 8: `page.tsx` — responsive maxHeight
- [x] FIX 9: all screens — DiamondMarker consistency
- [x] Run `turbo check-types` — must be 0 errors

### Round 2 — New screens
- [x] `screen-splash.tsx` — 1 variant
- [x] `screen-perms.tsx` — 2 variants (A: requesting, B: granted)
- [x] `screen-profile.tsx` — 1 screen, 3 interactive tabs

### Round 3 — Integrate
- [x] Register all new screens in `page.tsx` SCREENS array
- [x] Update sidebar grouping: Onboarding / Walking / Discovery / Voice / Profile
- [x] Remove S1C from sidebar
- [x] Verify all 17 variants render without TypeScript errors

---

## Quality Gate (per screen)

- [x] Zero TypeScript errors
- [x] No inline hex values (all from `tokens.ts`)
- [x] No inline `rotate(45deg)` diamonds (all use `DiamondMarker`)
- [x] NavBar screens: `paddingBottom: NAV_HEIGHT` applied to scrollable content
- [x] BottomSheet screens: `bottomOffset={NAV_HEIGHT}` passed where NavBar is present
- [x] Single-line text: `overflow: hidden, textOverflow: ellipsis, whiteSpace: nowrap`
- [x] Multi-line text caps: `WebkitLineClamp` applied

---

---

# Phase 2 — Connected & Seamless Journey

> Written: 2026-05-01
> All Round 1–3 tasks are complete. This phase turns the static design viewer into an interactive prototype where every tap goes somewhere real.

---

## Current State (post Round 3)

The showcase (`page.tsx`) is a sidebar-driven design viewer. Every screen is an isolated static snapshot:

- 11 screen variants render correctly in isolation
- All TypeScript errors cleared, design tokens applied consistently
- **No navigation between screens** — every CTA, NavBar tap, and Back button does nothing
- **No shared state** — mode selection, user name, walk data are all hardcoded per screen
- Page.tsx sidabar is the only way to switch screens — not representative of real usage

The prototype looks finished but cannot be demo'd as a user flow.

---

## Journey Gaps (what's broken or missing)

### Gap 1 — No Navigation Layer
Every transition point is dead:

| From | Action | Should go to |
|------|--------|-------------|
| Splash | "Begin your walk" | Permissions |
| Splash | "Already explored?" | Sign-in (missing screen) |
| ScreenPermsA | "Allow" location | ScreenPermsB (granted state) |
| ScreenPermsB | "Continue" | Onboarding Name (missing screen) |
| OnboardingName | "Continue" | S5A (Narrative Style) |
| S5A | "Continue" | S7A (Walking Setup) |
| S7A | "Start wandering" | ScreenHome |
| ScreenHome | "Resume Old Quarter Walk" | ScreenSmartWalk |
| ScreenHome walk card | tap | ScreenSmartWalk |
| ScreenSmartWalk | mic button | S2B (Voice Ask — suggestions) |
| ScreenSmartWalk | NarrativeTab "Ask" icon | S2B |
| S2A | "Tap to stop" | S2C (Voice Chat with transcript) |
| S2B | suggestion tap | S2C (question pre-loaded) |
| S2B/S2C | Back / Close | ScreenSmartWalk |
| ScreenProfile | "Sign out" | Splash |
| NavBar (all screens) | Home tab | ScreenHome |
| NavBar (all screens) | Walk tab | ScreenSmartWalk |
| NavBar (all screens) | Chat tab | S2B |
| NavBar (all screens) | Profile tab | ScreenProfile |

### Gap 2 — No Shared App State
Screens are isolated React trees. Missing cross-screen data:

- **userName** — hardcoded "Jane Doe" in ScreenHome
- **narrativeMode** — chosen in S5A, needed in SmartWalk ModePills + S2 context card + HistoryTab badges
- **autoAudio / leadingCues** — chosen in S7A, needed in SmartWalk + SettingsTab
- **gemsCollected / distanceKm** — needed in SmartWalk MetricStrip + ScreenHome stats + Profile history header
- **chatHistory** — questions asked in S2C should appear in HistoryTab
- **onboardingDone** — controls whether first launch shows Splash→Perms→onboarding or goes straight to Home
- **walkActive** — whether a walk is in progress (gates SmartWalk content vs LockView)

### Gap 3 — Missing Onboarding Name Screen
The flow skips from Permissions → S5A with no way to capture the user's name. ScreenHome shows "Jane Doe" with no source.

### Gap 4 — Missing Sign-in Screen
"Already explored?" on Splash links nowhere. Returning users have no path back into the app.

### Gap 5 — S2A / S2B / S2C Are Disconnected
Three separate static snapshots that don't chain:
- S2A (full-screen listening) should transition → S2C after "Tap to stop"
- S2B suggestion tap should load S2C with that question
- S2C back button returns to SmartWalk

### Gap 6 — NavBar Manages Own Active State
`nav-bar.tsx` uses internal `useState` for active tab. This means the active tab never reflects which screen is actually showing. NavBar tabs don't navigate.

### Gap 7 — Voice Ask Entry Point Unclear
SmartWalk has a mic button (floating) and NarrativeTab has an "Ask" mic icon. Neither navigates anywhere. The user has no path to the voice screens without using the sidebar.

---

## Implementation Plan

### Step 1 — App Context (`context/app-context.tsx`)

Single React context that all screens read and write. No external state library needed for prototype scale.

**State shape:**

```ts
interface AppState {
  // Navigation
  screen: ScreenName
  screenHistory: ScreenName[]
  navigate: (to: ScreenName) => void
  goBack: () => void

  // User (set during onboarding)
  userName: string           // default ''
  setUserName: (name: string) => void

  // Onboarding
  onboardingDone: boolean
  narrativeMode: 'story' | 'facts' | 'secrets'   // default 'story'
  setNarrativeMode: (m: Mode) => void
  autoAudio: boolean         // default true
  setAutoAudio: (v: boolean) => void
  leadingCues: boolean       // default true
  setLeadingCues: (v: boolean) => void

  // Walk session (simulated)
  walkActive: boolean
  gemsCollected: number      // default 4
  distanceKm: number         // default 1.2

  // Voice / Chat
  chatHistory: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  pendingQuestion: string    // question carried from S2B into S2C
  setPendingQuestion: (q: string) => void
}

type ScreenName =
  | 'splash'
  | 'sign-in'
  | 'perms'
  | 'onboarding-name'
  | 'onboarding-style'    // S5A
  | 'onboarding-setup'    // S7A
  | 'home'
  | 'smart-walk'
  | 'voice-ask'           // S2B (default entry)
  | 'voice-listen'        // S2A (from mic long-press)
  | 'voice-chat'          // S2C
  | 'profile'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  audioSecs?: number      // for AI messages with waveform display
  timestamp: Date
}
```

**File to create:** `apps/web/src/components/wandervoice/context/app-context.tsx`

**Implementation notes:**
- Use `useReducer` internally, expose through `useAppContext()` hook
- `navigate(to)` pushes to `screenHistory`; `goBack()` pops
- Wrap the entire app with `<AppProvider>` in `page.tsx`

---

### Step 2 — Router Shell in `page.tsx`

Replace the current sidebar design-viewer with two modes:

**Prototype mode (default):** Full-screen interactive app shell. No sidebar. Screens transition based on `appContext.screen`. The existing sidebar viewer becomes an optional "dev mode" toggle.

```tsx
// page.tsx simplified shape
export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

function AppShell() {
  const { screen } = useAppContext()
  // Map screen name → component
  // Wrap in slide transition
  return <ScreenTransition>{SCREEN_MAP[screen]}</ScreenTransition>
}
```

**Dev/showcase mode:** Keep the existing sidebar viewer accessible via a small toggle button (e.g., `⊞` icon in corner), so designs can still be reviewed screen-by-screen.

**Transition:** CSS `transform: translateX` slide — forward = new screen enters from right, back = exits to right. Use a 200ms ease-out curve.

```tsx
// ScreenTransition: renders current screen with enter animation
// key={screen} forces remount on screen change
```

**File to modify:** `apps/web/src/app/page.tsx`

---

### Step 3 — Wire NavBar to Router

`nav-bar.tsx` currently:
```tsx
const [active, setActive] = useState(active ?? 0)  // internal state
```

Change to:
- Accept `active: number` as required prop (no internal state)
- Accept `onNavigate: (tab: number) => void` prop
- Remove internal `useState`

Tab → screen mapping (caller passes this):
```
Tab 0 (Home)    → 'home'
Tab 1 (Walk)    → 'smart-walk'
Tab 2 (Chat)    → 'voice-ask'
Tab 3 (Profile) → 'profile'
```

Each screen that renders NavBar passes its active tab number and the navigate function from context.

**File to modify:** `primitives/nav-bar.tsx`

---

### Step 4 — New Screen: Onboarding Name (`screen-onboarding-name.tsx`)

**Position in flow:** After ScreenPermsB → before S5A

**Layout:**
```
Dark (canopy bg)

Progress: ━━━━──── (step 1 of 4)

"What should we call you?"   ← 18px 700 mist

[  _______________  ]        ← real <input> centered, 20px mist
  Your first name

[Continue →]                 ← teal pill, disabled if empty
```

**Behavior:**
- `<input>` is a real HTML input, large font, no border — underline style only
- On Continue: `setUserName(value)`, navigate to `'onboarding-style'`
- Keyboard submit (Enter) same as tapping Continue

**File to create:** `screens/screen-onboarding-name.tsx`

---

### Step 5 — New Screen: Sign-in (`screen-sign-in.tsx`)

**Position in flow:** From Splash "Already explored?"

**Layout:**
```
Dark (canopy bg)

← back

"Welcome back"              ← 20px 700 mist

[  email@example.com  ]     ← input, underline style
[Continue with email →]     ← teal pill

──── or ────

[Continue with Google]      ← outlined pill, bark text

10px bark: "We'll never share your data."
```

**Behavior:**
- Email Continue: simulate delay (500ms), then navigate to `'home'` with `onboardingDone = true`
- Google: same — navigate to `'home'`
- Back → `'splash'`

**File to create:** `screens/screen-sign-in.tsx`

---

### Step 6 — Wire All Screen CTAs

Modify each existing screen to call `navigate()` from context:

#### `screen-splash.tsx`
```tsx
const { navigate } = useAppContext()
// "Begin your walk" onClick → navigate('perms')
// "Already explored?" onClick → navigate('sign-in')
```

#### `screen-perms.tsx` (ScreenPermsA / ScreenPermsB)
Merge PermsA and PermsB into a single `ScreenPerms` component with internal `granted` state (toggle on "Allow"):
```tsx
// "Allow" location tapped → setLocationGranted(true)
// "Allow" mic tapped → setMicGranted(true)
// "Continue" onClick (only when locationGranted) → navigate('onboarding-name')
```

#### `screen5.tsx` (S5A)
```tsx
const { setNarrativeMode, navigate } = useAppContext()
// "Continue" onClick → setNarrativeMode(sel), navigate('onboarding-setup')
```

#### `screen7.tsx` (S7A)
```tsx
const { setAutoAudio, setLeadingCues, navigate } = useAppContext()
// "Start wandering" onClick → setAutoAudio(autoOn), setLeadingCues(leading), navigate('home')
```

#### `screen-home.tsx`
```tsx
const { userName, gemsCollected, distanceKm, navigate } = useAppContext()
// Replace "Jane Doe" with userName (fallback 'Explorer')
// Replace hardcoded stats with context values
// "Resume Old Quarter Walk" → navigate('smart-walk')
// Walk card tap → navigate('smart-walk')
// NavBar: active=0, onNavigate wired to context
```

#### `screen-smart-walk.tsx`
```tsx
const { narrativeMode, setNarrativeMode, navigate } = useAppContext()
// Mic button (LockView + ActiveView) → navigate('voice-ask')
// ModePills reads narrativeMode from context, writes setNarrativeMode on change
// NavBar: active=1
```

#### `screen2.tsx` — S2A, S2B, S2C
```tsx
// S2A: "Tap to stop" → addMessage({role:'user', text: listeningQuestion}), navigate('voice-chat')
// S2B: suggestion tap → setPendingQuestion(q), navigate('voice-chat')
// S2B: Back/Close → goBack()
// S2C: reads chatHistory from context for message list
//       reads pendingQuestion (adds as first user message if set, clears after)
//       Back/Close → goBack()
// S2C: simulate AI response after 1.5s delay (mock answer from pendingQuestion lookup)
```

#### `screen-profile.tsx`
```tsx
const { chatHistory, narrativeMode, setNarrativeMode, autoAudio, setAutoAudio, leadingCues, setLeadingCues, navigate } = useAppContext()
// HistoryTab: render chatHistory items (last 4 user questions + AI snippets)
// SettingsTab: ToggleSwitches read/write from context
// "Sign out" → navigate('splash')
// NavBar: active=3
```

#### `tabs/narrative-tab.tsx`
```tsx
const { narrativeMode, setNarrativeMode, navigate } = useAppContext()
// ModePills reads/writes narrativeMode
// Mic icon ("Ask") → navigate('voice-ask')
```

---

### Step 7 — Mock Data Layer (`data/mock.ts`)

Replace hardcoded inline strings across all screens with importable mock data:

```ts
export const MOCK_WALK_SUGGESTIONS = [
  { id: 'old-quarter', title: 'Old Quarter Walk', distance: '2.1km', gems: 8, mode: 'story' },
  { id: 'hoan-kiem', title: 'Hoan Kiem Loop', distance: '1.4km', gems: 5, mode: 'facts' },
]

export const MOCK_SUGGESTED_QUESTIONS = [
  'What was sold here 100 years ago?',
  'Who lives above these shophouses?',
  'Is the guild still active?',
  'What happened here during the war?',
  'Why is the street called Silver Street?',
]

export const MOCK_AI_RESPONSES: Record<string, { text: string; audioSecs: number }> = {
  'What was sold here 100 years ago?': {
    text: 'Hàng Bạc means Silver Street — craftsmen from Châu Khê village set up workshops here in the 15th century, forging coins and jewelry for the royal court...',
    audioSecs: 52,
  },
  'Who lives above these shophouses?': {
    text: 'The upper floors are still family homes. Three or four generations often share the narrow tube houses — grandparents above, the shop below...',
    audioSecs: 44,
  },
  // … one entry per suggested question
  default: {
    text: 'That\'s a great question about this area. The street has a fascinating history dating back to the Lê dynasty...',
    audioSecs: 38,
  },
}

export const MOCK_SAVED_POIS = [
  { id: 'bach-ma', name: 'Bach Ma Temple', savedDaysAgo: 3 },
  { id: 'silk-lantern', name: 'Silk Lantern Workshop', savedDaysAgo: 1 },
]
```

**File to create:** `apps/web/src/components/wandervoice/data/mock.ts`

---

### Step 8 — Simulated AI Response in S2C

When S2C loads with a `pendingQuestion` set, after a 1.5s simulated delay:
1. Add an AI message to `chatHistory` using `MOCK_AI_RESPONSES[pendingQuestion] ?? MOCK_AI_RESPONSES.default`
2. Clear `pendingQuestion`
3. Show "Generating…" waveform state during the delay

Use `useEffect` + `setTimeout` in S2C component.

---

### Step 9 — Micro-interactions

#### 9.1 Waveform Animation in S2A
The `BIG_BARS` array in S2A is static. Add pseudo-animation while listening:

```tsx
// useEffect: when listening=true, run setInterval(400ms)
// Each tick: shuffle bar heights by ±20% with Math.random()
// Clear interval when listening=false (back to flat bars)
```

#### 9.2 ApproachBanner Auto-trigger in SmartWalk
SmartWalk's walk active view has no approach event. Simulate it:

```tsx
// useEffect on walkActive=true: after 8s, set showApproach=true
// Render <ApproachBanner name="Bach Ma Temple" dist="32m" /> as overlay
// Auto-hide after 4s
// If autoAudio is true: set narratingActive=true
```

#### 9.3 Screen Transition Slide
In `page.tsx` AppShell, each screen change gets a directional slide:

```tsx
// navigate(forward) → enter from right (translateX: 100% → 0)
// goBack() → exit to right (translateX: 0 → 100%), previous screen appears
// 200ms ease-out, no bounce
```

---

## Missing Primitives to Build

| Primitive | Used in | Description |
|-----------|---------|-------------|
| `primitives/progress-bar.tsx` | OnboardingName, S5A, S7A | `<ProgressBar current={1} total={4} />` — thin teal bar |
| `primitives/text-input.tsx` | OnboardingName, SignIn | Styled `<input>` — large, underline only, mist text on dark bg |
| `primitives/loading-dots.tsx` | S2C "Generating…" | Three dots with staggered bounce animation |

S5A and S7A currently hardcode their progress bars inline. Replace with `<ProgressBar>` after it's built.

---

## Files Summary

### New files to create

| File | Phase | Purpose |
|------|-------|---------|
| `context/app-context.tsx` | 1 | All shared state + navigate() |
| `screens/screen-onboarding-name.tsx` | 4 | Name entry, step 1/4 |
| `screens/screen-sign-in.tsx` | 5 | Returning user sign-in |
| `data/mock.ts` | 7 | Mock walks, questions, AI responses |
| `primitives/progress-bar.tsx` | misc | Reusable step bar |
| `primitives/text-input.tsx` | misc | Styled form input |
| `primitives/loading-dots.tsx` | misc | Animated "…" |

### Files to modify

| File | What changes |
|------|-------------|
| `app/page.tsx` | Wrap in AppProvider; add AppShell router; keep dev-mode sidebar toggle |
| `primitives/nav-bar.tsx` | Remove internal state; accept `active` + `onNavigate` props |
| `screens/screen-splash.tsx` | Wire CTAs to navigate |
| `screens/screen-perms.tsx` | Merge A/B into one component with internal grant state; wire Continue |
| `screens/screen5.tsx` | Save mode to context on Continue; use `<ProgressBar>` |
| `screens/screen7.tsx` | Save settings to context; use `<ProgressBar>` |
| `screens/screen-home.tsx` | Read userName/stats from context; wire walk cards + NavBar |
| `screens/screen-smart-walk.tsx` | Wire mic → voice-ask; read/write narrativeMode; NavBar |
| `screens/screen2.tsx` | Wire all navigation; S2C reads chatHistory + simulates response |
| `screens/screen-profile.tsx` | Read chatHistory/settings from context; wire sign-out + NavBar |
| `tabs/narrative-tab.tsx` | Read/write narrativeMode from context; wire mic → voice-ask |
| `tabs/history-tab.tsx` | Render from chatHistory context instead of hardcoded list |

---

## Implementation Order

1. **`context/app-context.tsx`** — must exist before any wiring
2. **`app/page.tsx`** — AppProvider + AppShell + dev-mode toggle
3. **`primitives/nav-bar.tsx`** — prop-driven, wired to context; all screens unblock
4. **`screens/screen-splash.tsx`** — wire CTAs (simplest screen to start)
5. **`screens/screen-perms.tsx`** — merge A/B, wire Continue
6. **`screens/screen-onboarding-name.tsx`** (new) + wire into flow
7. **`screens/screen-sign-in.tsx`** (new) + wire into flow
8. **`screens/screen5.tsx`** — save mode + navigate
9. **`screens/screen7.tsx`** — save settings + navigate
10. **`screens/screen-home.tsx`** — read context; wire cards + NavBar
11. **`screens/screen-smart-walk.tsx`** — wire mic; read mode; NavBar; ApproachBanner timer
12. **`data/mock.ts`** — mock questions + AI responses
13. **`screens/screen2.tsx`** — wire all 3 variants; simulated AI in S2C
14. **`tabs/narrative-tab.tsx`** + **`tabs/history-tab.tsx`** — read from context
15. **`screens/screen-profile.tsx`** — read context; wire sign-out + NavBar
16. **New primitives** (ProgressBar, TextInput, LoadingDots)
17. **Micro-interactions** (waveform anim, ApproachBanner timer, slide transitions)
18. **`turbo check-types`** — 0 errors gate

---

## Quality Gate (Phase 2)

- [ ] Full user journey can be walked without touching the sidebar: Splash → Perms → Name → Style → Setup → Home → SmartWalk → Voice → Profile
- [ ] NavBar active tab always matches the current screen
- [ ] Narrative mode chosen in S5A appears in SmartWalk ModePills + S2 context card + HistoryTab badges
- [ ] User name set in OnboardingName appears in ScreenHome greeting
- [ ] S2B suggestion tap opens S2C with that question as the first user message
- [ ] S2C shows simulated AI response after 1.5s delay
- [ ] HistoryTab shows last 4 questions from chatHistory
- [ ] SettingsTab toggles persist via context (change persists when leaving and returning to Profile)
- [ ] `turbo check-types` passes with 0 errors
- [ ] No new inline hex values introduced
