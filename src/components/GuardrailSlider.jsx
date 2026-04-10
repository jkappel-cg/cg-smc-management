export default function GuardrailSlider({
  value, onChange, min, max, step = 1,
  recLo, recHi, formatValue, formatLabel, conditionLabel, noHeader = false,
}) {
  const lo = recLo ?? min
  const isTwoSided = recLo != null && recLo > min
  const loPct = ((lo - min) / (max - min)) * 100
  const hiPct = ((recHi - min) / (max - min)) * 100
  const valPct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const inRange = value >= lo && value <= recHi
  const GREEN = '#078A0B'
  const GREEN_TRACK = '#09AD0E'
  const AMBER = '#BA7517'
  const thumbColor = inRange ? GREEN : AMBER

  let badgeText, badgeBg
  if (inRange)         { badgeText = isTwoSided ? 'Recommended' : 'Within range'; badgeBg = '#DCF7DD' }
  else if (value < lo) { badgeText = 'Below recommended'; badgeBg = '#FFF1C0' }
  else                 { badgeText = 'Above recommended';  badgeBg = '#FFF1C0' }

  const fmt = formatLabel ?? formatValue

  const badge = (
    <span style={{ fontSize: 12, background: badgeBg, color: '#0D1722', borderRadius: 4, padding: '2px 8px', fontWeight: 400, whiteSpace: 'nowrap' }}>
      {badgeText}
    </span>
  )

  return (
    <div>
      {/* Header row — skipped when noHeader=true (caller renders its own) */}
      {!noHeader && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          {conditionLabel
            ? <span style={{ fontSize: 14, fontWeight: 600, color: '#0D1722' }}>{conditionLabel}</span>
            : badge
          }
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {conditionLabel && badge}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722', whiteSpace: 'nowrap' }}>
              {formatValue(value)}
            </span>
          </div>
        </div>
      )}

      {/* Track */}
      <div style={{ position: 'relative', height: 24 }}>
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 6, background: '#E5E5E5', borderRadius: 3,
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute', top: '50%',
          left: `${loPct}%`, width: `${hiPct - loPct}%`,
          height: 6, background: GREEN_TRACK, borderRadius: 3,
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${valPct}%`,
          width: 24, height: 24,
          background: '#fff', border: `1px solid ${thumbColor}`, borderRadius: '50%',
          boxShadow: '0 0 5px rgba(0,0,0,0.15)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', margin: 0 }}
        />
      </div>

      {/* Anchor labels */}
      <div style={{ position: 'relative', height: 18, marginTop: 2 }}>
        <span style={{ position: 'absolute', left: 0, fontSize: 12, color: '#5E6976' }}>{fmt(min)}</span>
        {isTwoSided && (
          <span style={{ position: 'absolute', left: `${loPct}%`, transform: 'translateX(-50%)', fontSize: 12, color: GREEN, fontWeight: 400 }}>
            {fmt(lo)}
          </span>
        )}
        <span style={{ position: 'absolute', left: `${hiPct}%`, transform: 'translateX(-50%)', fontSize: 12, color: GREEN, fontWeight: 400 }}>
          {fmt(recHi)}
        </span>
        <span style={{ position: 'absolute', right: 0, fontSize: 12, color: '#5E6976' }}>{fmt(max)}</span>
      </div>
    </div>
  )
}
