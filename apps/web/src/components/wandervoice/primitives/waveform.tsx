import { z } from 'zod'
import { colors } from '../tokens'

const WaveformPropsSchema = z.object({
  color: z.string().default(colors.teal),
  n: z.number().min(1).max(40).default(20),
  h: z.number().default(28),
  active: z.boolean().default(true),
})

type WaveformProps = z.infer<typeof WaveformPropsSchema>

const BAR_HEIGHTS = [4, 8, 14, 20, 26, 20, 14, 20, 26, 28, 22, 16, 10, 18, 24, 18, 10, 14, 20, 14, 8, 12, 20, 14, 8]

export function Waveform(rawProps: Partial<WaveformProps>) {
  const props = WaveformPropsSchema.parse(rawProps)
  const { color, n, h, active } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2.5, height: h }}>
      {BAR_HEIGHTS.slice(0, n).map((v, i) => (
        <div
          key={i}
          style={{
            width: 2.5,
            height: active ? v : 3,
            background: color,
            borderRadius: 2,
            opacity: active ? 0.45 + (v / 28) * 0.55 : 0.22,
            transition: 'height 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}
