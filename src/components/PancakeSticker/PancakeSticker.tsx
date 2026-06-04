import { useRef } from 'react'
import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './PancakeSticker.module.css'

const CANVAS_SCALE = 0.8
const DRAG_THRESHOLD = 4

type PancakeStickerProps = {
  onOpen: () => void
  onPositionChange?: (pos: { x: number; y: number }) => void
  position: { x: number; y: number }
  revealed?: boolean
  revealDelay?: number
}

/** Draggable die-cut sticker on the pinboard that opens the pancake recipe. */
export function PancakeSticker({ onOpen, onPositionChange, position, revealed = true, revealDelay = 0 }: PancakeStickerProps) {
  const isTouch = useIsTouch()
  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const startPtr = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation() // prevent canvas from panning
    dragging.current = true
    didDrag.current = false
    startPtr.current = { x: e.clientX, y: e.clientY }
    startPos.current = { ...position }
    rootRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    e.stopPropagation()
    const dx = e.clientX - startPtr.current.x
    const dy = e.clientY - startPtr.current.y
    if (!didDrag.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    didDrag.current = true
    onPositionChange?.({
      x: startPos.current.x + dx / CANVAS_SCALE,
      y: startPos.current.y + dy / CANVAS_SCALE,
    })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    e.stopPropagation()
    dragging.current = false
    try { rootRef.current?.releasePointerCapture(e.pointerId) } catch { /* noop */ }
    if (!didDrag.current) onOpen()
  }

  // On touch, let pointer events flow to the canvas (finger-pan / pinch) and
  // open on a plain tap; on desktop keep the drag-to-move behaviour.
  const interaction = isTouch
    ? { onClick: onOpen }
    : { onPointerDown, onPointerMove, onPointerUp }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
      }}
      {...interaction}
      role="button"
      aria-label="Open pancake recipe"
    >
      <div
        className={`${styles.inner} ${revealed ? 'board-in' : 'board-hidden'}`}
        style={{ animationDelay: revealed ? `${revealDelay}s` : undefined }}
      >
        <div className={styles.sticker}>
          <img className={styles.img} src="/pancakes.png" alt="Fluffy pancakes" draggable={false} />
        </div>
        <span className={styles.tooltip} aria-hidden="true">Recipe?</span>
      </div>
    </div>
  )
}
