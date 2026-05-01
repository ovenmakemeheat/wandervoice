'use client'

import { useState, useEffect, useRef } from 'react'
import { colors } from '../tokens'
import { ModePills } from '../primitives/mode-pills'
import { useAppContext } from '../context/app-context'

interface NarrativeTabProps {
  dark?: boolean
}

// ── Slider ─────────────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, onChange, dark, format,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; dark: boolean; format?: (v: number) => string
}) {
  const safeValue = value ?? 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: colors.bark }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: colors.teal }}>
          {format ? format(safeValue) : safeValue.toFixed(2)}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={safeValue}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: colors.teal }}
      />
    </div>
  )
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: colors.bark,
      textTransform: 'uppercase', marginBottom: 8, marginTop: 4,
    }}>
      {title}
    </div>
  )
}

// ── Phase indicator ────────────────────────────────────────────────────────

const PHASE_LABELS: Record<string, string> = {
  searching: 'Searching knowledge…',
  'generating-text': 'Writing narrative…',
  'generating-audio': 'Synthesizing…',
  playing: 'Speaking…',
}

function PhaseIndicator({ phase, dark }: { phase: string; dark: boolean }) {
  const label = PHASE_LABELS[phase]
  if (!label) return null
  const isPlaying = phase === 'playing'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
      borderRadius: 8,
      background: isPlaying ? 'rgba(42,117,96,0.12)' : (dark ? 'rgba(245,247,242,0.05)' : 'rgba(28,39,32,0.04)'),
    }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {isPlaying ? (
          [5, 9, 14, 10, 16, 11, 7].map((h, i) => (
            <div key={i} style={{
              width: 3, height: h, background: colors.teal, borderRadius: 2,
              animation: 'wavePulse 1.2s infinite ease-in-out',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))
        ) : (
          [0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%', background: colors.teal,
              animation: `bounce 1s ${i * 0.15}s infinite`,
            }} />
          ))
        )}
      </div>
      <span style={{ fontSize: 11, color: isPlaying ? colors.teal : colors.bark, fontWeight: isPlaying ? 500 : 400 }}>
        {label}
      </span>
    </div>
  )
}

// ── Web Speech API helpers ─────────────────────────────────────────────────

function pickDefaultVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    voices.find(v => v.lang.startsWith('en') && v.localService) ??
    voices.find(v => v.lang.startsWith('en')) ??
    voices[0] ?? null
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export function NarrativeTab({ dark = false }: NarrativeTabProps) {
  const {
    nearestPOI, setNarrativeMode,
    voiceId, setVoiceId,
    voiceSpeed: voiceSpeedRaw, setVoiceSpeed,
    voiceStability: voicePitchRaw, setVoiceStability,
    customInstruction, setCustomInstruction,
    autoNarrate, narratorPhase, currentNarrativeText,
    theme,
  } = useAppContext()

  const voiceSpeed = voiceSpeedRaw ?? 1.0
  const voicePitch = voicePitchRaw ?? 1.0

  const isDark = dark || theme === 'dark'

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicesLoading, setVoicesLoading] = useState(true)
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [mode, setMode] = useState<'Story' | 'Facts' | 'Secrets'>('Story')
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [narrativeText, setNarrativeText] = useState('')
  const [instructionInput, setInstructionInput] = useState(customInstruction ?? '')

  const selectedVoice = voices.find(v => v.voiceURI === voiceId) ?? voices[0] ?? null

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length === 0) return false
      setVoices(v)
      setVoicesLoading(false)
      if (!voiceId) {
        const def = pickDefaultVoice(v)
        if (def) setVoiceId(def.voiceURI)
      }
      return true
    }
    if (load()) return
    window.speechSynthesis.addEventListener('voiceschanged', load)
    const timers = [setTimeout(load, 100), setTimeout(load, 500), setTimeout(load, 1500)]
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      timers.forEach(clearTimeout)
    }
  }, [voiceId, setVoiceId])

  // Sync mode → context
  useEffect(() => {
    setNarrativeMode(mode.toLowerCase() as any)
  }, [mode, setNarrativeMode])

  // Reset on POI / mode change
  useEffect(() => {
    setNarrativeText('')
    setDisplayText('')
    setCharIndex(0)
  }, [nearestPOI?.name, mode])

  // Feed auto-narrator text into typewriter
  const prevAutoTextRef = useRef('')
  useEffect(() => {
    if (!currentNarrativeText) return
    if (currentNarrativeText === prevAutoTextRef.current) return
    prevAutoTextRef.current = currentNarrativeText
    setNarrativeText(currentNarrativeText)
    setDisplayText('')
    setCharIndex(0)
  }, [currentNarrativeText])

  // Typewriter
  useEffect(() => {
    if (!narrativeText || charIndex >= narrativeText.length) return
    const t = setTimeout(() => {
      setDisplayText(p => p + narrativeText[charIndex])
      setCharIndex(p => p + 1)
    }, 22)
    return () => clearTimeout(t)
  }, [charIndex, narrativeText])

  if (!nearestPOI) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: colors.bark, fontSize: 13 }}>
        Waiting for landmark…
      </div>
    )
  }

  const divider = isDark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.08)'
  const textPrimary = isDark ? colors.mist : colors.leaf
  const cardBg = isDark ? 'rgba(245,247,242,0.03)' : 'rgba(28,39,32,0.02)'
  const cardBorder = isDark ? '1px solid rgba(245,247,242,0.08)' : '1px solid rgba(28,39,32,0.06)'

  const isActive = narratorPhase !== 'idle'

  return (
    <div style={{ padding: '12px 14px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Place header */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{nearestPOI.name}</div>
        <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>
          {nearestPOI.type || 'Landmark'} · {nearestPOI.address || 'Bangkok'}
        </div>
      </div>

      {/* Mode pills */}
      <ModePills mode={mode} setMode={setMode} dark={isDark} />

      {/* Phase indicator */}
      {isActive && <PhaseIndicator phase={narratorPhase} dark={isDark} />}

      {/* Narrative display */}
      <div style={{ minHeight: 100, padding: 14, background: cardBg, borderRadius: 14, border: cardBorder }}>
        {isActive && !displayText ? (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', height: 72 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: colors.teal,
                animation: `bounce 1s ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, lineHeight: 1.7, color: textPrimary, fontFamily: 'serif', fontStyle: 'italic' }}>
            {displayText || (
              <span style={{ color: colors.bark, fontStyle: 'normal', fontSize: 12 }}>
                {autoNarrate ? 'Auto-narrator will begin shortly…' : 'Enable auto-narrator to hear this place…'}
              </span>
            )}
            {charIndex < narrativeText.length && (
              <span style={{
                display: 'inline-block', width: 2, height: 13, background: colors.teal,
                marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite',
              }} />
            )}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: divider }} />

      {/* Voice selector */}
      <div>
        <SectionLabel title="Voice" />
        <div
          onClick={() => setShowVoicePicker(p => !p)}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 12px', borderRadius: 10, border: cardBorder, background: cardBg, cursor: 'pointer',
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>
              {voicesLoading ? 'Loading voices…' : (selectedVoice?.name ?? 'Default')}
            </div>
            {selectedVoice && (
              <div style={{ fontSize: 10, color: colors.bark, marginTop: 1 }}>
                {selectedVoice.lang} · {selectedVoice.localService ? 'Local' : 'Network'}
              </div>
            )}
          </div>
          <span style={{ fontSize: 10, color: colors.teal }}>{showVoicePicker ? '▲' : '▼'}</span>
        </div>

        {showVoicePicker && voices.length > 0 && (
          <div style={{
            maxHeight: 200, overflowY: 'auto', marginTop: 6, borderRadius: 10,
            border: cardBorder, background: isDark ? 'rgba(14,24,16,0.95)' : 'white',
          }}>
            {voices.map(v => (
              <div
                key={v.voiceURI}
                onClick={() => { setVoiceId(v.voiceURI); setShowVoicePicker(false) }}
                style={{
                  padding: '9px 12px', cursor: 'pointer', borderBottom: `1px solid ${divider}`,
                  background: v.voiceURI === voiceId
                    ? (isDark ? 'rgba(42,117,96,0.15)' : 'rgba(42,117,96,0.07)')
                    : 'transparent',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: v.voiceURI === voiceId ? 600 : 400, color: textPrimary }}>
                  {v.name}
                  {v.voiceURI === voiceId && <span style={{ color: colors.teal, marginLeft: 6 }}>✓</span>}
                </div>
                <div style={{ fontSize: 10, color: colors.bark }}>
                  {v.lang} · {v.localService ? 'Local' : 'Network'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice settings */}
      <div>
        <div
          onClick={() => setShowConfig(p => !p)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showConfig ? 10 : 0 }}
        >
          <SectionLabel title="Voice Settings" />
          <span style={{ fontSize: 10, color: colors.teal, marginTop: -4 }}>{showConfig ? '▲ Hide' : '▼ Show'}</span>
        </div>
        {showConfig && (
          <div style={{ padding: '8px 0' }}>
            <Slider label="Pitch" value={voicePitch} min={0} max={2} step={0.05} onChange={setVoiceStability} dark={isDark} format={v => v.toFixed(2)} />
            <Slider label="Speed" value={voiceSpeed} min={0.5} max={2} step={0.05} onChange={setVoiceSpeed} dark={isDark} format={v => `${v.toFixed(2)}×`} />
          </div>
        )}
      </div>

      <div style={{ height: 1, background: divider }} />

      {/* Custom instruction */}
      <div>
        <SectionLabel title="Custom Instruction" />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            value={instructionInput}
            onChange={e => setInstructionInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setCustomInstruction((instructionInput ?? '').trim()) }}
            placeholder="e.g. Kid friendly, focus on architecture…"
            style={{
              flex: 1, padding: '9px 12px', borderRadius: 10, border: cardBorder,
              background: cardBg, color: textPrimary, fontSize: 12, outline: 'none',
            }}
          />
          <button
            onClick={() => setCustomInstruction((instructionInput ?? '').trim())}
            style={{
              padding: '9px 14px', borderRadius: 10, border: 'none',
              background: colors.teal, color: colors.mist, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
        {customInstruction && (
          <div style={{ fontSize: 10, color: colors.teal, marginTop: 4 }}>
            Active: "{customInstruction}"
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes wavePulse { 0%,100%{transform:scaleY(0.7)} 50%{transform:scaleY(1.3)} }
      `}</style>
    </div>
  )
}
