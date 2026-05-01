'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'

const MODES = [
  { m: 'Story', desc: 'Narrative arcs, characters, vivid scenes. History as a place remembers it.' },
  { m: 'Facts', desc: 'Dates, measurements, context. Dense, scannable, information-first.' },
  { m: 'Secrets', desc: 'Hidden layers, local knowledge, what guidebooks omit.' },
] as const

type ModeKey = typeof MODES[number]['m']

export function S5A() {
  const [sel, setSel] = useState<ModeKey>('Story')

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.leaf,
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 18px',
      }}
    >
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
        {[true, true, false, false].map((filled, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: filled ? colors.teal : 'rgba(245,247,242,0.15)',
            }}
          />
        ))}
      </div>

      {/* Logo mark */}
      <svg width="52" height="22" viewBox="0 0 60 24" style={{ marginBottom: 10 }}>
        <circle cx="6" cy="18" r="2.2" fill="none" stroke={colors.mist} strokeWidth="1.5" />
        <circle cx="15" cy="15" r="2.2" fill="none" stroke={colors.mist} strokeWidth="1.5" />
        <circle cx="25" cy="13" r="2.2" fill="none" stroke={colors.mist} strokeWidth="1.5" />
        <line x1="33" y1="22" x2="33" y2="10" stroke={colors.teal} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="40" y1="22" x2="40" y2="4" stroke={colors.teal} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="47" y1="22" x2="47" y2="8" stroke={colors.teal} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="54" y1="22" x2="54" y2="13" stroke={colors.teal} strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <div style={{ fontSize: 11, fontWeight: 400, color: colors.bark, marginBottom: 2 }}>WanderVoice</div>
      <div style={{ fontSize: 19, fontWeight: 700, color: colors.mist, marginBottom: 4, lineHeight: 1.25 }}>
        How do you like your guides?
      </div>
      <p style={{ fontSize: 12, color: colors.bark, marginBottom: 18, lineHeight: 1.65, margin: '0 0 18px' }}>
        Choose a narrative style. You can switch any time inside a story.
      </p>

      {/* Mode cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'auto' }}>
        {MODES.map((s) => {
          const active = sel === s.m
          return (
            <div
              key={s.m}
              onClick={() => setSel(s.m)}
              style={{
                border: active ? borders.borderT : borders.borderD,
                borderRadius: 12,
                padding: '12px 14px',
                background: active ? 'rgba(42,117,96,0.15)' : 'rgba(245,247,242,0.04)',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                cursor: 'pointer',
              }}
            >
              {/* Radio dot */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: active ? `2px solid ${colors.teal}` : '2px solid rgba(245,247,242,0.2)',
                  background: active ? colors.teal : 'transparent',
                  flexShrink: 0,
                  marginTop: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.mist }} />}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? colors.mist : 'rgba(245,247,242,0.55)',
                    marginBottom: 2,
                  }}
                >
                  {s.m}
                </div>
                <p style={{ fontSize: 11, color: colors.bark, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 18,
          background: colors.teal,
          borderRadius: 14,
          padding: '13px 20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: colors.mist }}>Continue</span>
      </div>
    </div>
  )
}
