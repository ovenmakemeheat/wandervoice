import { colors, borders } from '../tokens'

interface HistoryTabProps {
  dark?: boolean
}

const HISTORY_ITEMS = [
  {
    time: '9:44',
    place: 'Hàng Bạc Silver St.',
    mode: 'Story',
    snippet: '…the silversmiths arrived from Châu Khê in 1428, carrying tools wrapped in…',
  },
  {
    time: '9:38',
    place: 'Bach Ma Temple',
    mode: 'Secrets',
    snippet: "…the well beneath the altar hasn't been mentioned in any official guide…",
  },
  {
    time: '9:21',
    place: 'Đồng Xuân Market',
    mode: 'Facts',
    snippet: '…opened in 1889 under French colonial administration, originally covering…',
  },
  {
    time: '9:05',
    place: 'Hoan Kiem Lake',
    mode: 'Story',
    snippet: '…the turtle surfaced three times before the sword was returned, according to…',
  },
]

export function HistoryTab({ dark = false }: HistoryTabProps) {
  return (
    <div
      style={{
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: colors.bark,
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        TODAY'S NARRATIVE
      </div>

      {HISTORY_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            padding: '9px 11px',
            borderRadius: 10,
            border: dark ? borders.borderD : borders.border,
            background: dark ? 'rgba(245,247,242,0.04)' : 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{ fontSize: 11, fontWeight: 600, color: dark ? colors.mist : colors.leaf }}
              >
                {item.place}
              </span>
              <div
                style={{
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: colors.teal,
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 500, color: colors.mist }}>{item.mode}</span>
              </div>
            </div>
            <span style={{ fontSize: 10, color: colors.bark }}>{item.time}</span>
          </div>
          <p
            style={{
              fontSize: 11,
              color: colors.bark,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {item.snippet}
          </p>
        </div>
      ))}
    </div>
  )
}
