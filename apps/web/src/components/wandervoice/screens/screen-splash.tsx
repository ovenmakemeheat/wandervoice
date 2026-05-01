'use client'

export { colors } from '../tokens'
import { colors } from '../tokens'
import { useAppContext } from '../context/app-context'

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Outer ring */}
      <circle cx="24" cy="24" r="21" stroke={colors.teal} strokeWidth="1.6" opacity="0.35" />
      {/* Inner ring */}
      <circle cx="24" cy="24" r="13" stroke={colors.teal} strokeWidth="1.2" opacity="0.2" />
      {/* Centre dot */}
      <circle cx="24" cy="24" r="2.5" fill={colors.teal} />
      {/* North point — tall, filled */}
      <polygon points="24,4 21.5,20 26.5,20" fill={colors.teal} />
      {/* South point — shorter */}
      <polygon points="24,44 21.8,28 26.2,28" fill={colors.teal} opacity="0.45" />
      {/* East point */}
      <polygon points="44,24 28,21.5 28,26.5" fill={colors.teal} opacity="0.6" />
      {/* West point */}
      <polygon points="4,24 20,21.5 20,26.5" fill={colors.teal} opacity="0.6" />
      {/* N label */}
      <text x="24" y="13" textAnchor="middle" fontSize="5.5" fontWeight="700" fill={colors.teal} fontFamily="system-ui, sans-serif" letterSpacing="0.5">N</text>
    </svg>
  )
}

export function ScreenSplash() {
  const { navigate } = useAppContext()

  return (
    <div style={{ width: '100%', height: '100%', background: colors.canopy, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <LogoMark size={72} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.mist, marginTop: 16, marginBottom: 8, letterSpacing: '-0.4px' }}>
          WanderVoice
        </h1>
        <div style={{ width: '100%', height: 1, background: colors.teal, opacity: 0.5, marginBottom: 16 }} />
        <p style={{ fontSize: 15, color: colors.bark, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          The city has<br />stories. Listen.
        </p>
      </div>

      <div style={{ width: '100%', marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => navigate('perms')}
          style={{
            width: '100%',
            padding: '14px',
            background: colors.teal,
            color: colors.mist,
            border: 'none',
            borderRadius: 30,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Begin your walk
        </button>
        <span
          onClick={() => navigate('sign-in')}
          style={{ fontSize: 11, color: colors.bark, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Already explored?
        </span>
      </div>
    </div>
  )
}
