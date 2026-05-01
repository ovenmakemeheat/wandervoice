import { z } from 'zod'
import { colors } from '../tokens'

const MapPropsSchema = z.object({
  dark: z.boolean().default(false),
  h: z.union([z.number(), z.literal('auto')]).default(140),
  gems: z.boolean().default(true),
})

type MapProps = z.infer<typeof MapPropsSchema>

export function MapPlaceholder(rawProps: Partial<MapProps>) {
  const { dark, h, gems } = MapPropsSchema.parse(rawProps)

  const bg = dark ? '#1A2820' : '#C4D4C0'
  const gridLine = dark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.10)'
  const road = dark ? 'rgba(245,247,242,0.28)' : 'rgba(28,39,32,0.22)'

  return (
    <div
      style={{
        background: bg,
        height: h === 'auto' ? '100%' : h,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid lines */}
      {[0.28, 0.55, 0.78].map((x) => (
        <div
          key={x}
          style={{
            position: 'absolute',
            left: `${x * 100}%`,
            top: 0,
            bottom: 0,
            borderLeft: `1px solid ${gridLine}`,
          }}
        />
      ))}
      {[0.35, 0.68].map((y) => (
        <div
          key={y}
          style={{
            position: 'absolute',
            top: `${y * 100}%`,
            left: 0,
            right: 0,
            borderTop: `1px solid ${gridLine}`,
          }}
        />
      ))}

      {/* Road path */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 200 140"
        preserveAspectRatio="none"
      >
        <path
          d="M100 0 C94 28 118 48 100 76 C82 104 112 122 100 140"
          stroke={road}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Gem markers — map-internal markers stay as divs (SVG composition context) */}
      {gems && (
        <>
          <div
            style={{
              position: 'absolute',
              left: '20%',
              top: '28%',
              width: 10,
              height: 10,
              background: colors.teal,
              transform: 'rotate(45deg)',
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '22%',
              top: '52%',
              width: 10,
              height: 10,
              background: colors.teal,
              transform: 'rotate(45deg)',
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '58%',
              top: '18%',
              width: 8,
              height: 8,
              background: dark ? colors.mist : colors.leaf,
              borderRadius: '50%',
            }}
          />
        </>
      )}

      {/* Current location dot */}
      <div
        style={{
          position: 'absolute',
          left: '47%',
          top: '44%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            background: colors.teal,
            borderRadius: '50%',
            border: `2.5px solid ${colors.mist}`,
            boxShadow: '0 0 0 5px rgba(42,117,96,0.22)',
          }}
        />
      </div>
    </div>
  )
}
