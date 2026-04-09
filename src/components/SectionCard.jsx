export default function SectionCard({ title, children }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid #e0e0e0',
        fontSize: 15,
        fontWeight: 600,
        color: '#1a1a1a',
      }}>
        {title}
      </div>
      <div style={{ padding: '0 24px' }}>
        {children}
      </div>
    </div>
  )
}
