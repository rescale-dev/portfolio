import type { ReactNode } from 'react'
import { usePan } from '../../hooks/usePan'
import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './Canvas.module.css'

type CanvasProps = {
  children: ReactNode
  onFirstMove?: () => void
}

/** Base zoom of the board, so more of the layout is visible on first load. */
const BASE_SCALE = 0.8
/** Touch devices start a touch more zoomed-out so the board reads at a glance. */
const TOUCH_SCALE = 0.55
const TOUCH_MIN_SCALE = 0.35
const TOUCH_MAX_SCALE = 1.3

export function Canvas({ children, onFirstMove }: CanvasProps) {
  const isTouch = useIsTouch()
  const scale = isTouch ? TOUCH_SCALE : BASE_SCALE

  const { isDragging, layerRef, bgRef, bind } = usePan({
    scale,
    onFirstMove,
    enableZoom: isTouch,
    minScale: TOUCH_MIN_SCALE,
    maxScale: TOUCH_MAX_SCALE,
  })

  return (
    <div
      className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
      {...bind}
    >
      <div
        ref={bgRef}
        className={styles.dots}
        style={{ backgroundPosition: '0px 0px' }}
      />
      <div
        ref={layerRef}
        className={styles.layer}
        style={{ transform: `translate3d(0, 0, 0) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
