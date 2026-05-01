import type { ReactNode, CSSProperties } from 'react'
import { colors } from './tokens'

interface PhoneFrameProps {
  children: ReactNode
  dark?: boolean
  style?: CSSProperties
}

export function PhoneFrame({ children, dark = false, style }: PhoneFrameProps) {
  return (
    <div
      style={{
        width: 280,
        height: 560,
        borderRadius: 32,
        overflow: 'hidden',
        border: `2px solid ${dark ? 'rgba(245,247,242,0.15)' : 'rgba(28,39,32,0.25)'}`,
        background: dark ? colors.leaf : colors.mist,
        flexShrink: 0,
        position: 'relative',
        boxShadow: dark
          ? '0 24px 60px rgba(0,0,0,0.55), 0 8px 20px rgba(0,0,0,0.4)'
          : '0 24px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)',
        ...style,
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 18,
          background: dark ? colors.leaf : colors.mist,
          borderRadius: '0 0 14px 14px',
          zIndex: 50,
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  )
}
