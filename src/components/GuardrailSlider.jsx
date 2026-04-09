// recLo: left boundary of recommended zone (omit for one-sided up-to band)
// recHi: right boundary of recommended zone
// conditionLabel: if provided, renders label-left / badge+value-right layout (condition row mode)
export default function GuardrailSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  recLo,
  recHi,
  formatValue,
  formatLabel,
  conditionLabel,
}) {
  const lo = recLo ?? min
  const isTwoSided = recLo != null && recLo > min
  const loPct = ((lo - min) / (max - min)) * 100
  const hiPct = ((recHi - min) / (max - min)) * 100
  const valPct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const inRange = value >= lo && value <= recHi
  const GREEN = '#078A0B'
  const AMBER = '#BA7517'
  const thumbColor = inRange ? GREEN : AMBER

  let badgeText, badgeBg, badgeColor
  if (inRange) {
    badgeText = isTwoSided ? 'Recommended' : 'Within range'
    badgeBg = '#c8f0c9'; badgeColor = GREEN
  } else if (value < lo) {
    badgeText = 'Below recommended'
    badgeBg = '#fff3e0'; badgeColor = AMBER
  } else {
    badgeText = 'Above recommended'
    badgeBg = '#fff3e0'; badgeColor = AMBER
  }

  const fmt = formatLabel ?? formatValue

  const badge = (
    <span style={{
      fontSize: 11, background: badgeBg, color: badgeColor,
      borderRadius: 4, padding: '2px 8px', fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {badgeText}
    </span>
  )

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        {conditionLabel
          ? <span style={{ fontSize: 13, color: '#1a1a1a' }}>{conditionLabel}</span>
          : badge
        }
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {conditionLabel && badge}
          <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
            {formatValue(value)}
          </span>
        </div>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 28 }}>
        {/* Background track */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 5, background: '#e0e0e0', borderRadius: 3,
          transform: 'translateY(-50%)',
        }} />
        {/* Recommended zone overlay */}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${loPct}%`, width: `${hiPct - loPct}%`,
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
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', margin: 0,
          }}
        />
      </div>

      {/* Anchor labels */}
      <div style={{ position: 'relative', height: 18, marginTop: 2 }}>
        <span style={{ position: 'absolute', left: 0, fontSize: 12, color: '#9ca3af' }}>
          {fmt(min)}
        </span>
        {isTwoSided && (
          <span style={{
            position: 'absolute', left: `${loPct}%`,
            transform: 'translateX(-50%)',
            fontSize: 12, color: GREEN, fontWeight: 600,
          }}>
            {fmt(lo)}
          </span>
        )}
        <span style={{
          position: 'absolute', left: `${hiPct}%`,
          transform: 'translateX(-50%)',
          fontSize: 12, color: GREEN, fontWeight: 600,
        }}>
          {fmt(recHi)}
        </span>
        <span style={{ position: 'absolute', right: 0, fontSize: 12, color: '#9ca3af' }}>
          {fmt(max)}
        </span>
      </div>
    </div>
  )
}
