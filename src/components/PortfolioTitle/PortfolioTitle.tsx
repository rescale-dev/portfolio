import { useEffect, useRef, useState } from 'react'
import styles from './PortfolioTitle.module.css'
import { useTheme } from '../../hooks/useTheme'

type PortfolioTitleProps = {
  /** Called once the hero finishes (wordmark typed + welcome/subtitle settled). */
  onDone?: () => void
}

// The wordmark is "portfolio", lowercase. Its middle "o" is replaced by a
// working light/dark toggle, so we type the two letter runs around it and
// reveal the toggle in the "o" slot.
const LEFT = 'portf'
const RIGHT = 'lio'
// One slot for each left letter, one for the toggle, one for each right letter.
const TOGGLE_SLOT = LEFT.length
const WORDMARK_LEN = LEFT.length + 1 + RIGHT.length

const START_DELAY = 1000
const CHAR_MS = 82
const FONT_FALLBACK_MS = 2500
const BOARD_DELAY = 580

const Caret = () => <span className={styles.caret} aria-hidden="true" />

// Sun / moon glyphs, drawn in the toggle's user-space and centred on the knob
// (1011.6, 308.1). They ride inside the knob group, so they slide with it.
const sunGlyph = (
  <g className={styles.toggleIcon} transform="translate(1004 308.1) scale(4.3) translate(-12 -12)">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </g>
)

const moonGlyph = (
  <g className={styles.toggleIcon} transform="translate(1004 308.1) scale(4.3) translate(-12 -12)">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </g>
)

/** The "o"-shaped theme switch, rebuilt 1:1 from the source SVG: a gradient
    glow ring, a filled gradient track, a white inner groove, and the knob
    (added here) that slides left↔right and swaps the sun/moon glyph. */
function WordmarkToggle({ revealed }: { revealed: boolean }) {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`${styles.toggle} ${revealed ? styles.toggleShow : ''}`}
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {/* viewBox crops the source design to the toggle, padded for the knob. */}
      <svg className={styles.toggleSvg} viewBox="876 183 424 250" aria-hidden="true">
        <defs>
          <linearGradient id="wmRing" x1="895" y1="308.1" x2="1288.2" y2="308.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#bd7fea" />
            <stop offset="1" stopColor="#6c7cf1" />
          </linearGradient>
          <linearGradient id="wmTrack" x1="905.7" y1="308.1" x2="1277.4" y2="308.1" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a95fff" />
            <stop offset="1" stopColor="#5458fe" />
          </linearGradient>
          <filter id="wmKnobShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="7" stdDeviation="13" floodColor="#1b1d2b" floodOpacity="0.3" />
          </filter>
          {/* Punches the groove out of the gradient body so the page background
              shows through the slot (white in light, dark in dark). */}
          <mask id="wmGroove">
            <rect x="876" y="183" width="424" height="250" fill="#fff" />
            <rect x="952.2" y="248.7" width="278.9" height="118.8" rx="59.4" fill="#000" />
          </mask>
        </defs>
        {/* Gradient body (soft outer ring + track) with the groove cut out. */}
        <g mask="url(#wmGroove)">
          <rect x="895" y="198.2" width="393.2" height="219.8" rx="109.9" fill="url(#wmRing)" />
          <rect x="905.7" y="210.1" width="371.7" height="196" rx="98" fill="url(#wmTrack)" />
        </g>
        {/* Knob + glyph (added): sits flush-left for light, slides right for dark. */}
        <g className={`${styles.toggleKnob} ${isDark ? styles.toggleKnobDark : ''}`}>
          <circle cx="1004" cy="308.1" r="95" fill="#fdfdfe" filter="url(#wmKnobShadow)" />
          {isDark ? moonGlyph : sunGlyph}
        </g>
      </svg>
    </button>
  )
}

export function PortfolioTitle({ onDone }: PortfolioTitleProps) {
  const [ready, setReady] = useState(false)
  const [typed, setTyped] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    let done = false
    const go = () => {
      if (!done) {
        done = true
        setReady(true)
      }
    }
    const fonts = document.fonts
    if (fonts?.load) {
      Promise.all([fonts.load('900 1em Satoshi'), fonts.load('300 1em Satoshi')])
        .then(() => fonts.ready)
        .then(go)
        .catch(go)
    } else {
      go()
    }
    const t = window.setTimeout(go, FONT_FALLBACK_MS)
    return () => {
      done = true
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    let raf = 0
    const startAt = performance.now() + START_DELAY
    const tick = (now: number) => {
      const elapsed = now - startAt
      const n = elapsed <= 0 ? 0 : Math.min(WORDMARK_LEN, Math.floor(elapsed / CHAR_MS) + 1)
      setTyped(n)
      if (n < WORDMARK_LEN) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  const typingDone = ready && typed >= WORDMARK_LEN

  useEffect(() => {
    if (!typingDone) return
    const id = window.setTimeout(() => onDoneRef.current?.(), BOARD_DELAY)
    return () => clearTimeout(id)
  }, [typingDone])

  const leftRevealed = Math.min(typed, LEFT.length)
  const toggleRevealed = typed > TOGGLE_SLOT
  const rightRevealed = Math.max(typed - TOGGLE_SLOT - 1, 0)

  const leftChars = [...LEFT.slice(0, leftRevealed)].map((ch, i) => (
    <span key={i} className={styles.char}>{ch}</span>
  ))

  const rightChars = [...RIGHT.slice(0, rightRevealed)].map((ch, i) => (
    <span key={i} className={styles.char}>{ch}</span>
  ))

  return (
    <div className={styles.root} aria-label="Welcome to my Portfolio — Graphic, Motion, AI">
      <div className={`${styles.top} ${typingDone ? styles.topShow : ''}`}>
        <span className={styles.welcome}>WELCOME TO MY</span>
      </div>
      <h1 className={styles.wordmark}>
        <span className={styles.word}>{leftChars}</span>
        {toggleRevealed && <WordmarkToggle revealed={toggleRevealed} />}
        <span className={styles.word}>{rightChars}</span>
        {!typingDone && <Caret />}
      </h1>
      <p className={`${styles.subtitle} ${typingDone ? styles.subtitleShow : ''}`}>
        GRAPHIC • MOTION • AI
      </p>
    </div>
  )
}
