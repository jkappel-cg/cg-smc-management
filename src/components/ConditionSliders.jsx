import { useState } from 'react'
import GuardrailSlider from './GuardrailSlider.jsx'

const SECTIONS = [
  {
    header: 'Major impact',
    items: [
      { key: 'notDriveable', label: 'Not driveable', badge: true },
      { key: 'badTires', label: 'Bad tires', default: 800, recMax: 1000 },
      { key: 'windshield', label: 'Windshield damage', default: 700, recMax: 900 },
      { key: 'fadedPaint', label: 'Faded paint', default: 750, recMax: 1000 },
      { key: 'rust', label: 'Rust', default: 1000, recMax: 1200 },
      { key: 'hailDamage', label: 'Hail damage', default: 1000, recMax: 1200 },
      { key: 'accidents', label: 'Accidents', isPercent: true, default: 5, recMax: 15,
        dollarDefault: 500, dollarRecMax: 1000 },
    ],
  },
  {
    header: 'Moderate impact',
    items: [
      { key: 'roughCondition', label: 'Rough condition', default: 300, recMax: 500 },
      { key: 'smoker', label: 'Smoker', default: 300, recMax: 400 },
      { key: 'dents', label: 'Dents', default: 300, recMax: 500 },
      { key: 'oneKey', label: 'One key only', default: 250, recMax: 400 },
      { key: 'mechanical', label: 'Mechanical defects', default: 250, recMax: 400 },
    ],
  },
  {
    header: 'Minor impact',
    items: [
      { key: 'scratches', label: 'Scratches', default: 100, recMax: 200 },
      { key: 'dings', label: 'Dings', default: 100, recMax: 200 },
      { key: 'chips', label: 'Chips', default: 100, recMax: 200 },
      { key: 'scuffs', label: 'Scuffs', default: 100, recMax: 200 },
    ],
  },
  {
    header: 'No impact',
    items: [
      { key: 'aftermarket', label: 'Aftermarket parts', static: true },
      { key: 'fadingPaint', label: 'Fading paint', static: true },
      { key: 'manual', label: 'Manual transmission', static: true },
    ],
  },
]

function initValues() {
  const vals = {}
  for (const section of SECTIONS) {
    for (const item of section.items) {
      if (!item.badge && !item.static) {
        vals[item.key] = item.default
      }
    }
  }
  return vals
}

function fmtDollar(v) {
  if (v === 0) return 'No deduction'
  return `−$${v.toLocaleString()}`
}
function fmtDollarLabel(v) {
  return v >= 1000 ? `$${v / 1000}k` : `$${v}`
}
function fmtPct(v) {
  if (v === 0) return 'No deduction'
  return `−${v}%`
}
function fmtPctLabel(v) {
  return `${v}%`
}

function UnitToggle({ unit, onChange }) {
  return (
    <div style={{ display: 'inline-flex', border: '1px solid #cccccc', borderRadius: 4, overflow: 'hidden', marginLeft: 8 }}>
      {['%', '$'].map(u => (
        <button
          key={u}
          onClick={() => onChange(u)}
          style={{
            padding: '2px 10px',
            fontSize: 12,
            background: unit === u ? '#0763D3' : 'transparent',
            color: unit === u ? '#fff' : '#555',
            border: 'none',
            cursor: 'pointer',
            fontWeight: unit === u ? 600 : 400,
          }}
        >
          {u}
        </button>
      ))}
    </div>
  )
}

export default function ConditionSliders() {
  const [values, setValues] = useState(initValues)
  const [accidentsUnit, setAccidentsUnit] = useState('%')

  function set(key, val) {
    setValues(v => ({ ...v, [key]: val }))
  }

  function handleUnitChange(u) {
    setAccidentsUnit(u)
    const accItem = SECTIONS[0].items.find(i => i.key === 'accidents')
    set('accidents', u === '%' ? accItem.default : accItem.dollarDefault)
  }

  return (
    <div>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
        We automatically adjust your offers based on the condition the consumer selects.
      </p>
      <p style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginBottom: 20 }}>
        Example: If a consumer selects "Bad tires," your offer is reduced by $800 based on the rules below.
      </p>

      {SECTIONS.map((section, si) => (
        <div key={section.header}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#1a1a1a',
            padding: '8px 0 8px',
            borderTop: si > 0 ? '1px solid #e0e0e0' : 'none',
            marginTop: si > 0 ? 8 : 0,
          }}>
            {section.header}
          </div>

          {section.items.map((item, idx) => {
            const isLast = idx === section.items.length - 1

            // Static "no offer made" badge
            if (item.badge) {
              return (
                <div key={item.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
                }}>
                  <span style={{ fontSize: 13, color: '#1a1a1a' }}>{item.label}</span>
                  <span style={{
                    fontSize: 11, background: '#FFE2E2', color: '#0D1722',
                    borderRadius: 4, padding: '2px 8px', fontWeight: 500,
                  }}>No offer made</span>
                </div>
              )
            }

            // Static "no adjustment"
            if (item.static) {
              return (
                <div key={item.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
                }}>
                  <span style={{ fontSize: 13, color: '#1a1a1a' }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>No adjustment</span>
                </div>
              )
            }

            // Accidents with unit toggle
            if (item.isPercent) {
              const isPct = accidentsUnit === '%'
              const recMax = isPct ? item.recMax : item.dollarRecMax
              const sliderMax = recMax * 2
              return (
                <div key={item.key} style={{
                  padding: '12px 0',
                  borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#1a1a1a' }}>{item.label}</span>
                    <UnitToggle unit={accidentsUnit} onChange={handleUnitChange} />
                  </div>
                  <GuardrailSlider
                    value={values[item.key]}
                    onChange={v => set(item.key, v)}
                    min={0}
                    max={isPct ? 30 : sliderMax}
                    step={isPct ? 1 : 50}
                    recHi={recMax}
                    formatValue={isPct ? fmtPct : fmtDollar}
                    formatLabel={isPct ? fmtPctLabel : fmtDollarLabel}
                  />
                </div>
              )
            }

            // Standard dollar deduction slider
            return (
              <div key={item.key} style={{
                padding: '12px 0',
                borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
              }}>
                <GuardrailSlider
                  value={values[item.key]}
                  onChange={v => set(item.key, v)}
                  min={0}
                  max={item.recMax * 2}
                  step={50}
                  recHi={item.recMax}
                  formatValue={fmtDollar}
                  formatLabel={fmtDollarLabel}
                  conditionLabel={item.label}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
