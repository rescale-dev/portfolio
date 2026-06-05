import { useDraggable } from '../../hooks/useDraggable'
import { useIsTouch } from '../../hooks/useIsTouch'
import type { AboutCardData } from '../../data/items'
import styles from './AboutCard.module.css'

type AboutCardProps = {
  data: AboutCardData
  revealed?: boolean
  revealDelay?: number
  onOpen?: () => void
  position?: { x: number; y: number }
  onPositionChange?: (pos: { x: number; y: number }) => void
}

export function AboutCard({ data, revealed = true, revealDelay = 0, onOpen, position, onPositionChange }: AboutCardProps) {
  const { title, thumbnail } = data
  const isTouch = useIsTouch()
  const pos = position ?? data.position
  const { elRef, wasDragged, handlers } = useDraggable(pos, onPositionChange)
  const dragHandlers = isTouch ? {} : handlers

  return (
    <div
      ref={elRef}
      className={styles.root}
      style={{
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
        cursor: !isTouch && onPositionChange ? 'grab' : undefined,
      }}
      onClick={() => { if (!wasDragged()) onOpen?.() }}
      {...dragHandlers}
    >
      <div
        className={`${styles.inner} ${revealed ? 'board-in' : 'board-hidden'}`}
        style={{ animationDelay: revealed ? `${revealDelay}s` : undefined }}
      >
        <div className={styles.card}>
          <div className={styles.head}>
            <h2 className={styles.title}>{title}</h2>
            <span className={styles.kana} aria-hidden="true">私について</span>
          </div>
          <div className={styles.thumbWrap}>
            <img className={styles.thumb} src={thumbnail} alt="Damian portrait" draggable={false} fetchPriority="high" />
          </div>
          <p className={styles.readmore}>
            Read More <span className={styles.arrow}>{'->'}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
