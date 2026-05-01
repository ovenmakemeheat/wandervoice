'use client'

export { colors } from '../tokens'
import { colors } from '../tokens'
import { useAppContext } from '../context/app-context'

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.42)} viewBox="0 0 60 25">
      <circle cx="6" cy="20" r="2.5" fill="none" stroke={colors.teal} strokeWidth="1.6" />
      <circle cx="16" cy="16" r="2.5" fill="none" stroke={colors.teal} strokeWidth="1.6" />
      <circle cx="27" cy="13" r="2.5" fill="none" stroke={colors.teal} strokeWidth="1.6" />
      <line x1="35" y1="24" x2="35" y2="10" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="43" y1="24" x2="43" y2="4" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="51" y1="24" x2="51" y2="9" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="58" y1="24" x2="58" y2="14" stroke={colors.teal} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function ScreenSplash() {
  const { navigate } = useAppContext()

  return (
    <div style={{ width: '100%', height: '100%', background: colors.canopy, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <LogoMark size={60} />
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
