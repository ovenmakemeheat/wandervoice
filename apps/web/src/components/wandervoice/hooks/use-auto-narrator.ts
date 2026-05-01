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
    voiceStability,  // repurposed as pitch
    voiceSpeed,
    customInstruction,
    addNarrativeHistory,
    setNarratorPhase,
    setCurrentNarrativeText,
  } = useAppContext()

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const runningRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const stopSpeech = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    utteranceRef.current = null
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
      // 1. Search for place knowledge
      setNarratorPhase('searching')
      // (search happens inside /api/ai/narrate agentic loop)

      // 2. Generate narrative text
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
      if (!text || signal.aborted) { runningRef.current = false; setNarratorPhase('idle'); return }

      setCurrentNarrativeText(text)

      // 2. Save to history (no audioUrl — Web Speech API has no blob)
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
        timestamp: now.getTime(),
      }
      addNarrativeHistory(entry)

      // 3. Speak via Web Speech API
      setNarratorPhase('generating-audio')
      if (signal.aborted) { runningRef.current = false; setNarratorPhase('idle'); return }

      await new Promise<void>((resolve) => {
        if (!window.speechSynthesis) { resolve(); return }
        window.speechSynthesis.cancel()

        const utt = new SpeechSynthesisUtterance(text)

        // Resolve voice from stored voiceURI
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(v => v.voiceURI === voiceId) ?? voices[0]
        if (voice) utt.voice = voice
        utt.rate = voiceSpeed ?? 1.0
        utt.pitch = voiceStability ?? 1.0  // stability slider → pitch

        utt.onstart = () => setNarratorPhase('playing')
        utt.onend = () => resolve()
        utt.onerror = () => resolve()

        utteranceRef.current = utt

        // Abort integration: cancel speech if fetch was aborted mid-way
        signal.addEventListener('abort', () => {
          window.speechSynthesis?.cancel()
          resolve()
        })

        window.speechSynthesis.speak(utt)
      })

      runningRef.current = false
      setNarratorPhase('idle')
    } catch (e: any) {
      runningRef.current = false
      if (e?.name !== 'AbortError') setNarratorPhase('idle')
    }
  }, [nearestPOI, narrativeMode, voiceId, voiceStability, voiceSpeed, customInstruction, addNarrativeHistory, setNarratorPhase, setCurrentNarrativeText])

  // Main loop
  useEffect(() => {
    if (!autoNarrate) {
      stopSpeech()
      return
    }
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
      stopSpeech()
    }
  }, [autoNarrate, nearestPOI, runCycle, stopSpeech])
}
