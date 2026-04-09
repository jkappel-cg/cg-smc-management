import { useState } from 'react'
import PhaseToggle from '../components/PhaseToggle.jsx'
import SectionCard from '../components/SectionCard.jsx'
import FieldBlock from '../components/FieldBlock.jsx'
import CardSelector from '../components/CardSelector.jsx'
import SelectInput from '../components/SelectInput.jsx'
import VehicleMakes from '../components/VehicleMakes.jsx'
import ConditionAdjustments from '../components/ConditionAdjustments.jsx'
import SaveBar from '../components/SaveBar.jsx'

const BOOK_VALUE_OPTIONS = [
  {
    value: 'cargurus',
    label: 'CarGurus IMV',
    description: 'Real-time market valuations',
    recommended: true,
    tooltip: 'Helps dealers make competitive offers using real-time market insights, sales data, listing prices, and vehicle attributes.',
  },
  {
    value: 'jdpower',
    label: 'J.D. Power',
    description: 'Retail, wholesale & trade-in data',
    recommended: false,
    tooltip: 'Delivers trusted vehicle valuations by combining retail, wholesale, and trade-in data with consumer insights. Formerly NADA.',
  },
  {
    value: 'blackbook',
    label: 'Blackbook',
    description: 'Wholesale & auction pricing',
    recommended: false,
    tooltip: 'Specializes in wholesale and auction pricing for highly accurate market condition assessments.',
  },
]

const BUYING_APPROACH_OPTIONS = [
  {
    value: 'aggressive',
    label: 'Aggressive',
    description: 'IMV −15% · Highest leads, lowest margins',
    recommended: false,
    tooltip: 'Highest likelihood of winning leads and meeting lead cap. Offers are closest to market value.',
  },
  {
    value: 'competitive',
    label: 'Competitive',
    description: 'IMV −20% · Balanced leads & margins',
    recommended: true,
    tooltip: 'A balanced approach between acquisition volume and profitability.',
  },
  {
    value: 'wholesale',
    label: 'Wholesale-first',
    description: 'IMV −30% · Lowest leads, highest margins',
    recommended: false,
    tooltip: 'Best suited for dealers prioritizing wholesale profitability over volume.',
  },
]

const MAX_OFFER_OPTIONS = [
  { value: '60000', label: 'Up to $60,000' },
  { value: '80000', label: 'Up to $80,000 (Recommended)' },
  { value: '100000', label: 'Up to $100,000' },
  { value: 'none', label: 'No maximum' },
]

const MAX_MILEAGE_OPTIONS = [
  { value: '200000', label: 'Up to 200k miles (Recommended)' },
  { value: '175000', label: 'Up to 175k miles' },
  { value: '150000', label: 'Up to 150k miles' },
  { value: '125000', label: 'Up to 125k miles' },
  { value: '100000', label: 'Up to 100k miles' },
]

const MAX_AGE_OPTIONS = [
  { value: 'none', label: 'No preference — 1999–present (Recommended)' },
  { value: '15', label: 'Up to 15 years old (2010–present)' },
  { value: '10', label: 'Up to 10 years old (2015–present)' },
  { value: '5', label: 'Up to 5 years old (2020–present)' },
]

function SaveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
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
  )
}

export default function SMCStrategy() {
  const [phase, setPhase] = useState('MVP')

  // Form state
  const [bookValue, setBookValue] = useState('cargurus')
  const [buyingApproach, setBuyingApproach] = useState('competitive')
  const [maxOffer, setMaxOffer] = useState('80000')
  const [maxMileage, setMaxMileage] = useState('200000')
  const [maxAge, setMaxAge] = useState('none')
  const [excludedMakes, setExcludedMakes] = useState([])

  function handleSave() {
    // Visual prototype — no-op
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left nav placeholder */}
      <div style={{
        width: 240,
        flexShrink: 0,
        background: '#0d1722',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }} />

      {/* Main content area */}
      <div style={{
        flex: 1,
        background: '#F4F6F9',
        padding: '24px 24px 80px',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <div style={{ width: '100%', maxWidth: 1164 }}>

        {/* Phase toggle (prototype only) */}
        <PhaseToggle phase={phase} onChange={setPhase} />

        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <a href="#" style={{ fontSize: 13, color: '#333', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            ← Back
          </a>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
              Sell My Car Strategy
            </h1>
            <p style={{ fontSize: 13, color: '#888' }}>
              Adjust your global bidding rules to refine your strategy
            </p>
          </div>
        </div>

        {/* Section 1 — Bidding Strategy */}
        <SectionCard title="Bidding strategy">
          <FieldBlock label="Book value source">
            <CardSelector
              options={BOOK_VALUE_OPTIONS}
              value={bookValue}
              onChange={setBookValue}
            />
          </FieldBlock>

          <FieldBlock label="Buying approach">
            <CardSelector
              options={BUYING_APPROACH_OPTIONS}
              value={buyingApproach}
              onChange={setBuyingApproach}
            />
          </FieldBlock>

          <FieldBlock label="Max offer amount" last inline>
            <SelectInput
              options={MAX_OFFER_OPTIONS}
              value={maxOffer}
              onChange={setMaxOffer}
              width={240}
            />
          </FieldBlock>
        </SectionCard>

        {/* Section 2 — Bidding Criteria */}
        <SectionCard title="Bidding criteria">
          <FieldBlock
            label="Max mileage limit"
            description="Vehicles above this mileage won't receive offers"
            inline
          >
            <SelectInput
              options={MAX_MILEAGE_OPTIONS}
              value={maxMileage}
              onChange={setMaxMileage}
              width={260}
            />
          </FieldBlock>

          <FieldBlock
            label="Max vehicle age"
            description="Vehicles older than this won't receive offers"
            inline
          >
            <SelectInput
              options={MAX_AGE_OPTIONS}
              value={maxAge}
              onChange={setMaxAge}
              width={320}
            />
          </FieldBlock>

          <FieldBlock
            label="Vehicle makes"
            description="Control which makes are eligible for offers"
            last
          >
            <VehicleMakes
              excluded={excludedMakes}
              onChange={setExcludedMakes}
            />
          </FieldBlock>
        </SectionCard>

        {/* Section 3 — Vehicle Condition Adjustments */}
        <SectionCard title="Vehicle condition adjustments">
          <FieldBlock last>
            <ConditionAdjustments />
          </FieldBlock>
        </SectionCard>

        {/* Bottom save bar */}
        <SaveBar onSave={handleSave} />

      </div>
      </div>
    </div>
  )
}
