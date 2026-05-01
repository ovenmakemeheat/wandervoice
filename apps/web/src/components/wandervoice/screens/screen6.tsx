'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { NarrativeToggle } from '../primitives/narrative-toggle'
import { SubPlaceChip } from '../primitives/sub-place-chip'
import { ApproachBanner } from '../primitives/approach-banner'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { DiamondMarker } from '../icons'

// ── Variant A: Dark, toggle center ────────────────────────────────────────

export function S6A() {
  const [narrating, setNarrating] = useState(true)
  const [mode, setMode] = useState('Story')

  const MODES = ['Story', 'Facts', 'Secrets']
  const KEYS = ['S', 'F', 'X']

  const COMING_UP = [
    { n: 'Hàng Bạc', d: '120m', h: false },
    { n: 'Silk wkshp', d: '280m', h: false },
    { n: 'Pharmacy', d: '410m', h: true },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: colors.leaf, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top stats */}
      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: colors.bark, letterSpacing: 1.2 }}>OLD QUARTER · HANOI</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 3 }}>
            {[['1.2km', 'walked'], ['4', 'gems'], ['22m', 'time']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.mist }}>{v}</div>
                <div style={{ fontSize: 9, color: colors.bark }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', background: 'rgba(245,247,242,0.07)', borderRadius: 20, padding: 2, gap: 1 }}>
          {KEYS.map((k, i) => {
            const active = mode === MODES[i]
            return (
              <div
                key={k}
                onClick={() => setMode(MODES[i])}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: active ? colors.teal : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: active ? colors.mist : colors.bark }}>{k}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ margin: '0 12px 6px' }}>
        <SubPlaceChip label="Bach Ma Temple · Main Hall" dark />
      </div>

      <ApproachBanner name="Hàng Bạc Silver Street" dist="120m" />

      {/* Narrative center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 20px' }}>
        {narrating && (
          <>
            <div style={{ fontSize: 10, color: colors.bark, letterSpacing: 1.5 }}>NARRATING NOW</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.mist, textAlign: 'center' }}>Bach Ma Temple</div>
            <div style={{ fontSize: 11, color: colors.bark }}>Est. 1010 · {mode} mode</div>
          </>
        )}
        <NarrativeToggle active={narrating} onToggle={() => setNarrating((p) => !p)} dark />
        {!narrating && (
          <span style={{ fontSize: 11, color: colors.bark, textAlign: 'center' }}>Guide paused · walking silently</span>
        )}
      </div>

      {/* Coming up */}
      <div style={{ padding: `0 12px ${NAV_HEIGHT + 4}px` }}>
        <div style={{ fontSize: 10, color: colors.bark, letterSpacing: 1.5, marginBottom: 6 }}>COMING UP</div>
        <div style={{ display: 'flex', gap: 7 }}>
          {COMING_UP.map((g) => (
            <div
              key={g.n}
              style={{
                flex: 1,
                background: g.h ? 'rgba(245,247,242,0.04)' : 'rgba(42,117,96,0.12)',
                border: g.h ? borders.borderD : '1px solid rgba(42,117,96,0.35)',
                borderRadius: 8,
                padding: '6px 8px',
              }}
            >
              <DiamondMarker size={7} color={g.h ? colors.bark : colors.teal} style={{ marginBottom: 4, borderRadius: 1 }} />
              <div style={{ fontSize: 10, fontWeight: 600, color: g.h ? colors.bark : colors.mist }}>{g.n}</div>
              <div style={{ fontSize: 9, color: colors.bark }}>{g.d}</div>
            </div>
          ))}
        </div>
      </div>

      <NavBar active={0} />
    </div>
  )
}

// ── Variant B: Light, sub-place chips + toggle ─────────────────────────────

export function S6B() {
  const [narrating, setNarrating] = useState(true)
  const [mode, setMode] = useState('Facts')
  const [sub, setSub] = useState('Main Gate')

  const SUB_PLACES = ['Main Gate', 'Library', 'Clock Tower', 'Admin Block', 'Hall A']
  const GEMS_LIST = [
    { n: 'Hàng Bạc', d: '120m' },
    { n: 'Bach Ma', d: '240m' },
    { n: 'Silk wkshp', d: '320m' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: colors.mist, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: borders.border }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: colors.leaf }}>WanderVoice</span>
        <div style={{ display: 'flex', gap: 4, background: colors.mistBg, borderRadius: 20, padding: 2 }}>
          {['Story', 'Facts', 'Secrets'].map((m) => (
            <div
              key={m}
              onClick={() => setMode(m)}
              style={{ padding: '3px 9px', borderRadius: 16, background: mode === m ? colors.teal : 'transparent', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 10, fontWeight: mode === m ? 600 : 400, color: mode === m ? colors.mist : colors.bark }}>{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-place chips */}
      <div style={{ padding: '8px 12px 0' }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: colors.bark, letterSpacing: 1, marginBottom: 5 }}>WHERE ARE YOU NOW?</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {SUB_PLACES.map((s) => (
            <div
              key={s}
              onClick={() => setSub(s)}
              style={{
                flexShrink: 0,
                padding: '5px 10px',
                borderRadius: 20,
                border: sub === s ? borders.borderT : borders.border,
                background: sub === s ? 'rgba(42,117,96,0.08)' : 'white',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: sub === s ? 500 : 400, color: sub === s ? colors.teal : colors.bark }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map with approach label */}
      <div style={{ position: 'relative', margin: '8px 12px 0' }}>
        <MapPlaceholder h={120} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, background: colors.gold, borderRadius: 12, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <DiamondMarker size={6} color={colors.leaf} style={{ borderRadius: 1 }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: colors.leaf }}>Hàng Bạc · 120m</span>
        </div>
      </div>

      {/* Narrative toggle */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 20px' }}>
        {narrating && (
          <span style={{ fontSize: 11, color: colors.bark, textAlign: 'center' }}>Narrating · {sub} · {mode} mode</span>
        )}
        <NarrativeToggle active={narrating} onToggle={() => setNarrating((p) => !p)} dark={false} />
      </div>

      {/* Gem row */}
      <div style={{ padding: `0 12px ${NAV_HEIGHT + 4}px` }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {GEMS_LIST.map((g) => (
            <div key={g.n} style={{ flex: 1, background: 'white', border: borders.border, borderRadius: 8, padding: '7px 8px' }}>
              <DiamondMarker size={7} color={colors.teal} style={{ marginBottom: 4, borderRadius: 1 }} />
              <div style={{ fontSize: 10, fontWeight: 600, color: colors.leaf }}>{g.n}</div>
              <div style={{ fontSize: 9, color: colors.bark }}>{g.d}</div>
            </div>
          ))}
        </div>
      </div>

      <NavBar active={0} />
    </div>
  )
}

// ── Variant C: Minimal dark (no NavBar — full-focus mode) ─────────────────

export function S6C() {
  const [narrating, setNarrating] = useState(false)
  const [mode, setMode] = useState('Secrets')

  const MODES = ['Story', 'Facts', 'Secrets']
  const KEYS = ['S', 'F', 'X']

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.canopy,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 18px 24px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, color: colors.bark, letterSpacing: 1.5 }}>OLD QUARTER · HANOI</div>
          <div style={{ fontSize: 10, color: colors.bark, marginTop: 3 }}>1.2 km · 4 gems heard</div>
        </div>
        <div style={{ display: 'flex', gap: 3, background: 'rgba(245,247,242,0.06)', borderRadius: 20, padding: 2 }}>
          {KEYS.map((k, i) => {
            const active = mode === MODES[i]
            return (
              <div
                key={k}
                onClick={() => setMode(MODES[i])}
                style={{ width: 26, height: 26, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? colors.teal : 'transparent', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: active ? colors.mist : colors.bark }}>{k}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Center gem */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <DiamondMarker size={14} color={colors.teal} style={{ borderRadius: 3 }} />
        <div style={{ fontSize: 24, fontWeight: 700, color: colors.mist, lineHeight: 1.1 }}>Bach Ma Temple</div>
        <div style={{ fontSize: 12, color: colors.bark }}>Est. 1010 · Temple district</div>
        <NarrativeToggle active={narrating} onToggle={() => setNarrating((p) => !p)} dark />
      </div>

      {/* Approach pill */}
      <div style={{ background: colors.gold, borderRadius: 20, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <DiamondMarker size={8} color={colors.leaf} style={{ borderRadius: 1 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.leaf, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Hàng Bạc approaching</div>
          <div style={{ fontSize: 10, color: 'rgba(28,39,32,0.65)' }}>120m · narrative will auto-start</div>
        </div>
      </div>
    </div>
  )
}
