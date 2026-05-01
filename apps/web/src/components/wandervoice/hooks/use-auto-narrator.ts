'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAppContext, type NarrativeHistoryEntry } from '../context/app-context'

const DELAY_AFTER_FINISH_MS = 10_000

export function useAutoNarrator() {
  const {
    autoNarrate,
    nearestPOI,
    narrativeMode,
    voiceId,
    voiceStability,
    voiceSimilarity,
    voiceStyle,
    voiceSpeed,
    customInstruction,
    addNarrativeHistory,
    setNarratorPhase,
    setCurrentNarrativeText,
  } = useAppContext()

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const runningRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const stopAudio = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    runningRef.current = false
    setNarratorPhase('idle')
    setCurrentNarrativeText('')
  }, [setNarratorPhase, setCurrentNarrativeText])

  const runCycle = useCallback(async () => {
    if (!nearestPOI || runningRef.current) return
    runningRef.current = true
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    try {
      // 1. Generate narrative text
      setNarratorPhase('generating-text')
      const modeLabel = narrativeMode.charAt(0).toUpperCase() + narrativeMode.slice(1)

      const textRes = await fetch('/api/ai/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          poiName: nearestPOI.name,
          poiType: nearestPOI.type,
          poiAddress: nearestPOI.address,
          poiTags: nearestPOI.tags,
          mode: narrativeMode,
          customInstruction: customInstruction?.trim() || undefined,
        }),
      })
      const { text } = await textRes.json()
      if (!text) { runningRef.current = false; setNarratorPhase('idle'); return }

      setCurrentNarrativeText(text)

      // 2. Synthesize speech
      setNarratorPhase('generating-audio')
      const audioRes = await fetch('/api/ai/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          text,
          voiceId: voiceId ?? 'EXAVITQu4vr4xnSDxMaL',
          stability: voiceStability ?? 0.5,
          similarityBoost: voiceSimilarity ?? 0.75,
          style: voiceStyle ?? 0.3,
          speed: voiceSpeed ?? 1.0,
        }),
      })
      if (!audioRes.ok) { runningRef.current = false; setNarratorPhase('idle'); return }

      const blob = await audioRes.blob()
      const url = URL.createObjectURL(blob)

      // 3. Save to history
      const now = new Date()
      const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      const snippet = text.length > 80 ? text.slice(0, 80).trimEnd() + '…' : text

      const entry: NarrativeHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        time: timeLabel,
        place: nearestPOI.name,
        mode: modeLabel,
        snippet,
        fullText: text,
        audioUrl: url,
        timestamp: now.getTime(),
      }
      addNarrativeHistory(entry)

      // 4. Play audio
      setNarratorPhase('playing')
      const audio = new Audio(url)
      audioRef.current = audio

      await new Promise<void>((resolve) => {
        audio.onended = () => resolve()
        audio.onerror = () => resolve()
        audio.play().catch(() => resolve())
      })

      runningRef.current = false
      setNarratorPhase('idle')
    } catch (e: any) {
      runningRef.current = false
      // AbortError is expected when user stops narration — don't log as error
      if (e?.name !== 'AbortError') {
        setNarratorPhase('idle')
      }
    }
  }, [nearestPOI, narrativeMode, voiceId, voiceStability, voiceSimilarity, voiceStyle, voiceSpeed, customInstruction, addNarrativeHistory, setNarratorPhase, setCurrentNarrativeText])

  // Main loop effect
  useEffect(() => {
    if (!autoNarrate) {
      stopAudio()
      return
    }

    // Guard: no POI yet — don't start, wait
    if (!nearestPOI) return

    let cancelled = false

    const loop = async () => {
      if (cancelled) return
      await runCycle()
      if (cancelled) return
      timerRef.current = setTimeout(loop, DELAY_AFTER_FINISH_MS)
    }

    loop()

    return () => {
      cancelled = true
      stopAudio()
    }
  }, [autoNarrate, nearestPOI, runCycle, stopAudio])
}
