const COLUMNS = [
  {
    header: 'Major impact',
    conditions: [
      { label: 'Not driveable', value: null, badge: true },
      { label: 'Bad tires', value: '−$800' },
      { label: 'Windshield damage', value: '−$700' },
      { label: 'Faded paint', value: '−$750' },
      { label: 'Rust', value: '−$1,000' },
      { label: 'Hail damage', value: '−$1,000' },
      { label: 'Accidents', value: '−5%' },
    ],
  },
  {
    header: 'Moderate impact',
    conditions: [
      { label: 'Rough condition', value: '−15%' },
      { label: 'Smoker', value: '−$300' },
      { label: 'Dents', value: '−$300' },
      { label: 'One key only', value: '−$250' },
      { label: 'Mechanical defects', value: '−$250' },
    ],
  },
  {
    header: 'Minor impact',
    conditions: [
      { label: 'Scratches', value: '−$100' },
      { label: 'Dings', value: '−$100' },
      { label: 'Chips', value: '−$100' },
      { label: 'Scuffs', value: '−$100' },
    ],
  },
  {
    header: 'No impact',
    conditions: [
      { label: 'Aftermarket parts', value: 'No adjustment' },
      { label: 'Fading paint', value: 'No adjustment' },
      { label: 'Manual transmission', value: 'No adjustment' },
    ],
  },
]

function ConditionRow({ label, value, badge }) {
  if (badge) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
        <span style={{
          fontSize: 11,
          background: '#ffd6d6',
          color: '#cc0000',
          borderRadius: 4,
          padding: '2px 8px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}>No offer made</span>
      </div>
    )
  }

  const isNoAdj = value === 'No adjustment'
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
      <span style={{
        fontSize: 12,
        fontWeight: isNoAdj ? 400 : 500,
        color: isNoAdj ? '#9ca3af' : '#cc0000',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function ConditionAdjustments() {
  return (
    <div>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
        We automatically adjust your offers based on the condition the consumer selects.
      </p>
      <p style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginBottom: 16 }}>
        Example: If a consumer selects "Bad tires," your offer is reduced by $800 based on the rules below.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {COLUMNS.map(col => (
          <div key={col.header}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #f0f0f0' }}>
              {col.header}
            </div>
            {col.conditions.map(c => (
              <ConditionRow key={c.label} {...c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
