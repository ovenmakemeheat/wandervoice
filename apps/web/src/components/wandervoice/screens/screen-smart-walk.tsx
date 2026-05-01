'use client'

import { useState, useEffect, useCallback, useRef, type FC } from 'react'
import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { MetricStrip } from '../primitives/metric-strip'
import { BottomSheet } from '../primitives/bottom-sheet'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { DiamondMarker, PlayIcon, PauseIcon } from '../icons'
import { useAppContext, type NarratorPhase } from '../context/app-context'
import { useAutoNarrator } from '../hooks/use-auto-narrator'

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

const PHASE_HINT: Partial<Record<NarratorPhase, string>> = {
  'searching': 'Searching…',
  'generating-text': 'Writing…',
  'generating-audio': 'Synthesizing…',
  'playing': 'Speaking…',
}

// ── Search bubble — shown in centre of map during knowledge lookup ─────────

const SEARCH_STEPS = [
  { icon: '🌐', label: 'Wikipedia', detail: 'Fetching article…' },
  { icon: '🔍', label: 'Web search', detail: 'Tavily lookup…' },
  { icon: '✦', label: 'AI grounding', detail: 'Merging knowledge…' },
]

function SearchBubble({ poi, dark }: { poi: string; dark: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(0)
    const t1 = setTimeout(() => setStep(1), 900)
    const t2 = setTimeout(() => setStep(2), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [poi])

  const bg = dark ? 'rgba(22,34,24,0.96)' : 'rgba(255,255,255,0.96)'
  const border = dark ? '1px solid rgba(245,247,242,0.12)' : '1px solid rgba(28,39,32,0.1)'
  const textPrimary = dark ? colors.mist : colors.leaf

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 60,
      width: 220,
      background: bg,
      borderRadius: 20,
      border,
      boxShadow: dark
        ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(42,117,96,0.2)'
        : '0 8px 32px rgba(28,39,32,0.15), 0 0 0 1px rgba(42,117,96,0.1)',
      padding: '16px 18px 14px',
      backdropFilter: 'blur(20px)',
      animation: 'bubbleIn 0.35s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'rgba(42,117,96,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14 }}>🔎</span>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.teal, letterSpacing: 0.5 }}>
            KNOWLEDGE SEARCH
          </div>
          <div style={{ fontSize: 10, color: colors.bark, marginTop: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {poi}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SEARCH_STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: i > step ? 0.3 : 1,
              transition: 'opacity 0.4s',
            }}>
              {/* Status dot */}
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: done
                  ? colors.teal
                  : active
                  ? 'rgba(42,117,96,0.15)'
                  : (dark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.06)'),
                border: active ? `1.5px solid ${colors.teal}` : '1.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                {done ? (
                  <span style={{ fontSize: 10, color: colors.mist }}>✓</span>
                ) : active ? (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: colors.teal,
                    animation: 'pulse 1s infinite',
                  }} />
                ) : null}
              </div>

              {/* Label */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: active || done ? 600 : 400, color: textPrimary }}>
                  {s.icon} {s.label}
                </div>
                {active && (
                  <div style={{ fontSize: 10, color: colors.bark, marginTop: 1, animation: 'fadeIn 0.3s' }}>
                    {s.detail}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 14, height: 2, background: dark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.08)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${((step + 1) / SEARCH_STEPS.length) * 100}%`,
          background: `linear-gradient(90deg, ${colors.teal}, #4CAF88)`,
          borderRadius: 1,
          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>

      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function FloatingNarrativeButton({
  active,
  phase,
  onToggle,
  onAskTap,
  centered = false,
  transparent = false
}: {
  active: boolean;
  phase: NarratorPhase;
  onToggle: () => void;
  onAskTap?: () => void;
  centered?: boolean;
  transparent?: boolean;
}) {
  const { theme } = useAppContext()
  const isDark = theme === 'dark'
  const isBusy = active && phase !== 'idle' && phase !== 'playing'
  
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: centered ? 6 : 3, height: centered ? 60 : 22 }}>
          {active ? (
            isBusy ? (
              // Show spinner dots while generating text/audio
              [0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: centered ? 10 : 5,
                    height: centered ? 10 : 5,
                    borderRadius: '50%',
                    background: isDark ? colors.mist : colors.leaf,
                    opacity: 0.7,
                    animation: `bounce 1s ${i * 0.15}s infinite`,
                  }}
                />
              ))
            ) : (
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
                    animation: 'wavePulse 1.2s infinite ease-in-out',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))
            )
          ) : (
            <PlayIcon size={centered ? 48 : 24} color={isDark ? colors.mist : colors.leaf} style={{ marginLeft: centered ? 8 : 4 }} />
          )}
        </div>
        {active && isBusy && (
          <span style={{ fontSize: centered ? 10 : 8, color: isDark ? colors.mist : colors.leaf, opacity: 0.7, letterSpacing: 0.5 }}>
            {PHASE_HINT[phase] ?? '…'}
          </span>
        )}
      </div>
      <style>{`
        @keyframes wavePulse {
          0%, 100% { transform: scaleY(0.8); }
          50% { transform: scaleY(1.2); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
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
  const { theme, nearestPOI, autoNarrate, setAutoNarrate, narratorPhase } = useAppContext()
  const isDark = theme === 'dark'
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
      <FloatingNarrativeButton active={autoNarrate} phase={narratorPhase} onToggle={() => setAutoNarrate(!autoNarrate)} centered transparent />

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
  const { navigate, theme, autoNarrate, setAutoNarrate, narratorPhase, nearestPOI } = useAppContext()
  const isDark = theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg

  // Mount the auto-narrator loop here so it lives with the walk screen
  useAutoNarrator()

  const isSearching = narratorPhase === 'searching'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'background 0.4s ease' }}>
      <StatusBar dark={isDark} />
      <div style={{ flex: 1, position: 'relative', padding: '0 12px 140px' }}>
        <MapPlaceholder h="auto" dark={isDark} />
        {isSearching && nearestPOI && (
          <SearchBubble poi={nearestPOI.name} dark={isDark} />
        )}
      </div>

      <BottomSheet dark={isDark} defaultTab={2} bottomOffset={NAV_HEIGHT}>
        <MetricStrip dark={isDark} />
        <POIPanel />
      </BottomSheet>

      <NavBar active={1} onNavigate={(t) => navigate(NAV_SCREENS[t])} />
      <FloatingNarrativeButton
        active={autoNarrate}
        phase={narratorPhase}
        onToggle={() => setAutoNarrate(!autoNarrate)}
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
