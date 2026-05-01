'use client'

import { colors, borders } from '../tokens'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { DiamondMarker, MapPinIcon, HeartIcon } from '../icons'

export function ScreenHome() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: colors.mist, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        
        {/* Header / Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: colors.bark, letterSpacing: 1.2 }}>GOOD MORNING</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.leaf }}>Jane Doe</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(42,117,96,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.teal }}>JD</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, background: 'white', borderRadius: 16, padding: '16px', border: borders.border }}>
            <DiamondMarker size={12} color={colors.teal} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.leaf }}>12</div>
            <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>Gems collected</div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: 16, padding: '16px', border: borders.border }}>
            <MapPinIcon size={14} color={colors.teal} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.leaf }}>15.4<span style={{ fontSize: 14 }}>km</span></div>
            <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>Total distance</div>
          </div>
        </div>

        {/* Quick action / Resume */}
        <div style={{ background: colors.leaf, borderRadius: 20, padding: 20, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
            <DiamondMarker size={100} color="white" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 12, color: 'rgba(245,247,242,0.6)', letterSpacing: 1.2, marginBottom: 4 }}>CONTINUE</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.mist, marginBottom: 16 }}>Old Quarter Walk</div>
            <button style={{ 
              background: colors.mist, 
              color: colors.leaf, 
              border: 'none', 
              borderRadius: 24, 
              padding: '10px 20px', 
              fontSize: 13, 
              fontWeight: 600,
              cursor: 'pointer' 
            }}>
              Resume Audio Guide
            </button>
          </div>
        </div>

        {/* Recommended */}
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.leaf, marginBottom: 12 }}>Recommended for you</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { title: 'Temple District', desc: '4 gems · 2.1 km', type: 'History' },
            { title: 'French Quarter', desc: '6 gems · 3.5 km', type: 'Architecture' }
          ].map((rec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', padding: 14, borderRadius: 16, border: borders.border }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(42,117,96,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartIcon size={20} color={colors.teal} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.leaf }}>{rec.title}</div>
                <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>{rec.desc} · {rec.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer for floating NavBar */}
        <div style={{ height: NAV_HEIGHT }} />
      </div>

      <NavBar active={0} />
    </div>
  )
}
