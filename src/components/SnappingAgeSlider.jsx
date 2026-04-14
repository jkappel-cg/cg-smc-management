import { useRef } from 'react'

const AGE_YEARS  = [2, 5, 10, 15, null]          // years old per stop (null = no limit)
const AGE_LABELS = ['2 yrs', '5 yrs', '10 yrs', '15 yrs', 'No limit']
// Default evenly-spaced percentages (used when no stopPcts prop given)
const DEFAULT_STOP_PCTS = AGE_LABELS.map((_, i) => (i / (AGE_LABELS.length - 1)) * 100)
const REC_HI_IDX = 2  // "10 yrs" is the recommended upper bound
const GREEN = '#078A0B'
const GREEN_TRACK = '#09AD0E'
const AMBER_TRACK = '#F5A623'

// value         = [loIdx, hiIdx]
// onChange       = fn([loIdx, hiIdx])
// noHeader       = bool — suppress the header row (caller renders it)
// stopPcts       = number[] — custom % positions for each stop
// showModelYears = bool — show model year labels + primary year-range header
export default function SnappingAgeSlider({
  value,
  onChange,
  noHeader = false,
  stopPcts = DEFAULT_STOP_PCTS,
  showModelYears = false,
}) {
  const [lo, hi] = value
  const trackRef  = useRef()
  const dragging  = useRef(null)

  const CURRENT_YEAR = new Date().getFullYear()

  // Model year per stop: currentYear - ageYears (null → no limit)
  const MODEL_YEARS = AGE_YEARS.map(yrs => yrs === null ? null : CURRENT_YEAR - yrs)
  // Stop labels: model-year mode vs age mode
  const STOP_LABELS = showModelYears
    ? MODEL_YEARS.map((yr, i) => yr === null ? 'No limit' : String(yr))
    : AGE_LABELS

  const inRange   = hi <= REC_HI_IDX
  const loPct     = stopPcts[lo]
  const hiPct     = stopPcts[hi]
  const trackColor = inRange ? GREEN_TRACK : AMBER_TRACK
  const thumbColor = '#79828D'

  // ── Header text ──────────────────────────────────────────────────────────
  // Model-year mode: primary = "Accepting: [oldest] – [newest]"
  // Age mode: badge + age range (existing behaviour)
  const loYear = MODEL_YEARS[lo]   // newest model year (lo = youngest age)
  const hiYear = MODEL_YEARS[hi]   // oldest model year (hi = oldest age, null = no limit)

  let primaryText
  if (showModelYears) {
    if (hiYear === null) {
      primaryText = `${loYear} and older`
    } else {
      primaryText = `${hiYear} – ${loYear}`
    }
  } else {
    primaryText = lo === hi ? AGE_LABELS[lo] : `${AGE_LABELS[lo]} – ${AGE_LABELS[hi]}`
  }

  const badgeText = inRange ? 'Recommended' : 'Outside recommended range'
  const badgeBg   = inRange ? '#DCF7DD' : '#FFF1C0'

  // Secondary age-in-years label (shown only in model-year mode, below stop labels)
  const loAgeLabel = AGE_LABELS[lo]
  const hiAgeLabel = AGE_LABELS[hi]
  const ageSubtext = lo === hi ? `${loAgeLabel}` : `${loAgeLabel} – ${hiAgeLabel}`

  // ── Interaction ──────────────────────────────────────────────────────────
  function getStopIdx(clientX) {
    const rect = trackRef.current.getBoundingClientRect()
    const pct  = ((clientX - rect.left) / rect.width) * 100
    let closest = 0, minDist = Infinity
    stopPcts.forEach((sp, i) => {
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
              <span style={{ fontSize: 15, fontWeight: 600, color: '#0D1722' }}>{primaryText}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{
                fontSize: 12, background: badgeBg, color: '#0D1722',
                borderRadius: 4, padding: '2px 8px', fontWeight: 400,
              }}>
                {badgeText}
              </span>
            </div>
          </div>
        ) : (
          /* Age mode: badge left, range right (original) */
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
        {stopPcts.map((pct, i) => (
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
          const pct     = stopPcts[i]
          const isFirst = i === 0
          const isLast  = i === STOP_LABELS.length - 1
          const isRec   = i <= REC_HI_IDX
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
