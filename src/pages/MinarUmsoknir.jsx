import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MinarUmsoknir.css'

const ASSETS = {
  logo: '/figma-assets/d34fa6c5a18c064370f1e0cf9cc7b3a3d28d5fa7.png',
  hero: '/figma-assets/1af8bb021722fc8cda711d628703c4b5a4c104fa.png',
  ctaPhoto: '/figma-assets/a8933d8ce667a400425ce74f66b4d9d7fbe3fb7a.png',
}

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5a4.5 4.5 0 0 0-4.5 4.5v2.09l-.86 1.72A1 1 0 0 0 5.58 12h8.84a1 1 0 0 0 .89-1.29l-.86-1.72V7A4.5 4.5 0 0 0 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 14a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCaretDown({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconSliders() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 5h2.5M8 5h9M3 10h9m2.5 0H17M3 15h6.5M13 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="6.5" cy="5" r="1.75" fill="currentColor" />
      <circle cx="12.5" cy="10" r="1.75" fill="currentColor" />
      <circle cx="10.5" cy="15" r="1.75" fill="currentColor" />
    </svg>
  )
}

function IconPlusNote() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3h8l4 4v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 4h10M6 4V2.5h4V4m-7 0 .5 9a1 1 0 0 0 1 .9h5a1 1 0 0 0 1-.9l.5-9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Meta({ label, value }) {
  return (
    <div className="minar-umsoknir__meta">
      <span className="minar-umsoknir__meta-label">{label}</span>
      <span className="minar-umsoknir__meta-value">{value}</span>
    </div>
  )
}

const NAV = [
  { id: 'yfirlit', label: 'Yfirlit' },
  { id: 'reikningar', label: 'Reikningar' },
  { id: 'notkun', label: 'Notkun' },
  { id: 'min-mal', label: 'Mín mál' },
  { id: 'umsoknir', label: 'Umsóknir', active: true },
]

const TABS = [
  { id: 'allt', label: 'Allt' },
  { id: 'samthykkt', label: 'Samþykktarbeiðnir' },
  { id: 'virkar', label: 'Virkar umsóknir' },
  { id: 'oklarad', label: 'Ókláraðar umsóknir' },
  { id: 'eldri', label: 'Eldri umsóknir' },
]

export default function MinarUmsoknir() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('allt')

  const showSamthykkt = activeTab === 'allt' || activeTab === 'samthykkt'
  const showVirkar = activeTab === 'allt' || activeTab === 'virkar'
  const showOklarad = activeTab === 'allt' || activeTab === 'oklarad'

  const showDividerAfterSamthykkt = showSamthykkt && (showVirkar || showOklarad)
  const showDividerAfterVirkar = showVirkar && showOklarad

  return (
    <div className="minar-umsoknir">
      <header className="minar-umsoknir__nav">
        <a href="/" className="minar-umsoknir__logo">
          <img src={ASSETS.logo} alt="Veitur" width={160} height={36} />
        </a>
        <nav className="minar-umsoknir__nav-items" aria-label="Aðalvalmynd">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                item.active
                  ? 'minar-umsoknir__nav-item minar-umsoknir__nav-item--active'
                  : 'minar-umsoknir__nav-item'
              }
            >
              <span>{item.label}</span>
              <span className="minar-umsoknir__nav-underline" aria-hidden />
            </button>
          ))}
        </nav>
        <div className="minar-umsoknir__nav-actions">
          <button type="button" className="minar-umsoknir__icon-btn" aria-label="Tilkynningar">
            <IconBell />
            <span className="minar-umsoknir__notif-dot" aria-hidden />
          </button>
          <button type="button" className="minar-umsoknir__user-menu">
            <span>Jónatan Gunnlaugsson</span>
            <IconCaretDown />
          </button>
        </div>
      </header>

      <section className="minar-umsoknir__hero" aria-labelledby="page-title">
        <img className="minar-umsoknir__hero-bg" src={ASSETS.hero} alt="" />
        <div className="minar-umsoknir__hero-inner">
          <h1 id="page-title" className="minar-umsoknir__hero-title">
            Mínar umsóknir
          </h1>
        </div>
      </section>

      <div className="minar-umsoknir__main-wrap">
        <div className="minar-umsoknir__toolbar">
          <div className="minar-umsoknir__tabs" role="tablist" aria-label="Síur umsókna">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={
                    isActive
                      ? 'minar-umsoknir__tab minar-umsoknir__tab--active'
                      : 'minar-umsoknir__tab'
                  }
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="minar-umsoknir__filters">
            <div className="minar-umsoknir__filters-left">
              <div className="minar-umsoknir__field minar-umsoknir__field--search">
                <label className="minar-umsoknir__label" htmlFor="search-requests">
                  Leit
                </label>
                <div className="minar-umsoknir__search">
                  <input
                    id="search-requests"
                    type="search"
                    placeholder="Leita að beiðni"
                    autoComplete="off"
                  />
                  <IconSearch />
                </div>
              </div>
              <div className="minar-umsoknir__field minar-umsoknir__field--period">
                <span className="minar-umsoknir__label">Tímabil</span>
                <div className="minar-umsoknir__select-like">
                  <span>Mánuður</span>
                  <IconCaretDown size={20} />
                </div>
              </div>
            </div>
            <div className="minar-umsoknir__filters-right">
              <button type="button" className="minar-umsoknir__btn-filter">
                <IconSliders />
                Sía
              </button>
              <button
                type="button"
                className="minar-umsoknir__btn-primary"
                onClick={() => navigate('/stofna-umsokn')}
              >
                Stofna umsókn
                <IconPlusNote />
              </button>
            </div>
          </div>
        </div>

        <div className="minar-umsoknir__content-frame">
          <div className="minar-umsoknir__layout">
            <div className="minar-umsoknir__content-col">
              {showSamthykkt ? (
              <section aria-labelledby="sec-approval">
                <h2 id="sec-approval" className="minar-umsoknir__section-title">
                  Samþykktarbeiðnir
                </h2>
                <div className="minar-umsoknir__card-list">
                  <article className="minar-umsoknir__list-card minar-umsoknir__list-card--approval">
                    <div className="minar-umsoknir__card-head">
                      <div className="minar-umsoknir__card-title-block">
                        <div className="minar-umsoknir__card-title-row">
                          <h3 className="minar-umsoknir__card-title">Ármúli 1</h3>
                          <div className="minar-umsoknir__tags">
                            <span className="minar-umsoknir__tag">
                              <span
                                className="minar-umsoknir__status-dot minar-umsoknir__status-dot--yellow"
                                aria-hidden
                              />
                              Í bið eftir samþykki
                            </span>
                          </div>
                        </div>
                        <p className="minar-umsoknir__card-sub">Greiðandi orkumælis</p>
                      </div>
                    </div>
                    <div className="minar-umsoknir__card-foot">
                      <div className="minar-umsoknir__meta-row">
                        <Meta label="Stofnað" value="06.05.2024" />
                      </div>
                      <button
                        type="button"
                        className="minar-umsoknir__text-link minar-umsoknir__text-link--with-hover-arrow"
                      >
                        Opna samþykkt
                        <span className="minar-umsoknir__text-link__hover-icon" aria-hidden>
                          <IconArrowRight />
                        </span>
                      </button>
                    </div>
                  </article>

                  <article className="minar-umsoknir__list-card minar-umsoknir__list-card--approval">
                    <div className="minar-umsoknir__card-head">
                      <div className="minar-umsoknir__card-title-block">
                        <div className="minar-umsoknir__card-title-row">
                          <h3 className="minar-umsoknir__card-title">Ármúli 1</h3>
                          <div className="minar-umsoknir__tags">
                            <span className="minar-umsoknir__tag">
                              <span
                                className="minar-umsoknir__status-dot minar-umsoknir__status-dot--yellow"
                                aria-hidden
                              />
                              Í bið eftir samþykki
                            </span>
                          </div>
                        </div>
                        <p className="minar-umsoknir__card-sub">Greiðandi umsóknar</p>
                      </div>
                    </div>
                    <div className="minar-umsoknir__card-foot">
                      <div className="minar-umsoknir__meta-row">
                        <Meta label="Stofnað" value="06.05.2024" />
                      </div>
                      <button
                        type="button"
                        className="minar-umsoknir__text-link minar-umsoknir__text-link--with-hover-arrow"
                      >
                        Opna samþykkt
                        <span className="minar-umsoknir__text-link__hover-icon" aria-hidden>
                          <IconArrowRight />
                        </span>
                      </button>
                    </div>
                  </article>

                  <article className="minar-umsoknir__list-card minar-umsoknir__list-card--approval">
                    <div className="minar-umsoknir__card-head">
                      <div className="minar-umsoknir__card-title-block">
                        <div className="minar-umsoknir__card-title-row">
                          <h3 className="minar-umsoknir__card-title">Reynimelur 28</h3>
                          <div className="minar-umsoknir__tags">
                            <span className="minar-umsoknir__tag">
                              <span
                                className="minar-umsoknir__status-dot minar-umsoknir__status-dot--yellow"
                                aria-hidden
                              />
                              Í bið eftir samþykki
                            </span>
                          </div>
                        </div>
                        <p className="minar-umsoknir__card-sub">Uppfærður kostnaður</p>
                      </div>
                    </div>
                    <div className="minar-umsoknir__card-foot">
                      <div className="minar-umsoknir__meta-row">
                        <Meta label="Stofnað" value="06.05.2024" />
                      </div>
                      <button
                        type="button"
                        className="minar-umsoknir__text-link minar-umsoknir__text-link--with-hover-arrow"
                      >
                        Opna samþykkt
                        <span className="minar-umsoknir__text-link__hover-icon" aria-hidden>
                          <IconArrowRight />
                        </span>
                      </button>
                    </div>
                  </article>
                </div>
                <div className="minar-umsoknir__section-foot">
                  <button type="button" className="minar-umsoknir__text-link">
                    Sjá fleiri beiðnir
                    <IconArrowRight />
                  </button>
                </div>
              </section>
              ) : null}

              {showDividerAfterSamthykkt ? (
                <div className="minar-umsoknir__divider" role="presentation" />
              ) : null}

              {showVirkar ? (
              <section aria-labelledby="sec-active">
                <h2 id="sec-active" className="minar-umsoknir__section-title">
                  Virkar umsóknir
                </h2>
                <div className="minar-umsoknir__card-list">
                  {Array.from({ length: 6 }, (_, i) => (
                    <article
                      key={i}
                      className="minar-umsoknir__list-card minar-umsoknir__list-card--soft"
                    >
                      <div className="minar-umsoknir__card-head">
                        <div className="minar-umsoknir__card-title-block">
                          <div className="minar-umsoknir__card-title-row">
                            <h3 className="minar-umsoknir__card-title">Reynimelur 28</h3>
                            <div className="minar-umsoknir__tags">
                              <span className="minar-umsoknir__tag">
                                <span
                                  className="minar-umsoknir__status-dot minar-umsoknir__status-dot--grey"
                                  aria-hidden
                                />
                                Umsjón
                              </span>
                              <span className="minar-umsoknir__tag">
                                <span
                                  className="minar-umsoknir__status-dot minar-umsoknir__status-dot--blue"
                                  aria-hidden
                                />
                                í vinnslu
                              </span>
                            </div>
                          </div>
                          <p className="minar-umsoknir__card-sub">Nýtenging húsnæðis</p>
                        </div>
                      </div>
                      <div className="minar-umsoknir__card-foot">
                        <div className="minar-umsoknir__meta-row">
                          <Meta label="Stofnað" value="06.05.2024" />
                          <Meta label="Síðast breytt" value="06.05.2024" />
                        </div>
                        <button
                          type="button"
                          className="minar-umsoknir__text-link minar-umsoknir__text-link--with-hover-arrow"
                        >
                          Sjá stöðuyfirlit
                          <span className="minar-umsoknir__text-link__hover-icon" aria-hidden>
                            <IconArrowRight />
                          </span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              ) : null}

              {showDividerAfterVirkar ? (
                <div className="minar-umsoknir__divider" role="presentation" />
              ) : null}

              {showOklarad ? (
              <section aria-labelledby="sec-draft">
                <h2 id="sec-draft" className="minar-umsoknir__section-title">
                  Ókláraðar umsóknir
                </h2>
                <div className="minar-umsoknir__card-list">
                  {[0, 1].map((i) => (
                    <article
                      key={i}
                      className="minar-umsoknir__list-card minar-umsoknir__list-card--soft"
                    >
                      <div className="minar-umsoknir__card-head">
                        <div className="minar-umsoknir__card-title-block">
                          <div className="minar-umsoknir__card-title-row">
                            <h3 className="minar-umsoknir__card-title">Reynimelur 28</h3>
                            <div className="minar-umsoknir__tags">
                              <span className="minar-umsoknir__tag">
                                <span
                                  className="minar-umsoknir__status-dot minar-umsoknir__status-dot--grey"
                                  aria-hidden
                                />
                                Umsjón
                              </span>
                              <span className="minar-umsoknir__tag minar-umsoknir__tag--muted">
                                {i === 0 ? 'Óklárað' : 'óklárað'}
                              </span>
                            </div>
                          </div>
                          <p className="minar-umsoknir__card-sub">Nýtenging húsnæðis</p>
                        </div>
                        <button
                          type="button"
                          className="minar-umsoknir__trash-btn"
                          aria-label="Eyða umsókn"
                        >
                          <IconTrash />
                        </button>
                      </div>
                      <div className="minar-umsoknir__card-foot">
                        <div className="minar-umsoknir__meta-row">
                          <Meta label="Stofnað" value="06.05.2024" />
                          <Meta label="Síðast breytt" value="06.05.2024" />
                        </div>
                        <button
                          type="button"
                          className="minar-umsoknir__text-link minar-umsoknir__text-link--with-hover-arrow"
                        >
                          Sjá stöðuyfirlit
                          <span className="minar-umsoknir__text-link__hover-icon" aria-hidden>
                            <IconArrowRight />
                          </span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="minar-umsoknir__section-foot">
                  <button type="button" className="minar-umsoknir__text-link">
                    Sjá allar beiðnir
                    <IconArrowRight />
                  </button>
                </div>
              </section>
              ) : null}
            </div>

            <aside className="minar-umsoknir__aside" aria-labelledby="cta-title">
              <div className="minar-umsoknir__cta-card">
                <div className="minar-umsoknir__cta-img-wrap">
                  <img src={ASSETS.ctaPhoto} alt="" />
                </div>
                <div className="minar-umsoknir__cta-body">
                  <div className="minar-umsoknir__cta-title-row">
                    <h2 id="cta-title" className="minar-umsoknir__cta-title">
                      Umsóknir
                    </h2>
                    <IconDoc />
                  </div>
                  <p className="minar-umsoknir__cta-text">
                    Hér getur þú stofnað nýja umsókn eða fylgst með stöðu þeirra sem eru í vinnslu.
                  </p>
                </div>
                <div className="minar-umsoknir__cta-actions">
                  <button type="button" className="minar-umsoknir__btn-secondary">
                    Sjá nánar
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
