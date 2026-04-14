import { useRef } from 'react'

const STOPS = ['2 yrs', '5 yrs', '10 yrs', '15 yrs', 'No limit']
const REC_HI_IDX = 2  // "10 yrs" is the recommended upper bound
const GREEN = '#078A0B'
const GREEN_TRACK = '#09AD0E'
const AMBER = '#BA7517'
const AMBER_TRACK = '#F5A623'

// value = [loIdx, hiIdx]
// onChange = fn([loIdx, hiIdx])
export default function SnappingAgeSlider({ value, onChange }) {
  const [lo, hi] = value
  const trackRef = useRef()
  const dragging = useRef(null)

  const inRange = hi <= REC_HI_IDX
  const loPct = (lo / (STOPS.length - 1)) * 100
  const hiPct = (hi / (STOPS.length - 1)) * 100
  const trackColor = inRange ? GREEN_TRACK : AMBER_TRACK
  const thumbColor = inRange ? GREEN : AMBER
  const badgeText = inRange ? 'Recommended' : 'Outside recommended range'
  const badgeBg = inRange ? '#DCF7DD' : '#FFF1C0'
  const displayText = lo === hi ? STOPS[lo] : `${STOPS[lo]} – ${STOPS[hi]}`

  function getStopIdx(clientX) {
    const rect = trackRef.current.getBoundingClientRect()
    const pct = (clientX - rect.left) / rect.width
    return Math.max(0, Math.min(STOPS.length - 1, Math.round(pct * (STOPS.length - 1))))
  }

  function handlePointerDown(e) {
    const idx = getStopIdx(e.clientX)
    const distToLo = Math.abs(idx - lo)
    const distToHi = Math.abs(idx - hi)
    // If equidistant, clicking left of center moves lo, right moves hi
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
    if (dragging.current === 'lo') {
      onChange([Math.min(idx, hi), hi])
    } else {
      onChange([lo, Math.max(idx, lo)])
    }
  }

  function handlePointerUp() {
    dragging.current = null
  }

  return (
    <div>
      {/* Header: badge left, range text right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 12,
          background: badgeBg,
          color: '#0D1722',
          borderRadius: 4, padding: '2px 8px', fontWeight: 400,
        }}>
          {badgeText}
        </span>
        <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>
          {displayText}
        </span>
      </div>

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
        {/* Colored range between lo and hi */}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${loPct}%`, width: `${hiPct - loPct}%`,
          height: 6, background: trackColor, borderRadius: 3,
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        {/* Dotted circle markers at each stop */}
        {STOPS.map((_, i) => {
          const pct = (i / (STOPS.length - 1)) * 100
          return (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: `${pct}%`,
              width: 14, height: 14,
              border: '1.5px dotted #C8CDD2', borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', background: 'transparent', zIndex: 1,
            }} />
          )
        })}
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
        {STOPS.map((stop, i) => {
          const pct = (i / (STOPS.length - 1)) * 100
          const isFirst = i === 0
          const isLast = i === STOPS.length - 1
          const inRec = i <= REC_HI_IDX
          return (
            <span key={stop} style={{
              position: 'absolute',
              left: isLast ? 'auto' : isFirst ? 0 : `${pct}%`,
              right: isLast ? 0 : 'auto',
              transform: (!isFirst && !isLast) ? 'translateX(-50%)' : 'none',
              fontSize: 12,
              color: inRec ? GREEN : '#5E6976',
              fontWeight: 400,
            }}>
              {stop}
            </span>
          )
        })}
      </div>

      {hi === STOPS.length - 1 && (
        <div style={{
          marginTop: 10, padding: '8px 12px',
          background: '#FFF1C0', border: '1px solid #f5c800',
          borderRadius: 6, fontSize: 14, color: '#0D1722',
        }}>
          ⚠ No vehicle age limit may reduce offer accuracy for older vehicles.
        </div>
      )}
    </div>
  )
}
