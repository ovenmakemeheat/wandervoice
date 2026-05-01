'use client'

import { useState, useRef } from 'react'
import { colors, borders } from '../tokens'
import { useAppContext } from '../context/app-context'

interface HistoryTabProps {
  dark?: boolean
}

const MODE_COLORS: Record<string, string> = {
  Story: colors.teal,
  Facts: '#5b8de8',
  Secrets: colors.gold,
}

export function HistoryTab({ dark = false }: HistoryTabProps) {
  const { narrativeHistory, theme } = useAppContext()
  const isDark = dark || theme === 'dark'
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = (id: string, audioUrl?: string) => {
    if (!audioUrl) return
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    audio.onended = () => setPlayingId(null)
    audio.play()
    setPlayingId(id)
  }

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const textPrimary = isDark ? colors.mist : colors.leaf

  return (
    <div style={{ padding: '10px 14px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: colors.bark, letterSpacing: 1, marginBottom: 2 }}>
        TODAY'S NARRATIVE
      </div>

      {narrativeHistory.length === 0 && (
        <div style={{ padding: '24px 0', textAlign: 'center', color: colors.bark, fontSize: 12 }}>
          No narratives yet — press ▶ to start auto-narrate
        </div>
      )}

      {narrativeHistory.map((item) => {
        const isExpanded = expandedIds.has(item.id)
        const isTruncated = item.fullText.length > item.snippet.length
        const displayText = isExpanded ? item.fullText : item.snippet

        return (
          <div
            key={item.id}
            style={{
              padding: '9px 11px',
              borderRadius: 10,
              border: isDark ? borders.borderD : borders.border,
              background: isDark ? 'rgba(245,247,242,0.04)' : 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: textPrimary }}>{item.place}</span>
                <div style={{ padding: '1px 6px', borderRadius: 10, background: MODE_COLORS[item.mode] ?? colors.teal }}>
                  <span style={{ fontSize: 9, fontWeight: 500, color: colors.mist }}>{item.mode}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.audioUrl && (
                  <button
                    onClick={() => togglePlay(item.id, item.audioUrl)}
                    style={{
                      width: 22, height: 22, borderRadius: '50%', border: 'none',
                      background: playingId === item.id ? colors.teal : (isDark ? 'rgba(245,247,242,0.1)' : 'rgba(28,39,32,0.08)'),
                      color: playingId === item.id ? colors.mist : colors.bark,
                      cursor: 'pointer', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {playingId === item.id ? '⏸' : '▶'}
                  </button>
                )}
                <span style={{ fontSize: 10, color: colors.bark }}>{item.time}</span>
              </div>
            </div>

            <p style={{ fontSize: 11, color: colors.bark, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              {displayText}
            </p>

            {isTruncated && (
              <button
                onClick={() => toggleExpand(item.id)}
                style={{
                  marginTop: 5, padding: 0, border: 'none', background: 'none',
                  fontSize: 10, fontWeight: 600, color: colors.teal, cursor: 'pointer',
                }}
              >
                {isExpanded ? 'Show less ▲' : 'Read more ▼'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
