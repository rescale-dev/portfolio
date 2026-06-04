import { useEffect, useRef, useState } from 'react'
import styles from './PortfolioTitle.module.css'

type PortfolioTitleProps = {
  /** Called once the hero finishes (wordmark typed + welcome/subtitle settled). */
  onDone?: () => void
}

const PORT = 'PORT'
const FOLIO = 'FOLIO'
const WORDMARK_LEN = PORT.length + FOLIO.length

const START_DELAY = 1000
const CHAR_MS = 82
const FONT_FALLBACK_MS = 2500
const BOARD_DELAY = 580

const Caret = () => <span className={styles.caret} aria-hidden="true" />

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

  const portRevealed = Math.min(typed, PORT.length)
  const folioRevealed = Math.max(typed - PORT.length, 0)

  const portChars = [...PORT.slice(0, portRevealed)].map((ch, i) => (
    <span key={i} className={styles.char}>{ch}</span>
  ))

  const folioChars = [...FOLIO.slice(0, folioRevealed)].map((ch, i) => (
    <span key={i} className={styles.char}>{ch}</span>
  ))

  return (
    <div className={styles.root} aria-label="Welcome to my Portfolio — Graphic, Motion, AI">
      <div className={`${styles.top} ${typingDone ? styles.topShow : ''}`}>
        <span className={styles.welcome}>WELCOME TO MY</span>
        <span className={styles.kana} aria-hidden="true">
          デザイナー
        </span>
      </div>
      <h1 className={styles.wordmark}>
        <span className={styles.port}>{portChars}</span>
        <span className={styles.folio}>{folioChars}</span>
        {!typingDone && <Caret />}
      </h1>
      <p className={`${styles.subtitle} ${typingDone ? styles.subtitleShow : ''}`}>
        GRAPHIC • MOTION • AI
      </p>
    </div>
  )
}
