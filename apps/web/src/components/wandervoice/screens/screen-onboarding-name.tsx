'use client'

import { useState } from 'react'
import { colors } from '../tokens'
import { useAppContext } from '../context/app-context'

export function ScreenOnboardingName() {
  const { setUserName, navigate, goBack } = useAppContext()
  const [name, setName] = useState('')

  const handleContinue = () => {
    if (!name.trim()) return
    setUserName(name.trim())
    navigate('onboarding-style')
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
      {/* Progress bar — step 1 of 4 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {[true, false, false, false].map((filled, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: filled ? colors.teal : 'rgba(245,247,242,0.15)',
            }}
          />
        ))}
      </div>

      {/* Back */}
      <button
        onClick={goBack}
        style={{ background: 'none', border: 'none', color: colors.bark, fontSize: 13, cursor: 'pointer', padding: 0, textAlign: 'left', marginBottom: 32 }}
      >
        ← Back
      </button>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontSize: 12, color: colors.bark, letterSpacing: 1.2, marginBottom: 8, margin: '0 0 8px' }}>STEP 1 OF 4</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.mist, margin: '0 0 32px', lineHeight: 1.25 }}>
          What should we call you?
        </h1>

        {/* Name input */}
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          placeholder="Your first name"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${name ? colors.teal : 'rgba(245,247,242,0.2)'}`,
            outline: 'none',
            width: '100%',
            fontSize: 28,
            fontWeight: 600,
            color: colors.mist,
            padding: '8px 0',
            marginBottom: 8,
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
        />
        <span style={{ fontSize: 11, color: colors.bark }}>Your first name</span>
      </div>

      {/* CTA */}
      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        style={{
          width: '100%',
          padding: '14px',
          background: name.trim() ? colors.teal : 'rgba(245,247,242,0.1)',
          color: name.trim() ? colors.mist : 'rgba(245,247,242,0.3)',
          border: 'none',
          borderRadius: 30,
          fontSize: 15,
          fontWeight: 600,
          cursor: name.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
      >
        Continue →
      </button>
    </div>
  )
}
