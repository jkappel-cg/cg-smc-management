import { useState } from 'react'
import PhaseToggle from '../components/PhaseToggle.jsx'
import SectionCard from '../components/SectionCard.jsx'
import FieldBlock from '../components/FieldBlock.jsx'
import CardSelector from '../components/CardSelector.jsx'
import SelectInput from '../components/SelectInput.jsx'
import VehicleMakes, { MakesToggle } from '../components/VehicleMakes.jsx'
import ConditionAdjustments from '../components/ConditionAdjustments.jsx'
import ConditionSliders from '../components/ConditionSliders.jsx'
import GuardrailSlider from '../components/GuardrailSlider.jsx'
import SnappingAgeSlider from '../components/SnappingAgeSlider.jsx'
import LaterConcepts from '../components/LaterConcepts.jsx'
import SaveBar from '../components/SaveBar.jsx'
import CustomRules from '../components/CustomRules.jsx'

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
  { value: '200000', label: 'Up to 200,000 miles (Recommended)' },
  { value: '175000', label: 'Up to 175,000 miles' },
  { value: '150000', label: 'Up to 150,000 miles' },
  { value: '125000', label: 'Up to 125,000 miles' },
  { value: '100000', label: 'Up to 100,000 miles' },
]

const MAX_AGE_OPTIONS = [
  { value: 'none', label: 'No limit (Recommended)' },
  { value: '15', label: 'Up to 15 years old' },
  { value: '10', label: 'Up to 10 years old' },
  { value: '5', label: 'Up to 5 years old' },
]

export default function SMCStrategy() {
  const [phase, setPhase] = useState('MVP')

  // Form state
  const [bookValue, setBookValue] = useState('cargurus')
  const [buyingApproach, setBuyingApproach] = useState('competitive')
  const [maxOffer, setMaxOffer] = useState('80000')
  const [maxMileage, setMaxMileage] = useState('200000')
  const [maxAge, setMaxAge] = useState('none')
  const [excludedMakes, setExcludedMakes] = useState([])
  const [makesMode, setMakesMode] = useState('include')
  // Next phase slider state
  const [maxOfferSlider, setMaxOfferSlider] = useState(80000)
  const [maxOfferRaw, setMaxOfferRaw] = useState(null)
  const [maxMileageSlider, setMaxMileageSlider] = useState(200000)
  const [maxMileageRaw, setMaxMileageRaw] = useState(null)
  const [ageRange, setAgeRange] = useState([0, 2])
  // Later phase state
  const [biddingRadius, setBiddingRadius] = useState(175)

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
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Top nav — white bar with PhaseToggle centered */}
        <div style={{
          height: 56,
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <PhaseToggle phase={phase} onChange={setPhase} />
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          padding: '24px 24px 80px',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <div style={{ width: '100%', maxWidth: 1164 }}>

          {phase === 'Later' ? (
            /* Later: only show LaterConcepts */
            <LaterConcepts
              ageRange={ageRange}
              onAgeRangeChange={setAgeRange}
              biddingRadius={biddingRadius}
              onBiddingRadiusChange={setBiddingRadius}
            />
          ) : (
            <>
              {/* Page header */}
              <div style={{ marginBottom: 20 }}>
                <a href="#" style={{ fontSize: 14, color: '#333', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8, textDecoration: 'none' }}>
                  ← <span style={{ textDecoration: 'underline' }}>Back</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0D1722', marginBottom: 4, fontFamily: "'RundDisplay', sans-serif" }}>
                      Sell My Car Strategy
                    </h1>
                    <p style={{ fontSize: 14, color: '#0D1722' }}>
                      Adjust your global and custom bidding rules to refine your strategy. Setup a meeting with your product specialist to customize your bidding strategy further.
                    </p>
                  </div>
                  <button style={{
                    flexShrink: 0,
                    padding: '8px 16px', fontSize: 14, fontWeight: 500,
                    background: '#fff', color: '#0763D3',
                    border: '1px solid #0763D3', borderRadius: 6,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#E4F5FE'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    Meet with specialist
                  </button>
                </div>
              </div>

              {/* Section 1 — Bidding Strategy */}
              <SectionCard title="Bidding strategy">
                <FieldBlock label="Book value source" description="The valuation data used to calculate your offers">
                  <CardSelector
                    options={BOOK_VALUE_OPTIONS}
                    value={bookValue}
                    onChange={setBookValue}
                  />
                </FieldBlock>

                <FieldBlock label="Buying approach" description="Controls how aggressively your offers are priced relative to market value">
                  <CardSelector
                    options={BUYING_APPROACH_OPTIONS}
                    value={buyingApproach}
                    onChange={setBuyingApproach}
                  />
                </FieldBlock>

                {phase !== 'MVP' ? (
                  <FieldBlock label="Max offer amount" description="Offers won't exceed this amount regardless of vehicle value" last inlineControl={
                    <div style={{ width: '55%' }}>
                      <GuardrailSlider
                        value={maxOfferSlider}
                        onChange={v => { setMaxOfferSlider(v); setMaxOfferRaw(null) }}
                        min={20000} max={200000} step={1000}
                        recLo={60000} recHi={200000}
                        formatValue={v => `$${v / 1000}k`}
                        formatLabel={v => `$${v / 1000}k`}
                        rawInput={maxOfferRaw}
                        onRawInput={setMaxOfferRaw}
                        onRawBlur={raw => {
                          const num = parseFloat(raw.replace(/[^0-9.]/g, '')) * (raw.includes('k') || raw.includes('K') ? 1000 : 1)
                          if (!isNaN(num)) setMaxOfferSlider(Math.max(20000, Math.min(200000, Math.round(num / 1000) * 1000)))
                          setMaxOfferRaw(null)
                        }}
                      />
                    </div>
                  } />
                ) : (
                  <FieldBlock label="Max offer amount" description="Offers won't exceed this amount regardless of vehicle value" last inline>
                    <SelectInput
                      options={MAX_OFFER_OPTIONS}
                      value={maxOffer}
                      onChange={setMaxOffer}
                      width={280}
                    />
                  </FieldBlock>
                )}
              </SectionCard>

              {/* Section 2 — Bidding Criteria */}
              <SectionCard title="Bidding criteria">
                {phase !== 'MVP' ? (
                  <FieldBlock label="Max mileage limit" description="Vehicles above this mileage won't receive offers" inlineControl={
                    <div style={{ width: '55%' }}>
                      <GuardrailSlider
                        value={maxMileageSlider}
                        onChange={v => { setMaxMileageSlider(v); setMaxMileageRaw(null) }}
                        min={50000} max={300000} step={5000}
                        recLo={50000} recHi={200000}
                        formatValue={v => `${v / 1000}k mi`}
                        formatLabel={v => `${v / 1000}k`}
                        rawInput={maxMileageRaw}
                        onRawInput={setMaxMileageRaw}
                        onRawBlur={raw => {
                          const num = parseFloat(raw.replace(/[^0-9.]/g, '')) * (raw.toLowerCase().includes('k') ? 1000 : 1)
                          if (!isNaN(num)) setMaxMileageSlider(Math.max(50000, Math.min(300000, Math.round(num / 5000) * 5000)))
                          setMaxMileageRaw(null)
                        }}
                      />
                    </div>
                  } />
                ) : (
                  <FieldBlock label="Max mileage limit" description="Vehicles above this mileage won't receive offers" inline>
                    <SelectInput
                      options={MAX_MILEAGE_OPTIONS}
                      value={maxMileage}
                      onChange={setMaxMileage}
                      width={280}
                    />
                  </FieldBlock>
                )}

                {phase !== 'MVP' ? (
                  <FieldBlock label="Max vehicle age" description="Vehicles older than this won't receive offers" inlineControl={
                    <div style={{ width: '55%' }}>
                      <SnappingAgeSlider value={ageRange} onChange={setAgeRange} />
                    </div>
                  } />
                ) : (
                  <FieldBlock label="Max vehicle age" description="Vehicles older than this won't receive offers" inline>
                    <SelectInput
                      options={MAX_AGE_OPTIONS}
                      value={maxAge}
                      onChange={setMaxAge}
                      width={280}
                    />
                  </FieldBlock>
                )}

                <FieldBlock
                  label="Vehicle makes"
                  description="Control which makes are eligible for offers"
                  last
                  inlineControl={<MakesToggle mode={makesMode} onChange={m => { setMakesMode(m); if (m === 'include') setExcludedMakes([]) }} />}
                >
                  {makesMode === 'exclude' && (
                    <VehicleMakes excluded={excludedMakes} onChange={setExcludedMakes} />
                  )}
                </FieldBlock>
              </SectionCard>

              {/* Section 3 — Vehicle Condition Adjustments */}
              <SectionCard title="Vehicle condition adjustments">
                <FieldBlock last>
                  {phase !== 'MVP' ? <ConditionSliders /> : <ConditionAdjustments />}
                </FieldBlock>
              </SectionCard>

              {/* Section 4 — Custom Rules (Next only) */}
              {phase === 'Next' && <CustomRules />}
            </>
          )}

          {/* Bottom save bar */}
          <SaveBar onSave={handleSave} />

        </div>
        </div>
      </div>
    </div>
  )
}
