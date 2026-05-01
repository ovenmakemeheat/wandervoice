'use client'

import { z } from 'zod'
import { colors } from '../tokens'
import { useState, useEffect, useRef, useMemo } from 'react'

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
}

interface Road {
  id: number
  points: { lat: number; lng: number }[]
}

export function MapPlaceholder(rawProps: Partial<MapProps>) {
  const { dark, h, gems } = MapPropsSchema.parse(rawProps)

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
    try {
      // Overpass API query for nearby attractions, historic spots, AND roads (highways)
      // We use [out:json] and out geom to get coordinates for ways
      const query = `
        [out:json][timeout:25];
        (
          node["tourism"~"attraction|museum|viewpoint|gallery"](around:1000,${loc.lat},${loc.lng});
          node["historic"](around:1000,${loc.lat},${loc.lng});
          way["highway"~"primary|secondary|tertiary|residential|footway"](around:1000,${loc.lat},${loc.lng});
        );
        out geom 100;
      `

      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      })

      const data = await res.json()

      if (data && data.elements) {
        const fetchedPois: POI[] = []
        const fetchedRoads: Road[] = []

        data.elements.forEach((e: any) => {
          if (e.type === 'node' && e.tags && (e.tags.name || e.tags['name:en'])) {
            fetchedPois.push({
              lat: e.lat,
              lng: e.lon,
              name: e.tags['name:en'] || e.tags.name,
            })
          } else if (e.type === 'way' && e.geometry) {
            fetchedRoads.push({
              id: e.id,
              points: e.geometry.map((p: any) => ({ lat: p.lat, lng: p.lon })),
            })
          }
        })

        setPois(fetchedPois.slice(0, 15))
        setRoads(fetchedRoads)
      }
    } catch (err) {
      console.warn('Failed to load map data from OpenStreetMap', err)
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
