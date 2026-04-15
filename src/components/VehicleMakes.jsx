import { useState, useRef, useEffect } from 'react'

const ALL_MAKES = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda',
  'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Ram', 'Subaru',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
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
              fontWeight: 400,
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
  const [query, setQuery]       = useState('')
  const [open, setOpen]         = useState(false)
  const [focused, setFocused]   = useState(false)
  const containerRef            = useRef()
  const inputRef                = useRef()

  const suggestions = query.trim().length > 0
    ? ALL_MAKES.filter(m =>
        m.toLowerCase().includes(query.toLowerCase()) &&
        !excluded.includes(m)
      )
    : []

  function addMake(make) {
    onChange([...excluded, make])
    setQuery('')
    inputRef.current?.focus()
  }

  function removeMake(make) {
    onChange(excluded.filter(m => m !== make))
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onPointerDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div ref={containerRef} style={{ marginTop: 12 }}>

      {/* Label */}
      <div style={{ fontSize: 13, fontWeight: 500, color: '#0D1722', marginBottom: 6 }}>
        Search makes to exclude
      </div>

      {/* Search input */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        border: `1px solid ${focused ? '#0763D3' : '#C8CDD2'}`,
        borderRadius: 6,
        background: '#fff',
        padding: '0 10px',
        height: 40,
        boxSizing: 'border-box',
      }}>
        {/* Search icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginRight: 8, color: '#5E6976' }}>
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setFocused(true); if (query) setOpen(true) }}
          onBlur={() => setFocused(false)}
          placeholder="i.e. Maseratis"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 14, color: '#0D1722', background: 'transparent',
          }}
        />
        {/* Clear button */}
        {query.length > 0 && (
          <button
            onPointerDown={e => { e.preventDefault(); setQuery(''); setOpen(false); inputRef.current?.focus() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#5E6976', display: 'flex' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown suggestions */}
      {open && suggestions.length > 0 && (
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: 6,
          background: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginTop: 4,
          maxHeight: 200,
          overflowY: 'auto',
          zIndex: 10,
          position: 'relative',
        }}>
          {suggestions.map(make => (
            <div
              key={make}
              onPointerDown={e => { e.preventDefault(); addMake(make); setOpen(false) }}
              style={{
                padding: '9px 14px',
                fontSize: 14, color: '#0D1722',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F4F6F9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {make}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {open && query.trim().length > 0 && suggestions.length === 0 && (
        <div style={{
          border: '1px solid #e0e0e0', borderRadius: 6, background: '#fff',
          marginTop: 4, padding: '9px 14px', fontSize: 14, color: '#9AA3AD',
        }}>
          No makes found
        </div>
      )}

      {/* Excluded pills */}
      {excluded.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {excluded.map(make => (
            <div key={make} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 10px',
              background: '#F0F2F4', borderRadius: 20,
              fontSize: 14, color: '#0D1722',
            }}>
              {make}
              <button
                onClick={() => removeMake(make)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, display: 'flex', alignItems: 'center',
                  color: '#5E6976', lineHeight: 1, fontSize: 16,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Validation hint — only when no makes selected yet */}
      {excluded.length === 0 && (
        <div style={{ fontSize: 12, color: '#9AA3AD', marginTop: 8 }}>
          Select at least one make to exclude
        </div>
      )}
    </div>
  )
}
