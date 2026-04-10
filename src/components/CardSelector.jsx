import { useState } from 'react'
import InfoTooltip from './InfoTooltip.jsx'

export default function CardSelector({ options, value, onChange }) {
  const [hoveredSelected, setHoveredSelected] = useState(null)

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {options.map(opt => {
        const selected = value === opt.value
        const isHoverSelected = hoveredSelected === opt.value
        let bg = '#fff'
        if (selected) bg = isHoverSelected ? '#F4F6F9' : '#E4F5FE'
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            onMouseEnter={() => { if (selected) setHoveredSelected(opt.value) }}
            onMouseLeave={() => setHoveredSelected(null)}
            style={{
              flex: 1,
              padding: 12,
              border: selected ? '2px solid #0763D3' : '1px solid #e0e0e0',
              borderRadius: 6,
              background: bg,
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
              <span style={{ fontSize: 12, color: '#888' }}>
                {opt.recommended ? 'Recommended' : ''}
              </span>
              <InfoTooltip text={opt.tooltip} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0D1722', marginBottom: 3 }}>
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
