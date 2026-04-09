export default function SaveBar({ onSave }) {
  return (
    <div style={{
      borderTop: '1px solid #e0e0e0',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff',
      marginTop: 8,
    }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>
        Changes apply immediately to new Sell My Car leads.
      </span>
      <button
        onClick={onSave}
        style={{
          background: '#0763D3',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '8px 22px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.target.style.background = '#0550A8' }}
        onMouseLeave={e => { e.target.style.background = '#0763D3' }}
      >
        Save changes
      </button>
    </div>
  )
}
