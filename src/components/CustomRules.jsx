import { useState } from 'react'

const CAR_MAKES = [
  'Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge',
  'Ford','Genesis','GMC','Honda','Hyundai','Infiniti','Jeep','Kia',
  'Land Rover','Lexus','Lincoln','Mazda','Mercedes-Benz','Nissan',
  'Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo',
]
const CURRENT_YEAR = new Date().getFullYear()

// Only Make and Year — mileage and model removed
const CONDITION_OPTIONS = [
  { value: 'make',      label: 'Make' },
  { value: 'modelYear', label: 'Year' },
]

const defaultCondition = () => ({
  type: null,
  make: 'Ford',
  modelYearOperator: 'before',
  modelYearValue: '',
})

const defaultForm = () => ({
  action: null,
  reducePercent: 10,
  increasePercent: 5,
  conditions: [defaultCondition()],
  enabled: true,
})

function getConditionText(cond) {
  if (cond.type === 'make')      return `${cond.make} vehicles`
  if (cond.type === 'modelYear') return `vehicles ${cond.modelYearOperator} ${cond.modelYearValue || '____'}`
  return 'vehicles'
}

function getSummary({ action, reducePercent, increasePercent, conditions }) {
  if (!action) return null
  const subject = conditions.length === 1
    ? getConditionText(conditions[0])
    : conditions.map(getConditionText).join(' and ')
  if (action === 'reduce')   return `Reduce offers by ${reducePercent}% on ${subject}`
  if (action === 'increase') return `Increase offers by ${increasePercent}% on ${subject}`
}

function isValid({ action, conditions }) {
  if (!action) return false
  return conditions.every(c => {
    if (!c.type) return false
    if (c.type === 'modelYear' && !c.modelYearValue) return false
    return true
  })
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: value ? '#0763D3' : '#C8CDD2',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.15s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2,
        left: value ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.15s',
      }} />
    </div>
  )
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {options.map((opt, i) => {
        const selected = value === opt.value
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            padding: '6px 14px', fontSize: 13, fontWeight: 400,
            background: selected ? '#E4F5FE' : '#fff',
            color: selected ? '#0D1722' : '#5E6976',
            border: selected ? '1px solid #0763D3' : '1px solid #cccccc',
            borderRadius: i === 0 ? '6px 0 0 6px' : i === options.length - 1 ? '0 6px 6px 0' : 0,
            marginLeft: i === 0 ? 0 : -1,
            zIndex: selected ? 1 : 0, position: 'relative',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{opt.label}</button>
        )
      })}
    </div>
  )
}

function InlineSelect({ value, onChange, options, width = 110 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        appearance: 'none', WebkitAppearance: 'none',
        width: '100%', padding: '5px 28px 5px 10px',
        fontSize: 14, color: '#0D1722', background: '#fff',
        border: '1px solid #cccccc', borderRadius: 4,
        cursor: 'pointer', outline: 'none',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4L6 8L10 4" stroke="#5E6976" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

function ActionCard({ label, description, selected, onClick, icon }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, textAlign: 'left', padding: '12px 14px',
        border: selected ? '1px solid #0763D3' : '1px solid #e0e0e0',
        borderRadius: 6,
        background: selected ? '#E4F5FE' : hovered ? '#F4F6F9' : '#fff',
        cursor: 'pointer',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        {icon}
        <span style={{ fontSize: 14, fontWeight: 600, color: '#0D1722' }}>{label}</span>
      </div>
      <div style={{ fontSize: 13, color: '#5E6976', paddingLeft: 26 }}>{description}</div>
    </button>
  )
}

const ReduceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2 4L7 10L10 7L14 12" stroke="#5E6976" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 12H14V9" stroke="#5E6976" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IncreaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M2 12L6 6L9 9L14 4" stroke="#5E6976" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 4H14V7" stroke="#5E6976" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SectionLabel = ({ children, step }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    {step && (
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        background: '#E8EBED', color: '#5E6976',
        fontSize: 11, fontWeight: 600, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{step}</span>
    )}
    <span style={{ fontSize: 12, fontWeight: 600, color: '#5E6976', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      {children}
    </span>
  </div>
)

// ── Condition row ────────────────────────────────────────────────────────────

function ConditionRow({ cond, idx, total, onChange, onRemove, inputStyle }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <ChipGroup
          value={cond.type}
          onChange={v => onChange(idx, 'type', v)}
          options={CONDITION_OPTIONS}
        />
        {total > 1 && (
          <button onClick={() => onRemove(idx)} title="Remove condition" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center',
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              border: '1px solid #5E6976',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#5E6976', lineHeight: 1,
              userSelect: 'none',
            }}>×</span>
          </button>
        )}
      </div>

      {!cond.type && (
        <div style={{ fontSize: 12, color: '#9AA3AD', marginTop: 8 }}>
          Select a condition type above
        </div>
      )}

      {cond.type === 'make' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <InlineSelect
            value={cond.make}
            onChange={v => onChange(idx, 'make', v)}
            options={CAR_MAKES.map(m => ({ value: m, label: m }))}
            width={160}
          />
        </div>
      )}

      {cond.type === 'modelYear' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <InlineSelect
            value={cond.modelYearOperator}
            onChange={v => onChange(idx, 'modelYearOperator', v)}
            options={[{ value: 'before', label: 'Before' }, { value: 'after', label: 'After' }]}
            width={100}
          />
          <input
            type="number"
            value={cond.modelYearValue}
            onChange={e => onChange(idx, 'modelYearValue', e.target.value)}
            placeholder={String(CURRENT_YEAR - 5)}
            min="1990" max={CURRENT_YEAR}
            style={{ ...inputStyle, width: 90 }}
            onFocus={e => e.target.style.borderColor = '#0763D3'}
            onBlur={e => e.target.style.borderColor = '#cccccc'}
          />
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function CustomRules() {
  const [rules, setRules] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm())

  function openNew()       { setForm(defaultForm()); setEditingId('new') }
  function openEdit(rule)  { setForm({ ...rule }); setEditingId(rule.id) }
  function closeForm()     { setEditingId(null); setForm(defaultForm()) }

  function saveRule() {
    if (!isValid(form)) return
    if (editingId === 'new') {
      setRules(r => [...r, { ...form, id: Date.now().toString() }])
    } else {
      setRules(r => r.map(rule => rule.id === editingId ? { ...form, id: editingId } : rule))
    }
    closeForm()
  }

  function deleteRule(id)  { setRules(r => r.filter(rule => rule.id !== id)) }
  function toggleRule(id)  { setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)) }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function setCondition(idx, key, val) {
    setForm(f => {
      const conds = [...f.conditions]
      conds[idx] = { ...conds[idx], [key]: val }
      return { ...f, conditions: conds }
    })
  }

  function addCondition() {
    setForm(f => ({ ...f, conditions: [...f.conditions, defaultCondition()] }))
  }

  function removeCondition(idx) {
    setForm(f => ({ ...f, conditions: f.conditions.filter((_, i) => i !== idx) }))
  }

  const summary = getSummary(form)
  const canSave = isValid(form)

  const inputStyle = {
    height: 32, padding: '4px 10px', fontSize: 14,
    border: '1px solid #cccccc', borderRadius: 4,
    outline: 'none', color: '#0D1722',
  }

  // Condition all filled for progressive disclosure
  const conditionsFilled = form.conditions.every(c => {
    if (!c.type) return false
    if (c.type === 'modelYear' && !c.modelYearValue) return false
    return true
  })

  const percentOptions = (form.action === 'reduce'
    ? [{ value: 5, label: '−5%' }, { value: 10, label: '−10%' }, { value: 15, label: '−15%' }]
    : [{ value: 5, label: '+5%' }, { value: 10, label: '+10%' }, { value: 15, label: '+15%' }]
  )

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>

      {/* Card header */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {editingId !== null ? (
            <>
              <button onClick={closeForm} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#5E6976', padding: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 14,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Custom rules
              </button>
              <span style={{ color: '#C8CDD2', fontSize: 14 }}>/</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0D1722' }}>
                {editingId === 'new' ? 'New rule' : 'Edit rule'}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#0D1722' }}>Custom rules</span>
              {rules.length > 0 && (
                <span style={{ fontSize: 12, fontWeight: 500, background: '#E8EBED', color: '#5E6976', borderRadius: 10, padding: '1px 7px' }}>
                  {rules.length}
                </span>
              )}
            </>
          )}
        </div>
        {editingId === null && (
          <button onClick={openNew} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', fontSize: 13, fontWeight: 500,
            background: '#fff', color: '#0D1722',
            border: '1px solid #C8CDD2', borderRadius: 6, cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F4F6F9'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New custom rule
          </button>
        )}
      </div>

      {/* ── List view ── */}
      {editingId === null && (
        <div style={{ padding: rules.length === 0 ? '40px 24px' : '0 24px' }}>
          {rules.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#5E6976' }}>No custom rules yet</div>
            </div>
          ) : (
            rules.map((rule, i) => (
              <div key={rule.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: i < rules.length - 1 ? '1px solid #f0f0f0' : 'none',
                opacity: rule.enabled ? 1 : 0.45,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: '#0D1722' }}>{getSummary(rule)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 16 }}>
                  <Toggle value={rule.enabled} onChange={() => toggleRule(rule.id)} />
                  <button onClick={() => openEdit(rule)} title="Edit"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#5E6976', display: 'flex' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      <path d="M7.5 3.5L10.5 6.5" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  </button>
                  <button onClick={() => deleteRule(rule.id)} title="Delete"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#5E6976', display: 'flex' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5H12M5.5 3.5V2.5H8.5V3.5M3.5 3.5L4 11.5H10L10.5 3.5H3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6V9.5M8 6V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Form view ── */}
      {editingId !== null && (
        <div style={{ padding: '20px 24px' }}>

          {/* Step 1 — Action */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel step="1">What do you want to do?</SectionLabel>
            <div style={{ display: 'flex', gap: 10 }}>
              <ActionCard
                icon={<ReduceIcon />}
                label="Reduce offers"
                description="Lower offer amounts based on make or year"
                selected={form.action === 'reduce'}
                onClick={() => set('action', 'reduce')}
              />
              <ActionCard
                icon={<IncreaseIcon />}
                label="Increase offers"
                description="Raise offer amounts based on make or year"
                selected={form.action === 'increase'}
                onClick={() => set('action', 'increase')}
              />
            </div>
          </div>

          {/* Step 2 — Conditions (shown once action is selected) */}
          {form.action && (
            <div style={{ marginBottom: 24 }}>
              <SectionLabel step="2">Which vehicles does this apply to?</SectionLabel>

              {form.conditions.map((cond, idx) => (
                <div key={idx}>
                  <ConditionRow
                    cond={cond}
                    idx={idx}
                    total={form.conditions.length}
                    onChange={setCondition}
                    onRemove={removeCondition}
                    inputStyle={inputStyle}
                  />
                  {idx < form.conditions.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
                      <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
                      <span style={{ fontSize: 12, color: '#5E6976' }}>and</span>
                      <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
                    </div>
                  )}
                </div>
              ))}

              {form.conditions.length < 2 && (
                <button onClick={addCondition} style={{
                  marginTop: 12, fontSize: 13, color: '#0763D3',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Add condition
                </button>
              )}
            </div>
          )}

          {/* Step 3 — Amount (shown once at least one condition is filled) */}
          {form.action && conditionsFilled && (
            <div style={{ marginBottom: 24 }}>
              <SectionLabel step="3">
                {form.action === 'reduce' ? 'How much do you want to reduce offers by?' : 'How much do you want to increase offers by?'}
              </SectionLabel>
              <ChipGroup
                value={form.action === 'reduce' ? form.reducePercent : form.increasePercent}
                onChange={v => set(form.action === 'reduce' ? 'reducePercent' : 'increasePercent', v)}
                options={percentOptions}
              />
            </div>
          )}

          {/* Live summary */}
          {summary && (
            <div style={{
              background: '#F7F9FA', border: '1px solid #E0E4E8',
              borderRadius: 6, padding: '10px 14px',
              display: 'flex', alignItems: 'center',
              marginBottom: 20,
            }}>
              {form.action === 'reduce' ? <ReduceIcon /> : <IncreaseIcon />}
              <span style={{ fontSize: 14, color: '#0D1722', marginLeft: 8 }}>{summary}</span>
            </div>
          )}

          {/* Save / Cancel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={saveRule} disabled={!canSave} style={{
              padding: '8px 18px', fontSize: 14, fontWeight: 500,
              background: canSave ? '#0D3880' : '#C8CDD2',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}>
              {editingId === 'new' ? 'Save rule' : 'Update rule'}
            </button>
            <button onClick={closeForm} style={{
              padding: '8px 18px', fontSize: 14, fontWeight: 500,
              background: 'none', color: '#0D1722', border: 'none', cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
