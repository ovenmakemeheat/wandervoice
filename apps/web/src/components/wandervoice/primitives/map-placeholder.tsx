import { z } from 'zod'
import { colors } from '../tokens'
import { useState, useEffect, useRef } from 'react'
import { useAppContext } from '../context/app-context'
import { MOCK_CITY_CENTER, MOCK_WAT_PHRA_KAEW, MOCK_SUB_PLACES, gmapsPhoto } from '../data/mock'

// Decode a Google Maps encoded polyline into lat/lng points
function decodePolyline(encoded: string): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = []
  let index = 0, lat = 0, lng = 0
  while (index < encoded.length) {
    let b: number, shift = 0, result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = 0; result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    points.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }
  return points
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

const MapPropsSchema = z.object({
  dark: z.boolean().default(false),
  h: z.union([z.number(), z.literal('auto')]).default(140),
  gems: z.boolean().default(true),
})

type MapProps = z.infer<typeof MapPropsSchema>

interface POI {
  lat: number
  lng: number
  name: string
  imageUrl?: string
  type?: string
  address?: string
  tags?: Record<string, string>
  distance?: number
  _osmId?: number
}

interface Road {
  id: number
  points: { lat: number; lng: number }[]
}

const MOCK_WAT_PHRA_KAEW_TAGS: Record<string, string> = {
  'name': 'วัดพระศรีรัตนศาสดาราม',
  'name:en': 'Wat Phra Kaew (Temple of the Emerald Buddha)',
  'name:th': 'วัดพระศรีรัตนศาสดาราม',
  'tourism': 'attraction',
  'historic': 'temple',
  'religion': 'buddhism',
  'denomination': 'theravada',
  'start_date': '1782',
  'heritage': '1',
  'fee': 'yes',
  'charge': '500 THB',
  'opening_hours': 'Mo-Su 08:30-15:30',
  'website': 'https://www.royalgrandpalace.th',
  'wheelchair': 'yes',
  'addr:street': 'Na Phra Lan Road',
  'addr:suburb': 'Khwaeng Phra Borom Maha Ratchawang',
  'addr:district': 'Khet Phra Nakhon',
  'addr:city': 'Bangkok',
  'addr:postcode': '10200',
  'addr:country': 'TH',
  'wikidata': 'Q898602',
  'wikipedia': 'en:Wat Phra Kaew',
  'operator': 'Thai Royal Household',
  'capacity': '5000',
  'historic:period': 'Rattanakosin Kingdom',
  'historic:civilization': 'Thai',
  'architect': 'King Rama I commission',
  'built_by': 'King Rama I',
}

export function MapPlaceholder(rawProps: Partial<MapProps>) {
  const { dark, h, gems } = MapPropsSchema.parse(rawProps)
  const { setNearestPOI, setNearbyPOIs, navigate } = useAppContext()

  const bg = dark ? '#1A2820' : '#C4D4C0'
  const gridLine = dark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.10)'
  const roadColor = dark ? 'rgba(245,247,242,0.22)' : 'rgba(28,39,32,0.18)'

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [pois, setPois] = useState<POI[]>([])
  const [roads, setRoads] = useState<Road[]>([])
  const [loading, setLoading] = useState(true)

  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  useEffect(() => {
    // Demo mode: NEXT_PUBLIC_FAKE_LAT/LNG override real GPS
    const fakeLat = parseFloat(process.env.NEXT_PUBLIC_FAKE_LAT ?? '')
    const fakeLng = parseFloat(process.env.NEXT_PUBLIC_FAKE_LNG ?? '')
    if (!isNaN(fakeLat) && !isNaN(fakeLng)) {
      console.log(`📍 Demo mode: faking location → ${fakeLat}, ${fakeLng}`)
      const loc = { lat: fakeLat, lng: fakeLng }
      setUserLocation(loc)
      fetchMapData(loc)
      return
    }

    // Real GPS
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
          fetchMapData(loc)
        },
        (err) => {
          console.warn('GPS failed, using Wat Phra Kaew fallback', err)
          const fallbackLoc = { lat: MOCK_CITY_CENTER.lat, lng: MOCK_CITY_CENTER.lng }
          setUserLocation(fallbackLoc)
          fetchMapData(fallbackLoc)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      const fallbackLoc = { lat: MOCK_CITY_CENTER.lat, lng: MOCK_CITY_CENTER.lng }
      setUserLocation(fallbackLoc)
      fetchMapData(fallbackLoc)
    }
  }, [])

  const fetchMapData = async (loc: { lat: number; lng: number }) => {
    setLoading(true)
    // Immediately show Wat Phra Kaew data while real fetch is in-flight
    setNearestPOI({
      lat: MOCK_WAT_PHRA_KAEW.lat,
      lng: MOCK_WAT_PHRA_KAEW.lng,
      name: MOCK_WAT_PHRA_KAEW.name,
      type: 'Tourist Attraction',
      address: MOCK_WAT_PHRA_KAEW.address,
      imageUrl: MOCK_WAT_PHRA_KAEW.photos[0],
      description: 'The most sacred Buddhist temple in Thailand, housing the revered Emerald Buddha statue within the Grand Palace complex.',
      tags: MOCK_WAT_PHRA_KAEW_TAGS,
    })

    try {
      // ── 1. Nearby places via Google Places API ────────────────────────────
      const nearbyRes = await fetch(
        `/api/maps/nearby?lat=${loc.lat}&lng=${loc.lng}&radius=800&type=tourist_attraction`
      )
      const nearbyData = await nearbyRes.json()

      const fetchedPois: POI[] = []

      if (nearbyData.results?.length) {
        for (const place of nearbyData.results.slice(0, 20)) {
          const photoRef = place.photos?.[0]?.photo_reference
          fetchedPois.push({
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            name: place.name,
            type: (place.types?.[0] ?? 'attraction').replace(/_/g, ' '),
            address: place.vicinity ?? undefined,
            imageUrl: photoRef ? gmapsPhoto(photoRef, 400) : undefined,
            distance: haversineM(loc.lat, loc.lng, place.geometry.location.lat, place.geometry.location.lng),
            tags: {
              tourism: 'attraction',
              ...(place.rating ? { rating: String(place.rating) } : {}),
              ...(place.user_ratings_total ? { user_ratings_total: String(place.user_ratings_total) } : {}),
              ...(place.opening_hours?.open_now !== undefined
                ? { opening_hours: place.opening_hours.open_now ? 'open now' : 'closed now' }
                : {}),
            },
          })
        }

        const sorted = [...fetchedPois].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
        setPois(sorted.slice(0, 20))
        setNearbyPOIs(sorted.slice(0, 15))

        // Nearest non-Wat-Phra-Kaew place becomes the live nearest POI
        const nearest = sorted[0]
        if (nearest) setNearestPOI(nearest)
      }

      // ── 2. Walking route polylines via Directions API ─────────────────────
      // Fetch 4 cardinal walking routes to draw road network around user
      const DESTINATIONS = [
        { lat: loc.lat + 0.006, lng: loc.lng },          // north ~670m
        { lat: loc.lat - 0.006, lng: loc.lng },          // south
        { lat: loc.lat, lng: loc.lng + 0.008 },          // east ~690m
        { lat: loc.lat, lng: loc.lng - 0.008 },          // west
      ]

      const routePolylines: { lat: number; lng: number }[][] = []

      await Promise.all(DESTINATIONS.map(async (dest, i) => {
        try {
          const dirRes = await fetch(
            `/api/maps/directions?origin=${loc.lat},${loc.lng}&destination=${dest.lat},${dest.lng}&mode=walking`
          )
          const dirData = await dirRes.json()
          const encoded = dirData.routes?.[0]?.overview_polyline?.points
          if (encoded) routePolylines[i] = decodePolyline(encoded)
        } catch { /* skip this direction */ }
      }))

      const roads: Road[] = routePolylines
        .filter(Boolean)
        .map((points, i) => ({ id: i, points }))
      setRoads(roads)

    } catch (err) {
      console.error('Google Maps fetch failed:', err)
      // Wat Phra Kaew data already set above — nothing more to do
    } finally {
      setLoading(false)
    }
  }

  // Projection scale (pixels per degree)
  const SCALE = 160000
  // Center screen coordinates
  const cx = 200
  const cy = 100

  // Helper to project lat/lng to local coordinates
  const project = (lat: number, lng: number) => {
    if (!userLocation) return { x: 0, y: 0 }
    const dx = (lng - userLocation.lng) * SCALE * Math.cos((userLocation.lat * Math.PI) / 180)
    const dy = (userLocation.lat - lat) * SCALE
    return { x: cx + dx, y: cy + dy }
  }

  return (
    <div
      style={{
        background: bg,
        height: h === 'auto' ? '100%' : h,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Infinite Grid effect */}
        <div
          style={{
            position: 'absolute',
            inset: -2000,
            backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}
        />

        {/* Real Roads from OpenStreetMap */}
        <svg
          style={{
            position: 'absolute',
            left: -1000,
            top: -1000,
            width: 3000,
            height: 3000,
            pointerEvents: 'none',
          }}
          viewBox="-1000 -1000 3000 3000"
        >
          {roads.map((road) => {
            const points = road.points
              .map((p) => {
                const proj = project(p.lat, p.lng)
                return `${proj.x},${proj.y}`
              })
              .join(' ')
            return (
              <polyline
                key={road.id}
                points={points}
                stroke={roadColor}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )
          })}
        </svg>

        {/* Real POI markers */}
        {gems &&
          userLocation &&
          pois.map((poi, i) => {
            const { x, y } = project(poi.lat, poi.lng)
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    background: colors.teal,
                    transform: 'rotate(45deg)',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    color: dark ? colors.mist : colors.leaf,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    padding: '2px 4px',
                    background: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
                    borderRadius: 4,
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  {poi.name}
                </span>
              </div>
            )
          })}

        {/* Wat Phra Kaew — pinned landmark marker */}
        {userLocation && (() => {
          const { x, y } = project(MOCK_WAT_PHRA_KAEW.lat, MOCK_WAT_PHRA_KAEW.lng)
          return (
            <div
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: 'translate(-50%, -100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                zIndex: 8,
                pointerEvents: 'none',
              }}
            >
              <div style={{
                background: colors.gold,
                borderRadius: '50% 50% 50% 0',
                width: 18,
                height: 18,
                transform: 'rotate(-45deg)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '2px solid white',
              }} />
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                color: dark ? colors.mist : colors.leaf,
                background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.85)',
                padding: '2px 5px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(3px)',
                border: `1px solid ${colors.gold}44`,
              }}>
                Wat Phra Kaew
              </span>
            </div>
          )
        })()}

        {/* Current location dot */}
        {userLocation && (
          <div
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                background: colors.teal,
                borderRadius: '50%',
                border: `3px solid ${colors.mist}`,
                boxShadow: '0 0 10px rgba(42,117,96,0.5)',
              }}
            />
            <div 
              onClick={(e) => {
                e.stopPropagation()
                navigate('sub-place-selection')
              }}
              style={{ 
                fontSize: 9, 
                color: colors.teal, 
                background: colors.mist, 
                padding: '2px 8px', 
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: `1px solid ${colors.teal}33`
              }}
            >
              Refine
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.teal, animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 10, color: dark ? colors.bark : colors.leaf, fontWeight: 500 }}>Live Data...</span>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
