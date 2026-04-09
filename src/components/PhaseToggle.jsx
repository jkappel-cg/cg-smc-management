export default function PhaseToggle({ phase, onChange }) {
  const phases = ['MVP', 'Next', 'Later']

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
    }}>
      <span style={{ fontSize: 13, color: '#b625ce', fontWeight: 600 }}>View</span>
      <div style={{
        display: 'flex',
        border: '1px solid #b625ce',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {phases.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              padding: '5px 14px',
              fontSize: 13,
              fontWeight: 500,
              background: phase === p ? '#b625ce' : 'transparent',
              color: phase === p ? '#fff' : '#b625ce',
              border: 'none',
              borderLeft: p !== 'MVP' ? '1px solid #b625ce' : 'none',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
