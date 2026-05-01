'use client'

import { colors, borders } from '../tokens'
import { MapPlaceholder } from '../primitives/map-placeholder'
import { MetricStrip } from '../primitives/metric-strip'
import { BottomSheet } from '../primitives/bottom-sheet'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { ApproachBanner } from '../primitives/approach-banner'
import { SubPlaceChip } from '../primitives/sub-place-chip'

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11, color: dark ? colors.mist : colors.leaf }}>9:41</span>
      <span style={{ fontSize: 11, color: colors.bark }}>Old Quarter · Hanoi</span>
      <span style={{ fontSize: 11, color: dark ? colors.mist : colors.leaf }}>···</span>
    </div>
  )
}

// Shared wrapper: relative container so NavBar absolute-positions correctly
function WithNav({ children, navActive = 0, bg = colors.mist }: {
  children: React.ReactNode
  navActive?: number
  bg?: string
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
        {/* Spacer so content doesn't hide behind floating NavBar */}
        <div style={{ height: NAV_HEIGHT }} />
      </div>
      <NavBar active={navActive} />
    </div>
  )
}

// ── Variant A: Light, content-first ───────────────────────────────────────

export function S1A() {
  return (
    <WithNav navActive={0} bg={colors.mist}>
      <div style={{ display: 'flex', flexDirection: 'column', background: colors.mist }}>
        <StatusBar />
        <div style={{ padding: '8px 12px 0' }}>
          <div style={{ position: 'relative' }}>
            <MapPlaceholder h={128} />
            <div style={{ position: 'absolute', top: 6, right: 6, background: colors.gold, borderRadius: 12, padding: '2px 8px' }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: colors.leaf }}>◈ 120m</span>
            </div>
            <div style={{ position: 'absolute', bottom: 6, left: 8 }}>
              <SubPlaceChip label="Old Quarter · Hàng Bạc" />
            </div>
          </div>
        </div>
        <div style={{ margin: '8px 12px 0', display: 'flex', flexDirection: 'column', minHeight: 340 }}>
          <BottomSheet dark={false} defaultTab={1} />
        </div>
      </div>
    </WithNav>
  )
}

// ── Variant B: Dark, metrics ───────────────────────────────────────────────

export function S1B() {
  return (
    <WithNav navActive={0} bg={colors.leaf}>
      <div style={{ display: 'flex', flexDirection: 'column', background: colors.leaf }}>
        <StatusBar dark />
        <div style={{ padding: '0 12px' }}>
          <MapPlaceholder h={170} dark />
        </div>
        <MetricStrip dark />
        <div style={{ margin: '0 12px', display: 'flex', flexDirection: 'column', minHeight: 300 }}>
          <BottomSheet dark defaultTab={1} />
        </div>
      </div>
    </WithNav>
  )
}
