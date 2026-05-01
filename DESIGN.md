# DESIGN.md — WanderVoice

> Creative identity for WanderVoice — the location-aware AI audio guide for Southeast Asia.

---

## Table of Contents

1. [Brand Concept](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#1-brand-concept)
2. [Wordmark &amp; Logo](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#2-wordmark--logo)
3. [Mood &amp; Tone](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#3-mood--tone)
4. [Color Palette](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#4-color-palette)
5. [Typography](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#5-typography)
6. [Iconography](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#6-iconography)
7. [Illustration Style](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#7-illustration-style)
8. [Motion Language](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#8-motion-language)
9. [Reference Imagery — CI Analysis](https://claude.ai/local_sessions/local_3d9fcd63-a73c-4be8-9bf3-8fb54bbecc0d#9-reference-imagery--ci-analysis)

---

## 1. Brand Concept

**"The voice of every place you wander into."**

WanderVoice is built from two complementary ideas held in tension:

**Wander** — unhurried, curious movement through a place. Not navigation. Not efficiency. The act of being present somewhere and letting it reveal itself. Wander implies freedom, discovery, and the serendipity of what you find when you're not rushing toward a destination.

**Voice** — the spoken, human, local layer. Not text on a screen. Not a pin on a map. The voice of a grandmother who has sold the same soup for forty years, the guide who grew up in the temple's shadow, the market vendor who knows every stall owner by name. Voice is intimate, trusted, and alive.

Together: WanderVoice is the platform that gives every place its voice, and every wanderer the chance to hear it.

### Visual Identity Pillars

**Path becoming sound** — the core visual metaphor. A wandering footpath that dissolves into an audio waveform. Movement transforms into voice. This appears in the logo mark, illustration language, and motion.

**Warm depth** — not flat and clinical. Not dark and moody. The visual palette sits in the register of morning mist lifting off jungle canopy — soft greens, warm amber, natural and breathing, with something more to discover the longer you look. Light is the default: Mist white surfaces, Jungle teal accents, deep forest shadows reserved for emphasis.

**Handmade precision** — the identity feels crafted rather than generated. Slightly imperfect geometry in illustrations, stroke-based icons rather than filled shapes, texture implied through structure rather than applied as decoration.

---

## 2. Wordmark & Logo

### Wordmark

```
Wander Voice
──────┬──────────┬──────
      │          │
   regular    semibold
   weight      weight
```

* **Wander** — set in Inter, weight 400 (regular). The lighter weight reflects openness, movement, ease.
* **Voice** — set in Inter, weight 600 (semibold). The heavier weight anchors the brand; voice has presence.
* Single word, no space: **WanderVoice** in product contexts. Two words — **Wander Voice** — in editorial / display use.
* Wordmark color: Leaf `#1C2720` on light surfaces (Mist white `#F5F7F2`). Mist white `#F5F7F2` on dark surfaces. Never use the accent color for the wordmark.

### Logo Mark

A single-line path that begins as a wandering footstep trail (three dots, slightly uneven spacing) and curves into a minimal audio waveform (three vertical bars of varying height). The transition point — where path becomes wave — is the brand's visual signature.

```
  ·  ·   ·          ▌ ▌▌ ▌
  (path)    →    (waveform)
```

* Stroke only, no fills. Stroke weight: 2px at standard size.
* Stroke color inherits from wordmark — Leaf or Mist white.
* Minimum size: 24px height. Below this, use wordmark only.
* Clear space: equal to the height of the capital W on all sides.

### App Icon

For the app icon (square canvas with rounded corners per platform spec):

* Background: Leaf `#1C2720`
* Mark: the path-to-waveform in Mist white `#F5F7F2`
* Accent dot at the transition point: Jungle teal `#2A7560`
* No wordmark inside the icon.

---

## 3. Mood & Tone

| Dimension    | Direction                  | Avoid                        |
| ------------ | -------------------------- | ---------------------------- |
| Warmth       | Amber-lit, intimate, close | Cold, blue-tech, clinical    |
| Movement     | Curious, unhurried, alive  | Urgent, directive, GPS-like  |
| Culture      | Rooted in place, specific  | Generic "world travel" stock |
| Intelligence | Calm, confident, present   | Flashy AI, over-promising    |
| Voice        | Human, local, layered      | Robotic, corporate, polished |

### Reference Moods

* Golden hour filtering through a temple's carved doorway
* Rain beginning on a night market — the smell before the drops
* The pause before a local guide says something you didn't know to ask
* Handwritten menus on shophouse chalkboards
* The sound of a morning market waking up before tourists arrive

---

## 4. Color Palette

> **Active palette: Jungle Mist** — light, nature-rooted, teal-green accent. Chosen for minimal and user-friendly presentation.

### Primary

| Name         | Hex         | Role                                                                |
| ------------ | ----------- | ------------------------------------------------------------------- |
| Leaf         | `#1C2720` | Primary text, navigation bar, dominant dark surface                 |
| Deep canopy  | `#162218` | Elevated cards on dark surfaces                                     |
| Jungle teal  | `#2A7560` | Primary accent — CTAs, active states, gem markers, logo accent dot |
| Morning gold | `#E8A850` | Secondary accent — alerts, highlights, time-sensitive moments      |
| Mist white   | `#F5F7F2` | Light surface — slightly nature-tinted off-white, never pure white |

### Supporting

| Name           | Hex         | Role                                                |
| -------------- | ----------- | --------------------------------------------------- |
| Canopy mist    | `#EFF4EE` | Background fills, recessed areas on light mode      |
| Bark           | `#6B7C6A` | Secondary text, metadata, captions, inactive states |
| Verified green | `#27AE60` | Operator verified badge, success states             |
| Dew            | `#D4DFD3` | Borders, dividers, disabled UI elements             |

### Rules

* Jungle teal `#2A7560` and Morning gold `#E8A850` never appear together on the same element.
* Morning gold is used at most once per screen — it signals urgency and loses meaning if overused.
* All text on Leaf or Deep canopy surfaces uses Mist white or Bark — never Jungle teal.
* Illustration fills use only Leaf, Canopy mist, and one accent maximum.

### Semantic Map

```
Primary action     →  Jungle teal   #2A7560
Gem / local pick   →  Jungle teal   #2A7560
Alert / time limit →  Morning gold  #E8A850
Verified / success →  Verified green #27AE60
Inactive / muted   →  Bark          #6B7C6A
```

---

## 5. Typography

### Typefaces

| Context                  | Typeface       | Why                                                                                 |
| ------------------------ | -------------- | ----------------------------------------------------------------------------------- |
| Latin (primary)          | Inter          | Legible at small sizes on mid-range Android; clean numerals; excellent weight range |
| Thai                     | Sarabun        | Purpose-built for Thai readability; harmonizes well with Inter's proportions        |
| Vietnamese               | Be Vietnam Pro | Designed for the language; handles tonal diacritics without clipping                |
| Chinese (Simplified)     | Noto Sans SC   | Full CJK coverage at a weight that pairs with Inter Semibold                        |
| Bahasa / Tagalog / Malay | Inter          | Shares Latin character set; no additional typeface needed                           |

### Scale

| Name       | Size | Weight | Use                                     |
| ---------- | ---- | ------ | --------------------------------------- |
| Display    | 32px | 700    | App icon label, hero POI name in player |
| Heading    | 22px | 600    | Screen titles                           |
| Subheading | 18px | 600    | Section labels, card titles             |
| Body       | 16px | 400    | Guide audio subtitles, main content     |
| Secondary  | 14px | 400    | Supporting text, distances, timestamps  |
| Caption    | 13px | 400    | Metadata, language tags, source badges  |
| Label      | 11px | 500    | Pill text, category chips               |

### Principles

* Hierarchy through **size and weight only** — never color alone.
* Thai and Vietnamese require **1.75× line height** to accommodate tone marks and diacritics without clipping.
* No italics anywhere in the UI — italic rendering is unreliable across complex scripts.
* All numeric data (play counts, distances, durations) uses tabular lining figures so values align in columns.

---

## 6. Iconography

### Style

* **Stroke-only, 1.5px weight** — consistent with the logo mark's drawn quality; reads on both light and dark without inversion.
* **Rounded line caps and joins** — reflects the brand's warmth; no sharp terminations.
* **24×24px grid** , 20px active area within 2px padding on each side.
* **Single color** — always inherits from the context's text token. Never hardcode an icon color.

### Map Markers

| Marker           | Shape                         | Color                                | Diameter  |
| ---------------- | ----------------------------- | ------------------------------------ | --------- |
| Standard POI     | Solid circle                  | Leaf `#1C2720`/ Mist white on dark | 32px      |
| Local gem        | Diamond (45° rotated square) | Jungle teal `#2A7560`              | 28px      |
| Current location | Pulsing circle + outer ring   | Jungle teal + 35% opacity ring       | 20px core |
| Visited POI      | Solid circle, muted           | Bark `#6B7C6A`                     | 28px      |

The diamond gem marker is the brand's most distinct visual element on the map — immediately separates local picks from standard points without any label.

### Do / Don't

| Do                              | Don't                                   |
| ------------------------------- | --------------------------------------- |
| Use stroke icons at 1.5px       | Use filled icon packs                   |
| Inherit color from parent token | Hardcode icon colors                    |
| Scale to 24px minimum           | Use icons below 20px                    |
| Use diamond for gems only       | Apply diamond shape to other categories |

---

## 7. Illustration Style

Used in: empty states, onboarding cards, marketing surfaces.

### Approach

Flat geometry drawn from SEA craft traditions — the diamond grids of Thai silk, the stepped borders of Balinese temple carvings, the repeating wave patterns of Vietnamese lacquerware. Never literal, never stereotyped. The geometry is the reference, not the motif itself.

### Rules

* **Two colors maximum** per illustration: one neutral surface + one accent.
* **No gradients, no shadows** — all fills are flat.
* **Stroke weight matches icons** — 1.5px, rounded caps, same visual register.
* Compositions are **asymmetric and slightly off-center** — feels handmade, not generated.

### Motif Library

| Motif                  | Abstraction                                              |
| ---------------------- | -------------------------------------------------------- |
| Temple spire           | Tapered vertical form with stepped silhouette            |
| River longboat         | Low horizontal shape, slightly curved hull               |
| Market lantern cluster | Circles of 3 varying sizes grouped closely               |
| Jungle canopy          | Layered horizontal arcs, densest at top                  |
| Path-to-waveform       | The logo mark's core metaphor, reused in larger format   |
| Woven grid             | Diamond lattice used as background texture at 8% opacity |

### Illustration Palette by Surface

| Surface            | Background             | Mark color              |
| ------------------ | ---------------------- | ----------------------- |
| Light / onboarding | Mist white `#F5F7F2` | Leaf `#1C2720`        |
| Dark / empty state | Leaf `#1C2720`       | Mist white `#F5F7F2`  |
| Accent moment      | Leaf `#1C2720`       | Jungle teal `#2A7560` |

---

## 8. Motion Language

### Principles

* **Motion serves orientation** — every animation tells the user where they are, not how impressive the app is.
* **Wander tempo** — slow enough to feel unhurried; fast enough to feel responsive. The brand doesn't rush.
* **Audio-visual sync** — any motion tied to audio (waveform, progress bar, approach pulse) locks to the audio clock, never runs independently.

### Core Timings

| Moment                     | Type                             | Duration  | Easing                             |
| -------------------------- | -------------------------------- | --------- | ---------------------------------- |
| Screen enter               | Slide up + fade                  | 240ms     | ease-out                           |
| Bottom sheet open          | Spring                           | 300ms     | spring — tension 180, friction 22 |
| Audio playback start       | Waveform fades in                | 150ms     | ease-out                           |
| Voice listening            | Waveform bars pulse to amplitude | real-time | —                                 |
| Gem pin appears            | Scale 0→1 + fade                | 200ms     | ease-out                           |
| POI approach pulse         | Ring expands + fades             | 900ms     | ease-out, repeats 2×              |
| Alert banner slides in     | Slide down                       | 200ms     | ease-out                           |
| Progress bar fill          | Linear advance                   | real-time | linear                             |
| Transition between screens | Slide + crossfade                | 240ms     | ease-in-out                        |

### Wander Tempo Rule

No entrance animation faster than 150ms. No transition slower than 350ms. Everything in between. The pace communicates that WanderVoice is calm, considered, and present — not reactive or anxious.

### Reduced Motion

When `prefers-reduced-motion` is active:

* All slides and springs → 80ms fade-only
* Waveform → static stepped bar display
* Pulsing rings → solid static outline at 40% opacity
* Progress bar → instant position updates

---

## 9. Reference Imagery — CI Analysis

> This section documents real-world visual references reviewed during creative direction, noting which elements align with WanderVoice CI and which to avoid.

### Reference 01 — Keithston & Partners "Break Sections" Slide

**Description:** A full-bleed presentation slide using an aerial drone photograph of dense forest canopy with a road cutting through it. Large-scale extra-bold condensed white headline ("BREAK SECTIONS") overlaid at near-full-bleed size. Muted olive rounded-rect card with body copy. Zigzag wave decorative mark in top-right corner. Brand logo top-left.

**First impression:** Sporty, assertive, adventurous — closer to a trail running or cycling brand than a calm wanderer.

**Element-by-element CI verdict:**

| Element                                     | What it does                                          | WanderVoice verdict                                                           |
| ------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| Typography — extra-bold condensed          | Reads athletic, commanding, high-energy               | ✗ Avoid — conflicts with Wander tempo (unhurried, not assertive)            |
| Photography — aerial drone, top-down       | Dynamic, commanding; feels like sport or action brand | ✗ Avoid — WanderVoice stays ground-level, intimate, golden-hour             |
| Color — olive green + white on dark forest | Muted, natural; close to Jungle Mist palette          | ✓ Aligned — keep this tonal range                                           |
| Decorative mark — loose zigzag wave        | Adds playful, handmade quality; breaks rigidity       | △ Directionally right — but replace with path-to-waveform (brand-specific)  |
| Layout — full-bleed photo, text on top     | High contrast, confident                              | △ Use selectively — WanderVoice overlays should be more restrained in scale |

**What to borrow:**

* The green palette execution — dark canopy background, muted olive mid-tone, white foreground text is almost exactly the Jungle Mist dark-surface pattern.
* The intent of a single decorative brand mark breaking the grid — but ours is the path-to-waveform, not a generic wave.

**What to reject:**

* Condensed heavy type at hero scale. WanderVoice headlines use Inter 600 semibold at restrained sizes — not extra-bold display condensed.
* Aerial photography framing. The top-down perspective is about dominance and scale; WanderVoice photography is about being inside a place, not surveying it from above.
* The "assertive" energy overall. This reference declares. WanderVoice invites.

**Design lesson:**

> Same palette, completely different energy — the difference is type weight and photography angle. Jungle Mist can feel sporty if type is too heavy or imagery is too dramatic. Keep Inter at regular–semibold weights and photography at human eye-level to hold the calm, curious register.

---

*Last updated: May 2026*
*Product: WanderVoice*
*Status: Pre-prototype creative direction*
