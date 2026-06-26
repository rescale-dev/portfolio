import { useDraggable } from '../../hooks/useDraggable'
import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './GameLauncher.module.css'

type GameLauncherProps = {
  onOpen: () => void
  position: { x: number; y: number }
  onPositionChange?: (pos: { x: number; y: number }) => void
  revealed?: boolean
  revealDelay?: number
}

/** macOS-style app icon on the board that launches the Satoru in Tokyo game. */
export function GameLauncher({ onOpen, position, onPositionChange, revealed = true, revealDelay = 0 }: GameLauncherProps) {
  const isTouch = useIsTouch()
  const { elRef, wasDragged, handlers } = useDraggable(position, onPositionChange)
  const dragHandlers = isTouch ? {} : handlers

  return (
    <div
      ref={elRef}
      className={styles.root}
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        cursor: !isTouch && onPositionChange ? 'grab' : undefined,
      }}
      onClick={() => { if (!wasDragged()) onOpen() }}
      role="button"
      aria-label="Play Satoru in Tokyo"
      {...dragHandlers}
    >
      <div
        className={`${styles.inner} ${revealed ? 'board-in' : 'board-hidden'}`}
        style={{ animationDelay: revealed ? `${revealDelay}s` : undefined }}
      >
      <div className={styles.icon} aria-hidden="true">
        <div className={styles.scene}>
          <span className={styles.moon} />
          <div className={styles.skyline} />
          <div className={styles.plat} style={{ left: '14%', bottom: '24%' }} />
          <div className={styles.plat} style={{ left: '56%', bottom: '46%', width: '30%' }} />
          <div className={styles.cat}>
            <span className={styles.eye} style={{ left: '4px' }} />
            <span className={styles.eye} style={{ right: '4px' }} />
          </div>
          <span className={styles.scan} />
        </div>
        <span className={styles.gloss} />
        <span className={styles.play}>▶</span>
      </div>

      <p className={styles.title}>Satoru in Tokyo</p>
      <div className={styles.tags}>
        <span className={styles.tag}>Arcade</span>
        <span className={styles.tag}>Tokyo</span>
      </div>
      </div>
    </div>
  )
}
