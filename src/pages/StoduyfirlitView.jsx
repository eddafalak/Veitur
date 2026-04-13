import { useId, useMemo, useState } from 'react'
import YfirlitPriceCard from '../components/YfirlitPriceCard.jsx'
import { GREID_ORKU_MAELI_ROW_IDS, readGreidendurOrkumaelaDraft } from '../greidendurOrkumaelaDraft.js'
import './StoduyfirlitView.css'

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13 8H3m0 0 3-3M3 8l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7.2V11M8 5.1h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 6v5M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StatusPill({ label, tone }) {
  return (
    <span className={`stoduyfirlit__status-pill stoduyfirlit__status-pill--${tone}`}>
      <span className="stoduyfirlit__status-pill-dot" aria-hidden />
      {label}
    </span>
  )
}

function InfoField({ label, value }) {
  return (
    <div className="stoduyfirlit__info-field">
      <span className="stoduyfirlit__info-field-label">{label}</span>
      <span className="stoduyfirlit__info-field-value">{value}</span>
    </div>
  )
}

const STEPPER_STEPS = [
  {
    id: 'samthykktir',
    date: '15.01.2025',
    title: 'Samþykktir',
    defaultOpen: true,
    active: true,
    lines: [
      'Greiðandi umsóknar: Bíður samþykktar/Samþykkt/Hafnað',
      'Rafverktaki: Bíður samþykktar/Samþykkt/Hafnað',
      'Pípari: Bíður samþykktar/Samþykkt/Hafnað',
    ],
  },
  {
    id: 'undirbuningur',
    title: 'Undirbúningur',
    defaultOpen: false,
    mutedTitle: true,
    lines: [],
  },
  {
    id: 'framkvaemd',
    title: 'Framkvæmd',
    defaultOpen: false,
    mutedTitle: true,
    lines: [],
  },
  {
    id: 'fragangur',
    title: 'Frágangur',
    defaultOpen: false,
    mutedTitle: true,
    lines: [],
  },
]

const METER_ROWS = [
  { meter: 'Íbúð 101', payer: 'Tralalaverk ehf', kt: '1201024-0071', phone: '5545555', status: 'samthykkt', statusLabel: 'Samþykkt' },
  {
    meter: 'Íbúð 101',
    payer: 'Tralalaverk ehf',
    kt: '1201024-0071',
    phone: '5545555',
    status: 'samthykkt',
    statusLabel: 'Samþykkt',
  },
  { meter: 'Íbúð 101', payer: 'Tralalaverk ehf', kt: '1201024-0071', phone: '5545555', status: 'ibid', statusLabel: 'í bið' },
  { meter: 'Íbúð 101', payer: 'Tralalaverk ehf', kt: '1201024-0071', phone: '5545555', status: 'samthykkt', statusLabel: 'Samþykt' },
]

const SIDEBAR_ACCORDIONS = [
  { id: 'stadsetning', label: 'Staðsetning', defaultOpen: true },
  { id: 'tenging', label: 'Tenging', defaultOpen: false },
  { id: 'umsaekjandi', label: 'Umsækjandi', defaultOpen: false },
  { id: 'tengilidur', label: 'Tengiliður', defaultOpen: false },
  { id: 'greidandi', label: 'Greiðandi umsóknar', defaultOpen: false },
  { id: 'pipa', label: 'Pípulagningameistari', defaultOpen: false },
  { id: 'raf', label: 'Rafverktaki', defaultOpen: false },
]

export default function StoduyfirlitView({ address, onBack }) {
  const stepHeadingId = useId()
  const [openSteps, setOpenSteps] = useState(() =>
    Object.fromEntries(STEPPER_STEPS.map((s) => [s.id, s.defaultOpen])),
  )
  const [openAcc, setOpenAcc] = useState(() =>
    Object.fromEntries(SIDEBAR_ACCORDIONS.map((a) => [a.id, a.defaultOpen])),
  )

  const toggleStep = (id) => {
    setOpenSteps((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAcc = (id) => {
    setOpenAcc((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const meterRowsDisplay = useMemo(() => {
    const draft = readGreidendurOrkumaelaDraft(address)
    if (!draft) return METER_ROWS
    return METER_ROWS.map((row, i) => {
      const id = GREID_ORKU_MAELI_ROW_IDS[i]
      const d = id ? draft[id] : null
      if (!d || typeof d !== 'object') return row
      return {
        ...row,
        payer: d.nafn?.trim() ? d.nafn.trim() : row.payer,
        kt: d.kennitala?.trim() ? d.kennitala.trim() : row.kt,
        phone: d.simi?.trim() ? d.simi.trim() : row.phone,
      }
    })
  }, [address])

  return (
    <div className="stoduyfirlit">
      <div className="stoduyfirlit__shell">
        <header className="stoduyfirlit__shell-head">
          <button type="button" className="stoduyfirlit__back" onClick={onBack}>
            <IconArrowLeft />
            Til baka í yfirlit
          </button>
        </header>

        <div className="stoduyfirlit__grid">
          <div className="stoduyfirlit__main">
            <section className="stoduyfirlit__status-card" aria-labelledby="stoduyfirlit-addr">
              <div className="stoduyfirlit__status-card-top">
                <div className="stoduyfirlit__status-card-title-row">
                  <h2 id="stoduyfirlit-addr" className="stoduyfirlit__addr-title">
                    {address}
                  </h2>
                  <StatusPill label="í vinnslu" tone="neutral" />
                </div>
                <p className="stoduyfirlit__status-lead">Staða umsóknar: Í bið eftir samþykktum</p>
              </div>
              <InfoField
                label="Staða umsóknar"
                value="Umsóknin er nú til yfirferðar hjá samþykktaraðilum. Vinnsla hjá Veitum hefst þegar allir samþykktaraðilar hafa brugðist við."
              />
              <div className="stoduyfirlit__info-row">
                <InfoField label="Stofnað" value="15.01.2025" />
                <InfoField label="Síðast breytt" value="30.01.2025" />
              </div>
            </section>

            <section className="stoduyfirlit__stepper-block" aria-labelledby={stepHeadingId}>
              <div className="stoduyfirlit__stepper-head">
                <h3 id={stepHeadingId} className="stoduyfirlit__stepper-title">
                  Stöðuyfirlit
                </h3>
              </div>
              <div className="stoduyfirlit__stepper-list">
                {STEPPER_STEPS.map((step, index) => {
                  const isOpen = openSteps[step.id]
                  const isLast = index === STEPPER_STEPS.length - 1
                  return (
                    <div key={step.id} className="stoduyfirlit__step-row">
                      <div className="stoduyfirlit__step-rail">
                        <div
                          className={
                            step.active
                              ? 'stoduyfirlit__step-icon stoduyfirlit__step-icon--active'
                              : 'stoduyfirlit__step-icon stoduyfirlit__step-icon--pending'
                          }
                          aria-hidden
                        >
                          {step.active ? <span className="stoduyfirlit__step-icon-dot" /> : null}
                        </div>
                        {!isLast ? (
                          <div
                            className={
                              step.active
                                ? 'stoduyfirlit__step-line stoduyfirlit__step-line--muted'
                                : 'stoduyfirlit__step-line'
                            }
                            aria-hidden
                          />
                        ) : null}
                      </div>
                      <div className="stoduyfirlit__step-panel">
                        <div className="stoduyfirlit__step-header">
                          <div className="stoduyfirlit__step-titles">
                            {step.date ? (
                              <span className="stoduyfirlit__step-date">{step.date}</span>
                            ) : null}
                            <span
                              className={
                                step.mutedTitle
                                  ? 'stoduyfirlit__step-name stoduyfirlit__step-name--muted'
                                  : 'stoduyfirlit__step-name'
                              }
                            >
                              {step.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="stoduyfirlit__step-toggle"
                            onClick={() => toggleStep(step.id)}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? `Fella saman ${step.title}` : `Opna ${step.title}`}
                          >
                            {isOpen ? (
                              <span className="stoduyfirlit__step-toggle-icon stoduyfirlit__step-toggle-icon--minus" />
                            ) : (
                              <span className="stoduyfirlit__step-toggle-icon stoduyfirlit__step-toggle-icon--plus" />
                            )}
                          </button>
                        </div>
                        {isOpen && step.lines.length > 0 ? (
                          <div className="stoduyfirlit__step-body">
                            {step.lines.map((line) => (
                              <p key={line}>{line}</p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="stoduyfirlit__card stoduyfirlit__card--meter" aria-labelledby="meter-card-title">
              <div className="stoduyfirlit__card-head">
                <h3 id="meter-card-title" className="stoduyfirlit__card-title">
                  Greiðendur orkumæla
                </h3>
                <p className="stoduyfirlit__card-desc">
                  Greiðandi orkumælis er sá sem greiðir fyrir dreifingu og notkun orku, getur verið eigandi
                  eða leigjandi, eftir því sem samið er um.
                </p>
              </div>
              <div className="stoduyfirlit__table-wrap">
                <div className="stoduyfirlit__table" role="table" aria-label="Greiðendur orkumæla">
                  <div className="stoduyfirlit__table-head" role="row">
                    <div role="columnheader">Mælir</div>
                    <div role="columnheader">Greiðandi</div>
                    <div role="columnheader">Tengiliðaupplýsingar</div>
                    <div role="columnheader">Staða</div>
                  </div>
                  {meterRowsDisplay.map((row, i) => (
                    <div key={i} className="stoduyfirlit__table-block">
                      <div className="stoduyfirlit__table-row" role="row">
                        <div role="cell" className="stoduyfirlit__cell-meter">
                          {row.meter}
                        </div>
                        <div role="cell" className="stoduyfirlit__cell-payer">
                          {row.payer}
                          <br />
                          {row.kt}
                        </div>
                        <div role="cell">{row.phone}</div>
                        <div role="cell" className="stoduyfirlit__cell-status">
                          <StatusPill label={row.statusLabel} tone={row.status} />
                        </div>
                      </div>
                      {row.banner ? (
                        <div className="stoduyfirlit__banner" role="status">
                          <IconWarning />
                          <p className="stoduyfirlit__banner-text">
                            Tralalalverk ehf hefur hafnað beiðni um greiðanda orkumælis
                          </p>
                          <button type="button" className="stoduyfirlit__banner-link">
                            Skrá nýjan greiðanda
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="stoduyfirlit__meter-footnote">
                  <IconInfo />
                  <p>
                    Greiðandi orkumælis er sá sem greiðir fyrir dreifingu og notkun orku, getur verið eigandi
                    eða leigjandi, eftir því sem samið er um.
                  </p>
                </div>
              </div>
            </section>

            <YfirlitPriceCard />
          </div>

          <aside className="stoduyfirlit__aside" aria-label="Nánar um umsókn">
            {SIDEBAR_ACCORDIONS.map((acc) => {
              const open = openAcc[acc.id]
              return (
                <div key={acc.id} className="stoduyfirlit__accordion">
                  <button
                    type="button"
                    className="stoduyfirlit__accordion-trigger"
                    onClick={() => toggleAcc(acc.id)}
                    aria-expanded={open}
                  >
                    <span>{acc.label}</span>
                    <span
                      className={
                        open
                          ? 'stoduyfirlit__accordion-chevron stoduyfirlit__accordion-chevron--up'
                          : 'stoduyfirlit__accordion-chevron'
                      }
                      aria-hidden
                    />
                  </button>
                  {open && acc.id === 'stadsetning' ? (
                    <div className="stoduyfirlit__accordion-panel">
                      <p className="stoduyfirlit__accordion-address">{address}</p>
                      <div className="stoduyfirlit__map-wrap">
                        <iframe
                          title="Kort"
                          className="stoduyfirlit__map"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src="https://www.openstreetmap.org/export/embed.html?bbox=-21.98%2C64.10%2C-21.82%2C64.17&layer=mapnik"
                        />
                      </div>
                    </div>
                  ) : null}
                  {open && acc.id !== 'stadsetning' ? (
                    <div className="stoduyfirlit__accordion-panel stoduyfirlit__accordion-panel--placeholder">
                      <p className="stoduyfirlit__accordion-placeholder">Nánari upplýsingar birtast hér þegar þær liggja fyrir.</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </aside>
        </div>
      </div>
    </div>
  )
}
