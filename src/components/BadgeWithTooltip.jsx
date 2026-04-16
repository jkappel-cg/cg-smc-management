import { useState } from 'react'

const TOOLTIP_TEXT = {
  'Above recommended': 'This value is above the recommended range. It may make your offers less competitive with sellers.',
  'Below recommended': 'This value is below the recommended range. It may undervalue the impact on your offer.',
  'Outside recommended range': 'This setting is outside the recommended range. It may affect your competitiveness with sellers.',
}

export default function BadgeWithTooltip({ text, bg }) {
  const [show, setShow] = useState(false)
  const tipText = TOOLTIP_TEXT[text]
  const isOut = !!tipText

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => isOut && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        fontSize: 12, background: bg, color: '#0D1722',
        borderRadius: 4, padding: '2px 8px', fontWeight: 400,
        whiteSpace: 'nowrap',
        ...(isOut ? {
          textDecoration: 'underline dotted',
          textDecorationColor: '#0D1722',
          textUnderlineOffset: 2,
          cursor: 'help',
        } : {}),
      }}>
        {text}
      </span>
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
          zIndex: 20, width: 230,
          background: '#0D1722', color: '#fff',
          fontSize: 12, lineHeight: 1.5,
          padding: '8px 10px', borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
        }}>
          {tipText}
          <div style={{
            position: 'absolute', top: '100%', left: 12,
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #0D1722',
          }} />
        </div>
      )}
    </span>
  )
}
