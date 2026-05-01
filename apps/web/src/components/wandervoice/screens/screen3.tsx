import { colors, borders } from '../tokens'
import { BottomSheet } from '../primitives/bottom-sheet'
import { NavBar } from '../primitives/nav-bar'
import { BackIcon, HeartIcon, ShareIcon } from '../icons'

export function S3A() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: colors.mist, display: 'flex', flexDirection: 'column' }}>
      {/* Hero header */}
      <div
        style={{
          height: 150,
          background: `linear-gradient(160deg, ${colors.canopy}, rgba(42,117,96,0.55))`,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 14px 10px',
        }}
      >
        {/* Back button */}
        <div style={{ position: 'absolute', top: 10, left: 12 }}>
          <div style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.35)', borderRadius: 20, color: colors.mist, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <BackIcon size={14} color={colors.mist} />
            <span style={{ fontSize: 11, color: colors.mist }}>Back</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 6 }}>
          {[HeartIcon, ShareIcon].map((Ico, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico size={16} color={colors.mist} />
            </div>
          ))}
        </div>

        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, background: colors.teal, transform: 'rotate(45deg)', borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: colors.mist }}>Local Gem</span>
        </div>
      </div>

      {/* Title row */}
      <div style={{ padding: '12px 14px 8px', borderBottom: borders.border }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.leaf, marginBottom: 3 }}>
          Hàng Bạc Silver Street
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: colors.bark }}>Est. 1428</span>
          <span style={{ fontSize: 11, color: colors.dew }}>·</span>
          <span style={{ fontSize: 11, color: colors.bark }}>Jewellery guild</span>
          <span style={{ fontSize: 11, color: colors.dew }}>·</span>
          <span style={{ fontSize: 11, color: colors.verified }}>✓ Verified</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <BottomSheet dark={false} defaultTab={1} />
      </div>

      <NavBar active={1} />
    </div>
  )
}
