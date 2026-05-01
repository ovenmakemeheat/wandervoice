import { colors, borders } from '../tokens'
import { BackIcon, MapPinIcon, MicIcon, CheckIcon } from '../icons'

function PermCard({
  icon: Icon,
  title,
  required = false,
  description,
  granted = false,
}: {
  icon: any
  title: string
  required?: boolean
  description: string
  granted?: boolean
}) {
  return (
    <div
      style={{
        background: granted ? 'rgba(42,117,96,0.1)' : 'rgba(245,247,242,0.04)',
        border: granted ? borders.borderT : borders.borderD,
        borderRadius: 12,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,247,242,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color={granted ? colors.teal : colors.mist} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.mist }}>{title}</div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: required ? colors.gold : colors.bark,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {required ? 'Required' : 'Optional'}
            </div>
          </div>
        </div>
        {granted ? (
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: colors.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon size={14} color={colors.mist} />
          </div>
        ) : (
          <button
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              background: 'white',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: colors.leaf,
              cursor: 'pointer',
            }}
          >
            Allow
          </button>
        )}
      </div>
      <p style={{ fontSize: 12, color: colors.bark, margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  )
}

function ScreenPermsBase({ granted = false }: { granted?: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', background: colors.leaf, display: 'flex', flexDirection: 'column', padding: '16px 20px 24px' }}>
      <div style={{ paddingBottom: 24, display: 'flex', alignItems: 'center' }}>
        <BackIcon size={20} color={colors.mist} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.mist, margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
            Before you go
          </h1>
          <p style={{ fontSize: 14, color: colors.bark, margin: 0 }}>
            Two things WanderVoice needs from you.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PermCard
            icon={MapPinIcon}
            title="Location"
            required
            description="Detects gems as you walk."
            granted={granted}
          />
          <PermCard
            icon={MicIcon}
            title="Microphone"
            description="Ask questions while walking."
            granted={granted}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <button
          style={{
            width: '100%',
            padding: '14px',
            background: granted ? colors.teal : 'rgba(245,247,242,0.1)',
            color: granted ? colors.mist : 'rgba(245,247,242,0.3)',
            border: 'none',
            borderRadius: 30,
            fontSize: 15,
            fontWeight: 600,
            cursor: granted ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          Continue →
        </button>
        <span style={{ fontSize: 10, color: colors.bark }}>
          Location only active while app is open.
        </span>
      </div>
    </div>
  )
}

export function ScreenPermsA() {
  return <ScreenPermsBase granted={false} />
}

export function ScreenPermsB() {
  return <ScreenPermsBase granted={true} />
}
