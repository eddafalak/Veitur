import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoduyfirlitView from './StoduyfirlitView.jsx'
import './MinarUmsoknir.css'

const ASSETS = {
  logo: '/figma-assets/d34fa6c5a18c064370f1e0cf9cc7b3a3d28d5fa7.png',
  hero: '/figma-assets/1af8bb021722fc8cda711d628703c4b5a4c104fa.png',
  ctaPhoto: '/figma-assets/a8933d8ce667a400425ce74f66b4d9d7fbe3fb7a.png',
  userMenu: {
    close: `${import.meta.env.BASE_URL}figma-assets/user-menu/close.svg`,
    switchAccount: `${import.meta.env.BASE_URL}figma-assets/user-menu/switch-account.svg`,
    user: `${import.meta.env.BASE_URL}figma-assets/user-menu/user.svg`,
    assetsMeters: `${import.meta.env.BASE_URL}figma-assets/user-menu/assets-meters.svg`,
    accessDelegation: `${import.meta.env.BASE_URL}figma-assets/user-menu/access-delegation.svg`,
    paymentInfo: `${import.meta.env.BASE_URL}figma-assets/user-menu/payment-info.svg`,
    piPort: `${import.meta.env.BASE_URL}figma-assets/user-menu/pi-port.svg`,
    advice: `${import.meta.env.BASE_URL}figma-assets/user-menu/advice.svg`,
    help: `${import.meta.env.BASE_URL}figma-assets/user-menu/help.svg`,
    logout: `${import.meta.env.BASE_URL}figma-assets/user-menu/logout.svg`,
  },
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
      {value != null && value !== '' ? (
        <span className="minar-umsoknir__meta-value">{value}</span>
      ) : null}
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

const ADDRESS_POSTAL_REYKJAVIK = ', 107 Reykjavík'

function virkarCardStreet(i) {
  if (i === 1) return 'Ármúli 1'
  if (i === 2) return 'Holtsgata 24'
  if (i === 3) return 'Fannafold 3'
  if (i === 4) return 'Akravogur 56'
  if (i === 5) return 'Nýlendugata 8'
  return 'Reynimelur 32'
}

function virkarCardFullAddress(i) {
  return `${virkarCardStreet(i)}${ADDRESS_POSTAL_REYKJAVIK}`
}

export default function MinarUmsoknir() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('allt')
  const [statusApplication, setStatusApplication] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuBtnRef = useRef(null)
  const userMenuPanelRef = useRef(null)
  const userMenuCloseBtnRef = useRef(null)

  const showSamthykkt = activeTab === 'allt' || activeTab === 'samthykkt'
  const showVirkar = activeTab === 'allt' || activeTab === 'virkar'
  const showOklarad = activeTab === 'allt' || activeTab === 'oklarad'

  const showDividerAfterSamthykkt = showSamthykkt && (showVirkar || showOklarad)
  const showDividerAfterVirkar = showVirkar && showOklarad

  const VIRKAR_TOTAL = 6
  const VIRKAR_PREVIEW = 3
  const virkarCount = activeTab === 'virkar' ? VIRKAR_TOTAL : VIRKAR_PREVIEW
  const showVirkarSeeAll = activeTab !== 'virkar' && VIRKAR_TOTAL > VIRKAR_PREVIEW
  const periodFilterActive = activeTab !== 'allt'

  useEffect(() => {
    if (!statusApplication) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [statusApplication])

  useEffect(() => {
    if (!userMenuOpen) return undefined

    const t = window.setTimeout(() => userMenuCloseBtnRef.current?.focus(), 0)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false)
        window.setTimeout(() => userMenuBtnRef.current?.focus(), 0)
      }
    }

    const onPointerDown = (e) => {
      const panel = userMenuPanelRef.current
      const btn = userMenuBtnRef.current
      if (!panel || !btn) return
      if (panel.contains(e.target) || btn.contains(e.target)) return
      setUserMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [userMenuOpen])

  const userMenuItems = [
    { id: 'switch', label: 'Skipta um aðgang', iconSrc: ASSETS.userMenu.switchAccount, dividerAfter: true },
    { id: 'info', label: 'Mínar upplýsingar', iconSrc: ASSETS.userMenu.user },
    { id: 'assets', label: 'Eignir og mælar', iconSrc: ASSETS.userMenu.assetsMeters },
    { id: 'access', label: 'Aðgangar og umboð', iconSrc: ASSETS.userMenu.accessDelegation },
    { id: 'payment', label: 'Greiðsluupplýsingar', iconSrc: ASSETS.userMenu.paymentInfo },
    { id: 'pi', label: 'PI Port og vefþjónustur', iconSrc: ASSETS.userMenu.piPort, dividerAfter: true },
    { id: 'advice', label: 'Hollráð', iconSrc: ASSETS.userMenu.advice },
    { id: 'help', label: 'Aðstoð', iconSrc: ASSETS.userMenu.help, dividerAfter: true },
    { id: 'logout', label: 'Útskrá', iconSrc: ASSETS.userMenu.logout },
  ]

  return (
    <div className="minar-umsoknir">
      <header className="minar-umsoknir__nav">
        <a href="/umsoknir" className="minar-umsoknir__logo">
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
          <button
            ref={userMenuBtnRef}
            type="button"
            className="minar-umsoknir__user-menu"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            onClick={() => setUserMenuOpen((v) => !v)}
          >
            <span>Jónatan Gunnlaugsson</span>
            <IconCaretDown />
          </button>
          {userMenuOpen ? (
            <div ref={userMenuPanelRef} className="minar-umsoknir__user-dropdown" role="menu">
              <div className="minar-umsoknir__user-dropdown-head">
                <div className="minar-umsoknir__user-dropdown-name">Jónatan Gunnlaugsson</div>
                <button
                  ref={userMenuCloseBtnRef}
                  type="button"
                  className="minar-umsoknir__user-dropdown-close"
                  onClick={() => {
                    setUserMenuOpen(false)
                    window.setTimeout(() => userMenuBtnRef.current?.focus(), 0)
                  }}
                  aria-label="Loka valmynd"
                >
                  <img src={ASSETS.userMenu.close} alt="" aria-hidden />
                </button>
              </div>
              <div className="minar-umsoknir__user-dropdown-items" role="presentation">
                {userMenuItems.map((item) => (
                  <div key={item.id} role="presentation">
                    <button
                      type="button"
                      role="menuitem"
                      className="minar-umsoknir__user-dropdown-item"
                      onClick={() => {
                        setUserMenuOpen(false)
                        if (item.id === 'logout') navigate('/login')
                      }}
                    >
                      <span className="minar-umsoknir__user-dropdown-icon" aria-hidden>
                        <img src={item.iconSrc} alt="" />
                      </span>
                      <span className="minar-umsoknir__user-dropdown-label">{item.label}</span>
                    </button>
                    {item.dividerAfter ? <div className="minar-umsoknir__user-dropdown-divider" /> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {!statusApplication ? (
        <section className="minar-umsoknir__hero" aria-labelledby="page-title">
          <img className="minar-umsoknir__hero-bg" src={ASSETS.hero} alt="" />
          <div className="minar-umsoknir__hero-inner">
            <h1 id="page-title" className="minar-umsoknir__hero-title">
              Mínar umsóknir
            </h1>
          </div>
        </section>
      ) : null}

      <div
        className={
          statusApplication
            ? 'minar-umsoknir__main-wrap minar-umsoknir__main-wrap--detail'
            : 'minar-umsoknir__main-wrap'
        }
      >
        {statusApplication ? (
          <StoduyfirlitView
            address={statusApplication.address}
            onBack={() => setStatusApplication(null)}
          />
        ) : (
          <>
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
                {periodFilterActive ? (
                  <button
                    type="button"
                    className="minar-umsoknir__select-like minar-umsoknir__select-like--active"
                    aria-haspopup="listbox"
                  >
                    <span className="minar-umsoknir__select-like__value">Mánuður</span>
                    <IconCaretDown size={20} />
                  </button>
                ) : (
                  <div className="minar-umsoknir__select-like" aria-disabled="true">
                    <span className="minar-umsoknir__select-like__value">Mánuður</span>
                    <IconCaretDown size={20} />
                  </div>
                )}
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
                          <h3 className="minar-umsoknir__card-title">Reynimelur 32</h3>
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
                        <Meta label="Nýtenging húsnæðis" />
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
                        <Meta label="Nýtenging húsnæðis" />
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
                          <h3 className="minar-umsoknir__card-title">Holtsgata 24</h3>
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
                        <Meta label="Nýtenging húsnæðis" />
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
                  {Array.from({ length: virkarCount }, (_, i) => (
                    <article
                      key={i}
                      className="minar-umsoknir__list-card minar-umsoknir__list-card--soft"
                    >
                      <div className="minar-umsoknir__card-head">
                        <div className="minar-umsoknir__card-title-block">
                          <div className="minar-umsoknir__card-title-row">
                            <h3 className="minar-umsoknir__card-title">{virkarCardStreet(i)}</h3>
                            <div className="minar-umsoknir__tags">
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
                          onClick={() =>
                            setStatusApplication({ address: virkarCardFullAddress(i) })
                          }
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
                {showVirkarSeeAll ? (
                  <div className="minar-umsoknir__section-foot">
                    <button
                      type="button"
                      className="minar-umsoknir__text-link"
                      onClick={() => setActiveTab('virkar')}
                    >
                      Sjá fleiri umsóknir
                      <IconArrowRight />
                    </button>
                  </div>
                ) : null}
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
                            <h3 className="minar-umsoknir__card-title">Reynimelur 32</h3>
                            <div className="minar-umsoknir__tags">
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
                          onClick={() =>
                            setStatusApplication({
                              address: `Reynimelur 32${ADDRESS_POSTAL_REYKJAVIK}`,
                            })
                          }
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
                    Sjá fleiri umsóknir
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
          </>
        )}
      </div>

    </div>
  )
}
