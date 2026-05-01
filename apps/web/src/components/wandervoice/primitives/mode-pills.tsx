'use client'

import { z } from 'zod'
import { colors, borders } from '../tokens'

const ModePillsPropsSchema = z.object({
  mode: z.enum(['Story', 'Facts', 'Secrets']),
  dark: z.boolean().default(false),
})

type ModePillsProps = z.infer<typeof ModePillsPropsSchema> & {
  setMode: (m: 'Story' | 'Facts' | 'Secrets') => void
}

const MODES = ['Story', 'Facts', 'Secrets'] as const

export function ModePills({ mode, setMode, dark = false }: ModePillsProps) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {MODES.map((m) => {
        const active = mode === m
        return (
          <div
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '4px 11px',
              borderRadius: 20,
              cursor: 'pointer',
              border: active ? borders.borderT : dark ? borders.borderD : borders.border,
              background: active ? colors.teal : 'transparent',
            }}
          >
            <span
              style={{
                fontFamily: 'inherit',
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                color: active ? colors.mist : dark ? 'rgba(245,247,242,0.5)' : colors.bark,
              }}
            >
              {m}
            </span>
          </div>
        )
      })}
    </div>
  )
}
