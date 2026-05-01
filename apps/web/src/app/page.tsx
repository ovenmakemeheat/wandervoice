'use client'

import { useState, type ReactNode } from 'react'
import { colors } from '@/components/wandervoice/tokens'
import { AppProvider, useAppContext, type ScreenName } from '@/components/wandervoice/context/app-context'
import { S2A, S2B, S2C } from '@/components/wandervoice/screens/screen2'
import { S5A } from '@/components/wandervoice/screens/screen5'
import { S7A } from '@/components/wandervoice/screens/screen7'
import { ScreenSplash } from '@/components/wandervoice/screens/screen-splash'
import { ScreenPerms } from '@/components/wandervoice/screens/screen-perms'
import { ScreenProfile } from '@/components/wandervoice/screens/screen-profile'
import { ScreenSmartWalk } from '@/components/wandervoice/screens/screen-smart-walk'
import { ScreenHome } from '@/components/wandervoice/screens/screen-home'
import { ScreenOnboardingName } from '@/components/wandervoice/screens/screen-onboarding-name'
import { ScreenSignIn } from '@/components/wandervoice/screens/screen-sign-in'

// ── Screen map ────────────────────────────────────────────────────────────

const SCREEN_MAP: Record<ScreenName, ReactNode> = {
  'splash': <ScreenSplash />,
  'sign-in': <ScreenSignIn />,
  'perms': <ScreenPerms />,
  'onboarding-name': <ScreenOnboardingName />,
  'onboarding-style': <S5A />,
  'onboarding-setup': <S7A />,
  'home': <ScreenHome />,
  'smart-walk': <ScreenSmartWalk />,
  'voice-ask': <S2B />,
  'voice-listen': <S2A />,
  'voice-chat': <S2C />,
  'profile': <ScreenProfile />,
}

const DARK_SCREENS: ScreenName[] = [
  'splash', 'sign-in', 'perms', 'onboarding-name', 'onboarding-style',
  'onboarding-setup', 'smart-walk', 'voice-ask', 'voice-listen', 'voice-chat',
]

// ── App shell (reads from context) ────────────────────────────────────────

function AppShell() {
  const { screen, direction, theme } = useAppContext()
  const isDark = theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg
  const outerBg = isDark ? '#0e1810' : '#dce8db'

  return (
    <div
      style={{
        width: '100vw',
        height: '100svh',
        display: 'flex',
        fontFamily: 'var(--font-inter, "Inter", -apple-system, sans-serif)',
        overflow: 'hidden',
        background: outerBg,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'background 0.4s ease',
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
          transition: 'background-image 0.4s ease',
        }}
      />

      {/* Phone card — fills on mobile, elevated card on desktop */}
      <div
        key={screen}
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
          boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.3)',
          borderRadius: 'clamp(0px, calc((100vw - 430px) * 999), 28px)',
        }}
      >
        {SCREEN_MAP[screen]}
      </div>

      {/* Prototype link — bottom corner */}
      <a
        href="/prototype"
        style={{
          position: 'fixed',
          bottom: 14,
          right: 16,
          fontSize: 10,
          color: 'rgba(245,247,242,0.25)',
          textDecoration: 'none',
          zIndex: 999,
          letterSpacing: '0.05em',
        }}
      >
        /prototype
      </a>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
