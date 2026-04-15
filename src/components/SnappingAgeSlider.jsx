import { useRef } from 'react'

// Forward direction (left=newest, right=oldest) — used by LaterConcepts
const AGE_YEARS  = [2, 5, 10, 15, null]
const AGE_LABELS = ['2 yrs', '5 yrs', '10 yrs', '15 yrs', 'No limit']
const DEFAULT_STOP_PCTS = AGE_LABELS.map((_, i) => (i / (AGE_LABELS.length - 1)) * 100)
const REC_HI_IDX = 2  // "10 yrs" is the recommended upper bound

// Reversed direction (left=oldest/1999, right=newest/current year) — used by Max Vehicle Age
const AGE_YEARS_REV  = [27, 15, 10, 5, 2, 0]
const AGE_LABELS_REV = ['27 yrs', '15 yrs', '10 yrs', '5 yrs', '2 yrs', '0 yrs']
const DEFAULT_STOP_PCTS_REV = AGE_LABELS_REV.map((_, i) => (i / (AGE_LABELS_REV.length - 1)) * 100)
const REC_LO_IDX_REV = 2  // index 2 = "10 yrs" = oldest car we'd recommend accepting

const GREEN_TRACK = '#09AD0E'
const AMBER_TRACK = '#F5A623'

// value         = [loIdx, hiIdx]
// onChange       = fn([loIdx, hiIdx])
// noHeader       = bool — suppress the header row (caller renders it)
// stopPcts       = number[] — custom % positions for each stop
// showModelYears = bool — show model year labels + primary year-range header
// reversed       = bool — left=oldest/1999, right=newest/current year
export default function SnappingAgeSlider({
  value,
  onChange,
  noHeader = false,
  stopPcts,
  showModelYears = false,
  reversed = false,
}) {
  const [lo, hi] = value
  const trackRef = useRef()
  const dragging = useRef(null)

  const CURRENT_YEAR = new Date().getFullYear()

  const YEARS        = reversed ? AGE_YEARS_REV  : AGE_YEARS
  const LABELS       = reversed ? AGE_LABELS_REV : AGE_LABELS
  const defaultPcts  = reversed ? DEFAULT_STOP_PCTS_REV : DEFAULT_STOP_PCTS
  const effectivePcts = stopPcts ?? defaultPcts

  const MODEL_YEARS = YEARS.map(yrs => yrs === null ? null : CURRENT_YEAR - yrs)
  const STOP_LABELS = showModelYears
    ? MODEL_YEARS.map(yr => yr === null ? 'No limit' : String(yr))
    : LABELS

  const inRange    = reversed ? lo >= REC_LO_IDX_REV : hi <= REC_HI_IDX
  const loPct      = effectivePcts[lo]
  const hiPct      = effectivePcts[hi]
  const trackColor = inRange ? GREEN_TRACK : AMBER_TRACK
  const thumbColor = '#79828D'

  // ── Header text ──────────────────────────────────────────────────────────
  const loYear = MODEL_YEARS[lo]
  const hiYear = MODEL_YEARS[hi]

  let primaryText
  if (showModelYears) {
    if (reversed) {
      // lo = oldest accepted year (left), hi = newest accepted year (right)
      primaryText = hiYear === CURRENT_YEAR ? `${loYear} and newer` : `${loYear} – ${hiYear}`
    } else {
      // lo = newest (smallest age), hi = oldest (largest age, null = no limit)
      primaryText = hiYear === null ? `${loYear} and older` : `${hiYear} – ${loYear}`
    }
  } else {
    primaryText = lo === hi ? LABELS[lo] : `${LABELS[lo]} – ${LABELS[hi]}`
  }

  const badgeText = inRange ? 'Recommended' : 'Outside recommended range'
  const badgeBg   = inRange ? '#DCF7DD' : '#FFF1C0'

  // Secondary age-in-years label (shown only in model-year mode)
  const loAgeLabel = LABELS[lo]
  const hiAgeLabel = LABELS[hi]
  const ageSubtext = lo === hi ? loAgeLabel : `${loAgeLabel} – ${hiAgeLabel}`

  // ── Interaction ──────────────────────────────────────────────────────────
  function getStopIdx(clientX) {
    const rect = trackRef.current.getBoundingClientRect()
    const pct  = ((clientX - rect.left) / rect.width) * 100
    let closest = 0, minDist = Infinity
    effectivePcts.forEach((sp, i) => {
      const d = Math.abs(pct - sp)
      if (d < minDist) { minDist = d; closest = i }
    })
    return closest
  }

  function handlePointerDown(e) {
    const idx = getStopIdx(e.clientX)
    const distToLo = Math.abs(idx - lo)
    const distToHi = Math.abs(idx - hi)
    if (distToLo < distToHi || (distToLo === distToHi && idx <= lo)) {
      dragging.current = 'lo'
      onChange([Math.min(idx, hi), hi])
    } else {
      dragging.current = 'hi'
      onChange([lo, Math.max(idx, lo)])
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!dragging.current) return
    const idx = getStopIdx(e.clientX)
    if (dragging.current === 'lo') onChange([Math.min(idx, hi), hi])
    else                            onChange([lo, Math.max(idx, lo)])
  }

  function handlePointerUp() { dragging.current = null }

  return (
    <div>
      {/* Header — hidden when noHeader=true */}
      {!noHeader && (
        showModelYears ? (
          /* Model-year mode: label on left, year range on right */
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#5E6976' }}>Accepting vehicles from</span>
              <span style={{ fontSize: 12, fontWeight: 400, color: '#0D1722' }}>{primaryText}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <span style={{
                fontSize: 12, background: badgeBg, color: '#0D1722',
                borderRadius: 4, padding: '2px 8px', fontWeight: 400,
              }}>
                {badgeText}
              </span>
            </div>
          </div>
        ) : (
          /* Age mode: badge left, range right */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{
              fontSize: 12, background: badgeBg, color: '#0D1722',
              borderRadius: 4, padding: '2px 8px', fontWeight: 400,
            }}>
              {badgeText}
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>{primaryText}</span>
          </div>
        )
      )}

      {/* Track */}
      <div
        ref={trackRef}
        style={{ position: 'relative', height: 24, cursor: 'pointer', userSelect: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Gray base */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 6, background: '#E5E5E5', borderRadius: 3,
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        {/* Colored fill between lo and hi */}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${loPct}%`, width: `${hiPct - loPct}%`,
          height: 6, background: trackColor, borderRadius: 3,
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        {/* Dotted stop markers */}
        {effectivePcts.map((pct, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: `${pct}%`,
            width: 14, height: 14,
            border: '1.5px dotted #C8CDD2', borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', background: 'transparent', zIndex: 1,
          }} />
        ))}
        {/* Lo thumb */}
        <div style={{
          position: 'absolute', top: '50%', left: `${loPct}%`,
          width: 24, height: 24,
          background: '#fff', border: `1px solid ${thumbColor}`, borderRadius: '50%',
          boxShadow: '0 0 6px rgba(0,0,0,0.18)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 2,
        }} />
        {/* Hi thumb */}
        <div style={{
          position: 'absolute', top: '50%', left: `${hiPct}%`,
          width: 24, height: 24,
          background: '#fff', border: `1px solid ${thumbColor}`, borderRadius: '50%',
          boxShadow: '0 0 6px rgba(0,0,0,0.18)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 2,
        }} />
      </div>

      {/* Stop labels */}
      <div style={{ position: 'relative', height: 18, marginTop: 2 }}>
        {STOP_LABELS.map((label, i) => {
          const pct     = effectivePcts[i]
          const isFirst = i === 0
          const isLast  = i === STOP_LABELS.length - 1
          return (
            <span key={label} style={{
              position: 'absolute',
              left:  isLast  ? 'auto' : isFirst ? 0 : `${pct}%`,
              right: isLast  ? 0 : 'auto',
              transform: (!isFirst && !isLast) ? 'translateX(-50%)' : 'none',
              fontSize: 12,
              color: '#5E6976',
              fontWeight: 400,
            }}>
              {label}
            </span>
          )
        })}
      </div>

      {/* Secondary age-in-years context — only in model-year mode */}
      {showModelYears && (
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#9AA3AD' }}>({ageSubtext})</span>
        </div>
      )}
    </div>
  )
}
