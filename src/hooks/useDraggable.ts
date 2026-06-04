import { useRef } from 'react'

const CANVAS_SCALE = 0.8
const DRAG_THRESHOLD = 4

/**
 * Shared drag handler for board items. Stops propagation so the Canvas
 * panning doesn't fire while dragging an individual card.
 */
export function useDraggable(
  position: { x: number; y: number },
  onPositionChange?: (pos: { x: number; y: number }) => void,
) {
  const elRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const startPtr = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    dragging.current = true
    didDrag.current = false
    startPtr.current = { x: e.clientX, y: e.clientY }
    startPos.current = { ...position }
    elRef.current?.setPointerCapture(e.pointerId)
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
    try { elRef.current?.releasePointerCapture(e.pointerId) } catch { /* noop */ }
  }

  return {
    elRef,
    wasDragged: () => didDrag.current,
    handlers: { onPointerDown, onPointerMove, onPointerUp },
  }
}
