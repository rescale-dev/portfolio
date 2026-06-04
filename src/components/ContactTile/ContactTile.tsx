import { useState, useRef, useCallback } from 'react'
import styles from './ContactTile.module.css'

const EMAIL = 'damian.tylus2001r@gmail.com'
const PHONE = '+48 730 996 641'
const LINKEDIN = 'https://www.linkedin.com/in/damiantylus/'
const INSTAGRAM = 'https://www.instagram.com/dam1an0z/'

type Tooltip = 'email' | 'phone' | null

export function ContactTile() {
  const [tooltip, setTooltip] = useState<Tooltip>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showTooltip = useCallback((which: Tooltip) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTooltip(which)
    timerRef.current = setTimeout(() => setTooltip(null), 2000)
  }, [])

  const handleEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(EMAIL).catch(() => {})
    showTooltip('email')
  }, [showTooltip])

  const handlePhone = useCallback(() => {
    showTooltip('phone')
  }, [showTooltip])

  return (
    <div className={`${styles.root} intro-fade`}>
      {/* Email — copy to clipboard */}
      <div className={styles.emailWrap}>
        <button type="button" className={styles.email} onClick={handleEmail} aria-label="Copy email">
          <svg className={styles.mailIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7v10h16V7l-8 5.2z" />
          </svg>
          <span className={styles.emailText}>{EMAIL}</span>
        </button>
        {tooltip === 'email' && (
          <span className={styles.tooltip} role="status">Copied!</span>
        )}
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.icons}>
        {/* LinkedIn — open in new tab */}
        <a
          className={`${styles.icon} ${styles.linkedin}`}
          href={LINKEDIN}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
          </svg>
        </a>

        {/* Phone — show number tooltip */}
        <div className={styles.phoneWrap}>
          <button
            type="button"
            className={`${styles.icon} ${styles.phone}`}
            onClick={handlePhone}
            aria-label="Phone number"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </button>
          {tooltip === 'phone' && (
            <span className={styles.tooltip} role="status">{PHONE}</span>
          )}
        </div>

        {/* Instagram — open in new tab */}
        <a
          className={`${styles.icon} ${styles.instagram}`}
          href={INSTAGRAM}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
