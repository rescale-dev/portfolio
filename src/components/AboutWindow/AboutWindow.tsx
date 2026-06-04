import { useCallback, useEffect, useState } from 'react'
import type { AboutCardData } from '../../data/items'
import styles from './AboutWindow.module.css'

type AboutWindowProps = {
  data: AboutCardData
  onClose: () => void
}

export function AboutWindow({ data, onClose }: AboutWindowProps) {
  const { bio = [], portrait } = data

  const [closing, setClosing] = useState(false)
  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 240)
  }, [closing, onClose])

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
      <div
        className={`${styles.window} ${closing ? styles.windowClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="About Damian"
      >
        <div className={styles.titlebar}>
          <div className={styles.lights}>
            <button
              type="button"
              className={`${styles.light} ${styles.red}`}
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
          <span className={styles.winTitle}>About Me</span>
        </div>

        <div className={styles.body}>
          <div className={styles.layout}>
            <div className={styles.textCol}>
              <h2 className={styles.headline}><span className={styles.headlineHello}>Hello,</span>{"\n"}I'm Damian.</h2>
              {bio.map((p, i) => (
                <p key={i} className={styles.para}>{p}</p>
              ))}
            </div>
            {portrait && (
              <div className={styles.photoWrap}>
                <img
                  className={styles.photo}
                  src={portrait}
                  alt="Damian — Fuji 6273"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
