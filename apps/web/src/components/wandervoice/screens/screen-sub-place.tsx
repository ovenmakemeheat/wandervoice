'use client'

import { colors } from '../tokens'
import { useAppContext } from '../context/app-context'
import { DiamondMarker, ChevronIcon, SearchIcon } from '../icons'

const SUB_PLACES = [
  { id: 'chapel', name: 'Emerald Buddha Chapel', area: 'Central complex' },
  { id: 'chedi', name: 'The Golden Chedi', area: 'Upper Terrace' },
  { id: 'pantheon', name: 'The Royal Pantheon', area: 'Upper Terrace' },
  { id: 'mondop', name: 'Phra Mondop (Library)', area: 'Upper Terrace' },
  { id: 'murals', name: 'Ramakien Gallery', area: 'Outer cloister' },
]

export function ScreenSubPlaceSelection() {
  const { navigate, goBack } = useAppContext()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.mistBg }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.leaf, margin: 0 }}>
          Refine your location
        </h2>
        <div onClick={goBack} style={{ fontSize: 13, color: colors.bark, cursor: 'pointer' }}>Cancel</div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <p style={{ fontSize: 13, color: colors.bark, margin: '0 0 20px' }}>
          We detected you are at <b>Wat Phra Kaew</b>. Which specific area are you exploring?
        </p>

        {/* Search Bar (Visual only) */}
        <div style={{ 
          background: 'rgba(28,39,32,0.05)', 
          borderRadius: 12, 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          marginBottom: 24 
        }}>
          <SearchIcon size={16} color={colors.bark} />
          <span style={{ fontSize: 14, color: 'rgba(28,39,32,0.4)' }}>Search sub-places...</span>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SUB_PLACES.map((place) => (
            <div
              key={place.id}
              onClick={() => navigate('smart-walk')}
              style={{
                background: colors.mist,
                borderRadius: 16,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                border: '1.5px solid rgba(28,39,32,0.06)'
              }}
            >
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 10, 
                background: 'rgba(42,117,96,0.08)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <DiamondMarker size={14} color={colors.teal} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: colors.leaf }}>{place.name}</div>
                <div style={{ fontSize: 12, color: colors.bark }}>{place.area}</div>
              </div>

              <ChevronIcon size={16} color={colors.bark} />
            </div>
          ))}
        </div>

        {/* AI Generate Prompt (Mock) */}
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          borderRadius: 16, 
          background: 'linear-gradient(135deg, #2A7560 0%, #1C2720 100%)',
          color: colors.mist,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Can't find your spot?</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Generate custom guide for this area</div>
          <div style={{ 
            marginTop: 12, 
            background: 'rgba(245,247,242,0.15)', 
            padding: '8px 16px', 
            borderRadius: 20, 
            fontSize: 12,
            display: 'inline-block'
          }}>
            AI Generate
          </div>
        </div>
      </div>
    </div>
  )
}
