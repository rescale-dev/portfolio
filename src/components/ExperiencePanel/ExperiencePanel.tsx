import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './ExperiencePanel.module.css'

export type ExperienceEntry = {
  role: string
  company: string
  period: string
  bullets: string[]
}

type ExperiencePanelProps = {
  entries: ExperienceEntry[]
  onClose: () => void
}

export function ExperiencePanel({ entries, onClose }: ExperiencePanelProps) {
  const [closing, setClosing] = useState(false)
  const [canScrollMore, setCanScrollMore] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 320)
  }, [closing, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const check = () => {
      setCanScrollMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [])

  return (
    <>
      <div
        className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`}
        onClick={handleClose}
        role="presentation"
      />
      <aside
        className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}
        role="complementary"
        aria-label="Experience"
      >
        <div className={styles.header}>
          <h2 className={styles.heading}>Experience</h2>
          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            aria-label="Close"
          >
            {'×'}
          </button>
        </div>

        <div className={styles.bodyWrap}>
          <div className={styles.body} ref={bodyRef}>
            {entries.map((entry, i) => (
              <div key={i} className={styles.entry}>
                <div className={styles.entryHead}>
                  <span className={styles.role}>{entry.role}</span>
                  <span className={styles.meta}>{entry.company} · {entry.period}</span>
                </div>
                <ul className={styles.list}>
                  {entry.bullets.map((b, j) => (
                    <li key={j} className={styles.bullet}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {canScrollMore && (
            <div className={styles.scrollHint} aria-hidden="true">
              <span className={styles.scrollArrow}>↓</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
