import { z } from 'zod'
import { colors } from '../tokens'
import { ChevronIcon, DiamondMarker } from '../icons'

const ApproachBannerPropsSchema = z.object({
  name: z.string().default('Hàng Bạc Silver Street'),
  dist: z.string().default('120m'),
})

type ApproachBannerProps = z.infer<typeof ApproachBannerPropsSchema>

export function ApproachBanner({ name, dist }: ApproachBannerProps) {
  const { name: n, dist: d } = ApproachBannerPropsSchema.parse({ name, dist })

  return (
    <div
      style={{
        margin: '0 12px 6px',
        background: colors.gold,
        borderRadius: 10,
        padding: '7px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <DiamondMarker size={9} color={colors.leaf} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.leaf }}>{n}</div>
        <div style={{ fontSize: 10, color: 'rgba(28,39,32,0.65)' }}>{d} ahead · narrative queued</div>
      </div>
      <ChevronIcon size={16} color={colors.leaf} />
    </div>
  )
}
