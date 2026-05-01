'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { MetricStrip } from '../primitives/metric-strip'
import { BottomSheet } from '../primitives/bottom-sheet'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { DiamondMarker, PlayIcon, PauseIcon } from '../icons'

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
      <span style={{ fontSize: 11, color: dark ? colors.mist : colors.leaf }}>9:41</span>
      <span style={{ fontSize: 11, color: colors.bark }}>Old Quarter · Hanoi</span>
      <span style={{ fontSize: 11, color: dark ? colors.mist : colors.leaf }}>···</span>
    </div>
  )
}

const WAVEFORM_HEIGHTS = [5, 10, 18, 14, 22, 18, 12, 20, 22, 16, 10, 18, 14, 8]

function FloatingNarrativeButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: active ? colors.teal : 'rgba(245,247,242,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: active ? '0 0 0 8px rgba(42,117,96,0.18), 0 0 0 16px rgba(42,117,96,0.07)' : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.2s',
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 22 }}>
        {active ? (
          WAVEFORM_HEIGHTS.map((v, i) => (
            <div
              key={i}
              style={{
                width: 2.5,
                height: v,
                background: colors.mist,
                borderRadius: 2,
                opacity: 0.6 + (v / 22) * 0.4,
                transition: 'height 0.2s',
              }}
            />
          ))
        ) : (
          <PlayIcon size={24} color={colors.mist} style={{ marginLeft: 4 }} />
        )}
      </div>
    </div>
  )
}

function LockView({ onUnlock }: { onUnlock: () => void }) {
  const [narrating, setNarrating] = useState(true)
  const MODES = ['Story', 'Facts', 'Secrets']
  const KEYS = ['S', 'F', 'X']
  const [mode, setMode] = useState('Story')

  return (
    <div
      onClick={onUnlock}
      style={{
        width: '100%',
        height: '100%',
        background: colors.canopy,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 18px 24px',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, color: colors.bark, letterSpacing: 1.5 }}>OLD QUARTER · HANOI</div>
          <div style={{ fontSize: 10, color: colors.bark, marginTop: 3 }}>1.2 km · 4 gems heard</div>
        </div>
        <div style={{ display: 'flex', gap: 3, background: 'rgba(245,247,242,0.06)', borderRadius: 20, padding: 2 }} onClick={(e) => e.stopPropagation()}>
          {KEYS.map((k, i) => {
            const active = mode === MODES[i]
            return (
              <div
                key={k}
                onClick={() => setMode(MODES[i])}
                style={{ width: 26, height: 26, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? colors.teal : 'transparent', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: active ? colors.mist : colors.bark }}>{k}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <DiamondMarker size={14} color={colors.teal} style={{ borderRadius: 3 }} />
        <div style={{ fontSize: 24, fontWeight: 700, color: colors.mist, lineHeight: 1.1 }}>Hàng Bạc Silver Street</div>
        <div style={{ fontSize: 12, color: colors.bark }}>Est. 1428 · Jewellery guild</div>
          {/* Narrative button is now floating at the bottom */}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ background: colors.gold, borderRadius: 20, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <DiamondMarker size={8} color={colors.leaf} style={{ borderRadius: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.leaf, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Hàng Bạc approaching</div>
            <div style={{ fontSize: 10, color: 'rgba(28,39,32,0.65)' }}>120m · narrative will auto-start</div>
          </div>
        </div>
        <span style={{ fontSize: 11, color: colors.bark, opacity: 0.8 }}>Tap anywhere to unlock</span>
      </div>

      <FloatingNarrativeButton active={narrating} onToggle={() => setNarrating(p => !p)} />
    </div>
  )
}

function ActiveMergedView() {
  const [narrating, setNarrating] = useState(true)
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: colors.leaf, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <StatusBar dark />
        <div style={{ padding: '0 12px' }}>
          <MapPlaceholder h={140} dark />
        </div>
        <MetricStrip dark />
        
        {/* POI details section integrated into the walk screen */}
        <div style={{ padding: '16px 14px 10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <DiamondMarker size={8} color={colors.teal} />
            <span style={{ fontSize: 11, fontWeight: 500, color: colors.mist }}>Nearby POI</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.mist, marginBottom: 4 }}>
            Hàng Bạc Silver Street
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: colors.bark }}>Est. 1428</span>
            <span style={{ fontSize: 11, color: colors.teal }}>·</span>
            <span style={{ fontSize: 11, color: colors.bark }}>Jewellery guild</span>
          </div>
        </div>

        <div style={{ margin: '0 12px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 300 }}>
          <BottomSheet dark defaultTab={1} />
        </div>

        {/* Spacer so content doesn't hide behind floating NavBar and FAB */}
        <div style={{ height: NAV_HEIGHT + 70 }} />
      </div>
      <NavBar active={1} />
      <FloatingNarrativeButton active={narrating} onToggle={() => setNarrating(p => !p)} />
    </div>
  )
}

export function ScreenSmartWalk() {
  const [isLocked, setIsLocked] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (isLocked) return
    if (timerRef.current) clearTimeout(timerRef.current)
    // Set to 5 seconds for demonstration purposes
    timerRef.current = setTimeout(() => {
      setIsLocked(true)
    }, 5000)
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
