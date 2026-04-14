import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserMenu from '../components/UserMenu.jsx'
import './MinarUmsoknir.css'
import './StofnaUmsokn.css'

const ASSETS = {
  logo: '/figma-assets/d34fa6c5a18c064370f1e0cf9cc7b3a3d28d5fa7.png',
  hero: '/figma-assets/1af8bb021722fc8cda711d628703c4b5a4c104fa.png',
  cardFaersla: `${import.meta.env.BASE_URL}OR89219%204.png`,
  cardBreyta: `${import.meta.env.BASE_URL}OR89219%202.png`,
  cardLitra: `${import.meta.env.BASE_URL}OR89219.png`,
  cardThrif: `${import.meta.env.BASE_URL}OR89219%203.png`,
  /** Nýtenging — Figma OR89219 / OR89220 */
  cardNytHusnaedi: `${import.meta.env.BASE_URL}OR89219%206.png`,
  cardNytInnvidi: `${import.meta.env.BASE_URL}OR89219%205.png`,
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

const NAV = [
  { id: 'yfirlit', label: 'Yfirlit' },
  { id: 'reikningar', label: 'Reikningar' },
  { id: 'notkun', label: 'Notkun' },
  { id: 'min-mal', label: 'Mín mál' },
  { id: 'umsoknir', label: 'Umsóknir', active: true },
]

const CATEGORY_TABS = [
  { id: 'breytingar', label: 'Breytingar' },
  { id: 'nytenging', label: 'Nýtenging' },
  { id: 'skammtima', label: 'Skammtímatengingar' },
  { id: 'aftenging', label: 'Aftenging' },
  { id: 'annad', label: 'Annað' },
]

const BREYTINGAR_OPTIONS = [
  {
    id: 'thrif',
    gridClass: 'stofna-umsokn__option-card--pos-11',
    title: 'Ósk um þrífösun',
    description:
      'Sækja um breytingu á núverandi tengingu í þriggja fasta tengingu.',
    image: ASSETS.cardThrif,
  },
  {
    id: 'faersla',
    gridClass: 'stofna-umsokn__option-card--pos-21',
    title: 'Færsla utan lóðar',
    description: 'Sækja um færslu á búnaði í eigu Veitna sem er staðsettur utan lóðar.',
    image: ASSETS.cardFaersla,
  },
  {
    id: 'breyta',
    gridClass: 'stofna-umsokn__option-card--pos-12',
    title: 'Breyta tengingum og búnaði',
    description:
      'Sækja um breytingu á tengingum og búnaði, til dæmis þegar færa þarf lagnir eða strengi, stækka núverandi tengingar eða færa mælagrind.',
    image: ASSETS.cardBreyta,
  },
  {
    id: 'litra',
    gridClass: 'stofna-umsokn__option-card--pos-22',
    title: 'Ósk um breytingu á lítrum',
    description: 'Sækja um breytingu á rennsli heits vatns í sumarhús.',
    image: ASSETS.cardLitra,
  },
]

const NYTENGING_OPTIONS = [
  {
    id: 'nyt-hus',
    gridClass: 'stofna-umsokn__option-card--pos-11',
    title: 'Nýtenging húsnæðis',
    description:
      'Sækja um varanlega tengingu við rafmagn, kalt vatn, heitt vatn eða fráveitu, eftir því sem er í boði á þjónustusvæði Veitna.',
    image: ASSETS.cardNytHusnaedi,
    applicationPath: '/umsokn/nytenging/husnaedis',
  },
  {
    id: 'nyt-inn',
    gridClass: 'stofna-umsokn__option-card--pos-21',
    title: 'Nýtenging innviða',
    description:
      'Sækja um tengingu við rafmagn, heitt vatn og kalt vatn fyrir innviði, til dæmis fótboltavelli, ljósastaura og bílahleðslur, eftir því sem er í boði á þjónustusvæði Veitna.',
    image: ASSETS.cardNytInnvidi,
    applicationPath: '/umsokn/nytenging/innvidi',
  },
]

export default function StofnaUmsokn() {
  const [activeCategory, setActiveCategory] = useState('breytingar')

  return (
    <div className="minar-umsoknir stofna-umsokn">
      <header className="minar-umsoknir__nav">
        <Link to="/umsoknir" className="minar-umsoknir__logo">
          <img src={ASSETS.logo} alt="Veitur" width={160} height={36} />
        </Link>
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
          <UserMenu name="Jónatan Gunnlaugsson" />
        </div>
      </header>

      <section className="minar-umsoknir__hero" aria-labelledby="stofna-title">
        <img className="minar-umsoknir__hero-bg" src={ASSETS.hero} alt="" />
        <div className="minar-umsoknir__hero-inner">
          <h1 id="stofna-title" className="minar-umsoknir__hero-title">
            Stofna umsókn
          </h1>
        </div>
      </section>

      <div className="minar-umsoknir__main-wrap">
        <div className="stofna-umsokn__stack">
          <div className="stofna-umsokn__panel">
            <div className="stofna-umsokn__back-wrap">
              <Link to="/umsoknir" className="stofna-umsokn__back">
                <IconArrowLeft />
                Til baka
              </Link>
            </div>
            <div className="stofna-umsokn__tabs-row">
              <div className="minar-umsoknir__tabs" role="tablist" aria-label="Tegund umsóknar">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === tab.id}
                    className={
                      activeCategory === tab.id
                        ? 'minar-umsoknir__tab minar-umsoknir__tab--active'
                        : 'minar-umsoknir__tab'
                    }
                    onClick={() => setActiveCategory(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="stofna-umsokn__tabs-spacer" aria-hidden />
            </div>
          </div>

          <div className="stofna-umsokn__panel">
            {activeCategory === 'breytingar' && (
              <>
                <h2 className="stofna-umsokn__section-title">Breytingar</h2>
                <div className="stofna-umsokn__card-grid">
                  {BREYTINGAR_OPTIONS.map((opt) => (
                    <article
                      key={opt.id}
                      className={`stofna-umsokn__option-card ${opt.gridClass}`}
                    >
                      <div className="stofna-umsokn__option-body">
                        <div className="stofna-umsokn__option-text">
                          <h3>{opt.title}</h3>
                          <p>{opt.description}</p>
                        </div>
                        <button type="button" className="stofna-umsokn__option-cta">
                          Hefja umsókn
                          <IconArrowRight />
                        </button>
                      </div>
                      <div
                        className="stofna-umsokn__option-media"
                        style={opt.image ? { backgroundImage: `url(${opt.image})` } : undefined}
                      >
                        <img src={opt.image} alt="" />
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
            {activeCategory === 'nytenging' && (
              <>
                <h2 className="stofna-umsokn__section-title">Nýtenging</h2>
                <div className="stofna-umsokn__card-grid stofna-umsokn__card-grid--nytenging">
                  {NYTENGING_OPTIONS.map((opt) => (
                    <article
                      key={opt.id}
                      className={`stofna-umsokn__option-card ${opt.gridClass}`}
                    >
                      <div className="stofna-umsokn__option-body">
                        <div className="stofna-umsokn__option-text">
                          <h3>{opt.title}</h3>
                          <p>{opt.description}</p>
                        </div>
                        <Link to={opt.applicationPath} className="stofna-umsokn__option-cta">
                          Hefja umsókn
                          <IconArrowRight />
                        </Link>
                      </div>
                      <div
                        className="stofna-umsokn__option-media"
                        style={opt.image ? { backgroundImage: `url(${opt.image})` } : undefined}
                      >
                        <img src={opt.image} alt="" />
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
            {activeCategory !== 'breytingar' && activeCategory !== 'nytenging' && (
              <>
                <h2 className="stofna-umsokn__section-title">
                  {CATEGORY_TABS.find((t) => t.id === activeCategory)?.label}
                </h2>
                <p className="stofna-umsokn__tab-placeholder">
                  Þessi hluti er í undirbúningi. Veldu „Breytingar“ eða „Nýtenging“ til að skoða tiltækar umsóknir.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="stofna-umsokn__footer">
        <p className="stofna-umsokn__footer-title">Footer</p>
      </footer>
    </div>
  )
}
