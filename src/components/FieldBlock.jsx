const Sep = () => <div style={{ height: 1, background: '#f0f0f0', width: '100%' }} />

export default function FieldBlock({ label, description, children, last = false, inline = false, inlineControl = null }) {

  if (inlineControl != null) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: children ? 16 : 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0D1722', marginBottom: 3 }}>{label}</div>
            {description && <div style={{ fontSize: 14, color: '#0D1722' }}>{description}</div>}
          </div>
          {inlineControl}
        </div>
        {children}
        {!last && <Sep />}
      </div>
    )
  }

  if (inline) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#0D1722', marginBottom: 3 }}>{label}</div>
            {description && <div style={{ fontSize: 14, color: '#0D1722' }}>{description}</div>}
          </div>
          {children}
        </div>
        {!last && <Sep />}
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {label && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#0D1722', marginBottom: 3 }}>{label}</div>
          {description && <div style={{ fontSize: 14, color: '#0D1722' }}>{description}</div>}
        </div>
      )}
      {children}
      {!last && <Sep />}
    </div>
  )
}
