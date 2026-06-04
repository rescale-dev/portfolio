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

export default function App() {
  const isTouch = useIsTouch()
  const posScale = isTouch ? 0.7 : 1

  const [hintVisible, setHintVisible] = useState(true)
  const [openFolder, setOpenFolder] = useState<FolderItem | null>(null)
  const [gameOpen, setGameOpen] = useState(false)
  // Board items stay hidden until the hero title finishes typing.
  const [boardRevealed, setBoardRevealed] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [experienceOpen, setExperienceOpen] = useState(false)
  const [recipeOpen, setRecipeOpen] = useState(false)
  const [stickerPos, setStickerPos] = useState<Pos>({ x: -10 * posScale, y: 490 * posScale })
  const [weatherPos, setWeatherPos] = useState<Pos>({ x: 620 * posScale, y: -415 * posScale })
  const [gameLauncherPos, setGameLauncherPos] = useState<Pos>({ x: 0, y: -470 * posScale })
  const [aboutCardPos, setAboutCardPos] = useState<Pos>({
    x: aboutCard.position.x * posScale,
    y: aboutCard.position.y * posScale,
  })
  const [folderPositions, setFolderPositions] = useState<Pos[]>(
    folders.map(f => ({ x: f.position.x * posScale, y: f.position.y * posScale }))
  )

  // Warm up decoding of the card cover images during the typing phase, so the
  // first frame of the reveal animation never waits on an image decode.
  useEffect(() => {
    ;['/graphic/kv-vilaro.jpg', '/case/landscaping-cover.jpg', '/about-me.jpg'].forEach((src) => {
      const img = new Image()
      img.src = src
      img.decode?.().catch(() => {})
    })
  }, [])

  return (
    <>
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

      {/* Fixed, screen-anchored UI (outside the pannable board). */}
      <ThemeToggle />
      <ProfileBadge onClick={() => setExperienceOpen(true)} />
      <ToolRail />
      <ContactTile />
      <OnboardingHint visible={hintVisible && boardRevealed} />

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
