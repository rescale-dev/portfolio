import { useCallback, useEffect, useState } from 'react'
import type { FolderItem, Work } from '../../data/items'
import { CaseStudyModal } from '../CaseStudyModal/CaseStudyModal'
import { StoryDeck } from '../StoryDeck/StoryDeck'
import styles from './FolderWindow.module.css'

/** Play glyph shown on tiles that open a video lightbox. */
const playIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.52)" />
    <polygon points="19,14 38,24 19,34" fill="#fff" />
  </svg>
)

type FolderWindowProps = {
  folder: FolderItem
  onClose: () => void
}

/** Small "expand" glyph shown on hover over a work tile. */
const expandIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
)

/** Mac-style window that opens over a blurred backdrop and shows the folder's works. */
export function FolderWindow({ folder, onClose }: FolderWindowProps) {
  const { title, works = [], sections, window: text, expandable = false, logos, pages, badge } = folder
  const featured = works.filter((w) => w.featured)
  const rest = works.filter((w) => !w.featured)

  // Every work across the window, so the stagger covers sectioned folders too.
  const allWorks = sections ? sections.flatMap((s) => s.works) : works

  // Mount the heavy Vimeo iframes one at a time so the window itself pops
  // instantly and the players fill in progressively instead of all at once.
  const [mountedCount, setMountedCount] = useState(0)
  useEffect(() => {
    if (mountedCount >= allWorks.length) return
    const delay = mountedCount === 0 ? 120 : 150
    const t = setTimeout(() => setMountedCount((c) => c + 1), delay)
    return () => clearTimeout(t)
  }, [mountedCount, allWorks.length])

  // The work currently expanded into the lightbox (with sound controls).
  const [expanded, setExpanded] = useState<Work | null>(null)
  const [galleryExpanded, setGalleryExpanded] = useState<Work | null>(null)
  // The work whose case study is open in the case modal.
  const [caseWork, setCaseWork] = useState<Work | null>(null)

  // Plays the exit animation before unmounting.
  const [closing, setClosing] = useState(false)
  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 240)
  }, [closing, onClose])

  // Close on Escape — the lightbox first, then the window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (caseWork) { setCaseWork(null); return }
      if (galleryExpanded) { setGalleryExpanded(null); return }
      if (expanded) { setExpanded(null); return }
      handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose, expanded, galleryExpanded, caseWork])

  const renderWork = (work: Work, index: number, square = false) => {
    const hasLightbox = expandable || !!work.lightboxVimeoId || !!work.lightboxGallery || !!work.caseStudy
    const handleClick = () => {
      if (work.caseStudy) setCaseWork(work)
      else if (work.lightboxGallery) setGalleryExpanded(work)
      else if (work.lightboxVimeoId) setExpanded({ ...work, vimeoId: work.lightboxVimeoId })
      else if (expandable) setExpanded(work)
    }
    return (
      <figure
        key={work.id}
        className={`${styles.work} ${hasLightbox ? styles.expandable : ''}`}
        onClick={handleClick}
      >
        <div className={`${styles.workThumb} ${square ? styles.square : ''}`}>
          {work.vimeoId ? (
            index < mountedCount ? (
              <iframe
                className={styles.player}
                src={`https://player.vimeo.com/video/${work.vimeoId}?background=1&autoplay=1&loop=1&muted=1&dnt=1`}
                title={work.title}
                allow="autoplay; fullscreen; picture-in-picture"
                frameBorder="0"
              />
            ) : (
              <span className={styles.placeholder} aria-hidden="true" />
            )
          ) : (
            <img className={styles.playerImg} src={work.image} alt={work.title} draggable={false} loading="lazy" />
          )}
          {work.lightboxVimeoId && (
            <span className={styles.playIcon} aria-hidden="true">{playIcon}</span>
          )}
          {expandable && !work.lightboxVimeoId && (
            <span className={styles.expandHint} aria-hidden="true">{expandIcon}</span>
          )}
        </div>
        <figcaption className={styles.workMeta}>
          <span className={styles.workTitle}>{work.title}</span>
          {work.tag && <span className={styles.workTag}>{work.tag}</span>}
          {work.caption && <span className={styles.workCaption}>{work.caption}</span>}
        </figcaption>
      </figure>
    )
  }

  return (
    <>
    <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} role="presentation">
      <div
        className={`${styles.window} ${closing ? styles.windowClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} works`}
      >
        {/* Title bar — single working close button (macOS-style). */}
        <div className={styles.titlebar}>
          <div className={styles.lights}>
            <button
              type="button"
              className={`${styles.light} ${styles.red}`}
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
          <span className={styles.winTitle}>{title}</span>
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>

        {/* Scrollable content. */}
        <div className={styles.body}>
          {text && ((text.batches && text.batches.length > 0) || !pages) && (
            <div className={`${styles.header} ${text.centered ? styles.headerCentered : ''}`}>
              {text.batches && text.batches.length > 0 && (
                <div className={styles.batches}>
                  {text.batches.map((b) => (
                    <span key={b} className={styles.batch}>
                      {b}
                    </span>
                  ))}
                </div>
              )}
              {!pages && <h2 className={styles.headline}>{text.headline}</h2>}
              {!pages && text.subline && <p className={styles.subline}>{text.subline}</p>}
            </div>
          )}

          {pages ? (
            <StoryDeck pages={pages} />
          ) : sections
            ? sections.map((sec, si) => {
                const offset = sections
                  .slice(0, si)
                  .reduce((n, s) => n + s.works.length, 0)
                return (
                  <section key={sec.title} className={styles.section}>
                    <div className={styles.sectionHead}>
                      <h3 className={styles.sectionTitle}>{sec.title}</h3>
                      {sec.description && (
                        <p className={styles.sectionDesc}>{sec.description}</p>
                      )}
                    </div>
                    <div className={sec.wide ? styles.grid : styles.gridSquares}>
                      {sec.works.map((work, i) =>
                        renderWork(work, offset + i, !sec.wide),
                      )}
                    </div>
                  </section>
                )
              })
            : (
              <>
                {featured.length > 0 && (
                  <div className={styles.gridFeatured}>
                    {featured.map((work, i) => renderWork(work, i))}
                  </div>
                )}

                {rest.length > 0 && (
                  <div className={styles.grid}>
                    {rest.map((work, i) => renderWork(work, featured.length + i))}
                  </div>
                )}
              </>
            )}
          {logos && logos.length > 0 && (
            <div className={styles.logoBar}>
              <p className={styles.logoLabel}>Projects delivered for</p>
              <div className={styles.logoRow}>
                {logos.map((l) => (
                  <img key={l.alt} className={styles.logo} src={l.src} alt={l.alt} draggable={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Lightbox: the clicked work, enlarged and with sound controls unlocked. */}
    {expanded && (
      <div
        className={styles.lightbox}
        onClick={() => setExpanded(null)}
        role="presentation"
      >
        <button
          type="button"
          className={styles.lightboxClose}
          onClick={() => setExpanded(null)}
          aria-label="Close"
        >
          {'×'}
        </button>
        <div
          className={styles.lightboxInner}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={expanded.title}
        >
          {expanded.vimeoId ? (
            <iframe
              className={styles.lightboxPlayer}
              src={`https://player.vimeo.com/video/${expanded.vimeoId}?autoplay=1&loop=1&muted=1&dnt=1&title=0&byline=0&portrait=0`}
              title={expanded.title}
              allow="autoplay; fullscreen; picture-in-picture"
              frameBorder="0"
            />
          ) : (
            <img className={styles.lightboxImg} src={expanded.image} alt={expanded.title} />
          )}
        </div>
      </div>
    )}
    {/* Gallery lightbox: multiple static images + video side by side. */}
    {galleryExpanded && galleryExpanded.lightboxGallery && (
      <div
        className={styles.lightbox}
        onClick={() => setGalleryExpanded(null)}
        role="presentation"
      >
        <button
          type="button"
          className={styles.lightboxClose}
          onClick={() => setGalleryExpanded(null)}
          aria-label="Close"
        >{'×'}</button>
        <div
          className={styles.galleryInner}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={galleryExpanded.title}
        >
          {galleryExpanded.lightboxGallery.map((item, i) => (
            <div key={i} className={styles.galleryItem}>
              {item.type === 'video' ? (
                <iframe
                  className={styles.lightboxPlayer}
                  src={`https://player.vimeo.com/video/${item.vimeoId}?autoplay=1&loop=1&muted=1&dnt=1&title=0&byline=0&portrait=0`}
                  title={galleryExpanded.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  frameBorder="0"
                />
              ) : (
                <img
                  className={styles.lightboxImg}
                  src={item.src}
                  alt={galleryExpanded.title}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    {/* Case study modal: full write-up for a clicked case tile. */}
    {caseWork && caseWork.caseStudy && (
      <CaseStudyModal study={caseWork.caseStudy} onClose={() => setCaseWork(null)} />
    )}
    </>
  )
}
