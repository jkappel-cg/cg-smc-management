import { useState } from 'react'

const ALL_MAKES = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
  'Audi', 'Lexus', 'Nissan', 'Hyundai', 'Kia', 'Subaru', 'Jeep', 'Ram', 'GMC',
]

export function MakesToggle({ mode, onChange }) {
  return (
    <div style={{ display: 'flex', flexShrink: 0 }}>
      {[
        { value: 'include', label: 'Include all makes' },
        { value: 'exclude', label: 'Exclude some makes' },
      ].map((opt, i) => {
        const selected = mode === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '8px 14px',
              fontSize: 14,
              fontWeight: selected ? 600 : 400,
              color: selected ? '#0D1722' : '#5E6976',
              background: selected ? '#E4F5FE' : '#fff',
              border: selected ? '1px solid #0763D3' : '1px solid #e0e0e0',
              borderRadius: i === 0 ? '6px 0 0 6px' : '0 6px 6px 0',
              marginLeft: i === 0 ? 0 : -1,
              zIndex: selected ? 1 : 0,
              position: 'relative',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function VehicleMakes({ excluded, onChange }) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? ALL_MAKES.filter(m => m.toLowerCase().includes(search.toLowerCase()))
    : []

  function toggleExclude(make) {
    if (excluded.includes(make)) {
      onChange(excluded.filter(m => m !== make))
    } else {
      onChange([...excluded, make])
    }
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search makes to exclude..."
        style={{
          width: '100%',
          height: 36,
          border: '1px solid #cccccc',
          borderRadius: 4,
          fontSize: 14,
          padding: '6px 10px',
          marginBottom: 10,
          outline: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = '#0066cc' }}
        onBlur={e => { e.target.style.borderColor = '#cccccc' }}
      />

      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {filtered.map(make => {
            const isExcluded = excluded.includes(make)
            return (
              <button
                key={make}
                onClick={() => toggleExclude(make)}
                style={{
                  padding: '4px 10px',
                  fontSize: 14,
                  borderRadius: 4,
                  border: isExcluded ? '1px solid #ffaaaa' : '1px solid #cccccc',
                  background: isExcluded ? '#ffd6d6' : '#f5f5f5',
                  color: isExcluded ? '#cc0000' : '#0D1722',
                  textDecoration: isExcluded ? 'line-through' : 'none',
                  opacity: isExcluded ? 0.75 : 1,
                  cursor: 'pointer',
                }}
              >
                {make}
              </button>
            )
          })}
        </div>
      )}

      {excluded.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {excluded.map(make => (
            <button
              key={make}
              onClick={() => toggleExclude(make)}
              title="Click to re-include"
              style={{
                padding: '4px 10px',
                fontSize: 14,
                borderRadius: 4,
                border: '1px solid #ffaaaa',
                background: '#ffd6d6',
                color: '#cc0000',
                textDecoration: 'line-through',
                opacity: 0.75,
                cursor: 'pointer',
              }}
            >
              {make} ×
            </button>
          ))}
        </div>
      )}

      {excluded.length >= 5 && (
        <div style={{
          padding: '10px 14px',
          background: '#FFF1C0',
          border: '1px solid #f5c800',
          borderRadius: 6,
          fontSize: 14,
          color: '#0D1722',
        }}>
          ⚠ Excluding vehicle makes may reduce the number of leads you receive.
        </div>
      )}
    </div>
  )
}
