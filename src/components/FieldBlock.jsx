export default function FieldBlock({ label, description, children, last = false, inline = false, inlineControl = null }) {
  const borderBottom = last ? 'none' : '1px solid #f0f0f0'

  if (inlineControl != null) {
    return (
      <div style={{ padding: '20px 0', borderBottom }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: children ? 16 : 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0D1722', marginBottom: 3 }}>
              {label}
            </div>
            {description && (
              <div style={{ fontSize: 12, color: '#5E6976' }}>
                {description}
              </div>
            )}
          </div>
          {inlineControl}
        </div>
        {children}
      </div>
    )
  }

  if (inline) {
    return (
      <div style={{ padding: '20px 0', borderBottom }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0D1722', marginBottom: 3 }}>
              {label}
            </div>
            {description && (
              <div style={{ fontSize: 12, color: '#5E6976' }}>
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
    <div style={{ padding: '20px 0', borderBottom }}>
      {label && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#0D1722', marginBottom: 3 }}>
            {label}
          </div>
          {description && (
            <div style={{ fontSize: 12, color: '#5E6976' }}>
              {description}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
