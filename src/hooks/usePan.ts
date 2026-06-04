import { useCallback, useEffect, useRef, useState } from 'react'

type UsePanOptions = {
  /** Base zoom applied to the layer, kept in the transform string. */
  scale?: number
  /** Soft limit (px) for how far the canvas can be dragged from the origin in each axis. */
  bounds?: { x: number; y: number }
  /** Fired once, on the first time the user starts panning. */
  onFirstMove?: () => void
  /** Enable two-finger pinch-to-zoom (touch only). */
  enableZoom?: boolean
  /** Lower clamp for the zoom scale. */
  minScale?: number
  /** Upper clamp for the zoom scale. */
  maxScale?: number
}

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value))

const clampRange = (value: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, value))

const FRICTION = 0.92
const MIN_VELOCITY = 0.08
/** Pointer travel (px) before a press is treated as a drag rather than a click. */
const DRAG_THRESHOLD = 4

/**
 * Drag-to-pan for a Figma-like canvas.
 *
 * Writes the transform straight to the DOM (no React re-render per move) and
 * adds momentum so the board glides to a stop after release — both make the
 * panning feel smooth. Works with the left (button 0) and middle (button 1)
 * mouse buttons, plus touch. On touch devices `enableZoom` adds two-finger
 * pinch-to-zoom (zoom about the midpoint between the fingers).
 */
export function usePan({
  scale = 1,
  bounds = { x: 1400, y: 1000 },
  onFirstMove,
  enableZoom = false,
  minScale = 0.35,
  maxScale = 1.3,
}: UsePanOptions = {}) {
  const layerRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  const offset = useRef({ x: 0, y: 0 })
  const scaleRef = useRef(scale)
  const velocity = useRef({ x: 0, y: 0 })
  const startPointer = useRef({ x: 0, y: 0 })
  const lastPointer = useRef({ x: 0, y: 0 })
  const isPanning = useRef(false)
  /** Whether the current gesture has crossed the drag threshold (so a tap stays a click). */
  const draggedThisGesture = useRef(false)
  const hasMoved = useRef(false)
  const inertiaRaf = useRef<number | null>(null)

  // Multi-touch / pinch state.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinching = useRef(false)
  const pinchStartDist = useRef(0)
  const pinchStartScale = useRef(scale)
  /** World-space point under the pinch midpoint at gesture start (zoom anchor). */
  const pinchWorld = useRef({ x: 0, y: 0 })

  const [isDragging, setIsDragging] = useState(false)

  const apply = useCallback(() => {
    const { x, y } = offset.current
    const s = scaleRef.current
    if (layerRef.current) {
      layerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`
    }
    if (bgRef.current) {
      bgRef.current.style.backgroundPosition = `${x}px ${y}px`
    }
  }, [])

  // Keep the initial / scale-change transform in sync.
  useEffect(() => {
    scaleRef.current = scale
    apply()
  }, [apply, scale])

  const stopInertia = useCallback(() => {
    if (inertiaRaf.current !== null) {
      cancelAnimationFrame(inertiaRaf.current)
      inertiaRaf.current = null
    }
  }, [])

  const runInertia = useCallback(() => {
    const step = () => {
      velocity.current.x *= FRICTION
      velocity.current.y *= FRICTION

      offset.current.x = clamp(offset.current.x + velocity.current.x, bounds.x)
      offset.current.y = clamp(offset.current.y + velocity.current.y, bounds.y)
      apply()

      if (
        Math.abs(velocity.current.x) > MIN_VELOCITY ||
        Math.abs(velocity.current.y) > MIN_VELOCITY
      ) {
        inertiaRaf.current = requestAnimationFrame(step)
      } else {
        inertiaRaf.current = null
      }
    }
    inertiaRaf.current = requestAnimationFrame(step)
  }, [apply, bounds.x, bounds.y])

  /** Begin a pinch gesture from the two currently-tracked pointers. */
  const beginPinch = useCallback(() => {
    const pts = [...pointers.current.values()]
    if (pts.length < 2) return
    const [a, b] = pts
    const dist = Math.hypot(b.x - a.x, b.y - a.y)
    const midX = (a.x + b.x) / 2
    const midY = (a.y + b.y) / 2
    pinching.current = true
    pinchStartDist.current = dist || 1
    pinchStartScale.current = scaleRef.current
    // World point under the midpoint, so we can keep it pinned while scaling.
    pinchWorld.current = {
      x: (midX - offset.current.x) / scaleRef.current,
      y: (midY - offset.current.y) / scaleRef.current,
    }
    isPanning.current = false
    draggedThisGesture.current = false
    setIsDragging(false)
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
        stopInertia()
        if (enableZoom && pointers.current.size === 2) {
          beginPinch()
          return
        }
        if (pointers.current.size === 1) {
          isPanning.current = true
          draggedThisGesture.current = false
          velocity.current = { x: 0, y: 0 }
          startPointer.current = { x: e.clientX, y: e.clientY }
          lastPointer.current = { x: e.clientX, y: e.clientY }
        }
        return
      }

      // Mouse / pen — unchanged behaviour.
      if (e.button !== 0 && e.button !== 1) return
      if (e.button === 1) e.preventDefault()

      stopInertia()
      isPanning.current = true
      draggedThisGesture.current = false
      velocity.current = { x: 0, y: 0 }
      startPointer.current = { x: e.clientX, y: e.clientY }
      lastPointer.current = { x: e.clientX, y: e.clientY }
      // Don't capture the pointer or flag dragging yet — wait for real movement,
      // so a plain tap stays a click and reaches the card underneath.
    },
    [stopInertia, enableZoom, beginPinch],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Keep the tracked position fresh for touch pointers.
      if (e.pointerType === 'touch' && pointers.current.has(e.pointerId)) {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      }

      // Pinch-zoom takes over while two fingers are down.
      if (pinching.current) {
        const pts = [...pointers.current.values()]
        if (pts.length < 2) return
        const [a, b] = pts
        const dist = Math.hypot(b.x - a.x, b.y - a.y)
        const midX = (a.x + b.x) / 2
        const midY = (a.y + b.y) / 2
        const next = clampRange(
          (pinchStartScale.current * dist) / pinchStartDist.current,
          minScale,
          maxScale,
        )
        scaleRef.current = next
        // Pin the world anchor under the current midpoint.
        offset.current.x = clamp(midX - pinchWorld.current.x * next, bounds.x)
        offset.current.y = clamp(midY - pinchWorld.current.y * next, bounds.y)
        apply()
        return
      }

      if (!isPanning.current) return

      // Until the press travels past the threshold, treat it as a potential click.
      if (!draggedThisGesture.current) {
        const movedX = e.clientX - startPointer.current.x
        const movedY = e.clientY - startPointer.current.y
        if (Math.hypot(movedX, movedY) < DRAG_THRESHOLD) return

        draggedThisGesture.current = true
        setIsDragging(true)
        try {
          ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        } catch {
          // Ignore: synthetic/inactive pointers can't be captured.
        }
        if (!hasMoved.current) {
          hasMoved.current = true
          onFirstMove?.()
        }
      }

      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }

      offset.current.x = clamp(offset.current.x + dx, bounds.x)
      offset.current.y = clamp(offset.current.y + dy, bounds.y)
      // Track the latest movement to seed momentum on release.
      velocity.current = { x: dx, y: dy }
      apply()
    },
    [apply, bounds.x, bounds.y, onFirstMove, minScale, maxScale],
  )

  const end = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') {
        pointers.current.delete(e.pointerId)

        if (pinching.current) {
          // Leaving pinch. If one finger remains, resume panning from it.
          if (pointers.current.size === 1) {
            const [p] = [...pointers.current.values()]
            pinching.current = false
            isPanning.current = true
            draggedThisGesture.current = false
            velocity.current = { x: 0, y: 0 }
            startPointer.current = { x: p.x, y: p.y }
            lastPointer.current = { x: p.x, y: p.y }
          } else if (pointers.current.size === 0) {
            pinching.current = false
            setIsDragging(false)
          }
          return
        }
      }

      if (!isPanning.current) return
      isPanning.current = false

      // A press that never crossed the threshold is a click — leave it for the card.
      if (!draggedThisGesture.current) return

      setIsDragging(false)
      const el = e.currentTarget as HTMLElement
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
      runInertia()
    },
    [runInertia],
  )

  useEffect(() => stopInertia, [stopInertia])

  return {
    isDragging,
    layerRef,
    bgRef,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerLeave: end,
      onPointerCancel: end,
    },
  }
}
