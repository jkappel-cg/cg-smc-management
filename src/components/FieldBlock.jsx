export default function FieldBlock({ label, description, children, last = false }) {
  return (
    <div style={{
      padding: '20px 0',
      borderBottom: last ? 'none' : '1px solid #f0f0f0',
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
