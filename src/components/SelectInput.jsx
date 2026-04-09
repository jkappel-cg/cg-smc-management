export default function SelectInput({ options, value, onChange, width }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        height: 36,
        border: '1px solid #cccccc',
        borderRadius: 4,
        fontSize: 14,
        padding: '6px 10px',
        background: '#fff',
        color: '#1a1a1a',
        width: width || 'auto',
        outline: 'none',
        cursor: 'pointer',
      }}
      onFocus={e => { e.target.style.borderColor = '#0066cc' }}
      onBlur={e => { e.target.style.borderColor = '#cccccc' }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
