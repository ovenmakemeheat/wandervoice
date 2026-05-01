'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { Waveform } from '../primitives/waveform'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { BackIcon, CloseIcon, ChevronIcon, MicIcon, PauseIcon } from '../icons'

// ── Variant A: Full-screen immersive mic ──────────────────────────────────

export function S2A() {
  const [listening, setListening] = useState(true)

  const BIG_BARS = [6, 11, 18, 26, 36, 28, 18, 26, 36, 42, 36, 26, 18, 24, 32, 24, 16, 10, 18, 26, 18, 10, 7]

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.leaf,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 28px',
      }}
    >
      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.mist }}>WanderVoice</span>
        <div style={{ padding: '4px 10px', border: borders.borderD, borderRadius: 20 }}>
          <span style={{ fontSize: 11, color: colors.bark }}>Hàng Bạc · Story</span>
        </div>
      </div>

      {/* Waveform + question */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {BIG_BARS.map((v, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: listening ? v : 3,
                background: colors.teal,
                borderRadius: 2,
                opacity: 0.55 + (v / 42) * 0.45,
                transition: 'height 0.3s',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 13, color: colors.bark }}>{listening ? 'Listening…' : 'Tap to ask'}</span>
        {listening && (
          <p
            style={{
              fontSize: 14,
              color: colors.mist,
              textAlign: 'center',
              maxWidth: 220,
              lineHeight: 1.55,
              margin: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            "Who built this street and what did they sell?"
          </p>
        )}
      </div>

      {/* Context card */}
      <div
        style={{
          width: '100%',
          background: 'rgba(245,247,242,0.06)',
          border: borders.borderD,
          borderRadius: 12,
          padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 500, color: colors.bark, letterSpacing: 1, marginBottom: 4 }}>CONTEXT</div>
        <p style={{ fontSize: 12, color: 'rgba(245,247,242,0.65)', lineHeight: 1.6, margin: 0 }}>
          Answering as your Hanoi guide — Story mode, grounded in current location.
        </p>
      </div>

      {/* Mic button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div
          onClick={() => setListening((p) => !p)}
          style={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            background: listening ? colors.teal : 'rgba(245,247,242,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: listening ? '0 0 0 8px rgba(42,117,96,0.18), 0 0 0 16px rgba(42,117,96,0.07)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {listening
            ? <PauseIcon size={22} color={colors.mist} />
            : <MicIcon size={22} color={colors.mist} />}
        </div>
        <span style={{ fontSize: 11, color: colors.bark }}>{listening ? 'Tap to stop' : 'Tap to ask'}</span>
      </div>
    </div>
  )
}

// ── Variant B: Suggestions (last answer removed — duplicates History tab) ─

export function S2B() {
  return (
    <div style={{ width: '100%', height: '100%', background: colors.mist, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: borders.border }}>
        <BackIcon size={18} color={colors.bark} />
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.leaf }}>Ask about this place</span>
        <CloseIcon size={18} color={colors.bark} />
      </div>

      {/* Context banner */}
      <div style={{ margin: '8px 12px', background: colors.teal, borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 10, color: 'rgba(245,247,242,0.65)', marginBottom: 2 }}>ASKING ABOUT</div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: colors.mist,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Hàng Bạc Silver Street · Story
        </div>
      </div>

      {/* Suggested questions */}
      <div style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: colors.bark, letterSpacing: 1, marginBottom: 8, marginTop: 4 }}>SUGGESTED</div>
        {[
          'What was sold here 100 years ago?',
          'Who lives above these shophouses?',
          'Is the guild still active?',
          'What happened here during the war?',
          'Why is the street called Silver Street?',
        ].map((q) => (
          <div
            key={q}
            style={{
              padding: '10px 12px',
              border: borders.border,
              borderRadius: 8,
              marginBottom: 6,
              background: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: colors.leaf,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {q}
            </span>
            <ChevronIcon size={16} color={colors.teal} />
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 12px', borderTop: borders.border, display: 'flex', gap: 8, alignItems: 'center', background: colors.mist }}>
        <div style={{ flex: 1, background: colors.mistBg, borderRadius: 24, padding: '10px 16px', border: borders.border }}>
          <span style={{ fontSize: 12, color: colors.bark }}>Ask anything about this place…</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MicIcon size={18} color={colors.mist} />
        </div>
      </div>
    </div>
  )
}

// ── Variant C: Chat conversation ─────────────────────────────────────────

export function S2C() {
  return (
    <div style={{ width: '100%', height: '100%', background: colors.leaf, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackIcon size={18} color={colors.bark} />
        <span style={{ fontSize: 12, fontWeight: 600, color: colors.mist }}>Voice Guide</span>
        <CloseIcon size={18} color={colors.bark} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: 'rgba(42,117,96,0.28)', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', maxWidth: '75%' }}>
            <p style={{ fontSize: 12, color: colors.mist, lineHeight: 1.5, margin: 0 }}>Who built this street?</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.teal, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.mist }}>W</span>
          </div>
          <div style={{ background: 'rgba(245,247,242,0.07)', borderRadius: '3px 12px 12px 12px', padding: '8px 12px', maxWidth: '80%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Waveform color={colors.teal} n={10} h={14} active={false} />
              <span style={{ fontSize: 10, color: colors.bark }}>0:48</span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: 'rgba(245,247,242,0.8)',
                lineHeight: 1.5,
                margin: 0,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}
            >
              Silversmiths from Châu Khê village, established 1428 under the Lê dynasty guild system…
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: 'rgba(42,117,96,0.28)', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', maxWidth: '75%' }}>
            <p style={{ fontSize: 12, color: colors.mist, lineHeight: 1.5, margin: 0 }}>Still active today?</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.teal, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.mist }}>W</span>
          </div>
          <div style={{ background: 'rgba(245,247,242,0.07)', borderRadius: '3px 12px 12px 12px', padding: '8px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Waveform color={colors.teal} n={8} h={12} active />
              <span style={{ fontSize: 11, color: colors.bark }}>Generating…</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 12px', borderTop: borders.borderD, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, background: 'rgba(245,247,242,0.07)', borderRadius: 24, padding: '10px 14px', border: borders.borderD }}>
          <span style={{ fontSize: 12, color: colors.bark }}>Continue asking…</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MicIcon size={18} color={colors.mist} />
        </div>
      </div>

      {/* Spacer for NavBar */}
      <div style={{ height: NAV_HEIGHT }} />
      <NavBar active={2} />
    </div>
  )
}
