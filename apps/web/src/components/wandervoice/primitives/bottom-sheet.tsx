'use client'

import { useState, useRef } from 'react'
import { z } from 'zod'
import { colors, borders } from '../tokens'
import { InfoTab } from '../tabs/info-tab'
import { NarrativeTab } from '../tabs/narrative-tab'
import { HistoryTab } from '../tabs/history-tab'

const BottomSheetPropsSchema = z.object({
  dark: z.boolean().default(false),
  defaultTab: z.number().min(0).max(2).default(1),
  bottomOffset: z.number().default(0),
  children: z.any().optional(),
})

type BottomSheetProps = z.input<typeof BottomSheetPropsSchema> & { children?: React.ReactNode }

const TAB_LABELS = ['Info', 'Narrative', 'History']

export function BottomSheet({ dark = false, defaultTab = 1, bottomOffset = 0, children }: BottomSheetProps) {
  const [tab, setTab] = useState(defaultTab)
  
  // Drag logic
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const SNAP_THRESHOLD = 100
  const COLLAPSED_Y = 480 // Drag further down to hide most content

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    startY.current = e.clientY - dragY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const currentY = e.clientY - startY.current
    // Constrain drag: can't drag up past 0, can drag down
    setDragY(Math.max(0, currentY))
  }

  const onPointerUp = () => {
    setIsDragging(false)
    if (dragY > SNAP_THRESHOLD) {
      setDragY(COLLAPSED_Y)
    } else {
      setDragY(0)
    }
  }

  const bg = dark ? 'rgba(22,34,24,0.97)' : 'white'
  const activeBg = dark ? 'rgba(42,117,96,0.18)' : colors.mistBg

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        borderRadius: '24px 24px 0 0',
        border: dark ? borders.borderD : borders.border,
        borderBottom: 'none',
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        maxHeight: 'calc(100% - 60px)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          width: '100%',
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'ns-resize',
          flexShrink: 0,
          touchAction: 'none',
        }}
      >
        <div 
          style={{ 
            width: 36, 
            height: 4, 
            borderRadius: 2, 
            background: dark ? 'rgba(245,247,242,0.15)' : 'rgba(0,0,0,0.1)',
          }} 
        />
      </div>

      {/* Optional panel content (MetricStrip, POI info, etc.) */}
      {children && (
        <div style={{ flexShrink: 0 }}>
          {children}
        </div>
      )}

      {/* Tabs header */}
      <div style={{ display: 'flex', borderBottom: dark ? borders.borderD : borders.border, flexShrink: 0 }}>
        {TAB_LABELS.map((label, i) => (
          <div
            key={label}
            onClick={() => {
              setTab(i)
              if (dragY > 0) setDragY(0) // Auto-expand on tab click
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              textAlign: 'center',
              cursor: 'pointer',
              background: tab === i ? activeBg : bg,
              borderRight: i < 2 ? (dark ? borders.borderD : borders.border) : 'none',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: tab === i ? 600 : 400,
                color: tab === i ? colors.teal : dark ? 'rgba(245,247,242,0.45)' : colors.bark,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tab content — bottomOffset clears floating NavBar */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: bottomOffset + 20 }}>
        {tab === 0 && <InfoTab dark={dark} />}
        {tab === 1 && <NarrativeTab dark={dark} />}
        {tab === 2 && <HistoryTab dark={dark} />}
      </div>
    </div>
  )
}
