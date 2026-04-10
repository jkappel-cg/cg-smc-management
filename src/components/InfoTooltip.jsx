import { useState, useRef, useEffect } from 'react'

export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1px solid #cccccc',
          background: '#fff',
          fontSize: 12,
          color: '#888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        i
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          right: 0,
          width: 200,
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          padding: '10px 12px',
          fontSize: 12,
          color: '#333',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          zIndex: 10,
          lineHeight: 1.5,
        }}>
          {text}
        </div>
      )}
    </div>
  )
}
