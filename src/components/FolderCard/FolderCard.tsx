import { useDraggable } from '../../hooks/useDraggable'
import { useIsTouch } from '../../hooks/useIsTouch'
import type { FolderItem } from '../../data/items'
import styles from './FolderCard.module.css'

type FolderCardProps = {
  folder: FolderItem
  onOpen?: (folder: FolderItem) => void
  revealed?: boolean
  revealDelay?: number
  position?: { x: number; y: number }
  onPositionChange?: (pos: { x: number; y: number }) => void
}

export function FolderCard({ folder, onOpen, revealed = true, revealDelay = 0, position, onPositionChange }: FolderCardProps) {
  const { title, subtitles, preview, previewVideo, previewImages, accentDots, sample, enabled, previewCenter } = folder
  const isTouch = useIsTouch()
  const pos = position ?? folder.position
  const previewClass = `${styles.preview} ${previewCenter ? styles.previewCenter : ''}`
  const { elRef, wasDragged, handlers } = useDraggable(pos, onPositionChange)
  // Touch: no per-item drag — pointer events flow to the canvas for pan / pinch.
  const dragHandlers = isTouch ? {} : handlers

  return (
    <div
      ref={elRef}
      className={`${styles.root} ${enabled ? styles.clickable : ''}`}
      style={{
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
        cursor: !isTouch && onPositionChange ? 'grab' : undefined,
      }}
      onClick={() => { if (!wasDragged() && enabled) onOpen?.(folder) }}
      {...dragHandlers}
    >
      <div
        className={`${styles.inner} ${revealed ? 'board-in' : 'board-hidden'}`}
        style={{ animationDelay: revealed ? `${revealDelay}s` : undefined }}
      >
      <div className={styles.stack}>
        <div className={`${styles.sheet} ${styles.sheet2}`} />
        <div className={`${styles.sheet} ${styles.sheet1}`} />
        <div className={styles.card}>
          {previewVideo ? (
            <video
              className={previewClass}
              src={previewVideo}
              poster={preview}
              autoPlay
              loop
              muted
              playsInline
              aria-label={`${title} preview`}
            />
          ) : previewImages && previewImages.length >= 4 ? (
            <div className={styles.previewCollage} aria-label={`${title} preview`}>
              {previewImages.slice(0, 4).map((src, i) => (
                <img key={i} className={styles.collageImg} src={src} alt="" draggable={false} />
              ))}
            </div>
          ) : (
            <img className={previewClass} src={preview} alt={`${title} preview`} draggable={false} />
          )}
          <div className={styles.dots} aria-hidden="true">
            {accentDots ? (
              accentDots.map((color, i) => (
                <span key={i} className={styles.dot} style={{ background: color }} />
              ))
            ) : (
              <>
                <span className={`${styles.dot} ${styles.dotBlue}`} />
                <span className={`${styles.dot} ${styles.dotPink}`} />
                <span className={`${styles.dot} ${styles.dotGreen}`} />
                <span className={`${styles.dot} ${styles.dotYellow}`} />
              </>
            )}
          </div>
          <p className={styles.cardTitle}>{sample.title}</p>
          <p className={styles.cardDesc}>{sample.description}</p>
        </div>
      </div>

      <p className={styles.title}>{title}</p>
      <div className={styles.tags}>
        {subtitles.map((s) => (
          <span key={s} className={styles.tag}>
            {s}
          </span>
        ))}
      </div>
      </div>
    </div>
  )
}
