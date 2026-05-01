import { colors } from '../tokens'
import { DiamondMarker, ChevronIcon, SearchIcon } from '../icons'
import { useAppContext } from '../context/app-context'
import { MOCK_SUB_PLACES } from '../data/mock'

export function PlaceTab({ dark = false }: { dark?: boolean }) {
  const { setNearestPOI, nearestPOI } = useAppContext()
  const textColor = dark ? colors.mist : colors.leaf
  const mutedColor = colors.bark

  const handleSelect = (place: any) => {
    setNearestPOI({
      ...place,
      address: 'Wat Phra Kaew',
      distance: 12, // Mock distance
    })
  }

  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: textColor, margin: '0 0 4px' }}>
          Explore areas of interest
        </h3>
        <p style={{ fontSize: 12, color: mutedColor, margin: 0 }}>
          Refine your focus or discover hidden details in this complex.
        </p>
      </div>

      {/* Search Bar (Visual only) */}
      <div style={{ 
        background: dark ? 'rgba(245,247,242,0.05)' : 'rgba(28,39,32,0.05)', 
        borderRadius: 12, 
        padding: '10px 14px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10,
        marginBottom: 20 
      }}>
        <SearchIcon size={14} color={mutedColor} />
        <span style={{ fontSize: 13, color: dark ? 'rgba(245,247,242,0.3)' : 'rgba(28,39,32,0.4)' }}>Search sub-places...</span>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_SUB_PLACES.map((place) => {
          const isActive = nearestPOI?.name === place.name
          return (
            <div
              key={place.id}
              onClick={() => handleSelect(place)}
              style={{
                background: isActive 
                  ? (dark ? 'rgba(42,117,96,0.25)' : 'rgba(42,117,96,0.1)') 
                  : (dark ? 'rgba(245,247,242,0.03)' : colors.mist),
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                border: isActive
                  ? `1.5px solid ${colors.teal}`
                  : (dark ? '1px solid rgba(245,247,242,0.08)' : '1px solid rgba(28,39,32,0.06)'),
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 8, 
                background: isActive ? colors.teal : (dark ? 'rgba(42,117,96,0.15)' : 'rgba(42,117,96,0.08)'), 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <DiamondMarker size={12} color={isActive ? colors.mist : colors.teal} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: textColor }}>{place.name}</div>
                <div style={{ fontSize: 11, color: mutedColor }}>{place.area}</div>
              </div>

              {isActive ? (
                <div style={{ fontSize: 10, color: colors.teal, fontWeight: 700 }}>ACTIVE</div>
              ) : (
                <ChevronIcon size={14} color={mutedColor} />
              )}
            </div>
          )
        })}
      </div>

      {/* AI Generate Prompt (Mock) */}
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        borderRadius: 14, 
        background: 'linear-gradient(135deg, #2A7560 0%, #1C2720 100%)',
        color: colors.mist,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>Place missing?</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>AI Generate guide for this area</div>
        <div style={{ 
          marginTop: 10, 
          background: 'rgba(245,247,242,0.15)', 
          padding: '6px 12px', 
          borderRadius: 20, 
          fontSize: 11,
          display: 'inline-block'
        }}>
          Magic Craft
        </div>
      </div>
    </div>
  )
}
