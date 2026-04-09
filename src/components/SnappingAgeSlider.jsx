const STOPS = ['2 yrs', '5 yrs', '10 yrs', 'No limit']
const STOP_DISPLAYS = ['Up to 2 years old', 'Up to 5 years old', 'Up to 10 years old', 'No limit']
const REC_MAX_INDEX = 2 // "10 yrs" is the last recommended stop
const GREEN = '#078A0B'
const AMBER = '#BA7517'

export default function SnappingAgeSlider({ value, onChange }) {
  const inRange = value <= REC_MAX_INDEX
  const thumbColor = inRange ? GREEN : AMBER
  const valPct = (value / (STOPS.length - 1)) * 100
  const recPct = (REC_MAX_INDEX / (STOPS.length - 1)) * 100 // 66.67%

  return (
    <div>
      {/* Header: badge + display label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 11,
          background: inRange ? '#c8f0c9' : '#fff3e0',
          color: inRange ? GREEN : AMBER,
          borderRadius: 4, padding: '2px 8px', fontWeight: 500,
        }}>
          {inRange ? 'Recommended' : 'Outside recommended range'}
        </span>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a' }}>
          {STOP_DISPLAYS[value]}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 28 }}>
        {/* Background track */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 5, background: '#e0e0e0', borderRadius: 3,
          transform: 'translateY(-50%)',
        }} />
        {/* Green zone: left → 10 yrs stop */}
        <div style={{
          position: 'absolute', top: '50%',
          left: 0, width: `${recPct}%`,
          height: 5, background: GREEN, opacity: 0.45, borderRadius: 3,
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        {/* Visual thumb */}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${valPct}%`,
          width: 20, height: 20,
          background: '#fff', border: `2px solid ${thumbColor}`, borderRadius: '50%',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        }} />
        {/* Native input */}
        <input
          type="range" min={0} max={3} step={1} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', margin: 0,
          }}
        />
      </div>

      {/* Stop labels */}
      <div style={{ position: 'relative', height: 18, marginTop: 2 }}>
        {STOPS.map((stop, i) => {
          const pct = (i / (STOPS.length - 1)) * 100
          const isRec = i <= REC_MAX_INDEX
          const isFirst = i === 0
          const isLast = i === STOPS.length - 1
          return (
            <span key={stop} style={{
              position: 'absolute',
              left: isLast ? 'auto' : isFirst ? 0 : `${pct}%`,
              right: isLast ? 0 : 'auto',
              transform: (!isFirst && !isLast) ? 'translateX(-50%)' : 'none',
              fontSize: 12,
              color: isRec ? GREEN : '#9ca3af',
              fontWeight: isRec ? 600 : 400,
            }}>
              {stop}
            </span>
          )
        })}
      </div>

      {/* Amber warning for No limit */}
      {value === 3 && (
        <div style={{
          marginTop: 10, padding: '8px 12px',
          background: '#fff3e0', border: '1px solid #f5c800',
          borderRadius: 6, fontSize: 13, color: AMBER,
        }}>
          ⚠ No vehicle age limit may reduce offer accuracy for older vehicles.
        </div>
      )}
    </div>
  )
}
