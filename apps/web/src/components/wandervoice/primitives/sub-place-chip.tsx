import { z } from 'zod'
import { colors, borders } from '../tokens'

const SubPlaceChipPropsSchema = z.object({
  label: z.string().default('Bach Ma Temple · Main Hall'),
  dark: z.boolean().default(false),
})

type SubPlaceChipProps = {
  label?: string
  dark?: boolean
  onClick?: () => void
}

export function SubPlaceChip({ label, dark = false, onClick }: SubPlaceChipProps) {
  const { label: resolvedLabel } = SubPlaceChipPropsSchema.parse({ label, dark })

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        borderRadius: 20,
        cursor: onClick ? 'pointer' : 'default',
        background: dark ? 'rgba(245,247,242,0.06)' : 'rgba(42,117,96,0.07)',
        border: dark ? borders.borderD : borders.borderT,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors.teal,
        }}
      />
      <span style={{ fontSize: 11, fontWeight: 500, color: dark ? colors.mist : colors.teal }}>
        {resolvedLabel}
      </span>
      <span style={{ fontSize: 11, color: colors.bark }}>↓</span>
    </div>
  )
}
