import type { ReactNode } from 'react'
import styles from './ToolRail.module.css'

/* Cloud Design mascot, recreated as pixel-art SVG. Swap for the real asset if you prefer. */
function CloudDesignLogo() {
  const c = '#bd7c5f'
  return (
    <svg viewBox="0 0 36 30" aria-hidden="true">
      {/* ears */}
      <rect x="0" y="9" width="6" height="7" fill={c} />
      <rect x="30" y="9" width="6" height="7" fill={c} />
      {/* body */}
      <rect x="6" y="2" width="24" height="21" fill={c} />
      {/* legs */}
      <rect x="6" y="23" width="5" height="6" fill={c} />
      <rect x="15" y="23" width="6" height="6" fill={c} />
      <rect x="25" y="23" width="5" height="6" fill={c} />
      {/* eyes */}
      <rect x="10" y="8" width="5" height="5" fill="#0a0a0a" />
      <rect x="21" y="8" width="5" height="5" fill="#0a0a0a" />
    </svg>
  )
}

function FigmaLogo() {
  return (
    <svg viewBox="0 0 38 57" aria-hidden="true">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  )
}

type Tool = {
  name: string
  /** Adobe app-style lettered badge. */
  badge?: { label: string; bg: string; fg: string }
  /** Custom logo node rendered on a white tile. */
  logo?: ReactNode
}

const tools: Tool[] = [
  { name: 'Adobe Photoshop', badge: { label: 'Ps', bg: '#001E36', fg: '#31A8FF' } },
  { name: 'Adobe Illustrator', badge: { label: 'Ai', bg: '#330000', fg: '#FF9A00' } },
  { name: 'Cloud Design', logo: <CloudDesignLogo /> },
  { name: 'Figma', logo: <FigmaLogo /> },
  { name: 'Adobe After Effects', badge: { label: 'Ae', bg: '#00005B', fg: '#9999FF' } },
]

export function ToolRail() {
  return (
    <div className={`${styles.root} intro-fade`}>
      <span className={styles.label}>my tools</span>
      <div className={styles.rail} role="list" aria-label="Tools">
        {tools.map((t) => (
          <div
            key={t.name}
            role="listitem"
            className={`${styles.tool} ${t.logo ? styles.tile : ''}`}
            style={t.badge ? { background: t.badge.bg, color: t.badge.fg } : undefined}
          >
            {t.badge ? t.badge.label : t.logo}
            <span className={styles.tooltip}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
