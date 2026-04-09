import InfoTooltip from './InfoTooltip.jsx'

export default function CardSelector({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: 12,
              border: selected ? '2px solid #0763D3' : '1px solid #e0e0e0',
              borderRadius: 6,
              background: selected ? 'rgba(7,99,211,0.04)' : '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {/* top row: recommended label + tooltip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 6,
              minHeight: 16,
            }}>
              <span style={{ fontSize: 10, color: '#888' }}>
                {opt.recommended ? 'Recommended' : ''}
              </span>
              <InfoTooltip text={opt.tooltip} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>
              {opt.label}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>
              {opt.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
