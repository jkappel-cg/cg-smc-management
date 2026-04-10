import { useState } from 'react'

const ALL_MAKES = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
  'Audi', 'Lexus', 'Nissan', 'Hyundai', 'Kia', 'Subaru', 'Jeep', 'Ram', 'GMC',
]

export default function VehicleMakes({ excluded, onChange }) {
  const [mode, setMode] = useState('include')
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
      {/* Toggle row */}
      <div style={{
        display: 'inline-flex',
        border: '1px solid #cccccc',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        {['include', 'exclude'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setSearch('') }}
            style={{
              padding: '6px 16px',
              fontSize: 14,
              background: mode === m ? '#0763D3' : 'transparent',
              color: mode === m ? '#fff' : '#555',
              border: 'none',
              cursor: 'pointer',
              fontWeight: mode === m ? 600 : 400,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {m === 'include' ? 'Include all' : 'Exclude specific'}
          </button>
        ))}
      </div>

      {mode === 'exclude' && (
        <div>
          {/* Search input */}
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

          {/* Search results chips */}
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
                      border: isExcluded
                        ? '1px solid #ffaaaa'
                        : '1px solid #cccccc',
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

          {/* Always-visible excluded chips */}
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

          {/* Warning banner */}
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
      )}
    </div>
  )
}
