const STOPS = ['2 yrs', '5 yrs', '10 yrs', 'No limit']
const STOP_DISPLAYS = ['Up to 2 years old', 'Up to 5 years old', 'Up to 10 years old', 'No limit']
const REC_MAX_INDEX = 2
const GREEN = '#078A0B'
const GREEN_TRACK = '#09AD0E'
const AMBER = '#BA7517'

export default function SnappingAgeSlider({ value, onChange }) {
  const inRange = value <= REC_MAX_INDEX
  const thumbColor = inRange ? GREEN : AMBER
  const valPct = (value / (STOPS.length - 1)) * 100
  const recPct = (REC_MAX_INDEX / (STOPS.length - 1)) * 100

  return (
    <div>
      {/* Header: badge left, display text right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 12,
          background: inRange ? '#DCF7DD' : '#FFF1C0',
          color: '#0D1722',
          borderRadius: 4, padding: '2px 8px', fontWeight: 500,
        }}>
          {inRange ? 'Recommended' : 'Outside recommended range'}
        </span>
        <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>
          {STOP_DISPLAYS[value]}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 32 }}>
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 10, background: '#E5E5E5', borderRadius: 5,
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute', top: '50%',
          left: 0, width: `${recPct}%`,
          height: 10, background: GREEN_TRACK, borderRadius: 5,
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%',
          left: `${valPct}%`,
          width: 27, height: 27,
          background: '#fff',
          border: `1px solid ${thumbColor}`,
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(0,0,0,0.18)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        }} />
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
              color: isRec ? GREEN : '#5E6976',
              fontWeight: 400,
            }}>
              {stop}
            </span>
          )
        })}
      </div>

      {value === 3 && (
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
