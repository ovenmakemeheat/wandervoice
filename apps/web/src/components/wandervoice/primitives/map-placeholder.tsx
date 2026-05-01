import { z } from 'zod'
import { colors } from '../tokens'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useAppContext } from '../context/app-context'

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
}

interface Road {
  id: number
  points: { lat: number; lng: number }[]
}

export function MapPlaceholder(rawProps: Partial<MapProps>) {
  const { dark, h, gems } = MapPropsSchema.parse(rawProps)
  const { setNearestPOI, setNearbyPOIs } = useAppContext()

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
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
          fetchMapData(loc)
        },
        (err) => {
          console.warn('GPS failed, using mock location', err)
          const mockLoc = { lat: 21.0333, lng: 105.8500 } // Hanoi Old Quarter
          setUserLocation(mockLoc)
          fetchMapData(mockLoc)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      const mockLoc = { lat: 21.0333, lng: 105.8500 }
      setUserLocation(mockLoc)
      fetchMapData(mockLoc)
    }
  }, [])

  const fetchMapData = async (loc: { lat: number; lng: number }) => {
    setLoading(true)
    setNearestPOI(null) // Signal "Fetching" state for skeleton UI

    try {
      // Broader query to ensure we get SOMETHING
      const query = `[out:json][timeout:25];(node["tourism"~"attraction|museum|viewpoint|gallery|hotel|place"](around:2000,${loc.lat},${loc.lng});node["historic"](around:2000,${loc.lat},${loc.lng});way["highway"~"primary|secondary|tertiary|residential|footway"](around:2000,${loc.lat},${loc.lng}););out body geom 100;`
      
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      console.log('Overpass Request:', url)
      
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Overpass status: ${res.status}`)
      
      const data = await res.json()
      console.log('Overpass Data received:', data)

      if (data && data.elements && data.elements.length > 0) {
        const fetchedPois: POI[] = []
        const fetchedRoads: Road[] = []
        const namedWays: { name: string; lat: number; lng: number }[] = []
        const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371e3 // metres
          const φ1 = (lat1 * Math.PI) / 180
          const φ2 = (lat2 * Math.PI) / 180
          const Δφ = ((lat2 - lat1) * Math.PI) / 180
          const Δλ = ((lon2 - lon1) * Math.PI) / 180
          const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          return R * c
        }

        data.elements.forEach((e: any) => {
          if (e.type === 'node' && e.tags && (e.tags.name || e.tags['name:en'])) {
            const name = e.tags['name:en'] || e.tags.name
            const type = e.tags.tourism || e.tags.historic || e.tags.amenity || 'Landmark'
            
            const street = e.tags['addr:street'] || ''
            const house = e.tags['addr:housenumber'] || ''
            const city = e.tags['addr:city'] || ''
            const address = [house, street, city].filter(v => v.trim()).join(', ')
            
            fetchedPois.push({
              lat: e.lat,
              lng: e.lon,
              name: name,
              type: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
              address: address || undefined,
              tags: e.tags,
              distance: getDistance(loc.lat, loc.lng, e.lat, e.lon),
              imageUrl: `https://loremflickr.com/300/300/landmark,vietnam,${encodeURIComponent(name.split(' ')[0])}?lock=${e.id % 100}`
            })
          } else if (e.type === 'way' && e.geometry) {
            const roadPoints = e.geometry.map((p: any) => ({ lat: p.lat, lng: p.lon }))
            fetchedRoads.push({ id: e.id, points: roadPoints })

            if (e.tags && (e.tags.name || e.tags['name:en'])) {
              const name = e.tags['name:en'] || e.tags.name
              const avgLat = roadPoints.reduce((acc: number, p: any) => acc + p.lat, 0) / roadPoints.length
              const avgLng = roadPoints.reduce((acc: number, p: any) => acc + p.lng, 0) / roadPoints.length
              
              namedWays.push({ name, lat: avgLat, lng: avgLng })
              
              if (e.tags.highway === 'secondary' || e.tags.highway === 'primary' || e.tags.highway === 'tertiary') {
                fetchedPois.push({
                  lat: avgLat,
                  lng: avgLng,
                  name: name,
                  type: 'Road',
                  address: e.tags.highway.charAt(0).toUpperCase() + e.tags.highway.slice(1) + ' Road',
                  tags: e.tags,
                  distance: getDistance(loc.lat, loc.lng, avgLat, avgLng),
                  imageUrl: `https://loremflickr.com/300/300/street,road?lock=${e.id % 100}`
                })
              }
            }
          }
        })

        // Enrichment
        fetchedPois.forEach(poi => {
          if (!poi.address && namedWays.length > 0) {
            let minD = Infinity
            let nearestRoad = ''
            namedWays.forEach(rw => {
              const d = Math.pow(poi.lat - rw.lat, 2) + Math.pow(poi.lng - rw.lng, 2)
              if (d < minD) {
                minD = d
                nearestRoad = rw.name
              }
            })
            if (nearestRoad) poi.address = `Near ${nearestRoad}`
          }
        })

        if (fetchedPois.length > 0) {
          const sorted = [...fetchedPois].sort((a, b) => (a.distance || 0) - (b.distance || 0))

          setPois(sorted.slice(0, 20))
          setNearbyPOIs(sorted.slice(0, 15))
          
          const THRESHOLD = 150 // 150 meters
          const nearestNode = sorted.find(p => p.type !== 'Road')
          const nearestAny = sorted[0]
          
          if (nearestNode) {
            if ((nearestNode.distance || 0) > THRESHOLD && nearestAny.type === 'Road') {
              setNearestPOI(nearestAny)
            } else {
              setNearestPOI(nearestNode)
            }
          } else {
            setNearestPOI(nearestAny)
          }
        } else {
          setNearestPOI({ lat: loc.lat, lng: loc.lng, name: 'N/A', type: 'Unknown', distance: 0 })
          setNearbyPOIs([])
        }
        setRoads(fetchedRoads)
      } else {
        setNearestPOI({ lat: loc.lat, lng: loc.lng, name: 'N/A', type: 'Unknown', distance: 0 })
        setNearbyPOIs([])
      }
    } catch (err) {
      console.error('Map fetch failed:', err)
      setNearestPOI({
        lat: loc.lat,
        lng: loc.lng,
        name: 'N/A',
        type: 'Unknown',
      })
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

        {/* Current location dot */}
        {userLocation && (
          <div
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
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
