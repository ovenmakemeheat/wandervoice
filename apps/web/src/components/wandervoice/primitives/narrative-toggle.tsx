'use client'

import { z } from 'zod'
import { colors, borders } from '../tokens'
import { PauseIcon } from '../icons'

const NarrativeTogglePropsSchema = z.object({
  active: z.boolean(),
  dark: z.boolean().default(false),
})

type NarrativeToggleProps = z.infer<typeof NarrativeTogglePropsSchema> & {
  onToggle: () => void
}

const WAVEFORM_HEIGHTS = [5, 10, 18, 14, 22, 18, 12, 20, 22, 16, 10, 18, 14, 8]

export function NarrativeToggle({ active, onToggle, dark = false }: NarrativeToggleProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 32px',
        borderRadius: 32,
        cursor: 'pointer',
        userSelect: 'none',
        background: active ? colors.teal : dark ? 'rgba(245,247,242,0.07)' : colors.mistBg,
        border: active ? `2px solid ${colors.teal}` : dark ? borders.borderD : borders.border,
        boxShadow: active ? '0 0 0 7px rgba(42,117,96,0.16)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      {/* Waveform / Pause bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 22 }}>
        {active ? (
          WAVEFORM_HEIGHTS.map((v, i) => (
            <div
              key={i}
              style={{
                width: 2.5,
                height: v,
                background: colors.mist,
                borderRadius: 2,
                opacity: 0.6 + (v / 22) * 0.4,
              }}
            />
          ))
        ) : (
          <PauseIcon size={18} color={dark ? colors.bark : colors.bark} />
        )}
      </div>

      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: active ? colors.mist : dark ? 'rgba(245,247,242,0.55)' : colors.bark,
        }}
      >
        {active ? 'Pause Narrative' : 'Continue Narrative'}
      </span>
      <span
        style={{
          fontSize: 10,
          color: active ? 'rgba(245,247,242,0.65)' : dark ? 'rgba(245,247,242,0.3)' : colors.bark,
        }}
      >
        {active ? 'AI narrating your walk' : 'Tap to resume guide'}
      </span>
    </div>
  )
}
