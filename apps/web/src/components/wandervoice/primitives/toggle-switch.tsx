'use client'

import { z } from 'zod'
import { colors } from '../tokens'

const TogglePropsSchema = z.object({
  on: z.boolean(),
  dark: z.boolean().default(false),
})

type ToggleProps = z.input<typeof TogglePropsSchema> & {
  onToggle: () => void
}

export function ToggleSwitch({ on, onToggle, dark = false }: ToggleProps) {
  void dark // dark variant reserved for future styling

  return (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? colors.teal : 'rgba(245,247,242,0.15)',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: colors.mist,
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}
