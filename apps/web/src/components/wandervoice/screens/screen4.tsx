import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { NavBar } from '../primitives/nav-bar'
import { PlayIcon } from '../icons'

const GEMS = [
  { name: 'Hàng Bạc Silver Street', dist: '120m', type: 'History', heard: false, gold: true },
  { name: 'Bach Ma Temple', dist: '240m', type: 'Temple', heard: false, gold: false },
  { name: 'Silk lantern workshop', dist: '320m', type: 'Craft', heard: true, gold: false },
  { name: '1930s French pharmacy', dist: '410m', type: 'Architecture', heard: false, gold: false },
]

export function S4A() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: colors.mist, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: borders.border, background: colors.mist }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: colors.leaf }}>Gems Nearby</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ padding: '4px 10px', border: borders.borderT, borderRadius: 20, background: 'rgba(42,117,96,0.08)' }}>
            <span style={{ fontSize: 11, color: colors.teal }}>Map</span>
          </div>
          <div style={{ padding: '4px 10px', border: borders.border, borderRadius: 20 }}>
            <span style={{ fontSize: 11, color: colors.bark }}>Filter</span>
          </div>
        </div>
      </div>

      <MapPlaceholder h={100} />

      {/* Stats strip */}
      <div style={{ padding: '8px 14px', display: 'flex', gap: 0, borderBottom: borders.border }}>
        {[['12', 'gems'], ['4', 'unheard'], ['1.4km', 'to walk all']].map(([v, l], i) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? borders.border : 'none' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.teal }}>{v}</div>
            <div style={{ fontSize: 10, color: colors.bark }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Gem list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {GEMS.map((g) => (
          <div
            key={g.name}
            style={{
              background: g.gold ? 'rgba(232,168,80,0.07)' : 'white',
              border: g.gold ? borders.borderG : borders.border,
              borderRadius: 10,
              padding: '10px 12px',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                background: g.heard ? colors.bark : colors.teal,
                transform: 'rotate(45deg)',
                borderRadius: 3,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.leaf, marginBottom: 2 }}>{g.name}</div>
              <div style={{ display: 'flex', gap: 5 }}>
                <span style={{ fontSize: 10, color: colors.bark }}>{g.dist}</span>
                <span style={{ fontSize: 10, color: colors.bark }}>·</span>
                <span style={{ fontSize: 10, color: colors.bark }}>{g.type}</span>
                {g.heard && (
                  <>
                    <span style={{ fontSize: 10, color: colors.bark }}>·</span>
                    <span style={{ fontSize: 10, color: colors.bark }}>heard</span>
                  </>
                )}
              </div>
            </div>
            {!g.heard && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlayIcon size={14} color={colors.mist} />
              </div>
            )}
          </div>
        ))}
      </div>

      <NavBar active={1} />
    </div>
  )
}
