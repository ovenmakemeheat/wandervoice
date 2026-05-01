'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { ToggleSwitch } from '../primitives/toggle-switch'
import { useAppContext } from '../context/app-context'

export function S7A() {
  const { setAutoAudio, setLeadingCues, setOnboardingDone, navigate } = useAppContext()
  const [autoOn, setAutoOn] = useState(false)
  const [leading, setLeading] = useState(true)

  const SETTINGS = [
    {
      key: 'auto' as const,
      on: autoOn,
      toggle: () => setAutoOn((p) => !p),
      title: 'Auto-audio',
      desc: 'When you walk within 50m of a gem, the guide begins automatically — no tapping required.',
      confirm: 'Will start playing as you approach each gem',
    },
    {
      key: 'lead' as const,
      on: leading,
      toggle: () => setLeading((p) => !p),
      title: 'Leading instructions',
      desc: 'Your guide will tell you what to look for before you arrive — "look up at the gate" or "the smell of incense is from the left."',
      confirm: 'Guide will cue your senses as you approach',
    },
  ]

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.leaf,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 18px',
      }}
    >
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {[true, true, true, false].map((filled, i) => (
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

      <div style={{ fontSize: 18, fontWeight: 700, color: colors.mist, marginBottom: 4, lineHeight: 1.3 }}>
        Set up your walking experience
      </div>
      <p style={{ fontSize: 12, color: colors.bark, marginBottom: 18, lineHeight: 1.65, margin: '0 0 18px' }}>
        WanderVoice detects nearby gems as you walk. Here's how it will guide you.
      </p>

      {/* Toggle cards */}
      {SETTINGS.map((s) => (
        <div
          key={s.key}
          style={{
            background: 'rgba(245,247,242,0.06)',
            border: s.on ? borders.borderT : borders.borderD,
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.mist }}>{s.title}</span>
            <ToggleSwitch on={s.on} onToggle={s.toggle} dark />
          </div>
          <p style={{ fontSize: 11, color: colors.bark, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
          {s.on && (
            <div
              style={{
                marginTop: 8,
                padding: '6px 10px',
                background: 'rgba(42,117,96,0.15)',
                borderRadius: 8,
                border: '1px solid rgba(42,117,96,0.3)',
              }}
            >
              <span style={{ fontSize: 10, color: colors.teal }}>✓ {s.confirm}</span>
            </div>
          )}
        </div>
      ))}

      {/* Gold info notice */}
      <div
        style={{
          background: 'rgba(232,168,80,0.12)',
          border: borders.borderG,
          borderRadius: 10,
          padding: '10px 12px',
          marginBottom: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, color: colors.gold, marginTop: 1 }}>✦</span>
          <p style={{ fontSize: 11, color: 'rgba(232,168,80,0.9)', lineHeight: 1.55, margin: 0 }}>
            Guides are AI-generated in real time, grounded in your location and chosen narrative mode.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div
        onClick={() => {
          setAutoAudio(autoOn)
          setLeadingCues(leading)
          setOnboardingDone()
          navigate('home')
        }}
        style={{
          marginTop: 16,
          background: colors.teal,
          borderRadius: 14,
          padding: '13px 20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: colors.mist }}>Start wandering</span>
      </div>
    </div>
  )
}
