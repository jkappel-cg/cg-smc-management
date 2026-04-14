import { useState } from 'react'
import GuardrailSlider from './GuardrailSlider.jsx'

// Conversion factor: $250 per 1% (based on ~$25k average vehicle value)
const FACTOR = 250

const SECTIONS = [
  {
    header: 'Major impact',
    items: [
      { key: 'notDriveable', label: 'Not driveable', badge: true },
      { key: 'badTires',    label: 'Bad tires',         default: 800,  recLo: 600, recMax: 1000, defaultUnit: '$' },
      { key: 'windshield',  label: 'Windshield damage', default: 700,  recLo: 500, recMax: 900,  defaultUnit: '$' },
      { key: 'fadedPaint',  label: 'Faded paint',       default: 750,  recLo: 500, recMax: 1000, defaultUnit: '$' },
      { key: 'rust',        label: 'Rust',              default: 1000, recLo: 700, recMax: 1200, defaultUnit: '$' },
      { key: 'hailDamage',  label: 'Hail damage',       default: 1000, recLo: 700, recMax: 1200, defaultUnit: '$' },
      { key: 'accidents',   label: 'Accidents',          default: 5,    recLo: 3,   recMax: 15,   defaultUnit: '%',
        dollarDefault: 500, dollarRecLo: 300, dollarRecMax: 1000 },
    ],
  },
  {
    header: 'Moderate impact',
    items: [
      { key: 'roughCondition', label: 'Rough condition',   default: 300, recLo: 200, recMax: 500, defaultUnit: '$' },
      { key: 'smoker',         label: 'Smoker',            default: 300, recLo: 150, recMax: 400, defaultUnit: '$' },
      { key: 'dents',          label: 'Dents',             default: 300, recLo: 150, recMax: 500, defaultUnit: '$' },
      { key: 'oneKey',         label: 'One key only',      default: 250, recLo: 150, recMax: 400, defaultUnit: '$' },
      { key: 'mechanical',     label: 'Mechanical defects',default: 250, recLo: 150, recMax: 400, defaultUnit: '$' },
    ],
  },
  {
    header: 'Minor impact',
    items: [
      { key: 'scratches', label: 'Scratches', default: 100, recLo: 50, recMax: 200, defaultUnit: '$' },
      { key: 'dings',     label: 'Dings',     default: 100, recLo: 50, recMax: 200, defaultUnit: '$' },
      { key: 'chips',     label: 'Chips',     default: 100, recLo: 50, recMax: 200, defaultUnit: '$' },
      { key: 'scuffs',    label: 'Scuffs',    default: 100, recLo: 50, recMax: 200, defaultUnit: '$' },
    ],
  },
  {
    header: 'No impact',
    items: [
      { key: 'aftermarket', label: 'Aftermarket parts',   static: true, default: 100, recLo: 50, recMax: 200, defaultUnit: '$' },
      { key: 'fadingPaint', label: 'Fading paint',        static: true, default: 100, recLo: 50, recMax: 200, defaultUnit: '$' },
      { key: 'manual',      label: 'Manual transmission', static: true, default: 150, recLo: 50, recMax: 250, defaultUnit: '$' },
    ],
  },
]

function initValues() {
  const vals = {}
  for (const s of SECTIONS) for (const item of s.items)
    if (!item.badge) vals[item.key] = item.static ? 0 : item.default
  return vals
}

function initUnits() {
  const u = {}
  for (const s of SECTIONS) for (const item of s.items)
    if (!item.badge) u[item.key] = item.defaultUnit || '$'
  return u
}

// Get slider config (min/max/recLo/recHi/step) for item in a given unit
function getConfig(item, unit) {
  if (item.dollarDefault) {
    // Accidents: explicit values for each unit
    if (unit === '%') return { min: 0, max: 30,   step: 1,   recLo: item.recLo,       recHi: item.recMax }
    else              return { min: 0, max: item.dollarRecMax * 2, step: 50, recLo: item.dollarRecLo, recHi: item.dollarRecMax }
  }
  if (unit === '$') return { min: 0, max: item.recMax * 2, step: 50, recLo: item.recLo, recHi: item.recMax }
  // % mode for $-native items: convert via FACTOR
  const pLo  = Math.round((item.recLo  / FACTOR) * 10) / 10
  const pHi  = Math.round((item.recMax / FACTOR) * 10) / 10
  const pMax = Math.round((item.recMax * 2 / FACTOR) * 10) / 10
  return { min: 0, max: pMax, step: 0.5, recLo: pLo, recHi: pHi }
}

function getFmt(unit) {
  if (unit === '$') return {
    formatValue: v => v === 0 ? 'No deduction' : `−$${v.toLocaleString()}`,
    formatLabel: v => v >= 1000 ? `$${v / 1000}k` : `$${v}`,
  }
  return {
    formatValue: v => v === 0 ? 'No deduction' : `−${v}%`,
    formatLabel: v => `${v}%`,
  }
}

function UnitToggle({ unit, onChange }) {
  return (
    <div style={{ display: 'inline-flex' }}>
      {['$', '%'].map((u, i) => {
        const selected = unit === u
        return (
          <button key={u} onClick={() => onChange(u)} style={{
            padding: '0 8px',
            height: 28,
            fontSize: 12,
            fontWeight: 400,
            background: selected ? '#E4F5FE' : '#fff',
            color: selected ? '#0D1722' : '#5E6976',
            border: selected ? '1px solid #0763D3' : '1px solid #cccccc',
            borderRadius: i === 0 ? '4px 0 0 4px' : '0 4px 4px 0',
            marginLeft: i === 0 ? 0 : -1,
            zIndex: selected ? 1 : 0,
            position: 'relative',
            cursor: 'pointer',
          }}>{u}</button>
        )
      })}
    </div>
  )
}

const Divider = () => <div style={{ height: 1, background: '#f0f0f0', width: '100%', marginTop: 12 }} />

export default function ConditionSliders() {
  const [values, setValues]             = useState(initValues)
  const [units, setUnits]               = useState(initUnits)
  const [rawInputs, setRawInputs]       = useState({})
  const [staticExpanded, setStaticExpanded] = useState({})

  function set(key, val) { setValues(v => ({ ...v, [key]: val })) }

  function changeUnit(item, newUnit) {
    const oldUnit = units[item.key]
    if (oldUnit === newUnit) return
    const cur = values[item.key]
    let next
    if (item.dollarDefault) {
      next = newUnit === '%' ? item.default : item.dollarDefault
    } else if (oldUnit === '$') {
      next = Math.round((cur / FACTOR) * 10) / 10
    } else {
      next = Math.round(cur * FACTOR)
    }
    setUnits(u => ({ ...u, [item.key]: newUnit }))
    setValues(v => ({ ...v, [item.key]: next }))
    setRawInputs(r => { const n = { ...r }; delete n[item.key]; return n })
  }

  function handleStaticExpand(item, clickedUnit) {
    const isExpanded = staticExpanded[item.key]
    const currentUnit = units[item.key]
    if (!isExpanded) {
      setStaticExpanded(e => ({ ...e, [item.key]: true }))
      setUnits(u => ({ ...u, [item.key]: clickedUnit }))
      setValues(v => ({ ...v, [item.key]: item.default }))
    } else if (currentUnit === clickedUnit) {
      setStaticExpanded(e => ({ ...e, [item.key]: false }))
      setValues(v => ({ ...v, [item.key]: 0 }))
      setRawInputs(r => { const n = { ...r }; delete n[item.key]; return n })
    } else {
      changeUnit(item, clickedUnit)
    }
  }

  function handleInputChange(key, raw) {
    setRawInputs(r => ({ ...r, [key]: raw }))
  }

  function commitInput(item, raw) {
    const unit = units[item.key]
    const cfg  = getConfig(item, unit)
    const parsed = parseFloat(String(raw).replace(/[$,%]/g, '').replace(/,/g, ''))
    if (!isNaN(parsed) && parsed >= 0) {
      set(item.key, Math.min(cfg.max, Math.max(cfg.min, parsed)))
    }
    setRawInputs(r => { const n = { ...r }; delete n[item.key]; return n })
  }

  function handleInputBlur(item, raw) { commitInput(item, raw) }

  function handleInputKeyDown(e, item) {
    if (e.key === 'Enter') { commitInput(item, e.target.value); e.target.blur() }
  }

  const inputStyle = {
    width: 90, height: 28,
    border: '1px solid #cccccc',
    borderRadius: 4,
    fontSize: 14,
    padding: '2px 8px',
    textAlign: 'right',
    outline: 'none',
    color: '#0D1722',
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#5E6976', marginBottom: 4 }}>
        We automatically adjust your offers based on the condition the consumer selects.
      </p>
      <p style={{ fontSize: 14, color: '#0D1722', marginBottom: 20 }}>
        Example: If a consumer selects "Bad tires," your offer is reduced by $800 based on the rules below.
      </p>

      {SECTIONS.map((section, si) => (
        <div key={section.header}>
          {/* Section header */}
          <div style={{
            fontSize: 14, fontWeight: 600, color: '#0D1722',
            paddingTop: 4, paddingBottom: 6,
            marginTop: si > 0 ? 36 : 0,
          }}>
            {section.header}
          </div>

          {section.items.map((item, idx) => {
            const isLast = idx === section.items.length - 1

            /* ── "Not driveable" — no offer ── */
            if (item.badge) return (
              <div key={item.key} style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>{item.label}</span>
                  <div style={{ width: '55%' }}>
                    <span style={{ fontSize: 12, background: '#FFE2E2', color: '#0D1722', borderRadius: 4, padding: '2px 8px', fontWeight: 400 }}>
                      No offer made
                    </span>
                  </div>
                </div>
                {!isLast && <Divider />}
              </div>
            )

            /* ── Static "no adjustment" items ── */
            if (item.static) {
              const isExpanded = staticExpanded[item.key]
              const unit = units[item.key]

              if (!isExpanded) {
                return (
                  <div key={item.key} style={{ padding: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>{item.label}</span>
                      <div style={{ width: '55%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#5E6976' }}>No adjustment</span>
                        <UnitToggle unit={null} onChange={u => handleStaticExpand(item, u)} />
                      </div>
                    </div>
                    {!isLast && <Divider />}
                  </div>
                )
              }

              // Expanded — label left, full slider right
              const val = values[item.key]
              const cfg = getConfig(item, unit)
              const { formatValue, formatLabel } = getFmt(unit)
              const inRange = val >= cfg.recLo && val <= cfg.recHi
              const badgeText = val === 0 ? 'No adjustment' : inRange ? 'Recommended' : val < cfg.recLo ? 'Below recommended' : 'Above recommended'
              const badgeBg   = val === 0 ? '#F0F2F4' : inRange ? '#DCF7DD' : '#FFF1C0'
              const badgeColor = val === 0 ? '#5E6976' : '#0D1722'
              const inputDisplay = item.key in rawInputs ? rawInputs[item.key] : (unit === '$' ? `$${val}` : `${val}%`)

              return (
                <div key={item.key} style={{ padding: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>{item.label}</span>
                    <div style={{ width: '55%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, background: badgeBg, color: badgeColor, borderRadius: 4, padding: '2px 8px', fontWeight: 400, whiteSpace: 'nowrap' }}>
                          {badgeText}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <UnitToggle unit={unit} onChange={u => handleStaticExpand(item, u)} />
                          <input
                            type="text"
                            value={inputDisplay}
                            onChange={e => handleInputChange(item.key, e.target.value)}
                            onBlur={e => handleInputBlur(item, e.target.value)}
                            onKeyDown={e => handleInputKeyDown(e, item)}
                            onFocus={e => e.target.select()}
                            style={inputStyle}
                            onMouseEnter={e => { e.target.style.borderColor = '#0066cc' }}
                            onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor = '#cccccc' }}
                          />
                        </div>
                      </div>
                      <GuardrailSlider
                        noHeader
                        value={val}
                        onChange={v => set(item.key, v)}
                        min={cfg.min} max={cfg.max} step={cfg.step}
                        recLo={cfg.recLo} recHi={cfg.recHi}
                        formatValue={formatValue}
                        formatLabel={formatLabel}
                      />
                    </div>
                  </div>
                  {!isLast && <Divider />}
                </div>
              )
            }

            /* ── Regular slider item ── */
            const unit = units[item.key]
            const val  = values[item.key]
            const cfg  = getConfig(item, unit)
            const { formatValue, formatLabel } = getFmt(unit)
            const inRange = val >= cfg.recLo && val <= cfg.recHi
            const badgeText = val === 0 ? 'No adjustment' : inRange ? 'Recommended' : val < cfg.recLo ? 'Below recommended' : 'Above recommended'
            const badgeBg   = val === 0 ? '#F0F2F4' : inRange ? '#DCF7DD' : '#FFF1C0'
            const badgeColor = val === 0 ? '#5E6976' : '#0D1722'
            const inputDisplay = item.key in rawInputs ? rawInputs[item.key] : String(val)

            return (
              <div key={item.key} style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Left: label */}
                  <span style={{ fontSize: 14, fontWeight: 400, color: '#0D1722' }}>{item.label}</span>
                  {/* Right: badge upper-left, toggle+input upper-right, slider below */}
                  <div style={{ width: '55%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, background: badgeBg, color: badgeColor, borderRadius: 4, padding: '2px 8px', fontWeight: 400, whiteSpace: 'nowrap' }}>
                        {badgeText}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <UnitToggle unit={unit} onChange={u => changeUnit(item, u)} />
                        <input
                          type="number"
                          value={inputDisplay}
                          onChange={e => handleInputChange(item.key, e.target.value)}
                          onBlur={e => handleInputBlur(item, e.target.value)}
                          onFocus={e => e.target.select()}
                          style={inputStyle}
                          onMouseEnter={e => { e.target.style.borderColor = '#0066cc' }}
                          onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor = '#cccccc' }}
                        />
                      </div>
                    </div>
                    <GuardrailSlider
                      noHeader
                      value={val}
                      onChange={v => set(item.key, v)}
                      min={cfg.min} max={cfg.max} step={cfg.step}
                      recLo={cfg.recLo} recHi={cfg.recHi}
                      formatValue={formatValue}
                      formatLabel={formatLabel}
                    />
                  </div>
                </div>
                {!isLast && <Divider />}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
