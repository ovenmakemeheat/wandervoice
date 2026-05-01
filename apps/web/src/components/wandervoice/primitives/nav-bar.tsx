'use client'

import { colors } from '../tokens'
import { HomeIcon, MapPinIcon, ChatIcon, PersonIcon } from '../icons'
import { useAppContext } from '../context/app-context'

export const NAV_HEIGHT = 72

interface NavBarProps {
  active?: number
  onNavigate?: (tab: number) => void
}

const ICONS = [HomeIcon, MapPinIcon, ChatIcon, PersonIcon]

export function NavBar({ active = 0, onNavigate }: NavBarProps) {
  const { theme } = useAppContext()
  const isDark = theme === 'dark'

  const bg = isDark ? 'rgba(22,34,24,0.96)' : 'rgba(255,255,255,0.92)'
  const activeColor = isDark ? colors.mist : 'white'
  const inactiveColor = isDark ? 'rgba(245,247,242,0.38)' : 'rgba(28,39,32,0.45)'
  const border = isDark ? '1px solid rgba(42,117,96,0.15)' : '1px solid rgba(28,39,32,0.08)'

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
        background: bg,
        borderRadius: 50,
        padding: '5px 8px',
        filter: isDark ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.45))' : 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
        border: border,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        transition: 'background 0.3s ease, border 0.3s ease',
      }}
    >
      {ICONS.map((IconComp, i) => (
        <div
          key={i}
          onClick={() => onNavigate?.(i)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active === i ? colors.teal : 'transparent',
            color: active === i ? activeColor : inactiveColor,
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
