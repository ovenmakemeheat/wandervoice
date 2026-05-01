'use client'

import { useState, type ReactNode } from 'react'
import { colors } from '@/components/wandervoice/tokens'
import { S2A, S2B, S2C } from '@/components/wandervoice/screens/screen2'
import { S5A } from '@/components/wandervoice/screens/screen5'
import { S7A } from '@/components/wandervoice/screens/screen7'
import { ScreenSplash } from '@/components/wandervoice/screens/screen-splash'
import { ScreenPermsA, ScreenPermsB } from '@/components/wandervoice/screens/screen-perms'
import { ScreenProfile } from '@/components/wandervoice/screens/screen-profile'
import { ScreenSmartWalk } from '@/components/wandervoice/screens/screen-smart-walk'
import { ScreenHome } from '@/components/wandervoice/screens/screen-home'

// ── Screen registry ────────────────────────────────────────────────────────

interface ScreenVariant {
  id: string
  label: string
  theme: 'dark' | 'light'
  component: ReactNode
}

interface ScreenGroup {
  id: string
  title: string
  short: string
  variants: ScreenVariant[]
}

const SCREENS: ScreenGroup[] = [
  // Onboarding
  {
    id: 'splash',
    title: 'Splash',
    short: 'Splash',
    variants: [{ id: 'splash', label: 'Dark · canopy', theme: 'dark', component: <ScreenSplash /> }],
  },
  {
    id: 'perms',
    title: 'Permissions',
    short: 'Perms',
    variants: [
      { id: 'perms-a', label: 'Dark · requesting', theme: 'dark', component: <ScreenPermsA /> },
      { id: 'perms-b', label: 'Dark · granted', theme: 'dark', component: <ScreenPermsB /> },
    ],
  },
  {
    id: 's5',
    title: 'Narrative Style',
    short: 'Style',
    variants: [{ id: 's5a', label: 'Dark · mode selection', theme: 'dark', component: <S5A /> }],
  },
  {
    id: 's7',
    title: 'Walking Setup',
    short: 'Setup',
    variants: [{ id: 's7a', label: 'Dark · toggles + AI notice', theme: 'dark', component: <S7A /> }],
  },

  // Core App
  {
    id: 'home',
    title: 'Home',
    short: 'Home',
    variants: [{ id: 'home-a', label: 'Light · personalized', theme: 'light', component: <ScreenHome /> }],
  },
  {
    id: 's-smart',
    title: 'Smart Walk',
    short: 'Smart',
    variants: [{ id: 'smart-walk', label: 'Dark · merged + auto-lock', theme: 'dark', component: <ScreenSmartWalk /> }],
  },

  // Voice
  {
    id: 's2',
    title: 'Voice Input',
    short: 'Voice',
    variants: [
      { id: 's2a', label: 'Dark · mic', theme: 'dark', component: <S2A /> },
      { id: 's2b', label: 'Light · suggestions', theme: 'light', component: <S2B /> },
      { id: 's2c', label: 'Dark · chat', theme: 'dark', component: <S2C /> },
    ],
  },

  // Profile
  {
    id: 'profile',
    title: 'Profile',
    short: 'Profile',
    variants: [{ id: 'profile-a', label: 'Light · mist', theme: 'light', component: <ScreenProfile /> }],
  },
]

// ── Logo mark ──────────────────────────────────────────────────────────────

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.42)} viewBox="0 0 60 25">
      <circle cx="6" cy="20" r="2.5" fill="none" stroke={colors.teal} strokeWidth="1.6" />
      <circle cx="16" cy="16" r="2.5" fill="none" stroke={colors.teal} strokeWidth="1.6" />
      <circle cx="27" cy="13" r="2.5" fill="none" stroke={colors.teal} strokeWidth="1.6" />
      <line x1="35" y1="24" x2="35" y2="10" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="43" y1="24" x2="43" y2="4" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="51" y1="24" x2="51" y2="9" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="58" y1="24" x2="58" y2="14" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <aside
      style={{
        width: 220,
        height: '100%',
        background: colors.canopy,
        borderRight: '1px solid rgba(245,247,242,0.07)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Branding */}
      <div
        style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid rgba(245,247,242,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <LogoMark size={32} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.mist, letterSpacing: '-0.2px' }}>
            WanderVoice
          </div>
          <div style={{ fontSize: 10, color: colors.bark, marginTop: 1 }}>Design prototype</div>
        </div>
      </div>

      {/* Screen list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {SCREENS.map((group, gi) => {
          const isGroupActive = group.variants.some((v) => v.id === activeId)
          return (
            <div key={group.id} style={{ marginBottom: 2 }}>
              {/* Group header */}
              <div
                style={{
                  padding: '4px 18px',
                  fontSize: 9,
                  fontWeight: 600,
                  color: colors.bark,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: gi > 0 ? 8 : 0,
                }}
              >
                {String(gi + 1).padStart(2, '0')} · {group.short}
              </div>

              {/* Variants */}
              {group.variants.map((v) => {
                const active = v.id === activeId
                return (
                  <button
                    key={v.id}
                    onClick={() => onSelect(v.id)}
                    style={{
                      width: '100%',
                      padding: '7px 18px',
                      textAlign: 'left',
                      background: active ? 'rgba(42,117,96,0.16)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      borderLeft: active ? `2px solid ${colors.teal}` : '2px solid transparent',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,247,242,0.04)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                    }}
                  >
                    {/* Theme dot */}
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: active ? colors.teal : (v.theme === 'dark' ? colors.bark : colors.dew),
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: active ? colors.mist : 'rgba(245,247,242,0.45)',
                        lineHeight: 1.4,
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {v.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 18px',
          borderTop: '1px solid rgba(245,247,242,0.07)',
          fontSize: 10,
          color: colors.bark,
          lineHeight: 1.6,
        }}
      >
        Hanoi prototype
        <br />
        14 variants · 8 screens
      </div>
    </aside>
  )
}

// ── Screen viewport ────────────────────────────────────────────────────────

function ScreenViewport({ variant }: { variant: ScreenVariant }) {
  const isDark = variant.theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg

  return (
    <div
      key={variant.id}
      style={{
        flex: 1,
        height: '100%',
        background: isDark ? '#0e1810' : '#dce8db',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'radial-gradient(rgba(42,117,96,0.06) 1px, transparent 1px)'
            : 'radial-gradient(rgba(28,39,32,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      {/* The screen itself — responsive: fills viewport on mobile, constrained + elevated on desktop */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          maxWidth: 430,
          maxHeight: 'min(932px, 100dvh)',
          display: 'flex',
          flexDirection: 'column',
          background: bg,
          overflow: 'hidden',
          // On large viewports: look like a phone card
          boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.3)',
          borderRadius: 'clamp(0px, calc((100vw - 430px) * 999), 28px)',
        }}
      >
        {variant.component}
      </div>
    </div>
  )
}

// ── Bottom variant picker (mobile / small) ─────────────────────────────────

function BottomPicker({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  // Find current group
  const currentGroup = SCREENS.find((g) => g.variants.some((v) => v.id === activeId))

  return (
    <div
      style={{
        height: 52,
        background: colors.canopy,
        borderTop: '1px solid rgba(245,247,242,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        overflowX: 'auto',
        padding: '0 8px',
        flexShrink: 0,
      }}
    >
      {SCREENS.map((group, gi) => {
        const isActive = group.id === currentGroup?.id
        const firstVariantId = group.variants[0].id
        return (
          <button
            key={group.id}
            onClick={() => onSelect(firstVariantId)}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              border: 'none',
              background: isActive ? 'rgba(42,117,96,0.2)' : 'transparent',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? colors.teal : 'rgba(245,247,242,0.38)',
                letterSpacing: '0.04em',
              }}
            >
              {String(gi + 1).padStart(2, '0')} {group.short}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Variant switcher bar (top of viewport on desktop) ──────────────────────

function VariantBar({
  group,
  activeId,
  onSelect,
}: {
  group: ScreenGroup
  activeId: string
  onSelect: (id: string) => void
}) {
  if (group.variants.length <= 1) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        gap: 4,
        background: 'rgba(14,24,16,0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: 24,
        padding: '4px 6px',
        border: '1px solid rgba(245,247,242,0.12)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        pointerEvents: 'auto',
      }}
    >
      {group.variants.map((v, i) => {
        const active = v.id === activeId
        return (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            style={{
              padding: '5px 12px',
              borderRadius: 18,
              border: 'none',
              background: active ? colors.teal : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'background 0.15s',
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? colors.mist : 'rgba(245,247,242,0.45)',
                letterSpacing: '0.04em',
              }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span
              style={{
                fontSize: 10,
                color: active ? 'rgba(245,247,242,0.8)' : 'rgba(245,247,242,0.3)',
              }}
            >
              {v.label.split(' · ')[1] ?? v.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeId, setActiveId] = useState('home-a')

  // Resolve active variant + group
  const activeGroup = SCREENS.find((g) => g.variants.some((v) => v.id === activeId))!
  const activeVariant = activeGroup.variants.find((v) => v.id === activeId)!

  return (
    <div
      style={{
        width: '100vw',
        height: '100svh',
        display: 'flex',
        fontFamily: 'var(--font-inter, "Inter", -apple-system, sans-serif)',
        overflow: 'hidden',
        background: colors.canopy,
      }}
    >
      {/* Sidebar — hidden on small screens via CSS */}
      <div className="hidden md:flex" style={{ height: '100%' }}>
        <Sidebar activeId={activeId} onSelect={setActiveId} />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Variant switcher floats above the screen */}
        {activeGroup && (
          <VariantBar group={activeGroup} activeId={activeId} onSelect={setActiveId} />
        )}

        {/* Screen fills this area */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ScreenViewport variant={activeVariant} />
        </div>

        {/* Mobile bottom picker */}
        <div className="flex md:hidden">
          <BottomPicker activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>
    </div>
  )
}
