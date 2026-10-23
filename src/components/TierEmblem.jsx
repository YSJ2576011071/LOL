import { useId } from 'react'

// 티어 순위(rank)에 따라 장식이 늘어나는 SVG 엠블럼
export default function TierEmblem({ tier, size = 64, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [dark, light] = tier.gradient
  const fill = `url(#tier-fill-${uid})`
  const hasWings = tier.rank >= 4
  const hasCrown = tier.rank >= 8

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 ${tier.rank >= 8 ? 10 : 6}px ${light}55)` }}
    >
      <defs>
        <linearGradient id={`tier-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`tier-gem-${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>

      {hasWings && (
        <g fill={fill} opacity="0.85">
          <polygon points="12,34 0,24 4,52 12,62" />
          <polygon points="88,34 100,24 96,52 88,62" />
        </g>
      )}
      {hasCrown && (
        <polygon
          points="30,16 36,0 44,12 50,-2 56,12 64,0 70,16"
          transform="translate(0 4)"
          fill={fill}
        />
      )}

      <polygon points="50,8 86,28 86,70 50,92 14,70 14,28" fill={fill} stroke="#0b0f17" strokeWidth="2" />
      <polygon points="50,20 75,34 75,64 50,79 25,64 25,34" fill="#070b13" opacity="0.82" />
      <polygon points="50,30 63,49 50,68 37,49" fill={`url(#tier-gem-${uid})`} />
      {tier.rank >= 10 && <circle cx="50" cy="49" r="4" fill="#fff" opacity="0.9" />}
    </svg>
  )
}
