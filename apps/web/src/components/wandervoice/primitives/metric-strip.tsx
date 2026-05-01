import { z } from 'zod'
import { colors, borders } from '../tokens'

const MetricStripPropsSchema = z.object({
  dark: z.boolean().default(false),
})

type MetricStripProps = z.infer<typeof MetricStripPropsSchema>

const METRICS = [
  { value: '1.2km', label: 'walked' },
  { value: '4', label: 'gems' },
  { value: '22m', label: 'guided' },
]

export function MetricStrip({ dark = false }: MetricStripProps) {
  const divider = dark ? borders.borderD : borders.border

  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        padding: '7px 14px',
        borderBottom: dark ? borders.borderD : borders.border,
      }}
    >
      {METRICS.map(({ value, label }, i) => (
        <div
          key={label}
          style={{
            flex: 1,
            textAlign: 'center',
            borderRight: i < 2 ? divider : 'none',
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: dark ? colors.mist : colors.leaf,
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: 10, color: colors.bark }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
