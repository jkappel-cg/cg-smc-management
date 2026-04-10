import { useState } from 'react'

export default function CardSelector({ options, value, onChange }) {
  const [hoveredSelected, setHoveredSelected] = useState(null)
  const [activeTooltip, setActiveTooltip] = useState(null)

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
              border: selected ? '1px solid #0763D3' : '1px solid #e0e0e0',
              borderRadius: 6,
              background: bg,
              textAlign: 'left',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {/* Title row: dotted-underline title + Recommended chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 14, fontWeight: 600, color: '#0D1722',
                  borderBottom: '1px dotted #0D1722',
                  cursor: 'default',
                  position: 'relative',
                }}
                onMouseEnter={() => setActiveTooltip(opt.value)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {opt.label}
                {activeTooltip === opt.value && opt.tooltip && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      left: 0,
                      width: 220,
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 400,
                      color: '#333',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      zIndex: 20,
                      lineHeight: 1.5,
                      whiteSpace: 'normal',
                      pointerEvents: 'none',
                    }}
                  >
                    {opt.tooltip}
                  </div>
                )}
              </span>
              {opt.recommended && (
                <span style={{
                  fontSize: 11, background: '#E8EBED', color: '#5E6976',
                  borderRadius: 4, padding: '2px 6px', fontWeight: 500, whiteSpace: 'nowrap',
                }}>
                  Recommended
                </span>
              )}
            </div>
            {/* Description */}
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>
              {opt.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
