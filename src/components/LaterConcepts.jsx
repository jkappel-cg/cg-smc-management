import SectionCard from './SectionCard.jsx'
import SnappingAgeSlider from './SnappingAgeSlider.jsx'
import GuardrailSlider from './GuardrailSlider.jsx'
import FieldBlock from './FieldBlock.jsx'

// Per-year lead distribution (sums to 100). stopIndex ties each bar to the SnappingAgeSlider stops.
// stopIndex 0 = ≤2yr, 1 = ≤5yr, 2 = ≤10yr, 3 = all
const BARS = [
  { year: '1',  pct: 4,  stopIndex: 0 },
  { year: '2',  pct: 7,  stopIndex: 0 },
  { year: '3',  pct: 10, stopIndex: 1 },
  { year: '4',  pct: 12, stopIndex: 1 },
  { year: '5',  pct: 11, stopIndex: 1 },
  { year: '6',  pct: 10, stopIndex: 2 },
  { year: '7',  pct: 9,  stopIndex: 2 },
  { year: '8',  pct: 8,  stopIndex: 2 },
  { year: '9',  pct: 7,  stopIndex: 2 },
  { year: '10', pct: 6,  stopIndex: 2 },
  { year: '11', pct: 5,  stopIndex: 3 },
  { year: '12', pct: 4,  stopIndex: 3 },
  { year: '13', pct: 3,  stopIndex: 3 },
  { year: '14', pct: 2,  stopIndex: 3 },
  { year: '15', pct: 1,  stopIndex: 3 },
  { year: '16', pct: 1,  stopIndex: 3 },
]
const MAX_BAR_PCT = Math.max(...BARS.map(b => b.pct))
const CHART_HEIGHT = 100

// X-axis tick positions — show year labels only at key breakpoints
const TICKS = ['1', '5', '10', '15']

export default function LaterConcepts({ maxAgeStop, onAgeStopChange, biddingRadius, onBiddingRadiusChange }) {
  const coveredPct = BARS
    .filter(b => b.stopIndex <= maxAgeStop)
    .reduce((sum, b) => sum + b.pct, 0)

  return (
    <div>
      {/* Later concepts label */}
      <div style={{
        fontSize: 12, fontWeight: 600, color: '#b625ce',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        Later concepts
      </div>

      {/* Card 1 — Leads Distribution Impact */}
      <SectionCard title="Available leads by vehicle age">
        <div style={{ padding: '20px 0' }}>
          <p style={{ fontSize: 14, color: '#5E6976', marginBottom: 20 }}>
            This chart shows how your lead volume is distributed across vehicle ages.
            Restricting your max vehicle age cuts off the bars to the right — directly
            reducing the share of leads you're eligible to receive.
          </p>

          {/* Bar chart */}
          <div style={{
            position: 'relative',
            display: 'flex',
            gap: 4,
            alignItems: 'flex-end',
            height: CHART_HEIGHT,
            marginBottom: 6,
          }}>
            {BARS.map(bar => {
              const included = bar.stopIndex <= maxAgeStop
              const barH = Math.round((bar.pct / MAX_BAR_PCT) * CHART_HEIGHT)
              return (
                <div
                  key={bar.year}
                  style={{
                    flex: 1,
                    height: barH,
                    background: included ? '#09AD0E' : '#C8CDD2',
                    borderRadius: '3px 3px 0 0',
                    transition: 'background 0.2s',
                    minWidth: 0,
                  }}
                />
              )
            })}
          </div>

          {/* X-axis baseline */}
          <div style={{ borderTop: '1px solid #e0e0e0', marginBottom: 4 }} />

          {/* X-axis labels at key year marks */}
          <div style={{ position: 'relative', height: 16, marginBottom: 20 }}>
            {BARS.map((bar, i) => {
              if (!TICKS.includes(bar.year)) return null
              const pct = (i / (BARS.length - 1)) * 100
              const isFirst = i === 0
              const isLast = i === BARS.length - 1
              return (
                <span key={bar.year} style={{
                  position: 'absolute',
                  left: isLast ? 'auto' : isFirst ? 0 : `${pct}%`,
                  right: isLast ? 0 : 'auto',
                  transform: (!isFirst && !isLast) ? 'translateX(-50%)' : 'none',
                  fontSize: 12,
                  color: '#5E6976',
                }}>
                  {`Yr ${bar.year}`}
                </span>
              )
            })}
            <span style={{ position: 'absolute', right: 0, fontSize: 12, color: '#5E6976' }}>
              Yr 16+
            </span>
          </div>

          {/* Coverage summary */}
          <p style={{ fontSize: 14, color: '#5E6976', marginBottom: 20 }}>
            <span style={{ fontWeight: 600, color: '#0D1722' }}>~{coveredPct}%</span> of available leads eligible with current age setting
          </p>

          {/* Age slider */}
          <SnappingAgeSlider value={maxAgeStop} onChange={onAgeStopChange} />
        </div>
      </SectionCard>

      {/* Card 2 — Bidding Radius */}
      <SectionCard title="Bidding radius">
        <FieldBlock
          label="Search radius"
          description="Maximum distance from your dealership to accept leads from"
          last
          inlineControl={
            <div style={{ width: '55%' }}>
              <GuardrailSlider
                value={biddingRadius}
                onChange={onBiddingRadiusChange}
                min={0} max={400} step={1}
                recLo={150} recHi={200}
                formatValue={v => `${v} mi`}
                formatLabel={v => `${v}`}
              />
            </div>
          }
        />
      </SectionCard>
    </div>
  )
}
