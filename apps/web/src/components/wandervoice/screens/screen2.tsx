'use client'

import { useState, useEffect } from 'react'
import { colors, borders } from '../tokens'
import { Waveform } from '../primitives/waveform'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { BackIcon, CloseIcon, ChevronIcon, MicIcon, PauseIcon } from '../icons'
import { useAppContext } from '../context/app-context'
import { MOCK_SUGGESTED_QUESTIONS, MOCK_AI_RESPONSES } from '../data/mock'

// ── Variant A: Full-screen immersive mic ──────────────────────────────────

const BASE_BARS = [6, 11, 18, 26, 36, 28, 18, 26, 36, 42, 36, 26, 18, 24, 32, 24, 16, 10, 18, 26, 18, 10, 7]

const NAV_SCREENS_CHAT = ['home', 'smart-walk', 'voice-ask', 'profile'] as const

export function S2A() {
  const { navigate, goBack, addMessage, narrativeMode, theme } = useAppContext()
  const [listening, setListening] = useState(true)
  const [bars, setBars] = useState(BASE_BARS)
  const [capturedQ, setCapturedQ] = useState('')

  const isDark = theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg
  const textPrimary = isDark ? colors.mist : colors.leaf
  const textSecondary = colors.bark
  const cardBg = isDark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.04)'
  const border = isDark ? borders.borderD : borders.border

  useEffect(() => {
    if (!listening) return
    const id = setInterval(() => {
      setBars(BASE_BARS.map(v => Math.max(3, Math.round(v * (0.7 + Math.random() * 0.6)))))
    }, 400)
    return () => clearInterval(id)
  }, [listening])

  const handleStop = () => {
    const q = 'Who built this street and what did they sell?'
    setCapturedQ(q)
    addMessage({ id: Date.now().toString(), role: 'user', text: q, timestamp: Date.now() })
    navigate('voice-chat')
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 28px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>WanderVoice</span>
        <div style={{ padding: '4px 10px', border: border, borderRadius: 20 }}>
          <span style={{ fontSize: 11, color: textSecondary }}>Hàng Bạc · {narrativeMode.charAt(0).toUpperCase() + narrativeMode.slice(1)}</span>
        </div>
      </div>

      {/* Waveform + question */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {bars.map((v, i) => (
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
        <span style={{ fontSize: 13, color: textSecondary }}>{listening ? 'Listening…' : 'Tap to ask'}</span>
        {listening && (
          <p
            style={{
              fontSize: 14,
              color: textPrimary,
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
          background: cardBg,
          border: border,
          borderRadius: 12,
          padding: '12px 14px',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 500, color: textSecondary, letterSpacing: 1, marginBottom: 4 }}>CONTEXT</div>
        <p style={{ fontSize: 12, color: isDark ? 'rgba(245,247,242,0.65)' : 'rgba(28,39,32,0.65)', lineHeight: 1.6, margin: 0 }}>
          Answering as your Hanoi guide — {narrativeMode} mode, grounded in current location.
        </p>
      </div>

      {/* Mic button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 60 }}>
        <div
          onClick={listening ? handleStop : () => setListening(true)}
          style={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            background: listening ? colors.teal : (isDark ? 'rgba(245,247,242,0.1)' : 'rgba(28,39,32,0.1)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: listening ? (isDark ? '0 0 0 8px rgba(42,117,96,0.18), 0 0 0 16px rgba(42,117,96,0.07)' : '0 0 0 8px rgba(42,117,96,0.15)') : 'none',
            transition: 'all 0.2s',
          }}
        >
          {listening
            ? <PauseIcon size={22} color={colors.mist} />
            : <MicIcon size={22} color={isDark ? colors.mist : colors.leaf} />}
        </div>
        <span style={{ fontSize: 11, color: textSecondary }}>{listening ? 'Tap to stop' : 'Tap to ask'}</span>
      </div>

      <NavBar active={2} onNavigate={(t) => navigate(NAV_SCREENS_CHAT[t])} />
    </div>
  )
}

// ── Variant B: Suggestions ─────────────────────────────────────────────────

export function S2B() {
  const { goBack, navigate, addMessage, setPendingQuestion, narrativeMode, theme } = useAppContext()

  const isDark = theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg
  const textPrimary = isDark ? colors.mist : colors.leaf
  const border = isDark ? borders.borderD : borders.border
  const inputBg = isDark ? 'rgba(245,247,242,0.07)' : colors.mist

  const handleQuestion = (q: string) => {
    addMessage({ id: Date.now().toString(), role: 'user', text: q, timestamp: Date.now() })
    setPendingQuestion(q)
    navigate('voice-chat')
  }

  const modeLabel = narrativeMode.charAt(0).toUpperCase() + narrativeMode.slice(1)

  return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: border }}>
        <div onClick={goBack} style={{ cursor: 'pointer' }}><BackIcon size={18} color={colors.bark} /></div>
        <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>Ask about this place</span>
        <div onClick={goBack} style={{ cursor: 'pointer' }}><CloseIcon size={18} color={colors.bark} /></div>
      </div>

      {/* Context banner */}
      <div style={{ margin: '8px 12px', background: colors.teal, borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 10, color: 'rgba(245,247,242,0.65)', marginBottom: 2 }}>ASKING ABOUT</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.mist, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Hàng Bạc Silver Street · {modeLabel}
        </div>
      </div>

      {/* Suggested questions */}
      <div style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: colors.bark, letterSpacing: 1, marginBottom: 8, marginTop: 4 }}>SUGGESTED</div>
        {MOCK_SUGGESTED_QUESTIONS.map((q) => (
          <div
            key={q}
            onClick={() => handleQuestion(q)}
            style={{
              padding: '10px 12px',
              border: border,
              borderRadius: 8,
              marginBottom: 6,
              background: isDark ? 'rgba(245,247,242,0.04)' : 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {q}
            </span>
            <ChevronIcon size={16} color={colors.teal} />
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 12px 90px', borderTop: border, display: 'flex', gap: 8, alignItems: 'center', background: bg }}>
        <div style={{ flex: 1, background: inputBg, borderRadius: 24, padding: '10px 16px', border: border }}>
          <span style={{ fontSize: 12, color: colors.bark }}>Ask anything about this place…</span>
        </div>
        <div
          onClick={() => navigate('voice-listen')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
        >
          <MicIcon size={18} color={colors.mist} />
        </div>
      </div>

      <NavBar active={2} onNavigate={(t) => navigate(NAV_SCREENS_CHAT[t])} />
    </div>
  )
}

// ── Variant C: Chat conversation ─────────────────────────────────────────

export function S2C() {
  const { goBack, navigate, chatHistory, addMessage, pendingQuestion, clearPendingQuestion, theme } = useAppContext()
  const [generating, setGenerating] = useState(false)

  const isDark = theme === 'dark'
  const bg = isDark ? colors.leaf : colors.mistBg
  const textPrimary = isDark ? colors.mist : colors.leaf
  const border = isDark ? borders.borderD : borders.border
  const inputBg = isDark ? 'rgba(245,247,242,0.07)' : colors.mist

  useEffect(() => {
    if (!pendingQuestion) return
    setGenerating(true)
    const timer = setTimeout(() => {
      const response = MOCK_AI_RESPONSES[pendingQuestion] ?? MOCK_AI_RESPONSES['default']!
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.text,
        audioSecs: response.audioSecs,
        timestamp: Date.now(),
      })
      clearPendingQuestion()
      setGenerating(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [pendingQuestion])

  return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: border }}>
        <div onClick={goBack} style={{ cursor: 'pointer' }}><BackIcon size={18} color={colors.bark} /></div>
        <span style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>Voice Guide</span>
        <div onClick={goBack} style={{ cursor: 'pointer' }}><CloseIcon size={18} color={colors.bark} /></div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        {chatHistory.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: isDark ? 'rgba(42,117,96,0.28)' : 'rgba(42,117,96,0.15)', borderRadius: '12px 12px 3px 12px', padding: '8px 12px', maxWidth: '75%', border: border }}>
                  <p style={{ fontSize: 12, color: textPrimary, lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                </div>
              </div>
            )
          }
          return (
            <div key={msg.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.teal, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors.mist }}>W</span>
              </div>
              <div style={{ background: isDark ? 'rgba(245,247,242,0.07)' : 'white', borderRadius: '3px 12px 12px 12px', padding: '8px 12px', maxWidth: '80%', border: border }}>
                {msg.audioSecs && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Waveform color={colors.teal} n={10} h={14} active={false} />
                    <span style={{ fontSize: 10, color: colors.bark }}>0:{msg.audioSecs}</span>
                  </div>
                )}
                <p style={{ fontSize: 12, color: isDark ? 'rgba(245,247,242,0.8)' : colors.leaf, lineHeight: 1.5, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                  {msg.text}
                </p>
              </div>
            </div>
          )
        })}

        {chatHistory.length === 0 && !generating && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: colors.bark }}>Ask something about this place</span>
          </div>
        )}

        {generating && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.teal, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: colors.mist }}>W</span>
            </div>
            <div style={{ background: isDark ? 'rgba(245,247,242,0.07)' : 'white', borderRadius: '3px 12px 12px 12px', padding: '8px 12px', border: border }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Waveform color={colors.teal} n={8} h={12} active />
                <span style={{ fontSize: 11, color: colors.bark }}>Generating…</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 12px 90px', borderTop: border, display: 'flex', gap: 8, alignItems: 'center', background: bg }}>
        <div style={{ flex: 1, background: inputBg, borderRadius: 24, padding: '10px 14px', border: border }}>
          <span style={{ fontSize: 12, color: colors.bark }}>Continue asking…</span>
        </div>
        <div
          onClick={() => navigate('voice-ask')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
        >
          <MicIcon size={18} color={colors.mist} />
        </div>
      </div>

      <NavBar active={2} onNavigate={(t) => navigate(NAV_SCREENS_CHAT[t])} />
    </div>
  )
}
