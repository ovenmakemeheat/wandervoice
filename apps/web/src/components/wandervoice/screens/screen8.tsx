'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { NavBar } from '../primitives/nav-bar'
import { CheckIcon } from '../icons'

const PLACES = [
  { name: 'Main Library', hint: 'You may be here', ai: false },
  { name: 'Clock Tower', hint: '50m east', ai: false },
  { name: 'Lecture Hall A', hint: 'AI fetched', ai: true },
  { name: 'Faculty of Arts', hint: 'AI fetched', ai: true },
  { name: 'Admin Block', hint: 'AI fetched', ai: true },
]

export function S8A() {
  const [sel, setSel] = useState('Main Library')
  const [narrating, setNarrating] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: colors.mist, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: borders.border }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: colors.bark, letterSpacing: 1, marginBottom: 4 }}>YOU ARE INSIDE</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: colors.leaf }}>University of Hanoi</div>
        <div style={{ fontSize: 12, color: colors.bark, marginTop: 2 }}>Large campus · sub-places detected</div>
      </div>

      {/* Map with overlays */}
      <div style={{ position: 'relative', margin: '8px 12px 0' }}>
        <MapPlaceholder h={108} />
        {[
          { l: 'Library', x: '18%', y: '36%' },
          { l: 'Clock', x: '54%', y: '20%' },
          { l: 'Hall A', x: '66%', y: '56%' },
        ].map((p) => (
          <div
            key={p.l}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              background: 'rgba(245,247,242,0.92)',
              borderRadius: 8,
              padding: '2px 7px',
              border: borders.border,
            }}
          >
            <span style={{ fontSize: 9, color: colors.leaf }}>{p.l}</span>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ padding: '8px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: colors.bark, letterSpacing: 0.5 }}>WHERE ARE YOU RIGHT NOW?</span>
        <span style={{ fontSize: 11, color: colors.teal, cursor: 'pointer' }}>Not sure</span>
      </div>

      {/* Place list */}
      <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto' }}>
        {PLACES.map((p) => {
          const active = sel === p.name
          return (
            <div
              key={p.name}
              onClick={() => setSel(p.name)}
              style={{
                padding: '9px 12px',
                borderRadius: 10,
                border: active ? borders.borderT : borders.border,
                background: active ? 'rgba(42,117,96,0.06)' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              {/* Radio dot */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: active ? `2px solid ${colors.teal}` : '2px solid rgba(28,39,32,0.2)',
                  background: active ? colors.teal : 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.mist }} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.leaf }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  {p.ai && (
                    <div style={{ padding: '1px 6px', background: colors.mistBg, borderRadius: 4, border: borders.border }}>
                      <span style={{ fontSize: 9, color: colors.bark }}>AI fetched</span>
                    </div>
                  )}
                  <span style={{ fontSize: 10, color: colors.bark }}>{p.hint}</span>
                </div>
              </div>

              {active && <CheckIcon size={16} color={colors.teal} />}
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '10px 14px', borderTop: borders.border }}>
        <div
          onClick={() => setNarrating((p) => !p)}
          style={{
            background: narrating ? 'rgba(42,117,96,0.1)' : colors.teal,
            border: narrating ? borders.borderT : 'none',
            borderRadius: 14,
            padding: '12px 20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: narrating ? colors.teal : colors.mist }}>
            {narrating ? 'Pause Narrative' : 'Start Narrative here'}
          </div>
          <div style={{ fontSize: 10, color: narrating ? colors.teal : 'rgba(245,247,242,0.65)', marginTop: 2 }}>
            {narrating ? `Narrating ${sel}` : `Guide will focus on ${sel}`}
          </div>
        </div>
      </div>

      <NavBar active={1} />
    </div>
  )
}
