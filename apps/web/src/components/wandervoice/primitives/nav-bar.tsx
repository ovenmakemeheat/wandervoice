'use client'

import { useState } from 'react'
import { colors } from '../tokens'
import { HomeIcon, MapPinIcon, ChatIcon, PersonIcon } from '../icons'

export const NAV_HEIGHT = 72

interface NavBarProps {
  active?: number
}

const ICONS = [HomeIcon, MapPinIcon, ChatIcon, PersonIcon]

export function NavBar({ active: initialActive = 0 }: NavBarProps) {
  const [tab, setTab] = useState(initialActive)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        background: 'rgba(22,34,24,0.96)',
        borderRadius: 50,
        padding: '5px 8px',
        // filter instead of boxShadow — escapes overflow:hidden clipping
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.45))',
        zIndex: 100,
      }}
    >
      {ICONS.map((IconComp, i) => (
        <div
          key={i}
          onClick={() => setTab(i)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: tab === i ? colors.teal : 'transparent',
            color: tab === i ? colors.mist : 'rgba(245,247,242,0.38)',
            cursor: 'pointer',
            transition: 'background 0.16s, color 0.16s',
          }}
        >
          <IconComp size={18} color="currentColor" />
        </div>
      ))}
    </div>
  )
}
