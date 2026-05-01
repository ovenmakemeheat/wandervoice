import { colors, borders } from '../tokens'

interface InfoTabProps {
  dark?: boolean
}

const INFO_ROWS = [
  ['Type', 'Jewellery guild district'],
  ['District', 'Hoàn Kiếm, Hanoi'],
  ['Length', '450 m'],
  ['Founded by', 'Silversmiths of Châu Khê'],
]

export function InfoTab({ dark = false }: InfoTabProps) {
  const dividerColor = dark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.10)'

  return (
    <div
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 700, color: dark ? colors.mist : colors.leaf }}>
        Hàng Bạc Silver Street
      </div>
      <div style={{ fontSize: 12, color: colors.bark }}>Est. 1428</div>

      <div style={{ height: 1, background: dividerColor, margin: '4px 0' }} />

      {INFO_ROWS.map(([k, v]) => (
        <div
          key={k}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
        >
          <span style={{ fontSize: 11, color: colors.bark }}>{k}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: dark ? colors.mist : colors.leaf }}>
            {v}
          </span>
        </div>
      ))}

      <div style={{ height: 1, background: dividerColor, margin: '4px 0' }} />

      <p
        style={{
          fontSize: 12,
          color: colors.bark,
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        The street was established under the Lê dynasty guild system. Artisans migrated from Châu
        Khê village to produce silverwork and, later, coins for the royal court.
      </p>
    </div>
  )
}
