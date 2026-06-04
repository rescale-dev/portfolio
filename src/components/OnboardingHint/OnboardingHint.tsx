import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './OnboardingHint.module.css'

type OnboardingHintProps = {
  visible: boolean
}

export function OnboardingHint({ visible }: OnboardingHintProps) {
  const isTouch = useIsTouch()
  return (
    <div className={`${styles.root} ${visible ? '' : styles.hidden}`} aria-hidden="true">
      <span className={styles.hand}>{isTouch ? '👆' : '✋'}</span>
      {isTouch ? 'Swipe to explore, pinch to zoom' : 'Drag to explore'}
    </div>
  )
}
