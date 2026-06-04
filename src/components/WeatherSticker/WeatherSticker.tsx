import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './WeatherSticker.module.css'

const CANVAS_SCALE = 0.8
const DRAG_THRESHOLD = 4

const LAT = 52.2297
const LON = 21.0122
const API = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weathercode,is_day&timezone=Europe/Warsaw`

type WeatherState =
  | 'clear_day' | 'clear_night'
  | 'partly_cloudy_day' | 'partly_cloudy_night'
  | 'overcast' | 'fog'
  | 'drizzle' | 'rain' | 'heavy_rain'
  | 'snow' | 'heavy_snow' | 'sleet'
  | 'thunderstorm'
  | 'loading' | 'error'

function toState(code: number, isDay: boolean): WeatherState {
  if (code === 0)                           return isDay ? 'clear_day' : 'clear_night'
  if (code === 1)                           return isDay ? 'clear_day' : 'clear_night'
  if (code === 2)                           return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night'
  if (code === 3)                           return 'overcast'
  if (code === 45 || code === 48)           return 'fog'
  if (code >= 51 && code <= 57)            return 'drizzle'
  if (code === 61 || code === 63 || code === 80 || code === 81) return 'rain'
  if (code === 65 || code === 82)           return 'heavy_rain'
  if (code === 66 || code === 67)           return 'sleet'
  if (code === 71 || code === 73 || code === 77 || code === 85) return 'snow'
  if (code === 75 || code === 86)           return 'heavy_snow'
  if (code >= 95)                           return 'thunderstorm'
  return isDay ? 'clear_day' : 'clear_night'
}

function stateLabel(s: WeatherState): string {
  const map: Record<WeatherState, string> = {
    clear_day: 'Clear', clear_night: 'Clear night',
    partly_cloudy_day: 'Partly cloudy', partly_cloudy_night: 'Partly cloudy',
    overcast: 'Overcast', fog: 'Foggy',
    drizzle: 'Drizzle', rain: 'Rain', heavy_rain: 'Heavy rain',
    snow: 'Snow', heavy_snow: 'Heavy snow', sleet: 'Sleet',
    thunderstorm: 'Storm', loading: '…', error: '—',
  }
  return map[s] ?? '—'
}

/* Japanese caption (kanji + romaji), kawaii weather-chart style. */
function jpLabel(s: WeatherState): { kanji: string; romaji: string } {
  const map: Record<WeatherState, { kanji: string; romaji: string }> = {
    clear_day:           { kanji: '晴れ',   romaji: 'hare' },
    clear_night:         { kanji: '快晴',   romaji: 'kaisei' },
    partly_cloudy_day:   { kanji: '薄曇り', romaji: 'usugumori' },
    partly_cloudy_night: { kanji: '薄曇り', romaji: 'usugumori' },
    overcast:            { kanji: '曇り',   romaji: 'kumori' },
    fog:                 { kanji: '霧',     romaji: 'kiri' },
    drizzle:             { kanji: '小雨',   romaji: 'kosame' },
    rain:                { kanji: '雨',     romaji: 'ame' },
    heavy_rain:          { kanji: '大雨',   romaji: 'ooame' },
    snow:                { kanji: '雪',     romaji: 'yuki' },
    heavy_snow:          { kanji: '大雪',   romaji: 'ooyuki' },
    sleet:               { kanji: 'みぞれ', romaji: 'mizore' },
    thunderstorm:        { kanji: '雷',     romaji: 'kaminari' },
    loading:             { kanji: '…',      romaji: '' },
    error:               { kanji: '—',      romaji: '' },
  }
  return map[s] ?? { kanji: '—', romaji: '' }
}

/* ── Colour palette (kawaii) ─────────────────────────────────────────────── */
const SUN          = '#FFC93D'
const CLOUD        = '#C2E6F5'   // friendly sky-blue cloud (reads on white via die-cut)
const CLOUD_SH     = '#A6D3EA'
const RAINCLOUD    = '#9FB7EA'   // periwinkle rain cloud
const RAINCLOUD_SH = '#8AA3DC'
const GRAY         = '#A8B1BD'   // overcast / storm cloud
const GRAY_SH      = '#929BA8'
const SNOWCLOUD    = '#DCEEF8'
const SNOWCLOUD_SH = '#C3E1F1'
const FOGC         = '#C7D3DC'
const FOGC_SH      = '#B0BEC9'
const DROP         = '#7FB5E6'
const DROP_D       = '#5C97D6'
const FLAKE        = '#BFE0F5'
const BOLT         = '#FFC400'
const MOON         = '#FFE07A'
const STAR         = '#FFE07A'

/* Face ink — soft charcoal-plum, like the reference chart. */
const FACE  = '#5C5360'
const BLUSH = '#FF9FB0'

/* ── Kawaii face primitives ──────────────────────────────────────────────── */

function Eyes({ cx, cy, dx = 5, r = 2.1, wink = false, sleepy = false }: {
  cx: number; cy: number; dx?: number; r?: number; wink?: boolean; sleepy?: boolean
}) {
  if (sleepy) {
    return (
      <>
        <path d={`M ${cx - dx - 2.4} ${cy} q 2.4 2.6 4.8 0`} stroke={FACE} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d={`M ${cx + dx - 2.4} ${cy} q 2.4 2.6 4.8 0`} stroke={FACE} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </>
    )
  }
  return (
    <>
      {wink
        ? <path d={`M ${cx - dx - 2.4} ${cy} q 2.4 -2.8 4.8 0`} stroke={FACE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        : <ellipse cx={cx - dx} cy={cy} rx={r} ry={r + 0.4} fill={FACE} />}
      <ellipse cx={cx + dx} cy={cy} rx={r} ry={r + 0.4} fill={FACE} />
      {!wink && <circle cx={cx - dx - 0.7} cy={cy - 1} r="0.7" fill="#fff" />}
      <circle cx={cx + dx - 0.7} cy={cy - 1} r="0.7" fill="#fff" />
    </>
  )
}

function Mouth({ cx, cy, w = 4.5, depth = 2.6, sad = false }: {
  cx: number; cy: number; w?: number; depth?: number; sad?: boolean
}) {
  const d = sad
    ? `M ${cx - w} ${cy + depth} q ${w} ${-depth * 1.5} ${w * 2} 0`
    : `M ${cx - w} ${cy} q ${w} ${depth * 1.6} ${w * 2} 0`
  return <path d={d} stroke={FACE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
}

function Blush({ cx, cy, dx = 9 }: { cx: number; cy: number; dx?: number }) {
  return (
    <>
      <ellipse cx={cx - dx} cy={cy} rx="2.4" ry="1.6" fill={BLUSH} opacity="0.6" />
      <ellipse cx={cx + dx} cy={cy} rx="2.4" ry="1.6" fill={BLUSH} opacity="0.6" />
    </>
  )
}

/* Puffy cloud body centred at (cx, cy). */
function Cloud({ cx = 32, cy = 32, s = 1, fill = CLOUD, shade = CLOUD_SH }: {
  cx?: number; cy?: number; s?: number; fill?: string; shade?: string
}) {
  return (
    <g>
      <ellipse cx={cx - 13 * s} cy={cy + 1 * s} rx={11 * s} ry={9.5 * s} fill={fill} />
      <ellipse cx={cx + 13 * s} cy={cy} rx={12 * s} ry={10.5 * s} fill={fill} />
      <ellipse cx={cx} cy={cy - 8 * s} rx={13 * s} ry={12 * s} fill={fill} />
      <rect x={cx - 23 * s} y={cy - 3 * s} width={46 * s} height={15 * s} rx={7.5 * s} fill={fill} />
      <ellipse cx={cx} cy={cy + 8 * s} rx={18 * s} ry={4 * s} fill={shade} opacity="0.45" />
    </g>
  )
}

/* Teardrop rain. */
function Drop({ x, y, s = 1, fill = DROP }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      d={`M ${x} ${y - 5 * s} C ${x + 3.3 * s} ${y - 0.5 * s} ${x + 3.3 * s} ${y + 3.6 * s} ${x} ${y + 3.6 * s} C ${x - 3.3 * s} ${y + 3.6 * s} ${x - 3.3 * s} ${y - 0.5 * s} ${x} ${y - 5 * s} Z`}
      fill={fill}
    />
  )
}

/* Six-point snow crystal. */
function Flake({ cx, cy, r = 4 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      {[0, 60, 120].map(a => {
        const rad = (a * Math.PI) / 180
        return (
          <line key={a}
            x1={cx - r * Math.cos(rad)} y1={cy - r * Math.sin(rad)}
            x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)}
            stroke={FLAKE} strokeWidth={r * 0.45} strokeLinecap="round" />
        )
      })}
      <circle cx={cx} cy={cy} r={r * 0.28} fill={FLAKE} />
    </g>
  )
}

function Star({ cx, cy, r = 2 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={STAR} />
}

/* ── Weather illustrations ───────────────────────────────────────────────── */

function ClearDay() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const rad = (a * Math.PI) / 180
        return (
          <line key={a}
            x1={32 + 17 * Math.cos(rad)} y1={32 + 17 * Math.sin(rad)}
            x2={32 + 26 * Math.cos(rad)} y2={32 + 26 * Math.sin(rad)}
            stroke={SUN} strokeWidth="3.6" strokeLinecap="round" />
        )
      })}
      <circle cx="32" cy="32" r="15" fill={SUN} />
      <Eyes cx={32} cy={30} dx={5.5} wink />
      <Blush cx={32} cy={35} dx={10} />
      <Mouth cx={32} cy={35} w={5} depth={3} />
    </svg>
  )
}

function ClearNight() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Star cx={14} cy={16} r={1.8} />
      <Star cx={52} cy={20} r={2.2} />
      <Star cx={48} cy={48} r={1.6} />
      <Star cx={16} cy={46} r={1.4} />
      <circle cx="32" cy="32" r="15" fill={MOON} />
      <Eyes cx={32} cy={31} dx={5.5} sleepy />
      <Blush cx={32} cy={36} dx={10} />
      <Mouth cx={32} cy={35} w={3.5} depth={2} />
    </svg>
  )
}

function PartlyCloudyDay() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {[200, 245, 290, 335, 20].map(a => {
        const rad = (a * Math.PI) / 180
        return (
          <line key={a}
            x1={22 + 10 * Math.cos(rad)} y1={20 + 10 * Math.sin(rad)}
            x2={22 + 16 * Math.cos(rad)} y2={20 + 16 * Math.sin(rad)}
            stroke={SUN} strokeWidth="3" strokeLinecap="round" />
        )
      })}
      <circle cx="22" cy="20" r="9.5" fill={SUN} />
      <Cloud cx={36} cy={38} s={0.92} />
      <Eyes cx={36} cy={37} dx={4.5} />
      <Blush cx={36} cy={41} dx={8.5} />
      <Mouth cx={36} cy={41} />
    </svg>
  )
}

function PartlyCloudyNight() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Star cx={48} cy={14} r={1.8} />
      <Star cx={14} cy={18} r={1.4} />
      <circle cx="22" cy="19" r="9.5" fill={MOON} />
      <Cloud cx={36} cy={38} s={0.92} />
      <Eyes cx={36} cy={37} dx={4.5} />
      <Blush cx={36} cy={41} dx={8.5} />
      <Mouth cx={36} cy={41} />
    </svg>
  )
}

function Overcast() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={26} cy={26} s={0.78} fill={CLOUD} shade={CLOUD_SH} />
      <Cloud cx={36} cy={36} s={0.92} fill={GRAY} shade={GRAY_SH} />
      <Eyes cx={36} cy={35} dx={4.5} />
      <Blush cx={36} cy={39} dx={8.5} />
      <Mouth cx={36} cy={39} w={4} depth={1.4} />
    </svg>
  )
}

function Fog() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={26} s={0.95} fill={FOGC} shade={FOGC_SH} />
      <Eyes cx={32} cy={25} dx={5} sleepy />
      <Mouth cx={32} cy={29} w={3.5} depth={1.4} />
      {[40, 46, 52].map((y, i) => (
        <rect key={y} x={12 + i * 3} y={y} width={40 - i * 6} height="3.4" rx="1.7"
          fill={FOGC} opacity={0.85 - i * 0.12} />
      ))}
    </svg>
  )
}

function Drizzle() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={24} s={0.95} />
      <Eyes cx={32} cy={23} dx={5} />
      <Blush cx={32} cy={27} dx={9} />
      <Mouth cx={32} cy={27} />
      {[[22, 46], [32, 49], [42, 46]].map(([x, y], i) => (
        <Drop key={i} x={x} y={y} s={0.8} />
      ))}
    </svg>
  )
}

function Rain() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={23} s={0.98} fill={RAINCLOUD} shade={RAINCLOUD_SH} />
      <Eyes cx={32} cy={22} dx={5} />
      <Blush cx={32} cy={26} dx={9} />
      <Mouth cx={32} cy={26} />
      {[[20, 46], [30, 50], [40, 46], [26, 56], [36, 56]].map(([x, y], i) => (
        <Drop key={i} x={x} y={y} />
      ))}
    </svg>
  )
}

function HeavyRain() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={22} s={1.02} fill={RAINCLOUD} shade={RAINCLOUD_SH} />
      <Eyes cx={32} cy={21} dx={5} sleepy />
      <Mouth cx={32} cy={25} sad w={4} depth={2.4} />
      {[[18, 45], [27, 50], [36, 45], [45, 50], [22, 57], [40, 57]].map(([x, y], i) => (
        <Drop key={i} x={x} y={y} s={1.05} fill={DROP_D} />
      ))}
    </svg>
  )
}

function Snow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={23} s={0.98} fill={SNOWCLOUD} shade={SNOWCLOUD_SH} />
      <Eyes cx={32} cy={22} dx={5} />
      <Blush cx={32} cy={26} dx={9} />
      <Mouth cx={32} cy={26} />
      <Flake cx={21} cy={48} r={4} />
      <Flake cx={32} cy={53} r={3.4} />
      <Flake cx={43} cy={48} r={4} />
    </svg>
  )
}

function HeavySnow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={21} s={1.02} fill={SNOWCLOUD} shade={SNOWCLOUD_SH} />
      <Eyes cx={32} cy={20} dx={5} />
      <Blush cx={32} cy={24} dx={9} />
      <Mouth cx={32} cy={24} />
      <Flake cx={18} cy={44} r={4} />
      <Flake cx={29} cy={50} r={4} />
      <Flake cx={40} cy={44} r={4} />
      <Flake cx={48} cy={52} r={3.4} />
      <Flake cx={23} cy={57} r={3.4} />
      <Flake cx={37} cy={58} r={3.4} />
    </svg>
  )
}

function Sleet() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={23} s={0.98} fill={CLOUD} shade={CLOUD_SH} />
      <Eyes cx={32} cy={22} dx={5} />
      <Blush cx={32} cy={26} dx={9} />
      <Mouth cx={32} cy={26} />
      <Drop x={22} y={48} s={0.85} />
      <Flake cx={32} cy={51} r={3.6} />
      <Drop x={42} y={48} s={0.85} />
    </svg>
  )
}

function Thunderstorm() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={22} s={1.02} fill={GRAY} shade={GRAY_SH} />
      <Eyes cx={32} cy={21} dx={5} />
      <Blush cx={32} cy={25} dx={9} />
      <Mouth cx={32} cy={26} w={3.5} depth={1.4} sad />
      <polygon points="34,36 25,49 32,49 28,60 42,44 34,44" fill={BOLT} />
    </svg>
  )
}

function LoadingArt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Cloud cx={32} cy={30} s={0.98} fill={CLOUD} shade={CLOUD_SH} />
      <Eyes cx={32} cy={29} dx={5} sleepy />
      <Mouth cx={32} cy={33} w={3} depth={1.2} />
    </svg>
  )
}

function WeatherArt({ state }: { state: WeatherState }) {
  const map: Record<WeatherState, JSX.Element> = {
    clear_day: <ClearDay />, clear_night: <ClearNight />,
    partly_cloudy_day: <PartlyCloudyDay />, partly_cloudy_night: <PartlyCloudyNight />,
    overcast: <Overcast />, fog: <Fog />,
    drizzle: <Drizzle />, rain: <Rain />, heavy_rain: <HeavyRain />,
    snow: <Snow />, heavy_snow: <HeavySnow />, sleet: <Sleet />,
    thunderstorm: <Thunderstorm />,
    loading: <LoadingArt />, error: <LoadingArt />,
  }
  return map[state]
}

/* ── Component ───────────────────────────────────────────────────────────── */

type WeatherStickerProps = {
  position: { x: number; y: number }
  onPositionChange?: (pos: { x: number; y: number }) => void
  revealed?: boolean
  revealDelay?: number
}

export function WeatherSticker({ position, onPositionChange, revealed = true, revealDelay = 0 }: WeatherStickerProps) {
  const isTouch = useIsTouch()
  const [state, setState] = useState<WeatherState>('loading')
  const [temp, setTemp] = useState<number | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const startPtr = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let cancelled = false
    fetch(API)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return
        const { temperature_2m, weathercode, is_day } = d.current
        setTemp(Math.round(temperature_2m))
        setState(toState(weathercode, is_day === 1))
      })
      .catch(() => { if (!cancelled) setState('error') })
    return () => { cancelled = true }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    dragging.current = true
    didDrag.current = false
    startPtr.current = { x: e.clientX, y: e.clientY }
    startPos.current = { ...position }
    rootRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    e.stopPropagation()
    const dx = e.clientX - startPtr.current.x
    const dy = e.clientY - startPtr.current.y
    if (!didDrag.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    didDrag.current = true
    onPositionChange?.({
      x: startPos.current.x + dx / CANVAS_SCALE,
      y: startPos.current.y + dy / CANVAS_SCALE,
    })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    e.stopPropagation()
    dragging.current = false
    try { rootRef.current?.releasePointerCapture(e.pointerId) } catch { /* noop */ }
  }

  const jp = jpLabel(state)

  // Touch: no per-item drag, so finger-pan / pinch on the canvas works here too.
  const interaction = isTouch ? {} : { onPointerDown, onPointerMove, onPointerUp }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` }}
      {...interaction}
      aria-label={`Weather in Warsaw: ${stateLabel(state)}${temp !== null ? `, ${temp}°C` : ''}`}
    >
      <div
        className={`${styles.inner} ${revealed ? 'board-in' : 'board-hidden'}`}
        style={{ animationDelay: revealed ? `${revealDelay}s` : undefined }}
      >
        <div className={styles.sticker}>
          <div className={styles.art}>
            <WeatherArt state={state} />
          </div>
          <div className={styles.caption}>
            <span className={styles.city}>Warsaw</span>
            <span className={styles.temp}>{temp !== null ? `${temp}°C` : '—'}</span>
            <span className={styles.jp}>
              <span className={styles.kanji}>{jp.kanji}</span>
              {jp.romaji && <span className={styles.romaji}>{jp.romaji}</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
