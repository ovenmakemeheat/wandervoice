'use client'

import { useState } from 'react'
import { colors } from '../tokens'
import { useAppContext } from '../context/app-context'

export function ScreenSignIn() {
  const { navigate, goBack, setOnboardingDone } = useAppContext()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => {
      setOnboardingDone()
      navigate('home')
    }, 600)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.canopy,
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 24px 36px',
      }}
    >
      {/* Back */}
      <button
        onClick={goBack}
        style={{ background: 'none', border: 'none', color: colors.bark, fontSize: 13, cursor: 'pointer', padding: 0, textAlign: 'left', marginBottom: 40 }}
      >
        ← Back
      </button>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.mist, margin: '0 0 8px', lineHeight: 1.2 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: colors.bark, margin: '0 0 36px' }}>
          Continue where you left off.
        </p>

        {/* Email input */}
        <input
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          placeholder="email@example.com"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${email ? colors.teal : 'rgba(245,247,242,0.2)'}`,
            outline: 'none',
            width: '100%',
            fontSize: 18,
            color: colors.mist,
            padding: '8px 0',
            marginBottom: 24,
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
        />

        {/* Email CTA */}
        <button
          onClick={handleContinue}
          disabled={!email.trim() || loading}
          style={{
            width: '100%',
            padding: '14px',
            background: email.trim() ? colors.teal : 'rgba(245,247,242,0.1)',
            color: email.trim() ? colors.mist : 'rgba(245,247,242,0.3)',
            border: 'none',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 600,
            cursor: email.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            marginBottom: 14,
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Signing in…' : 'Continue with email →'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(245,247,242,0.1)' }} />
          <span style={{ fontSize: 11, color: colors.bark }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(245,247,242,0.1)' }} />
        </div>

        {/* Google CTA */}
        <button
          onClick={() => { setOnboardingDone(); navigate('home') }}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: 'rgba(245,247,242,0.6)',
            border: '1px solid rgba(245,247,242,0.15)',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Continue with Google
        </button>
      </div>

      <p style={{ fontSize: 10, color: colors.bark, textAlign: 'center', margin: 0 }}>
        We'll never share your data.
      </p>
    </div>
  )
}
