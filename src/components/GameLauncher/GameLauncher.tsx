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

/** Pixel-art arcade tile on the board that launches the Satoru in Tokyo game. */
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
      <div className={styles.cabinet}>
        <div className={styles.screen} aria-hidden="true">
          <div className={styles.plat} style={{ left: '16%', bottom: '20%' }} />
          <div className={styles.plat} style={{ left: '54%', bottom: '44%', width: '30%' }} />
          <div className={styles.cat}>
            <span className={styles.eye} style={{ left: '4px' }} />
            <span className={styles.eye} style={{ right: '4px' }} />
          </div>
          <span className={styles.scan} />
        </div>
        <div className={styles.marquee}>SATORU</div>
        <div className={styles.play}>▶ PLAY</div>
      </div>

      <p className={styles.title}>Satoru in Tokyo</p>
      <div className={styles.tags}>
        <span className={styles.tag}>ARCADE</span>
        <span className={styles.tag}>TOKYO</span>
      </div>
      </div>
    </div>
  )
}
