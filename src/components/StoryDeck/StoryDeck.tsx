import { useState } from 'react'
import type { StoryPage } from '../../data/items'
import styles from './StoryDeck.module.css'

type StoryDeckProps = {
  pages: StoryPage[]
}

/** Render a text string as one or more paragraphs, splitting on blank lines. */
const paragraphs = (text: string) =>
  text.split('\n\n').map((p, i) => (
    <p key={i} className={styles.rowText}>
      {p}
    </p>
  ))

/** Subpage view with a top tile navigation; one subpage shown at a time. */
export function StoryDeck({ pages }: StoryDeckProps) {
  const [index, setIndex] = useState(0)
  const page = pages[index]

  return (
    <div className={styles.deck}>
      <nav className={styles.tabs}>
        {pages.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.tab} ${i === index ? styles.active : ''}`}
            onClick={() => setIndex(i)}
            aria-current={i === index}
          >
            {p.label}
          </button>
        ))}
      </nav>

      {page.comingSoon ? (
        <div className={styles.placeholder}>Coming soon</div>
      ) : (
        <>
          {page.headline && <h2 className={styles.headline}>{page.headline}</h2>}
          {page.subline && <p className={styles.subline}>{page.subline}</p>}

          {page.blocks && (
            <div className={styles.blocks}>
              {page.blocks.map((block, i) =>
                block.layout === 'columns' && block.columns ? (
                  <div
                    key={i}
                    className={`${styles.columns} ${block.columns.length >= 3 ? styles.columns3 : ''}`}
                  >
                    {block.columns.map((col, ci) => (
                      <div key={ci} className={styles.column}>
                        {col.text && <div className={styles.colText}>{paragraphs(col.text)}</div>}
                        {col.video ? (
                          <video
                            className={styles.colVideo}
                            src={col.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          col.image && (
                            <img className={styles.colImg} src={col.image} alt="" draggable={false} />
                          )
                        )}
                        {col.caption && <span className={styles.colCaption}>{col.caption}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div key={i} className={styles.full}>
                    {block.text && <div className={styles.fullText}>{paragraphs(block.text)}</div>}
                    {block.image && (
                      <img className={styles.fullImg} src={block.image} alt="" draggable={false} />
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
