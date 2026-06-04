import { useEffect, useState } from 'react'

const QUERY = '(pointer: coarse)'

/**
 * True on touch-primary devices (phones, touch tablets). Used to switch the
 * board into its touch experience (pinch-zoom, finger-pan, no per-item drag)
 * while leaving the mouse/desktop behaviour untouched.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true,
  )

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(QUERY)
    const onChange = () => setIsTouch(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isTouch
}
