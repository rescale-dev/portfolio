import styles from './ProfileBadge.module.css'

const AVATAR = '/profile.jpeg'

type ProfileBadgeProps = {
  onClick?: () => void
}

export function ProfileBadge({ onClick }: ProfileBadgeProps) {
  return (
    <button
      type="button"
      className={`${styles.root} intro-fade`}
      onClick={onClick}
      aria-label="Experience"
    >
      <img className={styles.avatar} src={AVATAR} alt="Damian Tylus, graphic and motion designer" draggable={false} />
    </button>
  )
}
