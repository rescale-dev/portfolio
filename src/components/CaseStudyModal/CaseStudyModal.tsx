import { useCallback, useEffect, useState } from 'react'
import type { CaseStudy } from '../../data/items'
import styles from './CaseStudyModal.module.css'

type CaseStudyModalProps = {
  study: CaseStudy
  onClose: () => void
}

/** Full case study opened in a large, scrollable modal over a blurred backdrop. */
export function CaseStudyModal({ study, onClose }: CaseStudyModalProps) {
  const { client, category, year, cover, intro, metrics, sections, gallery } = study

  // Play the exit animation before unmounting (mirrors the open animation).
  const [closing, setClosing] = useState(false)
  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 240)
  }, [closing, onClose])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  return (
    <div
      className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`}
      onClick={handleClose}
      role="presentation"
    >
      <button
        type="button"
        className={styles.close}
        onClick={handleClose}
        aria-label="Close"
      >
        {'×'}
      </button>
      <article
        className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={client}
      >
        <div className={styles.hero}>
          <img className={styles.heroImg} src={cover} alt={client} draggable={false} />
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span>{category}</span>
            {year && <span className={styles.dot} aria-hidden="true">•</span>}
            {year && <span>{year}</span>}
          </div>
          <h2 className={styles.title}>{client}</h2>
          <p className={styles.intro}>{intro}</p>

          {metrics && metrics.length > 0 && (
            <div className={styles.metrics}>
              {metrics.map((m) => (
                <div key={m.label} className={styles.metric}>
                  <span className={styles.metricValue}>{m.value}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {sections.map((s) => (
            <section key={s.heading} className={styles.section}>
              <h3 className={styles.sectionTitle}>{s.heading}</h3>
              <p className={styles.sectionBody}>{s.body}</p>
            </section>
          ))}

          {gallery && gallery.length > 0 && (
            <div className={styles.gallery}>
              {gallery.map((src) => (
                <img key={src} className={styles.galleryImg} src={src} alt={client} draggable={false} loading="lazy" />
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
