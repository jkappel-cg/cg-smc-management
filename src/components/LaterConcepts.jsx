import SectionCard from './SectionCard.jsx'
import SnappingAgeSlider from './SnappingAgeSlider.jsx'
import GuardrailSlider from './GuardrailSlider.jsx'
import FieldBlock from './FieldBlock.jsx'

// Per-year lead distribution (sums to 100). stopIndex ties each bar to the SnappingAgeSlider stops.
// stopIndex 0 = ≤2yr, 1 = ≤5yr, 2 = ≤10yr, 3 = ≤15yr, 4 = No limit
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
  { year: '16', pct: 1,  stopIndex: 4 },
]
const NUM_BARS = BARS.length  // 16
const MAX_BAR_PCT = Math.max(...BARS.map(b => b.pct))
const CHART_HEIGHT = 100

// Align each slider stop to the right edge of its corresponding bar in the flex chart.
// Bar i (0-based) occupies fraction (i+1)/NUM_BARS of the total width.
// "2 yrs"   → right edge of bar index 1  → 2/16  = 12.5%
// "5 yrs"   → right edge of bar index 4  → 5/16  = 31.25%
// "10 yrs"  → right edge of bar index 9  → 10/16 = 62.5%
// "15 yrs"  → right edge of bar index 14 → 15/16 = 93.75%
// "No limit"→ right edge of bar index 15 → 16/16 = 100%
const SLIDER_STOP_PCTS = [2, 5, 10, 15, 16].map(yr => (yr / NUM_BARS) * 100)


const REC_HI_IDX = 2  // "10 yrs"
const GREEN = '#078A0B'

export default function LaterConcepts({ ageRange, onAgeRangeChange, biddingRadius, onBiddingRadiusChange }) {
  const [lo, hi] = ageRange
  const coveredPct = BARS
    .filter(b => b.stopIndex <= hi)
    .reduce((sum, b) => sum + b.pct, 0)

  const inRange = hi <= REC_HI_IDX
  const STOPS = ['2 yrs', '5 yrs', '10 yrs', '15 yrs', 'No limit']
  const badgeText = inRange ? 'Recommended' : 'Outside recommended range'
  const badgeBg = inRange ? '#DCF7DD' : '#FFF1C0'
  const displayText = lo === hi ? STOPS[lo] : `${STOPS[lo]} – ${STOPS[hi]}`

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

          {/* Badge + range — above the chart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{
              fontSize: 12, background: badgeBg, color: '#0D1722',
              borderRadius: 4, padding: '2px 8px', fontWeight: 400,
            }}>
              {badgeText}
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>
              {displayText}
            </span>
          </div>

          <p style={{ fontSize: 14, color: '#5E6976', marginBottom: 8 }}>
            This chart shows how your lead volume is distributed across vehicle ages.
            Restricting your max vehicle age cuts off the bars to the right — directly
            reducing the share of leads you're eligible to receive.
          </p>

          {/* Coverage summary */}
          <p style={{ fontSize: 14, color: '#5E6976', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, color: '#0D1722' }}>~{coveredPct}%</span> of available leads eligible with current age setting
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
              const included = bar.stopIndex <= hi
              const barH = Math.round((bar.pct / MAX_BAR_PCT) * CHART_HEIGHT)
              return (
                <div key={bar.year} style={{
                  flex: 1,
                  height: barH,
                  background: included ? '#09AD0E' : '#C8CDD2',
                  borderRadius: '3px 3px 0 0',
                  transition: 'background 0.2s',
                  minWidth: 0,
                }} />
              )
            })}
          </div>

          {/* X-axis baseline */}
          <div style={{ borderTop: '1px solid #e0e0e0', marginBottom: 12 }} />

          {/* Age slider — stop positions aligned to bar chart x-axis */}
          <SnappingAgeSlider
            value={ageRange}
            onChange={onAgeRangeChange}
            noHeader
            stopPcts={SLIDER_STOP_PCTS}
          />
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
