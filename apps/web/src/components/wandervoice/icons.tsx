import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
  style?: CSSProperties
}

const Icon = ({
  d,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.8,
  viewBox = '0 0 24 24',
  fill = 'none',
  style,
}: IconProps & { d: string; viewBox?: string; fill?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d={d} />
  </svg>
)

export const HomeIcon = (p: IconProps) => (
  <Icon d="M3 12L12 3l9 9M5 10v10h5v-6h4v6h5V10" {...p} />
)

export const GemIcon = (p: IconProps) => (
  <Icon
    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    {...p}
  />
)

export const BarsIcon = (p: IconProps) => (
  <Icon d="M4 18v-6M9 18V6M14 18v-8M19 18v-4" {...p} />
)

export const PersonIcon = (p: IconProps) => (
  <Icon
    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
    {...p}
  />
)

export const MicIcon = (p: IconProps) => (
  <Icon
    d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
    {...p}
  />
)

export const ChatIcon = (p: IconProps) => (
  <Icon
    d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
    {...p}
  />
)

export const HeartIcon = (p: IconProps) => (
  <Icon
    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
    {...p}
  />
)

export const ShareIcon = (p: IconProps) => (
  <Icon
    d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
    {...p}
  />
)

export const BackIcon = (p: IconProps) => (
  <Icon d="M19 12H5M12 19l-7-7 7-7" {...p} />
)

export const CheckIcon = (p: IconProps) => (
  <Icon d="M20 6L9 17l-5-5" {...p} />
)

export const CloseIcon = (p: IconProps) => (
  <Icon d="M18 6L6 18M6 6l12 12" {...p} />
)

export const ChevronIcon = (p: IconProps) => (
  <Icon d="M9 18l6-6-6-6" {...p} />
)

export const ClockIcon = (p: IconProps) => (
  <Icon d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2" {...p} />
)

export const PauseIcon = ({ size = 18, color = 'currentColor', style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
    style={style}
  >
    <path d="M6 4h4v16H6zM14 4h4v16h-4" />
  </svg>
)

export const PlayIcon = ({ size = 18, color = 'currentColor', style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
    style={style}
  >
    <path d="M5 3l14 9-14 9V3z" />
  </svg>
)

export const MapPinIcon = (p: IconProps) => (
  <Icon
    d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 10a1 1 0 100-2 1 1 0 000 2z"
    {...p}
  />
)

export const SearchIcon = (p: IconProps) => (
  <Icon
    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    {...p}
  />
)

// Diamond / Gem marker used on map and lists
export const DiamondMarker = ({
  size = 10,
  color,
  style,
}: {
  size?: number
  color: string
  style?: CSSProperties
}) => (
  <div
    style={{
      width: size,
      height: size,
      background: color,
      transform: 'rotate(45deg)',
      borderRadius: 2,
      flexShrink: 0,
      ...style,
    }}
  />
)
