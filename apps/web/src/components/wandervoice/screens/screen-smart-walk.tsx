'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { MetricStrip } from '../primitives/metric-strip'
import { BottomSheet } from '../primitives/bottom-sheet'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { DiamondMarker, PlayIcon, PauseIcon } from '../icons'
import { useAppContext } from '../context/app-context'

const NAV_SCREENS = ['home', 'smart-walk', 'voice-ask', 'profile'] as const

function StatusBar({ dark = false }: { dark?: boolean }) {
  const { nearestPOI } = useAppContext()
  const locLabel = nearestPOI?.name || 'Searching Location...'
  
  return (
    <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
      <span style={{ fontSize: 11, color: dark ? colors.mist : colors.leaf }}>9:41</span>
      <span style={{ fontSize: 11, color: colors.bark, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{locLabel}</span>
      <span style={{ fontSize: 11, color: dark ? colors.mist : colors.leaf }}>···</span>
    </div>
  )
}

const WAVEFORM_HEIGHTS = [5, 10, 18, 14, 22, 18, 12, 20, 22, 16, 10, 18, 14, 8]

function FloatingNarrativeButton({ 
  active, 
  onToggle, 
  onAskTap, 
  centered = false,
  transparent = false
}: { 
  active: boolean; 
  onToggle: () => void; 
  onAskTap?: () => void;
  centered?: boolean;
  transparent?: boolean;
}) {
  const { theme } = useAppContext()
  const isDark = theme === 'dark'
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      style={{
        position: centered ? 'relative' : 'absolute',
        bottom: centered ? 'auto' : 80,
        left: centered ? 'auto' : '50%',
        transform: centered ? 'none' : 'translateX(-50%)',
        width: centered ? '100%' : 64,
        height: centered ? 80 : 64,
        borderRadius: '50%',
        background: centered ? 'transparent' : (transparent ? (isDark ? 'rgba(245,247,242,0.05)' : 'rgba(28,39,32,0.05)') : (active ? colors.teal : (isDark ? 'rgba(245,247,242,0.1)' : 'rgba(28,39,32,0.1)'))),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: active && !centered
          ? (transparent ? 'none' : '0 0 0 8px rgba(42,117,96,0.18), 0 0 0 16px rgba(42,117,96,0.07)') 
          : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        backdropFilter: centered ? 'none' : 'blur(12px)',
        border: centered ? 'none' : (transparent ? (isDark ? '1px solid rgba(245,247,242,0.1)' : '1px solid rgba(28,39,32,0.1)') : 'none'),
        margin: centered ? '20px 0' : 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: centered ? 6 : 3, height: centered ? 60 : 22 }}>
        {active ? (
          WAVEFORM_HEIGHTS.map((v, i) => (
            <div
              key={i}
              style={{
                width: centered ? 6 : 2.5,
                height: centered ? v * 2.5 : v,
                background: isDark ? colors.mist : colors.leaf,
                borderRadius: 2,
                opacity: 0.6 + (v / 22) * 0.4,
                transition: 'height 0.2s',
                animation: active ? 'wavePulse 1.2s infinite ease-in-out' : 'none',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))
        ) : (
          <PlayIcon size={centered ? 48 : 24} color={isDark ? colors.mist : colors.leaf} style={{ marginLeft: centered ? 8 : 4 }} />
        )}
      </div>
      <style>{`
        @keyframes wavePulse {
          0%, 100% { transform: scaleY(0.8); }
          50% { transform: scaleY(1.2); }
        }
        @keyframes marquee {
          0% { transform: translateX(20%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-20%); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function LockView({ onUnlock }: { onUnlock: () => void }) {
  const { theme, nearestPOI } = useAppContext()
  const isDark = theme === 'dark'
  const [narrating, setNarrating] = useState(true)
  const MODES = ['Story', 'Facts', 'Secrets']
  const KEYS = ['S', 'F', 'X']
  const [mode, setMode] = useState('Story')

  const bg = isDark ? colors.canopy : '#eef4ef'
  const textPrimary = isDark ? colors.mist : colors.leaf
  const textSecondary = colors.bark

  const poiName = nearestPOI?.name || 'Discovering...'

  return (
    <div
      onClick={onUnlock}
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 18px 24px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.4s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {nearestPOI?.name || 'Locating...'}
          </div>
          <div style={{ fontSize: 10, color: textSecondary, marginTop: 3 }}>
            {nearestPOI?.address || 'Hanoi District'} · 4 gems heard
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, background: isDark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.06)', borderRadius: 20, padding: 2 }} onClick={(e) => e.stopPropagation()}>
          {KEYS.map((k, i) => {
            const active = mode === MODES[i]
            return (
              <div
                key={k}
                onClick={() => setMode(MODES[i])}
                style={{ width: 26, height: 26, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? colors.teal : 'transparent', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: active ? colors.mist : textSecondary }}>{k}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <DiamondMarker size={14} color={colors.teal} style={{ borderRadius: 3 }} />
        <div style={{ fontSize: 24, fontWeight: 700, color: textPrimary, lineHeight: 1.1 }}>{poiName}</div>
        <div style={{ fontSize: 12, color: textSecondary }}>Nearby · narrative active</div>
      </div>

      {/* Narrative button is now a relative wave below the text */}
      <FloatingNarrativeButton active={narrating} onToggle={() => setNarrating(p => !p)} centered transparent />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ background: colors.gold, borderRadius: 20, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <DiamondMarker size={8} color={colors.leaf} style={{ borderRadius: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.leaf, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{poiName} approaching</div>
            <div style={{ fontSize: 10, color: 'rgba(28,39,32,0.65)' }}>120m · narrative will auto-start</div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: textSecondary, opacity: 0.8 }}>Tap anywhere to unlock</span>
      </div>
    </div>
  )
}

function POIPanel() {
  const { nearestPOI, theme } = useAppContext()
  const isDark = theme === 'dark'

  // Loading / Skeleton State
  if (!nearestPOI) {
    return (
      <div style={{ padding: '16px 14px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div className="skeleton" style={{ width: 90, height: 90, borderRadius: 16, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '40%', height: 10, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '80%', height: 20, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 6 }} />
              <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <style>{`
          .skeleton {
            background: ${isDark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.06)'};
            background-image: linear-gradient(90deg, transparent, ${isDark ? 'rgba(245,247,242,0.1)' : 'rgba(28,39,32,0.1)'}, transparent);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    )
  }

  const poiName = nearestPOI.name
  const poiImage = nearestPOI.imageUrl

  return (
    <div style={{ padding: '16px 14px 10px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <DiamondMarker size={8} color={colors.teal} />
        <span style={{ fontSize: 11, fontWeight: 500, color: isDark ? colors.mist : colors.leaf }}>Nearby POI</span>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ 
          width: 90, 
          height: 90, 
          borderRadius: 16, 
          overflow: 'hidden', 
          background: isDark ? 'linear-gradient(135deg, #2c3e50, #000000)' : 'linear-gradient(135deg, #dce8db, #c4d4c0)', 
          flexShrink: 0, 
          border: isDark ? borders.borderD : borders.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {poiImage ? (
            <img src={poiImage} alt={poiName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 24, opacity: 0.2 }}>📍</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.teal, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {nearestPOI.type || 'Landmark'}
            </span>
            {nearestPOI.address && (
              <>
                <span style={{ fontSize: 10, color: colors.bark }}>•</span>
                <span style={{ fontSize: 10, color: colors.bark }}>{nearestPOI.address}</span>
              </>
            )}
          </div>
          
          <div style={{ fontSize: 20, fontWeight: 700, color: isDark ? colors.mist : colors.leaf, marginBottom: 6, lineHeight: 1.2 }}>
            {poiName}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {nearestPOI.tags?.['opening_hours'] && (
              <div style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: isDark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.06)', color: colors.bark }}>
                Open: {nearestPOI.tags['opening_hours']}
              </div>
            )}
            {nearestPOI.tags?.['historic:period'] && (
              <div style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(212,175,55,0.1)', color: colors.gold }}>
                Period: {nearestPOI.tags['historic:period']}
              </div>
            )}
            <div style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: isDark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.06)', color: colors.bark }}>
              2.4 km Walk
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActiveMergedView() {
  const { navigate, theme } = useAppContext()
  const [narrating, setNarrating] = useState(true)
  const isDark = theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'background 0.4s ease' }}>
      <StatusBar dark={isDark} />
      <div style={{ flex: 1, position: 'relative', padding: '0 12px 140px' }}>
        <MapPlaceholder h="auto" dark={isDark} />
      </div>

      <BottomSheet dark={isDark} defaultTab={1} bottomOffset={NAV_HEIGHT}>
        <MetricStrip dark={isDark} />
        <POIPanel />
      </BottomSheet>

      <NavBar active={1} onNavigate={(t) => navigate(NAV_SCREENS[t])} />
      <FloatingNarrativeButton
        active={narrating}
        onToggle={() => setNarrating(p => !p)}
        onAskTap={() => navigate('voice-ask')}
        transparent
      />
    </div>
  )
}

export function ScreenSmartWalk() {
  const [isLocked, setIsLocked] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (isLocked) return
    if (timerRef.current) clearTimeout(timerRef.current)
    // Set to 10 seconds
    timerRef.current = setTimeout(() => {
      setIsLocked(true)
    }, 10000)
  }, [isLocked])

  useEffect(() => {
    resetTimer()
    
    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel']
    const handler = () => resetTimer()
    
    events.forEach(evt => window.addEventListener(evt, handler, { passive: true }))
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach(evt => window.removeEventListener(evt, handler))
    }
  }, [resetTimer])

  if (isLocked) {
    return <LockView onUnlock={() => {
      setIsLocked(false)
      resetTimer()
    }} />
  }

  return <ActiveMergedView />
}
