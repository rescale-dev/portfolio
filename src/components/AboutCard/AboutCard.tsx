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
          <img
            className={styles.badge}
            src={thumbnail}
            alt={title.replace('\n', ' ')}
            draggable={false}
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  )
}
