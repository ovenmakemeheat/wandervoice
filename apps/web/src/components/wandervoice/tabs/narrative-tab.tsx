'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { colors, borders } from '../tokens'
import { ModePills } from '../primitives/mode-pills'
import { useAppContext } from '../context/app-context'

interface NarrativeTabProps {
  dark?: boolean
}

interface ElevenVoice {
  voice_id: string
  name: string
  category: string
  preview_url: string
  labels: Record<string, string>
}

// ── Slider primitive ───────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, onChange, dark, format,
}: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; dark: boolean; format?: (v: number) => string
}) {
  const safeValue = value ?? 0
  const display = format ? format(safeValue) : safeValue.toFixed(2)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: colors.bark }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: colors.teal }}>{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={safeValue}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: colors.teal }}
      />
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────

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
  'generating-text': 'Generating text…',
  'generating-audio': 'Generating audio…',
  'playing': 'Playing…',
}

function PhaseIndicator({ phase, dark }: { phase: string; dark: boolean }) {
  const label = PHASE_LABELS[phase]
  if (!label) return null
  const isAudio = phase === 'generating-audio'
  const isPlaying = phase === 'playing'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: isPlaying ? 'rgba(42,117,96,0.12)' : (dark ? 'rgba(245,247,242,0.05)' : 'rgba(28,39,32,0.04)') }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {isPlaying ? (
          // Waveform bars
          [5, 9, 14, 10, 16, 11, 7].map((h, i) => (
            <div key={i} style={{
              width: 3, height: h, background: colors.teal, borderRadius: 2,
              animation: 'wavePulse 1.2s infinite ease-in-out',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))
        ) : (
          // Spinner dots
          [0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%', background: isAudio ? colors.gold : colors.teal,
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

// ── Main component ─────────────────────────────────────────────────────────

export function NarrativeTab({ dark = false }: NarrativeTabProps) {
  const {
    nearestPOI, narrativeMode, setNarrativeMode,
    voiceId, setVoiceId,
    voiceStability: voiceStabilityRaw, setVoiceStability,
    voiceSimilarity: voiceSimilarityRaw, setVoiceSimilarity,
    voiceStyle: voiceStyleRaw, setVoiceStyle,
    voiceSpeed: voiceSpeedRaw, setVoiceSpeed,
    customInstruction, setCustomInstruction,
    autoNarrate, narratorPhase, currentNarrativeText,
    theme,
  } = useAppContext()

  const voiceStability = voiceStabilityRaw ?? 0.5
  const voiceSimilarity = voiceSimilarityRaw ?? 0.75
  const voiceStyle = voiceStyleRaw ?? 0.3
  const voiceSpeed = voiceSpeedRaw ?? 1.0

  const isDark = dark || theme === 'dark'

  // Local UI state
  const [mode, setMode] = useState<'Story' | 'Facts' | 'Secrets'>('Story')
  const [narrativeText, setNarrativeText] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [voices, setVoices] = useState<ElevenVoice[]>([])
  const [voicesLoading, setVoicesLoading] = useState(false)
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [instructionInput, setInstructionInput] = useState(customInstruction ?? '')
  const [error, setError] = useState<string | null>(null)
  const [manualPhase, setManualPhase] = useState<'idle' | 'generating-text' | 'generating-audio' | 'playing'>('idle')

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const selectedVoice = voices.find(v => v.voice_id === voiceId)

  // The effective phase to show — auto-narrator takes priority when active
  const effectivePhase = autoNarrate ? narratorPhase : manualPhase

  // Sync mode → context narrativeMode
  useEffect(() => {
    setNarrativeMode(mode.toLowerCase() as any)
  }, [mode, setNarrativeMode])

  // Reset when POI or mode changes
  useEffect(() => {
    setNarrativeText('')
    setDisplayText('')
    setCharIndex(0)
    setAudioUrl(null)
    setError(null)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
  }, [nearestPOI?.name, mode])

  // Feed auto-narrator text into the typewriter when a new cycle produces text
  const prevAutoTextRef = useRef('')
  useEffect(() => {
    if (!autoNarrate || !currentNarrativeText) return
    if (currentNarrativeText === prevAutoTextRef.current) return
    prevAutoTextRef.current = currentNarrativeText
    setNarrativeText(currentNarrativeText)
    setDisplayText('')
    setCharIndex(0)
  }, [autoNarrate, currentNarrativeText])

  // Typewriter effect
  useEffect(() => {
    if (!narrativeText || charIndex >= narrativeText.length) return
    const t = setTimeout(() => {
      setDisplayText(p => p + narrativeText[charIndex])
      setCharIndex(p => p + 1)
    }, 22)
    return () => clearTimeout(t)
  }, [charIndex, narrativeText])

  // Load voices once
  useEffect(() => {
    if (voices.length > 0) return
    setVoicesLoading(true)
    fetch('/api/ai/voices')
      .then(r => r.json())
      .then(d => setVoices(d.voices ?? []))
      .catch(() => {})
      .finally(() => setVoicesLoading(false))
  }, [])

  const generate = useCallback(async () => {
    if (!nearestPOI || isGenerating) return
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsGenerating(true)
    setManualPhase('generating-text')
    setNarrativeText('')
    setDisplayText('')
    setCharIndex(0)
    setAudioUrl(null)
    setError(null)

    try {
      // 1. Generate narrative text via OpenRouter
      const textRes = await fetch('/api/ai/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          poiName: nearestPOI.name,
          poiType: nearestPOI.type,
          poiAddress: nearestPOI.address,
          poiTags: nearestPOI.tags,
          mode: mode.toLowerCase(),
          customInstruction: (instructionInput ?? '').trim() || undefined,
        }),
      })
      const { text, error: textErr } = await textRes.json()
      if (textErr || !text) throw new Error(textErr ?? 'No text returned')

      setNarrativeText(text)
      setCharIndex(0)

      // 2. Generate speech via ElevenLabs
      setManualPhase('generating-audio')
      const audioRes = await fetch('/api/ai/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          text,
          voiceId,
          stability: voiceStability,
          similarityBoost: voiceSimilarity,
          style: voiceStyle,
          speed: voiceSpeed,
        }),
      })
      if (!audioRes.ok) throw new Error('TTS failed')

      const blob = await audioRes.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)

      // Auto-play
      setManualPhase('playing')
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setIsPlaying(false); setManualPhase('idle') }
      audio.play()
      setIsPlaying(true)
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e?.message ?? 'Failed')
      setManualPhase('idle')
    } finally {
      setIsGenerating(false)
    }
  }, [nearestPOI, mode, voiceId, voiceStability, voiceSimilarity, voiceStyle, voiceSpeed, instructionInput, isGenerating])

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setManualPhase('idle')
    } else {
      audioRef.current.play()
      setIsPlaying(true)
      setManualPhase('playing')
    }
  }, [isPlaying])

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

  const isAutoActive = autoNarrate && narratorPhase !== 'idle'
  const isBusy = isGenerating || isAutoActive

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

      {/* Phase indicator — shown when auto-narrator is running */}
      {effectivePhase !== 'idle' && (
        <PhaseIndicator phase={effectivePhase} dark={isDark} />
      )}

      {/* Narrative text area */}
      <div style={{ minHeight: 90, padding: 12, background: cardBg, borderRadius: 12, border: cardBorder, position: 'relative' }}>
        {isGenerating && !displayText ? (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', height: 70 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: colors.teal,
                animation: `bounce 1s ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, lineHeight: 1.6, color: textPrimary, fontFamily: 'serif', fontStyle: 'italic' }}>
            {displayText || <span style={{ color: colors.bark, fontStyle: 'normal', fontSize: 12 }}>
              {autoNarrate
                ? (narratorPhase === 'generating-text' ? 'Writing narrative…'
                  : narratorPhase === 'generating-audio' ? 'Synthesizing voice…'
                  : 'Auto-narrator will begin shortly…')
                : 'Tap Generate to narrate this place'}
            </span>}
            {charIndex < narrativeText.length && (
              <span style={{ display: 'inline-block', width: 2, height: 13, background: colors.teal, marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
            )}
          </div>
        )}
      </div>

      {error && (
        <div style={{ fontSize: 11, color: '#e57373', padding: '6px 10px', borderRadius: 8, background: 'rgba(229,115,115,0.1)' }}>
          {error}
        </div>
      )}

      {/* Controls row */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Generate — disabled when auto-narrator is active */}
        <button
          onClick={generate}
          disabled={isBusy}
          title={isAutoActive ? 'Auto-narrator is running — pause it first' : undefined}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
            background: isBusy ? colors.bark : colors.teal,
            color: colors.mist, fontSize: 12, fontWeight: 600,
            cursor: isBusy ? 'not-allowed' : 'pointer',
            opacity: isBusy ? 0.6 : 1,
          }}
        >
          {isGenerating
            ? (manualPhase === 'generating-text' ? 'Writing…' : manualPhase === 'generating-audio' ? 'Synthesizing…' : 'Generating…')
            : isAutoActive
            ? 'Auto-narrator active'
            : '✦ Generate'}
        </button>

        {/* Play/Pause — manual audio only */}
        {audioUrl && !isAutoActive && (
          <button
            onClick={togglePlayback}
            style={{
              width: 42, borderRadius: 10, border: cardBorder, background: cardBg,
              color: textPrimary, fontSize: 16, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        )}
      </div>

      <div style={{ height: 1, background: divider }} />

      {/* ── Voice selector ── */}
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
              {voicesLoading ? 'Loading voices…' : selectedVoice?.name ?? 'Sarah'}
            </div>
            {selectedVoice && (
              <div style={{ fontSize: 10, color: colors.bark, marginTop: 1 }}>
                {selectedVoice.category} · {Object.values(selectedVoice.labels ?? {}).slice(0, 2).join(', ')}
              </div>
            )}
          </div>
          <span style={{ fontSize: 10, color: colors.teal }}>{showVoicePicker ? '▲' : '▼'}</span>
        </div>

        {showVoicePicker && voices.length > 0 && (
          <div style={{
            maxHeight: 220, overflowY: 'auto', marginTop: 6, borderRadius: 10,
            border: cardBorder, background: isDark ? 'rgba(14,24,16,0.95)' : 'white',
          }}>
            {voices.map(v => (
              <div
                key={v.voice_id}
                onClick={() => { setVoiceId(v.voice_id); setShowVoicePicker(false) }}
                style={{
                  padding: '9px 12px', cursor: 'pointer', borderBottom: `1px solid ${divider}`,
                  background: v.voice_id === voiceId ? (isDark ? 'rgba(42,117,96,0.15)' : 'rgba(42,117,96,0.07)') : 'transparent',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: v.voice_id === voiceId ? 600 : 400, color: textPrimary }}>
                  {v.name}
                  {v.voice_id === voiceId && <span style={{ color: colors.teal, marginLeft: 6 }}>✓</span>}
                </div>
                <div style={{ fontSize: 10, color: colors.bark }}>
                  {v.category} · {Object.values(v.labels ?? {}).slice(0, 3).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Voice config ── */}
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
            <Slider label="Stability" value={voiceStability} min={0} max={1} step={0.01} onChange={setVoiceStability} dark={isDark} />
            <Slider label="Clarity / Similarity" value={voiceSimilarity} min={0} max={1} step={0.01} onChange={setVoiceSimilarity} dark={isDark} />
            <Slider label="Style Exaggeration" value={voiceStyle} min={0} max={1} step={0.01} onChange={setVoiceStyle} dark={isDark} />
            <Slider label="Speed" value={voiceSpeed} min={0.7} max={1.2} step={0.05} onChange={setVoiceSpeed} dark={isDark} format={v => `${v.toFixed(2)}×`} />
          </div>
        )}
      </div>

      <div style={{ height: 1, background: divider }} />

      {/* ── Custom instruction ── */}
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
