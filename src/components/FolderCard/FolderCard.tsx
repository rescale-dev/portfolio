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

const FOLDER_THEME: Record<string, string> = {
  blue: styles.themeBlue,
  green: styles.themeGreen,
  orange: styles.themeOrange,
  violet: styles.themeViolet,
}

/** 3D folder card. The work cards inside fan out of it on hover. */
function FolderDemo({
  title,
  tags,
  papers,
  theme = 'blue',
  idSuffix,
}: {
  title: string
  tags: string[]
  papers: string[]
  theme?: string
  idSuffix: string
}) {
  // Unique gradient id per folder, so the four instances don't share one.
  const gradId = `folderGrad-${idSuffix}`
  return (
    <div className={`${styles.folder} ${FOLDER_THEME[theme] ?? ''}`}>
      <svg className={styles.folderBack} viewBox="0 0 300 266" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a7cf6" />
            <stop offset="0.5" stopColor="#7160f0" />
            <stop offset="1" stopColor="#6353ec" />
          </linearGradient>
        </defs>
        <path
          d="M34 30 L112 30 C128 30 134 58 158 58 L266 58 Q288 58 288 80 L288 234 Q288 256 266 256 L34 256 Q12 256 12 234 L12 52 Q12 30 34 30 Z"
          fill={`url(#${gradId})`}
        />
      </svg>
      {/* Work cards peeking out of the folder; they fan up on hover. A single
          tile (e.g. Motion's looping video) sits centred instead. */}
      <div
        className={`${styles.folderPapers} ${papers.length === 1 ? styles.single : ''} ${papers.length === 2 ? styles.two : ''}`}
        aria-hidden="true"
      >
        {papers.slice(0, 3).map((src, i) => (
          <div key={i} className={styles.paper}>
            {/\.(mp4|webm|mov)$/i.test(src) ? (
              <video src={src} autoPlay loop muted playsInline />
            ) : (
              <img src={src} alt="" draggable={false} loading="lazy" />
            )}
          </div>
        ))}
      </div>
      {/* Front pocket card. */}
      <div className={styles.folderFront}>
        <p className={styles.folderTitle}>{title}</p>
        <div className={styles.folderTags}>
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FolderCard({ folder, onOpen, revealed = true, revealDelay = 0, position, onPositionChange }: FolderCardProps) {
  const { title, subtitles, preview, previewVideo, previewImages, accentDots, sample, enabled, previewCenter, variant } = folder
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
      {variant === 'folder' ? (
        <FolderDemo
          title={title}
          tags={subtitles}
          theme={folder.folderTheme}
          idSuffix={folder.id}
          papers={folder.tiles ?? (folder.works ?? []).map((w) => w.image).filter((s): s is string => !!s)}
        />
      ) : (
      <>
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
      </>
      )}
      </div>
    </div>
  )
}
