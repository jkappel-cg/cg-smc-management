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
        padding: '6px 32px 6px 10px',
        background: '#fff',
        color: '#0D1722',
        width: width || 'auto',
        minWidth: 0,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235E6976' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
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
