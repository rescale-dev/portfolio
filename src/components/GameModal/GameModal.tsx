import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './GameModal.module.css'

type GameModalProps = {
  onClose: () => void
}

/** Full-screen overlay that runs the Satoru in Tokyo game in an iframe. */
export function GameModal({ onClose }: GameModalProps) {
  const isTouch = useIsTouch()
  const frameRef = useRef<HTMLIFrameElement>(null)

  // Load Press Start 2P only when the game modal is first opened.
  useEffect(() => {
    if (document.getElementById('press-start-2p-font')) return
    const link = document.createElement('link')
    link.id = 'press-start-2p-font'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
    document.head.appendChild(link)
  }, [])

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

  useEffect(() => {
    const t = setTimeout(() => frameRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

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
        aria-label="Close game"
      >
        {'×'}
      </button>
      <div
        className={`${styles.frame} ${closing ? styles.frameClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Satoru in Tokyo"
      >
        <iframe
          ref={frameRef}
          className={styles.game}
          src={isTouch ? '/satoru-in-tokyo.html?touch=1' : '/satoru-in-tokyo.html'}
          title="Satoru in Tokyo"
          width={480}
          height={640}
        />
      </div>
      <p className={styles.hint}>
        {isTouch
          ? '← → arrows to move · character auto-jumps · Tap outside to close'
          : 'Click the game, then use ← → and ↑ / Space · Esc to close'}
      </p>
    </div>
  )
}
