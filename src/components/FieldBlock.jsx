export default function FieldBlock({ label, description, children, last = false, inline = false }) {
  if (inline) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
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
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 0' }}>
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
