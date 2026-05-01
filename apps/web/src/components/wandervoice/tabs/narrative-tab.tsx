'use client'

import { useState, useEffect } from 'react'
import { colors, borders } from '../tokens'
import { ModePills } from '../primitives/mode-pills'
import { NarrativeToggle } from '../primitives/narrative-toggle'
import { ChevronIcon } from '../icons'

interface NarrativeTabProps {
  dark?: boolean
}

const SUGGESTIONS = [
  { label: 'Switch to Secrets?', reason: 'This street has hidden guild rituals' },
  { label: 'Try Facts mode', reason: 'Dates and measurements available' },
]

const NARRATION_TEXT = "Hàng Bạc means Silver Street. Craftsmen from Châu Khê village set up workshops here in the 15th century, forging coins and jewelry for the royal court. Today, it remains the heart of Hanoi's jewelry trade, where the rhythmic sound of small hammers still echoes through the narrow shopfronts..."

export function NarrativeTab({ dark = false }: NarrativeTabProps) {
  const [narrating, setNarrating] = useState(true)
  const [mode, setMode] = useState<'Story' | 'Facts' | 'Secrets'>('Story')
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!narrating) {
      setDisplayText('')
      setCharIndex(0)
      return
    }

    if (charIndex < NARRATION_TEXT.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + NARRATION_TEXT[charIndex])
        setCharIndex(prev => prev + 1)
      }, 30)
      return () => clearTimeout(timeout)
    }
  }, [charIndex, narrating])

  return (
    <div
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Place + mode header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: dark ? colors.mist : colors.leaf }}>
            Hàng Bạc Silver Street
          </div>
          <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>
            Est. 1428 · Jewellery guild
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.bark }}>
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
          <span style={{ fontSize: 11, color: colors.teal }}>Ask</span>
        </div>
      </div>

      <ModePills mode={mode} setMode={setMode} dark={dark} />

      {/* Narrative Typewriter Space */}
      <div 
        style={{ 
          minHeight: 100, 
          padding: '12px', 
          background: dark ? 'rgba(245,247,242,0.03)' : 'rgba(28,39,32,0.02)',
          borderRadius: 12,
          border: dark ? '1px solid rgba(245,247,242,0.08)' : '1px solid rgba(28,39,32,0.05)',
          position: 'relative'
        }}
      >
        <div style={{ 
          fontSize: 13, 
          lineHeight: 1.5, 
          color: dark ? colors.mist : colors.leaf,
          opacity: 0.9,
          fontFamily: 'serif',
          fontStyle: 'italic'
        }}>
          {displayText}
          <span style={{ 
            display: narrating && charIndex < NARRATION_TEXT.length ? 'inline-block' : 'none',
            width: 2,
            height: 14,
            background: colors.teal,
            marginLeft: 2,
            verticalAlign: 'middle',
            animation: 'blink 1s infinite'
          }} />
        </div>
        {!narrating && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: colors.bark,
            fontSize: 12
          }}>
            Narrative paused
          </div>
        )}
      </div>

      {/* Personalization Section */}
      <div style={{ marginTop: 4, marginBottom: 8 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: colors.bark,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          PERSONALIZATION
        </div>
        
        {/* Quick instruction chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {['Kid friendly', 'Focus on architecture', 'Speak slower'].map((chip) => (
            <div
              key={chip}
              style={{
                padding: '6px 12px',
                borderRadius: 16,
                border: dark ? borders.borderD : borders.border,
                background: dark ? 'rgba(245,247,242,0.04)' : 'white',
                fontSize: 11,
                color: dark ? colors.mist : colors.leaf,
                cursor: 'pointer',
              }}
            >
              + {chip}
            </div>
          ))}
        </div>

        {/* Custom instruction input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: 12,
            border: dark ? borders.borderD : borders.border,
            background: dark ? 'rgba(0,0,0,0.2)' : colors.mistBg,
          }}
        >
          <input
            type="text"
            placeholder="Add custom instruction..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 12,
              color: dark ? colors.mist : colors.leaf,
            }}
          />
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.teal, cursor: 'pointer' }}>
            Save
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: colors.bark,
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          QUICK SUGGESTIONS
        </div>
        {SUGGESTIONS.map((s) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 10px',
              borderRadius: 8,
              marginBottom: 5,
              border: dark ? borders.borderD : borders.border,
              background: dark ? 'rgba(245,247,242,0.04)' : 'white',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: dark ? colors.mist : colors.leaf }}>
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: colors.bark }}>{s.reason}</div>
            </div>
            <ChevronIcon size={16} color={colors.teal} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
