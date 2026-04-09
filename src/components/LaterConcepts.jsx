import { useState } from 'react'
import SectionCard from './SectionCard.jsx'
import SnappingAgeSlider from './SnappingAgeSlider.jsx'
import GuardrailSlider from './GuardrailSlider.jsx'

const BARS = [
  { label: '0–2 yrs', pct: 18, stopIndex: 0 },
  { label: '3–5 yrs', pct: 28, stopIndex: 1 },
  { label: '6–10 yrs', pct: 32, stopIndex: 2 },
  { label: '10+ yrs', pct: 22, stopIndex: 3 },
]
const MAX_BAR_PCT = 32
const CHART_HEIGHT = 80 // px

export default function LaterConcepts({ maxAgeStop, onAgeStopChange, biddingRadius, onBiddingRadiusChange }) {
  const coveredPct = BARS
    .filter(b => b.stopIndex <= maxAgeStop)
    .reduce((sum, b) => sum + b.pct, 0)

  return (
    <div>
      {/* Later concepts label */}
      <div style={{
        fontSize: 11, fontWeight: 600, color: '#b625ce',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        Later concepts
      </div>

      {/* Card 1 — Leads Distribution Impact */}
      <SectionCard title="Leads distribution impact">
        <div style={{ padding: '20px 0' }}>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
            Approximate inventory coverage based on your max vehicle age setting.
          </p>

          {/* Bar chart */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: CHART_HEIGHT + 32, marginBottom: 16 }}>
            {BARS.map(bar => {
              const included = bar.stopIndex <= maxAgeStop
              const barH = Math.round((bar.pct / MAX_BAR_PCT) * CHART_HEIGHT)
              return (
                <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  {/* Percentage label */}
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: included ? '#078A0B' : '#9ca3af',
                    marginBottom: 4,
                  }}>
                    {bar.pct}%
                  </span>
                  {/* Bar */}
                  <div style={{
                    width: '100%',
                    height: barH,
                    background: included ? '#078A0B' : '#9ca3af',
                    opacity: included ? 0.7 : 0.4,
                    borderRadius: '3px 3px 0 0',
                    transition: 'background 0.2s, opacity 0.2s',
                  }} />
                  {/* Age range label */}
                  <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                    {bar.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>~{coveredPct}%</span> of inventory covered
          </p>

          {/* Age slider */}
          <SnappingAgeSlider value={maxAgeStop} onChange={onAgeStopChange} />
        </div>
      </SectionCard>

      {/* Card 2 — Bidding Radius */}
      <SectionCard title="Bidding radius">
        <div style={{ padding: '20px 0' }}>
          <GuardrailSlider
            value={biddingRadius}
            onChange={onBiddingRadiusChange}
            min={0} max={400} step={1}
            recLo={150} recHi={200}
            formatValue={v => `${v} mi`}
            formatLabel={v => v === 400 ? '400 mi' : `${v}`}
          />
        </div>
      </SectionCard>
    </div>
  )
}
