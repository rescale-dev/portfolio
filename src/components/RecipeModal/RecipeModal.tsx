import { useCallback, useEffect, useState } from 'react'
import styles from './RecipeModal.module.css'

type RecipeModalProps = {
  onClose: () => void
}

const SOURCE_URL = 'https://gymbeam.pl/blog/przepis-fitness-japonskie-puszyste-placuszki/'

const batter = [
  '30 g vanilla protein powder',
  '25 g plain flour',
  '20 ml skimmed milk',
  '5 g xylitol',
  '2 eggs',
  '2 g baking powder',
  'A few drops of vanilla flavour',
  'Cooking oil spray',
]

const topping = [
  '125 g low-fat cottage cheese',
  '5 g maple syrup',
  '5 g dark chocolate',
  'A few drops of vanilla flavour',
]

type Step = { art: JSX.Element; title: string; body: string }

const steps: Step[] = [
  {
    art: <EggSplitArt />,
    title: 'Separate the eggs',
    body: 'Split the yolks from the whites. Whisk the yolks until dense and noticeably lighter in colour.',
  },
  {
    art: <FoldDryArt />,
    title: 'Add the dry mix',
    body: 'Gently fold in the flour, protein powder and baking powder with a spatula until smooth.',
  },
  {
    art: <PeaksArt />,
    title: 'Whip the whites',
    body: 'In a separate bowl, beat the egg whites with xylitol and vanilla drops until stiff peaks form.',
  },
  {
    art: <FoldArt />,
    title: 'Fold together',
    body: 'Carefully fold the whites into the yolk mixture so the batter stays light and airy.',
  },
  {
    art: <PanArt />,
    title: 'Cook low & covered',
    body: 'Spray the pan with oil and ladle the batter into tall rounds. Cook covered for 3 minutes per side.',
  },
  {
    art: <ServeArt />,
    title: 'Top & serve',
    body: 'Blend the cottage cheese with maple syrup, vanilla and grated chocolate. Spoon over and serve right away.',
  },
]

export function RecipeModal({ onClose }: RecipeModalProps) {
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 240)
  }, [closing, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  return (
    <div
      className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={`${styles.window} ${closing ? styles.windowClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Japanese fluffy pancakes recipe"
      >
        <div className={styles.titlebar}>
          <div className={styles.lights}>
            <button
              type="button"
              className={`${styles.light} ${styles.red}`}
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
          <span className={styles.winTitle}>Recipe</span>
        </div>

        <div className={styles.body}>
          {/* Hero */}
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <span className={styles.kana}>ホットケーキ</span>
              <h2 className={styles.headline}>Japanese Fluffy Pancakes</h2>
              <p className={styles.lede}>
                Tall, jiggly, soufflé-style pancakes with a high-protein twist. Whipped egg
                whites do the heavy lifting, so they rise cloud-soft.
              </p>
              <div className={styles.meta}>
                <span className={styles.chip}>⏱ ~25 min</span>
                <span className={styles.chip}>🥞 10 pancakes</span>
                <span className={styles.chip}>🔥 505 kcal total</span>
              </div>
            </div>
            <div className={styles.heroImgWrap}>
              <img className={styles.heroImg} src="/pancakes.webp" alt="Stack of fluffy pancakes" draggable={false} />
            </div>
          </div>

          {/* Ingredients */}
          <div className={styles.ingredients}>
            <div className={styles.ingCol}>
              <h3 className={styles.colTitle}>Batter</h3>
              <ul className={styles.list}>
                {batter.map((b) => (
                  <li key={b} className={styles.item}>{b}</li>
                ))}
              </ul>
            </div>
            <div className={styles.ingCol}>
              <h3 className={styles.colTitle}>Topping</h3>
              <ul className={styles.list}>
                {topping.map((t) => (
                  <li key={t} className={styles.item}>{t}</li>
                ))}
              </ul>
              <div className={styles.nutrition}>
                <span className={styles.nutLabel}>Per full batch</span>
                <div className={styles.nutRow}>
                  <span><b>55 g</b> protein</span>
                  <span><b>33 g</b> carbs</span>
                  <span><b>17 g</b> fat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Method with illustrations */}
          <h3 className={styles.methodTitle}>How to make them</h3>
          <div className={styles.steps}>
            {steps.map((s, i) => (
              <div key={s.title} className={styles.step}>
                <div className={styles.stepArt}>{s.art}</div>
                <div className={styles.stepText}>
                  <span className={styles.stepNum}>Step {i + 1}</span>
                  <h4 className={styles.stepHeading}>{s.title}</h4>
                  <p className={styles.stepBody}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Source */}
          <a className={styles.source} href={SOURCE_URL} target="_blank" rel="noreferrer">
            View the original recipe
            <span className={styles.sourceArrow}>{'->'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Step illustrations (inline SVG, warm pancake palette) ───────────────── */

const AMBER = '#f0922e'
const AMBER_D = '#d9762a'
const CREAM = '#fff3df'
const INK = '#3a2a1a'

function EggSplitArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M10 30c0-4 6-6 10-6 3 0 6 1 6 1l-2 9c-4 3-14 2-14-4z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M54 30c0-4-6-6-10-6-3 0-6 1-6 1l2 9c4 3 14 2 14-4z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="40" r="9" fill={AMBER} stroke={INK} strokeWidth="2" />
      <circle cx="29" cy="37" r="2.6" fill={CREAM} opacity="0.8" />
    </svg>
  )
}

function FoldDryArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="26" cy="18" r="3" fill={CREAM} stroke={INK} strokeWidth="1.6" />
      <circle cx="36" cy="14" r="2.4" fill={CREAM} stroke={INK} strokeWidth="1.6" />
      <circle cx="44" cy="20" r="2" fill={CREAM} stroke={INK} strokeWidth="1.6" />
      <path d="M12 34h40l-5 16a6 6 0 0 1-6 5H23a6 6 0 0 1-6-5L12 34z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 34h46" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M40 27c-6 4-10 4-16 0" stroke={AMBER_D} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PeaksArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 34c3-3 4-10 7-10s3 7 6 7 4-9 7-9 3 8 6 8 4-6 6-4" fill="none" stroke={AMBER} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 36h40l-4 14a6 6 0 0 1-6 5H22a6 6 0 0 1-6-5L12 36z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 36h46" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FoldArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 30h40l-4 16a6 6 0 0 1-6 5H22a6 6 0 0 1-6-5L12 30z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 30h46" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M22 22a14 14 0 0 1 22 0" stroke={AMBER_D} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M44 22l1-6M44 22l-6 1" stroke={AMBER_D} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="40" r="4" fill={AMBER} />
    </svg>
  )
}

function PanArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M26 12c0 3-2 4-2 7M34 10c0 3-2 4-2 7" stroke={AMBER_D} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 32a18 7 0 0 1 36 0" fill={CREAM} stroke={INK} strokeWidth="2" />
      <ellipse cx="32" cy="32" rx="18" ry="7" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="32" cy="24" r="2.5" fill={AMBER} stroke={INK} strokeWidth="1.6" />
      <path d="M14 34v3a18 7 0 0 0 36 0v-3" fill={AMBER} stroke={INK} strokeWidth="2" />
      <path d="M50 36h11" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function ServeArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="30" rx="18" ry="6" fill={CREAM} stroke={INK} strokeWidth="2" />
      <ellipse cx="32" cy="24" rx="15" ry="5" fill={AMBER} stroke={INK} strokeWidth="2" />
      <ellipse cx="32" cy="19" rx="12" ry="4" fill={CREAM} stroke={INK} strokeWidth="2" />
      <rect x="29" y="12" width="6" height="6" rx="1.5" fill="#ffe08a" stroke={INK} strokeWidth="1.6" />
      <path d="M20 22c-3 4-3 7-3 7M44 22c3 4 3 7 3 7" stroke={AMBER_D} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 44h36l-3 7a5 5 0 0 1-5 3H22a5 5 0 0 1-5-3l-3-7z" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
