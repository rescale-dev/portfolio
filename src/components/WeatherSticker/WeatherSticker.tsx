import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../../hooks/useIsTouch'
import styles from './WeatherSticker.module.css'

const CANVAS_SCALE = 0.8
const DRAG_THRESHOLD = 4

// Warsaw.
const LAT = 52.2297
const LON = 21.0122
const API =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,is_day` +
  `&hourly=precipitation_probability&forecast_days=1&timezone=Europe/Warsaw`

type Cond =
  | 'sun' | 'moon'
  | 'partly' | 'partlyNight'
  | 'cloudy' | 'fog'
  | 'drizzle' | 'rain' | 'thunder' | 'snow'
  | 'wind' | 'loading'

/** Map a WMO weather code (+ day/night and wind) to one of our conditions. */
function toCondition(code: number, isDay: boolean, wind: number): Cond {
  if (code >= 95) return 'thunder'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  // Clear / cloudy — a strong wind takes over the icon.
  if (wind >= 38 && code <= 3) return 'wind'
  if (code === 0 || code === 1) return isDay ? 'sun' : 'moon'
  if (code === 2) return isDay ? 'partly' : 'partlyNight'
  if (code === 3) return 'cloudy'
  return isDay ? 'sun' : 'moon'
}

/** Card background gradient per condition. */
const BG: Record<Cond, string> = {
  sun: 'linear-gradient(165deg, #5cb1f6 0%, #2f86df 100%)',
  partly: 'linear-gradient(165deg, #5aa9ef 0%, #3179cf 100%)',
  cloudy: 'linear-gradient(165deg, #6f93bf 0%, #43658f 100%)',
  fog: 'linear-gradient(165deg, #7e98b4 0%, #506c8a 100%)',
  drizzle: 'linear-gradient(165deg, #4f86c4 0%, #2f5d97 100%)',
  rain: 'linear-gradient(165deg, #3f6ea8 0%, #274d7d 100%)',
  thunder: 'linear-gradient(165deg, #34527f 0%, #1c3056 100%)',
  snow: 'linear-gradient(165deg, #8fb2d8 0%, #5b80aa 100%)',
  wind: 'linear-gradient(165deg, #5fb6e8 0%, #3b8fd0 100%)',
  moon: 'linear-gradient(165deg, #2b3d64 0%, #16233f 100%)',
  partlyNight: 'linear-gradient(165deg, #2f4068 0%, #1a2842 100%)',
  loading: 'linear-gradient(165deg, #5aa9ef 0%, #3179cf 100%)',
}

const LABEL: Record<Cond, string> = {
  sun: 'Sunny', moon: 'Clear', partly: 'Partly cloudy', partlyNight: 'Partly cloudy',
  cloudy: 'Cloudy', fog: 'Foggy', drizzle: 'Light rain', rain: 'Rain',
  thunder: 'Thunderstorm', snow: 'Snow', wind: 'Windy', loading: '…',
}

/* ── Icon primitives ─────────────────────────────────────────────────────── */

const SVG = 96

/** Soft glassy cloud centred at (cx, cy). */
function cloud(cx: number, cy: number, s = 1, grad = 'url(#cg)') {
  return (
    <g>
      <ellipse cx={cx - 16 * s} cy={cy + 3 * s} rx={15 * s} ry={12.5 * s} fill={grad} />
      <ellipse cx={cx + 15 * s} cy={cy + 1 * s} rx={16 * s} ry={13.5 * s} fill={grad} />
      <ellipse cx={cx - 1 * s} cy={cy - 11 * s} rx={16 * s} ry={15 * s} fill={grad} />
      <rect x={cx - 30 * s} y={cy - 2 * s} width={60 * s} height={17 * s} rx={8.5 * s} fill={grad} />
      <ellipse cx={cx - 3 * s} cy={cy - 13 * s} rx={10 * s} ry={7 * s} fill="rgba(255,255,255,0.55)" />
    </g>
  )
}

function cloudGrad(id = 'cg') {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#d2deec" />
    </linearGradient>
  )
}

function sun(cx: number, cy: number, r: number, rays = true) {
  return (
    <g>
      {rays &&
        [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const t = (a * Math.PI) / 180
          return (
            <line
              key={a}
              x1={cx + (r + 5) * Math.cos(t)} y1={cy + (r + 5) * Math.sin(t)}
              x2={cx + (r + 12) * Math.cos(t)} y2={cy + (r + 12) * Math.sin(t)}
              stroke="#ffd166" strokeWidth="4" strokeLinecap="round"
            />
          )
        })}
      <circle cx={cx} cy={cy} r={r} fill="url(#sg)" />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.32} rx={r * 0.42} ry={r * 0.32} fill="rgba(255,255,255,0.4)" />
    </g>
  )
}

function sunGrad() {
  return (
    <radialGradient id="sg" cx="0.42" cy="0.4" r="0.7">
      <stop offset="0" stopColor="#ffe9a8" />
      <stop offset="0.6" stopColor="#ffce5e" />
      <stop offset="1" stopColor="#ffa83f" />
    </radialGradient>
  )
}

const drop = (x: number, y: number, len = 11, c = '#d6e6fb') => (
  <rect key={`${x}-${y}`} x={x - 1.5} y={y} width="3" height={len} rx="1.5" fill={c} />
)

const Box = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${SVG} ${SVG}`} fill="none" aria-hidden="true" className={styles.iconSvg}>
    {children}
  </svg>
)

function moonPhase(date = new Date()) {
  const synodic = 29.530588853
  const knownNew = Date.UTC(2000, 0, 6, 18, 14)
  let p = (((date.getTime() - knownNew) / 86400000) % synodic) / synodic
  if (p < 0) p += 1
  return p
}

function IconSun() {
  return <Box><defs>{sunGrad()}</defs>{sun(48, 46, 20)}</Box>
}

function IconMoon() {
  const R = 20, cx = 48, cy = 46
  const p = moonPhase()
  const k = (1 - Math.cos(2 * Math.PI * p)) / 2 // illuminated fraction
  const off = (p < 0.5 ? -1 : 1) * 2 * R * k
  return (
    <Box>
      <defs>
        <radialGradient id="mg" cx="0.42" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#fdfdf6" />
          <stop offset="1" stopColor="#dfe6f1" />
        </radialGradient>
        <clipPath id="mc"><circle cx={cx} cy={cy} r={R} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="url(#mg)" />
      <g clipPath="url(#mc)"><circle cx={cx + off} cy={cy} r={R} fill="#3a4d72" /></g>
      <circle cx={cx + 6} cy={cy - 6} r="2.6" fill="rgba(120,140,175,0.25)" />
      <circle cx={cx + 2} cy={cy + 6} r="3.4" fill="rgba(120,140,175,0.2)" />
    </Box>
  )
}

function IconPartly() {
  return (
    <Box>
      <defs>{sunGrad()}{cloudGrad()}</defs>
      {sun(36, 34, 13)}
      {cloud(52, 54, 0.9)}
    </Box>
  )
}

function IconPartlyNight() {
  return (
    <Box>
      <defs>
        <radialGradient id="mg2" cx="0.42" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#fdfdf6" /><stop offset="1" stopColor="#dfe6f1" />
        </radialGradient>
        {cloudGrad()}
      </defs>
      <circle cx="36" cy="33" r="13" fill="url(#mg2)" />
      <circle cx="41" cy="30" r="13" fill="#2f4068" />
      {cloud(52, 54, 0.9)}
    </Box>
  )
}

function IconCloudy() {
  return (
    <Box>
      <defs>{cloudGrad()}{cloudGrad('cg2')}</defs>
      {cloud(40, 38, 0.66, 'url(#cg2)')}
      {cloud(52, 52, 0.95)}
    </Box>
  )
}

function IconFog() {
  return (
    <Box>
      <defs>{cloudGrad()}</defs>
      {cloud(48, 38, 0.9)}
      {[58, 66, 74].map((y, i) => (
        <rect key={y} x={20 + i * 4} y={y} width={56 - i * 8} height="4.5" rx="2.25"
          fill="#dbe6f3" opacity={0.9 - i * 0.18} />
      ))}
    </Box>
  )
}

function IconDrizzle() {
  return (
    <Box>
      <defs>{cloudGrad()}</defs>
      {cloud(48, 36, 0.92)}
      {[[34, 60], [48, 64], [62, 60]].map(([x, y]) => drop(x, y, 8))}
    </Box>
  )
}

function IconRain() {
  return (
    <Box>
      <defs>{cloudGrad()}</defs>
      {cloud(48, 34, 0.95)}
      {[[30, 58], [42, 62], [54, 58], [66, 62], [36, 72], [60, 72]].map(([x, y]) => drop(x, y, 12))}
    </Box>
  )
}

function IconThunder() {
  return (
    <Box>
      <defs>
        <linearGradient id="cg3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2f7" /><stop offset="1" stopColor="#c2cedd" />
        </linearGradient>
      </defs>
      {cloud(48, 34, 0.95, 'url(#cg3)')}
      <polygon points="52,52 38,72 49,72 43,86 64,62 52,62" fill="#ffd23e" />
    </Box>
  )
}

function IconSnow() {
  return (
    <Box>
      <defs>{cloudGrad()}</defs>
      {cloud(48, 36, 0.92)}
      {[[34, 62], [48, 68], [62, 62], [41, 76], [55, 76]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#eaf3fb" />
      ))}
    </Box>
  )
}

function IconWind() {
  const s = { stroke: '#eaf2fb', strokeWidth: 5, fill: 'none', strokeLinecap: 'round' as const }
  return (
    <Box>
      <path d="M16 36 H54 a9 9 0 1 0 -9 -9" {...s} />
      <path d="M16 54 H66 a10 10 0 1 1 -10 10" {...s} />
      <path d="M16 72 H46 a8 8 0 1 0 -8 8" {...s} />
    </Box>
  )
}

function WeatherIcon({ cond }: { cond: Cond }) {
  switch (cond) {
    case 'sun': return <IconSun />
    case 'moon': return <IconMoon />
    case 'partly': return <IconPartly />
    case 'partlyNight': return <IconPartlyNight />
    case 'cloudy': return <IconCloudy />
    case 'fog': return <IconFog />
    case 'drizzle': return <IconDrizzle />
    case 'rain': return <IconRain />
    case 'thunder': return <IconThunder />
    case 'snow': return <IconSnow />
    case 'wind': return <IconWind />
    default: return <IconCloudy />
  }
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
  const [cond, setCond] = useState<Cond>('loading')
  const [temp, setTemp] = useState<number | null>(null)
  const [humidity, setHumidity] = useState<number | null>(null)
  const [wind, setWind] = useState<number | null>(null)
  const [precip, setPrecip] = useState<number | null>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const startPtr = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let cancelled = false
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        const c = d.current
        const w = Math.round(c.wind_speed_10m)
        setTemp(Math.round(c.temperature_2m))
        setHumidity(Math.round(c.relative_humidity_2m))
        setWind(w)
        // Precipitation probability for the current hour.
        const hour = String(c.time).slice(0, 13)
        const idx = (d.hourly?.time ?? []).findIndex((t: string) => t.slice(0, 13) === hour)
        const prob = idx >= 0 ? d.hourly.precipitation_probability[idx] : c.precipitation > 0 ? 100 : 0
        setPrecip(Math.round(prob ?? 0))
        setCond(toCondition(c.weather_code, c.is_day === 1, w))
      })
      .catch(() => { if (!cancelled) setCond('cloudy') })
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
    onPositionChange?.({ x: startPos.current.x + dx / CANVAS_SCALE, y: startPos.current.y + dy / CANVAS_SCALE })
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    e.stopPropagation()
    dragging.current = false
    try { rootRef.current?.releasePointerCapture(e.pointerId) } catch { /* noop */ }
  }

  const interaction = isTouch ? {} : { onPointerDown, onPointerMove, onPointerUp }
  const val = (n: number | null) => (n === null ? '—' : `${n}`)

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` }}
      {...interaction}
      aria-label={`Weather in Warsaw: ${LABEL[cond]}${temp !== null ? `, ${temp}°C` : ''}`}
    >
      <div
        className={`${styles.inner} ${revealed ? 'board-in' : 'board-hidden'}`}
        style={{ animationDelay: revealed ? `${revealDelay}s` : undefined }}
      >
        <div className={styles.card} style={{ background: BG[cond] }}>
          <svg className={styles.hill} viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 110 L0 64 Q54 26 104 56 T200 46 L200 110 Z" fill="rgba(255,255,255,0.07)" />
          </svg>

          <div className={styles.iconWrap}>
            <WeatherIcon cond={cond} />
          </div>

          <div className={styles.temp}>{val(temp)}<span className={styles.deg}>°</span></div>
          <div className={styles.city}>Warszawa</div>

          <div className={styles.details}>
            <div className={styles.col}>
              <span className={styles.label}>Wind now</span>
              <span className={styles.metric}>{val(wind)}<span className={styles.unit}>km</span></span>
            </div>
            <div className={styles.col}>
              <span className={styles.label}>Humidity</span>
              <span className={styles.metric}>{val(humidity)}<span className={styles.unit}>%</span></span>
            </div>
            <div className={styles.col}>
              <span className={styles.label}>Precipitation</span>
              <span className={styles.metric}>{val(precip)}<span className={styles.unit}>%</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
