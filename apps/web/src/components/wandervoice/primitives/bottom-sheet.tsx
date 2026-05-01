'use client'

import { useState } from 'react'
import { z } from 'zod'
import { colors, borders } from '../tokens'
import { InfoTab } from '../tabs/info-tab'
import { NarrativeTab } from '../tabs/narrative-tab'
import { HistoryTab } from '../tabs/history-tab'

const BottomSheetPropsSchema = z.object({
  dark: z.boolean().default(false),
  defaultTab: z.number().min(0).max(2).default(1),
  bottomOffset: z.number().default(0),
})

type BottomSheetProps = z.infer<typeof BottomSheetPropsSchema>

const TAB_LABELS = ['Info', 'Narrative', 'History']

export function BottomSheet({ dark = false, defaultTab = 1, bottomOffset = 0 }: BottomSheetProps) {
  BottomSheetPropsSchema.parse({ dark, defaultTab, bottomOffset })
  const [tab, setTab] = useState(defaultTab)

  const bg = dark ? 'rgba(22,34,24,0.97)' : 'white'
  const activeBg = dark ? 'rgba(42,117,96,0.18)' : colors.mistBg

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: bg,
        borderRadius: '14px 14px 0 0',
        border: dark ? borders.borderD : borders.border,
        borderBottom: 'none',
      }}
    >
      {/* Tabs header */}
      <div style={{ display: 'flex', borderBottom: dark ? borders.borderD : borders.border }}>
        {TAB_LABELS.map((label, i) => (
          <div
            key={label}
            onClick={() => setTab(i)}
            style={{
              flex: 1,
              padding: '9px 0',
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
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: bottomOffset }}>
        {tab === 0 && <InfoTab dark={dark} />}
        {tab === 1 && <NarrativeTab dark={dark} />}
        {tab === 2 && <HistoryTab dark={dark} />}
      </div>
    </div>
  )
}
