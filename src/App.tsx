import { useEffect, useState } from 'react'
import { Canvas } from './components/Canvas/Canvas'
import { PortfolioTitle } from './components/PortfolioTitle/PortfolioTitle'
import { FolderCard } from './components/FolderCard/FolderCard'
import { FolderWindow } from './components/FolderWindow/FolderWindow'
import { AboutCard } from './components/AboutCard/AboutCard'
import { OnboardingHint } from './components/OnboardingHint/OnboardingHint'
import { ProfileBadge } from './components/ProfileBadge/ProfileBadge'
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle'
import { GameLauncher } from './components/GameLauncher/GameLauncher'
import { GameModal } from './components/GameModal/GameModal'
import { ToolRail } from './components/ToolRail/ToolRail'
import { ContactTile } from './components/ContactTile/ContactTile'
import { AboutWindow } from './components/AboutWindow/AboutWindow'
import { ExperiencePanel } from './components/ExperiencePanel/ExperiencePanel'
import { PancakeSticker } from './components/PancakeSticker/PancakeSticker'
import { RecipeModal } from './components/RecipeModal/RecipeModal'
import { WeatherSticker } from './components/WeatherSticker/WeatherSticker'
import { useIsTouch } from './hooks/useIsTouch'
import { folders, aboutCard, experience } from './data/items'
import type { FolderItem } from './data/items'

// Per-item delay (s) for the staggered board entrance — items reveal one by one.
const STAGGER = 0.16

type Pos = { x: number; y: number }

// Hand-tuned mobile layout (canvas/layer space). The cards keep their fixed
// 320px size while the layer is zoomed out, so the desktop scatter can't just
// be scaled down — it overlaps. These positions sit the four cards in the
// corners (clearing the enlarged hero's vertical band) with the small items on
// the axis, leaving generous gaps so nothing overlaps. Keyed by item id.
const MOBILE_POS: Record<string, Pos> = {
  'graphic-design': { x: -340, y: -450 },
  motion: { x: 340, y: -450 },
  'case-study': { x: -340, y: 450 },
  'ai-creative': { x: 470, y: 0 },
  about: { x: 340, y: 450 },
  game: { x: 0, y: -540 },
  pancake: { x: 0, y: 540 },
  weather: { x: -470, y: 0 },
}

export default function App() {
  const isTouch = useIsTouch()
  const pos = (id: string, desktop: Pos): Pos => (isTouch ? MOBILE_POS[id] : desktop)

  const [hintVisible, setHintVisible] = useState(true)
  const [openFolder, setOpenFolder] = useState<FolderItem | null>(null)
  const [gameOpen, setGameOpen] = useState(false)
  // Board items stay hidden until the hero title finishes typing.
  const [boardRevealed, setBoardRevealed] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [recipeOpen, setRecipeOpen] = useState(false)
  const [stickerPos, setStickerPos] = useState<Pos>(pos('pancake', { x: -10, y: 490 }))
  const [weatherPos, setWeatherPos] = useState<Pos>(pos('weather', { x: 620, y: -415 }))
  const [gameLauncherPos, setGameLauncherPos] = useState<Pos>(pos('game', { x: 0, y: -470 }))
  const [aboutCardPos, setAboutCardPos] = useState<Pos>(pos('about', aboutCard.position))
  const [folderPositions, setFolderPositions] = useState<Pos[]>(
    folders.map(f => pos(f.id, f.position))
  )

  // Warm up decoding of the card cover images during the typing phase, so the
  // first frame of the reveal animation never waits on an image decode.
  useEffect(() => {
    ;['/graphic/kv-vilaro.jpg', '/case/landscaping-cover.jpg', '/ai/zabka.jpg', '/about-me.jpg'].forEach((src) => {
      const img = new Image()
      img.src = src
      img.decode?.().catch(() => {})
    })
  }, [])

  return (
    <>
      {/* Skip-to-content for keyboard users */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      <main id="main-content" aria-label="Interactive portfolio board">
      <Canvas onFirstMove={() => setHintVisible(false)}>
        <PortfolioTitle onDone={() => setBoardRevealed(true)} />
        {folders.map((folder, i) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onOpen={setOpenFolder}
            revealed={boardRevealed}
            revealDelay={i * STAGGER}
            position={folderPositions[i]}
            onPositionChange={pos => setFolderPositions(prev => prev.map((p, j) => j === i ? pos : p))}
          />
        ))}
        <AboutCard
          data={aboutCard}
          revealed={boardRevealed}
          revealDelay={folders.length * STAGGER}
          onOpen={() => setAboutOpen(true)}
          position={aboutCardPos}
          onPositionChange={setAboutCardPos}
        />
        <GameLauncher
          position={gameLauncherPos}
          onPositionChange={setGameLauncherPos}
          onOpen={() => setGameOpen(true)}
          revealed={boardRevealed}
          revealDelay={(folders.length + 1) * STAGGER}
        />
        <WeatherSticker
          position={weatherPos}
          onPositionChange={setWeatherPos}
          revealed={boardRevealed}
          revealDelay={(folders.length + 3) * STAGGER}
        />
        <PancakeSticker
          position={stickerPos}
          onOpen={() => setRecipeOpen(true)}
          onPositionChange={setStickerPos}
          revealed={boardRevealed}
          revealDelay={(folders.length + 2) * STAGGER}
        />
      </Canvas>
      </main>

      {/* Fixed, screen-anchored UI (outside the pannable board). */}
      <header aria-label="Site controls">
        <ThemeToggle />
        <ProfileBadge onClick={() => setExperienceOpen(true)} />
        <ToolRail />
        <ContactTile />
      </header>
      <OnboardingHint visible={hintVisible && boardRevealed} />

      {/* Visually hidden content for search engines and screen readers.
          Googlebot executes JS and reads this; recruitment bots find it too. */}
      <section className="sr-only" aria-label="Portfolio content summary">
        <h1>Damian Tylus &mdash; Graphic &amp; Motion Designer</h1>
        <p>Graphic Designer and Motion Designer based in Poland with experience at agencies in Warsaw and Lublin. Specialising in performance advertising, social media visuals, key visuals, motion showreels and AI-assisted creative production.</p>
        <nav aria-label="Portfolio sections">
          <ul>
            <li><a href="#section-graphic-design">Graphic Design</a></li>
            <li><a href="#section-motion">Motion</a></li>
            <li><a href="#section-case-studies">Case Studies</a></li>
            <li><a href="#section-ai-creative">AI Creative</a></li>
          </ul>
        </nav>
        <section id="section-graphic-design">
          <h2>Graphic Design</h2>
          <p>Performance ads for Meta and Google Ads campaigns, social media visuals and key visuals for consumer brands including Dr. Oetker, Żabka, Hama, Vileda and LOT Polish Airlines. Work covers static posts, motion pieces and video edits produced within structured content frameworks and collaborative concept development.</p>
        </section>
        <section id="section-motion">
          <h2>Motion</h2>
          <p>Personal motion showreels covering 2D animation, 3D and FOOH (Fake Out-Of-Home) work. All projects crafted manually prior to the AI-driven production wave.</p>
        </section>
        <section id="section-case-studies">
          <h2>Case Studies</h2>
          <h3>Landscaping Company Website</h3>
          <p>End-to-end web design and UI/UX project for a landscaping company near Lublin. Designed and built in Framer. After launch, the share of quality phone enquiries rose by approximately 34 percent.</p>
          <h3>citytools Branding</h3>
          <p>Full brand identity for citytools, an online store with professional power tools. Covers logo, colour palette, typography, business cards, social media and promotion templates.</p>
        </section>
        <section id="section-ai-creative">
          <h2>AI Creative</h2>
          <h3>AI Workflow</h3>
          <p>Brand identity moodboard generation and AI-assisted ad creative production for Żabka franchise campaign, with final delivery in Figma and Photoshop.</p>
          <h3>AI Photo</h3>
          <p>Image generation combining text prompts with reference graphics to produce standalone assets and mixed-media creatives.</p>
          <h3>AI Video</h3>
          <p>Video asset creation using the Kling model with keyframe-based motion generation between reference images.</p>
          <h3>AI Upscale</h3>
          <p>Resolution upscaling and visual enhancement of low-quality source material into premium, studio-grade product creatives using Magnific.</p>
        </section>
        <section>
          <h2>About Damian Tylus</h2>
          <p>Graphic and Motion Designer with experience at Vilaro and Esperienza agency in Warsaw and Lublin. Freelance since 2020, working with advertising agencies on social media materials, animation and video editing for international markets.</p>
          <p>Contact: <a href="mailto:damian.tylus2001r@gmail.com">damian.tylus2001r@gmail.com</a></p>
          <p><a href="https://www.linkedin.com/in/damiantylus/">LinkedIn</a></p>
          <p><a href="https://www.instagram.com/dam1an0z/">Instagram</a></p>
        </section>
      </section>

      {openFolder && (
        <FolderWindow folder={openFolder} onClose={() => setOpenFolder(null)} />
      )}

      {gameOpen && <GameModal onClose={() => setGameOpen(false)} />}

      {aboutOpen && <AboutWindow data={aboutCard} onClose={() => setAboutOpen(false)} />}

      {experienceOpen && (
        <ExperiencePanel entries={experience} onClose={() => setExperienceOpen(false)} />
      )}

      {recipeOpen && <RecipeModal onClose={() => setRecipeOpen(false)} />}
    </>
  )
}
