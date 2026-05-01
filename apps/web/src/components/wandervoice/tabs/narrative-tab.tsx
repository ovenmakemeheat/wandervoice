'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { ModePills } from '../primitives/mode-pills'
import { NarrativeToggle } from '../primitives/narrative-toggle'
import { ChevronIcon } from '../icons'

interface NarrativeTabProps {
  dark?: boolean
}

const SUGGESTIONS = [
  { label: 'Switch to Secrets?', reason: 'This street has hidden guild rituals' },
  { label: 'Try Facts mode', reason: 'Dates and measurements available' },
]

export function NarrativeTab({ dark = false }: NarrativeTabProps) {
  const [narrating, setNarrating] = useState(true)
  const [mode, setMode] = useState<'Story' | 'Facts' | 'Secrets'>('Story')

  return (
    <div
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Place + mode header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: dark ? colors.mist : colors.leaf }}>
            Hàng Bạc Silver Street
          </div>
          <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>
            Est. 1428 · Jewellery guild
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.bark }}>
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
          <span style={{ fontSize: 11, color: colors.teal }}>Ask</span>
        </div>
      </div>

      <ModePills mode={mode} setMode={setMode} dark={dark} />

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        <NarrativeToggle active={narrating} onToggle={() => setNarrating((p) => !p)} dark={dark} />
      </div>

      {/* Quick suggestions */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: colors.bark,
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          QUICK SUGGESTIONS
        </div>
        {SUGGESTIONS.map((s) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 10px',
              borderRadius: 8,
              marginBottom: 5,
              border: dark ? borders.borderD : borders.border,
              background: dark ? 'rgba(245,247,242,0.04)' : 'white',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: dark ? colors.mist : colors.leaf }}>
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: colors.bark }}>{s.reason}</div>
            </div>
            <ChevronIcon size={16} color={colors.teal} />
          </div>
        ))}
      </div>
    </div>
  )
}
