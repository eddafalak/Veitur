import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import YfirlitPriceCard from '../components/YfirlitPriceCard.jsx'
import UserMenu from '../components/UserMenu.jsx'
import { readGreidendurOrkumaelaDraft, saveGreidendurOrkumaelaDraft } from '../greidendurOrkumaelaDraft.js'
import './MinarUmsoknir.css'
import './NytengingUmsokn.css'

const ASSETS = {
  logo: '/figma-assets/d34fa6c5a18c064370f1e0cf9cc7b3a3d28d5fa7.png',
  /** `public/map.png` — kort / teikning (BASE_URL fyrir undirslóð) */
  mapSnapshot: `${import.meta.env.BASE_URL}map.png`,
}

/** `public/Icon=….svg` — bil sem %20; Fráveita á skrá sem a + samsettan brodd (NFD) */
const SERVICE_TAG_ICON_SRC = {
  rafmagn: '/Icon=Rafmagn.svg',
  heittVatn: '/Icon=Heitt%20vatn.svg',
  kaltVatn: '/Icon=Kalt%20vatn.svg',
  fraveita: '/Icon=Fra%CC%81veita.svg',
}

const NAV = [
  { id: 'yfirlit', label: 'Yfirlit' },
  { id: 'reikningar', label: 'Reikningar' },
  { id: 'notkun', label: 'Notkun' },
  { id: 'min-mal', label: 'Mín mál' },
  { id: 'umsoknir', label: 'Umsóknir', active: true },
]

const TITLES = {
  husnaedis: 'Nýtenging húsnæðis',
  innvidi: 'Nýtenging innviða',
}

const SAMPLE_ADDRESS = 'Reynimelur 32, 107 Reykjavík'

/** Sýnieinkunnafn — haus og greiðanda-spurning nota sama nafn og innskráður notandi. */
const DEMO_LOGGED_IN_NAME = 'Jónatan Gunnlaugsson'

/** Set to `true` to show the Figma 12-column debug overlay (skref ≥ 1). */
const SHOW_12_COL_GRID_OVERLAY = false

const FORM_LEAD_TITLE = {
  husnaedis: 'Umsókn: Nýtengingu húsnæðis',
  innvidi: 'Umsókn: Nýtengingu innviða',
}

/* Röð samkvæmt Figma (4110:92329 o.fl.) */
const STEPS = [
  { key: 'heimilisfang', label: 'Heimilisfang' },
  { key: 'upplysingar', label: 'Upplýsingar' },
  { key: 'greidendur', label: 'Greiðendur' },
  { key: 'tengilidir', label: 'Tengiliður og fagaðilar' },
  { key: 'fylgiskjol', label: 'Fylgiskjöl' },
  { key: 'yfirlit', label: 'Yfirlit' },
]

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
      <path
        d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14Zm0-2a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
        fill="currentColor"
      />
      <path
        d="m14.29 14.29 3.42 3.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 10.5 8 14.5 16 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCloseModal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8m0-8L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconFileArrowUp() {
  return (
    <img
      src="/Format=Stroke,%20Weight=Fill.svg"
      alt=""
      width={24}
      height={24}
      className="nytenging-umsokn__fylg-upload-icon"
      aria-hidden
    />
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

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13 8H3m0 0 3 3m-3-3 3-3"
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="nytenging-umsokn__info-icon">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 7.2V11M8 5.2h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Sama mynd og `public/Icon=Rafmagn.svg` / `src/assets/icons/rafmagn.svg` — SVG í stað <img> */
function IconRafmagnCard() {
  return (
    <svg
      className="nytenging-umsokn__form-card-head-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17.0402 22.9204C17.0402 23.3842 16.6642 23.7603 16.2003 23.7603H7.80128C7.15473 23.7596 6.75137 23.0593 7.07524 22.4997C7.22523 22.2405 7.50185 22.0808 7.80128 22.0805H16.2003C16.6642 22.0805 17.0402 22.4565 17.0402 22.9204ZM21.2397 9.48192C21.2471 12.3193 19.9436 15.001 17.708 16.7481C17.2899 17.0686 17.0434 17.5642 17.0402 18.0909V18.7209C17.0402 19.6486 16.2882 20.4007 15.3604 20.4007H8.64119C7.71346 20.4007 6.96138 19.6486 6.96138 18.7209V18.0909C6.96103 17.5705 6.71946 17.0796 6.3073 16.7618C4.07748 15.0252 2.77008 12.3597 2.76186 9.53336C2.73457 4.52964 6.7787 0.362663 11.7782 0.242973C16.9674 0.117929 21.2413 4.29119 21.2397 9.48192ZM15.9547 9.72759C15.6266 9.39915 15.0943 9.39915 14.7662 9.72759L12.0008 12.494L9.23542 9.72759C8.77798 9.27015 7.99688 9.47945 7.82946 10.1043C7.75175 10.3943 7.83466 10.7038 8.04696 10.9161L11.1609 14.029V17.881C11.1616 18.5275 11.8619 18.9309 12.4215 18.607C12.6807 18.457 12.8404 18.1804 12.8407 17.881V14.029L15.9547 10.9161C16.2831 10.588 16.2831 10.0557 15.9547 9.72759Z"
        fill="#96D23C"
      />
    </svg>
  )
}

/** Sama og `public/Icon=Heitt vatn.svg` / `src/assets/icons/heitt-vatn.svg` */
function IconHeittVatnCard() {
  return (
    <svg
      className="nytenging-umsokn__form-card-head-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M13.675 0.440888C13.2115 0.0555845 12.5062 0.24601 12.2997 0.812203L9.90413 7.39023L7.27336 4.84112C6.89874 4.47777 6.29088 4.52312 5.97431 4.93803C3.61576 8.02832 2.41797 11.1371 2.41797 14.1773C2.41797 21.5538 10.4032 26.1641 16.7914 22.4758C19.7562 20.7641 21.5826 17.6007 21.5826 14.1773C21.5826 7.70382 16.052 2.41723 13.675 0.440888ZM18.0861 15.1943C17.6235 17.7785 15.6004 19.8011 13.0162 20.2632C12.9684 20.2714 12.9199 20.2754 12.8714 20.2751C12.2008 20.275 11.7819 19.5489 12.1173 18.9683C12.2474 18.7431 12.4712 18.5879 12.7276 18.5449C14.5319 18.2411 16.0629 16.7101 16.3689 14.9025C16.4812 14.2412 17.2674 13.9494 17.784 14.3773C18.0237 14.576 18.1382 14.8874 18.0861 15.1943Z"
        fill="#B42828"
      />
    </svg>
  )
}

/** Sama og `public/Icon=Kalt vatn.svg` / `src/assets/icons/kalt-vatn.svg` */
function IconKaltVatnCard() {
  return (
    <svg
      className="nytenging-umsokn__form-card-head-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16.8319 4.41379C15.5349 2.91589 14.0751 1.56706 12.4796 0.39225C12.1902 0.189563 11.805 0.189563 11.5157 0.39225C9.92306 1.56755 8.46613 2.91636 7.17177 4.41379C4.28529 7.72867 2.76172 11.2231 2.76172 14.5201C2.76399 21.6332 10.4655 26.0764 16.6244 22.5179C19.481 20.8674 21.2409 17.8192 21.2419 14.5201C21.2419 11.2231 19.7183 7.72867 16.8319 4.41379ZM17.8661 15.5009C17.42 17.9927 15.4692 19.9431 12.9773 20.3886C12.9325 20.3958 12.8872 20.3997 12.8418 20.4002C12.1952 20.4 11.7912 19.6999 12.1147 19.14C12.2401 18.9229 12.4559 18.7732 12.7032 18.7317C14.4431 18.4388 15.9194 16.9625 16.2145 15.2194C16.3228 14.5817 17.0808 14.3004 17.579 14.713C17.8102 14.9046 17.9216 15.2049 17.8714 15.5009H17.8661Z"
        fill="#4CD0DC"
      />
    </svg>
  )
}

/** Sama og `public/Icon=Fráveita.svg` / `src/assets/icons/fraveita.svg` */
function IconFraveitaCard() {
  return (
    <svg
      className="nytenging-umsokn__form-card-head-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4.59456 7.20975H19.4033C19.6439 7.20974 19.8389 7.01474 19.8389 6.77419V1.98312C19.8389 1.02092 19.0589 0.240906 18.0967 0.240906H5.90122C4.93902 0.240906 4.159 1.02092 4.159 1.98312V6.77419C4.159 7.01474 4.35401 7.20974 4.59456 7.20975ZM7.64343 2.85422H9.35623C9.82324 2.84732 10.2163 3.20233 10.2567 3.66762C10.2902 4.17107 9.8902 4.59754 9.38563 4.59643H7.67283C7.20582 4.60333 6.8128 4.24832 6.77232 3.78303C6.73889 3.27958 7.13886 2.85311 7.64343 2.85422ZM22.4522 9.82959C22.4558 9.34594 22.0648 8.95193 21.5811 8.95196H2.4168C1.93313 8.95193 1.54207 9.34594 1.54569 9.82959C1.55128 13.7243 3.71938 17.2936 7.17303 19.0938L6.79519 21.7365C6.73816 22.1091 6.80028 22.4902 6.97268 22.8254C7.27273 23.3996 7.86664 23.7599 8.51454 23.7607H15.4463C15.8247 23.7659 16.1951 23.6516 16.5047 23.4341C17.029 23.0548 17.2998 22.4162 17.2082 21.7757L16.8249 19.0971C20.2796 17.2963 22.4478 13.7254 22.4522 9.82959ZM8.51454 22.0185L8.83358 19.7863C10.8933 20.4396 13.1046 20.4396 15.1643 19.7863L15.4834 22.0185H8.51454Z"
        fill="#0E8CA6"
      />
    </svg>
  )
}

function ServiceTags() {
  return (
    <div className="nytenging-umsokn__tags">
      <span className="nytenging-umsokn__tag" role="img" aria-label="Rafmagn">
        <span className="nytenging-umsokn__tag-icon" aria-hidden>
          <img src={SERVICE_TAG_ICON_SRC.rafmagn} alt="" width={24} height={24} decoding="async" />
        </span>
      </span>
      <span className="nytenging-umsokn__tag" role="img" aria-label="Heitt vatn">
        <span className="nytenging-umsokn__tag-icon" aria-hidden>
          <img src={SERVICE_TAG_ICON_SRC.heittVatn} alt="" width={24} height={24} decoding="async" />
        </span>
      </span>
      <span
        className="nytenging-umsokn__tag nytenging-umsokn__tag--muted"
        role="img"
        aria-label="Kalt vatn"
      >
        <span className="nytenging-umsokn__tag-icon" aria-hidden>
          <img src={SERVICE_TAG_ICON_SRC.kaltVatn} alt="" width={24} height={24} decoding="async" />
        </span>
      </span>
      <span className="nytenging-umsokn__tag" role="img" aria-label="Fráveita">
        <span className="nytenging-umsokn__tag-icon" aria-hidden>
          <img src={SERVICE_TAG_ICON_SRC.fraveita} alt="" width={24} height={24} decoding="async" />
        </span>
      </span>
    </div>
  )
}

function VerticalStepper({ currentIndex }) {
  return (
    <ol className="nytenging-umsokn__stepper" aria-label="Skref umsóknar">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex
        const isCurrent = i === currentIndex
        const isLast = i === STEPS.length - 1
        return (
          <li key={step.key} className="nytenging-umsokn__step-block">
            <div className="nytenging-umsokn__step">
              <div
                className={
                  isDone
                    ? 'nytenging-umsokn__step-icon nytenging-umsokn__step-icon--done'
                    : isCurrent
                      ? 'nytenging-umsokn__step-icon nytenging-umsokn__step-icon--current'
                      : 'nytenging-umsokn__step-icon nytenging-umsokn__step-icon--todo'
                }
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? <IconCheck /> : <span aria-hidden>{i + 1}</span>}
              </div>
              <span
                className={
                  isDone || isCurrent
                    ? 'nytenging-umsokn__step-label'
                    : 'nytenging-umsokn__step-label nytenging-umsokn__step-label--muted'
                }
              >
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <div
                className={
                  isDone
                    ? 'nytenging-umsokn__step-line nytenging-umsokn__step-line--active'
                    : 'nytenging-umsokn__step-line'
                }
                aria-hidden
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function SelectLikeField({ id, label, placeholder }) {
  return (
    <div className="nytenging-umsokn__field">
      <label className="nytenging-umsokn__field-label" htmlFor={id}>
        {label}
      </label>
      <button
        type="button"
        id={id}
        className="nytenging-umsokn__select-like"
        aria-haspopup="listbox"
      >
        <span className="nytenging-umsokn__select-like__value nytenging-umsokn__select-like__value--placeholder">
          {placeholder}
        </span>
        <IconCaretDown size={24} />
      </button>
    </div>
  )
}

function InputLikeField({ id, placeholder, 'aria-label': ariaLabel }) {
  return (
    <input
      id={id}
      type="text"
      className="nytenging-umsokn__input-like"
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
    />
  )
}

function ToggleRow({ id, label, checked, onChange }) {
  return (
    <div className="nytenging-umsokn__toggle-row">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        className={
          checked
            ? 'nytenging-umsokn__switch nytenging-umsokn__switch--on'
            : 'nytenging-umsokn__switch'
        }
        onClick={() => onChange(!checked)}
      >
        <span className="nytenging-umsokn__switch-thumb" />
      </button>
      <span className="nytenging-umsokn__toggle-label">{label}</span>
    </div>
  )
}

function UpplisingarStepContent({ type, addressLine, onBack, onContinue }) {
  const [vinnuskur, setVinnuskur] = useState(false)
  const [snojbredi, setSnojbredi] = useState(false)
  const [vatnsudun, setVatnsudun] = useState(false)

  return (
    <div className="nytenging-umsokn__uply">
      <header className="nytenging-umsokn__uply-lead">
        <h2 className="nytenging-umsokn__uply-title">{addressLine}</h2>
        <p className="nytenging-umsokn__uply-sub">{FORM_LEAD_TITLE[type]}</p>
      </header>

      <div className="nytenging-umsokn__uply-stack">
        <section className="nytenging-umsokn__form-card" aria-labelledby="card-vinnuskur">
          <div className="nytenging-umsokn__form-card-head nytenging-umsokn__form-card-head--solo" id="card-vinnuskur">
            Vinnuskúr
          </div>
          <div className="nytenging-umsokn__form-card-body">
            <div className="nytenging-umsokn__form-panel">
              <ToggleRow
                id="switch-vinnuskur"
                label="Er vinnuskúr á svæðinu?"
                checked={vinnuskur}
                onChange={setVinnuskur}
              />
              <div className="nytenging-umsokn__info-row">
                <IconInfo />
                <p className="nytenging-umsokn__info-text">
                  Bráðabirgða tengingar verða aftengdar við varanlegar tengingar
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="nytenging-umsokn__form-card" aria-labelledby="card-rafmagn">
          <div className="nytenging-umsokn__form-card-head" id="card-rafmagn">
            <span className="nytenging-umsokn__form-card-head-icon" aria-hidden>
              <IconRafmagnCard />
            </span>
            <span className="nytenging-umsokn__form-card-head-title">Rafmagn</span>
          </div>
          <div className="nytenging-umsokn__form-card-body">
            <div className="nytenging-umsokn__form-panel">
              <SelectLikeField id="raf-staerd" label="Stærð tengingar" placeholder="(amper)" />
            </div>
          </div>
        </section>

        <section className="nytenging-umsokn__form-card" aria-labelledby="card-heitt">
          <div className="nytenging-umsokn__form-card-head" id="card-heitt">
            <span className="nytenging-umsokn__form-card-head-icon" aria-hidden>
              <IconHeittVatnCard />
            </span>
            <span className="nytenging-umsokn__form-card-head-title">Heitt vatn</span>
          </div>
          <div className="nytenging-umsokn__form-card-body nytenging-umsokn__form-card-body--stack">
            <div className="nytenging-umsokn__form-panel">
              <div className="nytenging-umsokn__field-row">
                <SelectLikeField id="hv-brutto" label="Brúttórúmmál húsnæðis" placeholder="(m³)" />
                <SelectLikeField id="hv-staerd" label="Stærð tengingar" placeholder="(amper)" />
              </div>
            </div>
            <div className="nytenging-umsokn__form-panel">
              <ToggleRow
                id="switch-snoj"
                label="Verður snjóbræðsla?"
                checked={snojbredi}
                onChange={setSnojbredi}
              />
              {snojbredi ? (
                <div className="nytenging-umsokn__field-row nytenging-umsokn__field-row--tight">
                  <SelectLikeField id="hv-snoj" label="Stærð snjóbræðslu" placeholder="(m³)" />
                  <SelectLikeField id="hv-vatns" label="Áætluð vatnsþörf" placeholder="(amper)" />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="nytenging-umsokn__form-card" aria-labelledby="card-kalt">
          <div className="nytenging-umsokn__form-card-head" id="card-kalt">
            <span className="nytenging-umsokn__form-card-head-icon" aria-hidden>
              <IconKaltVatnCard />
            </span>
            <span className="nytenging-umsokn__form-card-head-title">Kalt vatn</span>
          </div>
          <div className="nytenging-umsokn__form-card-body nytenging-umsokn__form-card-body--stack">
            <div className="nytenging-umsokn__form-panel">
              <SelectLikeField id="kv-staerd" label="Stærð tengingar" placeholder="(amper)" />
            </div>
            <div className="nytenging-umsokn__form-panel nytenging-umsokn__form-panel--toggle-only">
              <ToggleRow
                id="switch-vatnsudun"
                label="Verður vatnsúðunarkerfi?"
                checked={vatnsudun}
                onChange={setVatnsudun}
              />
            </div>
            {vatnsudun ? (
              <div
                className="nytenging-umsokn__kv-extra-row"
                aria-label="Upplýsingar um vatnsúðunarkerfi"
              >
                <div className="nytenging-umsokn__form-panel">
                  <SelectLikeField
                    id="kv-vatnsudun-staerd"
                    label="Stærð vatnsúðunarkerfis"
                    placeholder="(mm)"
                  />
                </div>
                <div className="nytenging-umsokn__form-panel">
                  <SelectLikeField id="kv-aetlun-vatns" label="Áætluð vatnsþörf" placeholder="(l/mín)" />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="nytenging-umsokn__form-card" aria-labelledby="card-fraveita">
          <div className="nytenging-umsokn__form-card-head" id="card-fraveita">
            <span className="nytenging-umsokn__form-card-head-icon" aria-hidden>
              <IconFraveitaCard />
            </span>
            <span className="nytenging-umsokn__form-card-head-title">Fráveita</span>
          </div>
          <div className="nytenging-umsokn__form-card-body">
            <div className="nytenging-umsokn__form-panel nytenging-umsokn__frv-panel">
              <div className="nytenging-umsokn__frv-list-card">
                <p className="nytenging-umsokn__frv-spec">
                  <span className="nytenging-umsokn__frv-spec-label">Stærð tengingar:</span>{' '}
                  <span className="nytenging-umsokn__frv-spec-value">150mm</span>
                </p>
              </div>
              <div className="nytenging-umsokn__info-row">
                <IconInfo />
                <p className="nytenging-umsokn__info-text">Veitur tengja í stút við lóðarmörk</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="nytenging-umsokn__uply-actions">
        <button
          type="button"
          className="nytenging-umsokn__modal-btn nytenging-umsokn__modal-btn--secondary nytenging-umsokn__uply-back"
          onClick={onBack}
        >
          <IconArrowLeft />
          Til baka
        </button>
        <button type="button" className="nytenging-umsokn__footer-cta" onClick={onContinue}>
          Halda áfram
          <IconArrowRight />
        </button>
      </div>
    </div>
  )
}

const GREID_ORKU_COPY =
  'Greiðandi orkumælis er sá sem greiðir fyrir dreifingu og notkun orku, getur verið eigandi eða leigjandi, eftir því sem samið er um.'

const GREID_METER_ROWS = [
  { id: 'm1', label: 'Íbúð 101' },
  { id: 'm2', label: 'Íbúð 101' },
  { id: 'm3', label: 'Íbúð 101' },
  { id: 'm4', label: 'Íbúð 101' },
]

const GREID_UPPL_INFO_TEXT =
  'Umsóknir sem ekki tengjast íbúðarhúsnæði skulu hafa vatnsmæli. Ef húsnæði er bæði íbúðar- og atvinnuhúsnæði, skal setja vatnsmæli fyrir þann hluta sem er nýttur sem atvinnuhúsnæði.'

function GreidandiUpplModal({ onClose, meterRowId, onConfirm, initialPayer }) {
  const titleId = useId()
  const closeBtnRef = useRef(null)
  const [einnGreidandi, setEinnGreidandi] = useState(true)
  const [kennitala, setKennitala] = useState(initialPayer?.kennitala ?? '')
  const [nafn, setNafn] = useState(initialPayer?.nafn ?? '')
  const [simanumer, setSimanumer] = useState(initialPayer?.simi ?? '')

  const idKt = `${meterRowId}-uppl-kt`
  const idNafn = `${meterRowId}-uppl-nafn`
  const idSimi = `${meterRowId}-uppl-simi`

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const handleConfirm = () => {
    onConfirm({
      meterRowId,
      einnGreidandi,
      kennitala: kennitala.trim(),
      nafn: nafn.trim(),
      simanumer: simanumer.trim(),
    })
    onClose()
  }

  return createPortal(
    <div
      className="nytenging-umsokn__greid-uppl-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="nytenging-umsokn__greid-uppl-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="nytenging-umsokn__greid-uppl-head">
          <div className="nytenging-umsokn__greid-uppl-head-inner">
            <h2 id={titleId} className="nytenging-umsokn__greid-uppl-title">
              Greiðendaupplýsingar
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              className="nytenging-umsokn__greid-uppl-close"
              onClick={onClose}
              aria-label="Loka glugga"
            >
              <IconCloseModal />
            </button>
          </div>
        </div>

        <div className="nytenging-umsokn__greid-uppl-body">
          <div className="nytenging-umsokn__greid-uppl-stack">
            <div className="nytenging-umsokn__greid-uppl-tint">
              <div className="nytenging-umsokn__greid-uppl-toggle-card">
                <button
                  type="button"
                  role="switch"
                  aria-checked={einnGreidandi}
                  className={
                    einnGreidandi
                      ? 'nytenging-umsokn__switch nytenging-umsokn__switch--on nytenging-umsokn__switch--narrow'
                      : 'nytenging-umsokn__switch nytenging-umsokn__switch--narrow'
                  }
                  onClick={() => setEinnGreidandi((v) => !v)}
                >
                  <span className="nytenging-umsokn__switch-thumb nytenging-umsokn__switch-thumb--narrow" />
                </button>
                <div className="nytenging-umsokn__greid-uppl-toggle-copy">
                  <p className="nytenging-umsokn__greid-uppl-toggle-title">Einn greiðandi</p>
                  <p className="nytenging-umsokn__greid-uppl-toggle-desc">
                    Með því að virkja &quot;Einn greiðandi&quot; afritast greiðendaupplýsingar á allar íbúðir
                  </p>
                </div>
              </div>
            </div>

            <div className="nytenging-umsokn__greid-uppl-form-block">
              <h3 className="nytenging-umsokn__greid-uppl-form-heading">
                Upplýsingar um greiðanda orkumælis.
              </h3>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor={idKt}>
                  Kennitala
                </label>
                <input
                  id={idKt}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  className="nytenging-umsokn__input-like"
                  value={kennitala}
                  onChange={(e) => setKennitala(e.target.value)}
                />
              </div>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor={idNafn}>
                  Nafn
                </label>
                <input
                  id={idNafn}
                  type="text"
                  autoComplete="name"
                  className="nytenging-umsokn__input-like"
                  value={nafn}
                  onChange={(e) => setNafn(e.target.value)}
                />
              </div>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor={idSimi}>
                  Símanúmer
                </label>
                <input
                  id={idSimi}
                  type="tel"
                  autoComplete="tel"
                  className="nytenging-umsokn__input-like"
                  value={simanumer}
                  onChange={(e) => setSimanumer(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="nytenging-umsokn__greid-uppl-info">
            <span className="nytenging-umsokn__greid-uppl-info-icon" aria-hidden>
              <IconInfo />
            </span>
            <p className="nytenging-umsokn__greid-uppl-info-text">{GREID_UPPL_INFO_TEXT}</p>
          </div>
        </div>

        <div className="nytenging-umsokn__greid-uppl-foot">
          <button
            type="button"
            className="nytenging-umsokn__greid-uppl-confirm"
            onClick={handleConfirm}
          >
            <IconCheck />
            Staðfesta upplýsingar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

const TENGILIDUR_INFO =
  'Sá sem getur svarað fyrir hönnun, verkstað og framkvæmd, til dæmis varðandi staðsetningu búnaðar og inntaksrými'

const TENGILIDUR_APPLICANT = {
  kennitala: '1412913899',
  nafn: DEMO_LOGGED_IN_NAME,
  netfang: 'Jontatan@jonatan.is',
  simi: '7803432',
}

/* Fylgiskjöl — Figma 4110:95462 */
const FYLGISKJOL_SECTIONS = [
  {
    key: 'rafmagn',
    tag: 'Rafmagn',
    tagVariant: 'rafmagn',
    items: [
      {
        title: 'Einlínumynd',
        description:
          'Rafmagnsteikning sem sýnir uppröðun á töflubúnaði. Yfirlit um hvernig rafmagn dreifist frá inntaki til tækja, taflna og undirkerfa',
        dropRoundedLg: true,
      },
      {
        title: 'Raflagnateikning sem sýnir inntaksstað',
        description:
          'Teikning sem sýnir inntaksstað rafmagns frá dreifikerfi að inntakstækjum innan hússnæðis, eins og rafmagnstöflu.',
      },
      {
        title: 'Afláætlun',
        description:
          'Rafmagnshönnun sem felur í sér greiningu og útreikning á heildaraflþörf húsnæðis og hvernig álag dreifist milli rafrása, tækja og kerfa. Hún er nauðsynleg til að tryggja að rafkerfið sé rétt hannað fyrir raunverulega notkun, og til að forðast yfirálag og spennufall.',
      },
      {
        title: 'Einföld útlitsmynd af aðaltöflu',
        description:
          'Myndræn teikning sem sýnir uppsetningu, búnað og rásaskiptingu í aðaltöflu húsnæðis. Þetta er einföld yfirlitsmynd sem sýnir hvernig rofar, öryggi, mælibúnaður og dreifing eru staðsett og raðað innan töflunar.',
      },
      {
        title: 'Orkuáætlun',
        description: 'Excel skjal frá Veitum sem þarf að fylla út.',
      },
    ],
  },
  {
    key: 'kalt-vatn',
    tag: 'Kalt vatn',
    tagVariant: 'kalt',
    items: [
      {
        title: 'Hönnunarforsendur vatnsúðunarkerfis',
        description:
          'Lýsir því hvernig kerfið á að vera hannað til að tryggja að það virki örugglega og vel ef eldur kviknar.',
      },
    ],
  },
  {
    key: 'fraveita',
    tag: 'Fráveita',
    tagVariant: 'fraveita',
    items: [
      {
        title: 'Hönnun á fráveitukerfi',
        description: 'Skjal sem sýnir lagnakerfi fráveitu.',
      },
    ],
  },
  {
    key: 'onnur',
    tag: 'Önnur gögn',
    tagVariant: 'onnur',
    items: [
      {
        title: 'Grunnmynd',
        description: 'Teikning sem sýnir lágrétta sniðmynd af húsnæði.',
      },
      {
        title: 'Afstöðumynd',
        description:
          'Teikning sem sýnir húsnæði í samhengi við lóð sem hún stendur á. Hún sýnir afstöðu hússins við landið og nágrennið.',
      },
      {
        title: 'Sniðmynd',
        description:
          'Teikning sem sýnir skurð í gegnum byggingu til að sýna hvað er inn í henni frá hlið.',
      },
      {
        title: 'Skráningatafla mannvirkis',
        description:
          'Formleg tafla sem fylgir byggingarteikningum og geymir lykilupplýsingar um húsnæðið.',
      },
      {
        title: 'Annað viðhengi',
        description:
          'Ef þú hefur fleiri viðhengi sem þú telur hjálpa Veitum við aðgerðina á umsókninni.',
      },
    ],
  },
]

const FYLGISKJOL_DEMO_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

function FylgiskjolDemoModal({ open, onClose, titleId, descriptionId }) {
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="nytenging-umsokn__modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="nytenging-umsokn__fylg-demo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="nytenging-umsokn__fylg-demo-head">
          <h2 id={titleId} className="nytenging-umsokn__fylg-demo-title">
            Áætlað verð
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="nytenging-umsokn__fylg-demo-close"
            onClick={onClose}
            aria-label="Loka glugga"
          >
            <IconCloseModal />
          </button>
        </div>

        <div className="nytenging-umsokn__fylg-demo-body">
          <div className="nytenging-umsokn__fylg-demo-section">
            <div className="nytenging-umsokn__fylg-demo-section-head">
              <span className="nytenging-umsokn__fylg-demo-section-icon" aria-hidden>
                <IconRafmagnCard />
              </span>
              <span className="nytenging-umsokn__fylg-demo-section-title">Rafmagn</span>
            </div>
            <div className="nytenging-umsokn__fylg-demo-tint">
              <div className="nytenging-umsokn__fylg-demo-price-row nytenging-umsokn__fylg-demo-price-row--detail">
                <div className="nytenging-umsokn__fylg-demo-price-col">
                  <p className="nytenging-umsokn__fylg-demo-line-title">400A-3 fasa bráðabirgða</p>
                  <p className="nytenging-umsokn__fylg-demo-line-sub">
                    Grunnverð: 253.982 kr. + VSK: 15.039 kr.
                  </p>
                </div>
                <p className="nytenging-umsokn__fylg-demo-line-price">16.000.000 kr</p>
              </div>
              <div className="nytenging-umsokn__fylg-demo-price-row nytenging-umsokn__fylg-demo-price-row--detail">
                <div className="nytenging-umsokn__fylg-demo-price-col">
                  <p className="nytenging-umsokn__fylg-demo-line-title">400A-3 fasa bráðabirgða</p>
                  <p className="nytenging-umsokn__fylg-demo-line-sub">
                    Grunnverð: 253.982 kr. + VSK: 15.039 kr.
                  </p>
                </div>
                <p className="nytenging-umsokn__fylg-demo-line-price">16.000.000 kr</p>
              </div>
            </div>
          </div>

          <div className="nytenging-umsokn__fylg-demo-section">
            <div className="nytenging-umsokn__fylg-demo-section-head">
              <span className="nytenging-umsokn__fylg-demo-section-icon" aria-hidden>
                <IconHeittVatnCard />
              </span>
              <span className="nytenging-umsokn__fylg-demo-section-title">Heitt vatn</span>
            </div>
            <div className="nytenging-umsokn__fylg-demo-tint">
              <div className="nytenging-umsokn__fylg-demo-price-row nytenging-umsokn__fylg-demo-price-row--simple">
                <p className="nytenging-umsokn__fylg-demo-line-title">400A-3 fasa bráðabirgða</p>
                <p className="nytenging-umsokn__fylg-demo-line-price">16.000.000 kr</p>
              </div>
              <p className="nytenging-umsokn__fylg-demo-lorem">{FYLGISKJOL_DEMO_LOREM}</p>
            </div>
          </div>

          <div className="nytenging-umsokn__fylg-demo-section">
            <div className="nytenging-umsokn__fylg-demo-section-head">
              <span className="nytenging-umsokn__fylg-demo-section-icon" aria-hidden>
                <IconKaltVatnCard />
              </span>
              <span className="nytenging-umsokn__fylg-demo-section-title">Kalt vatn</span>
            </div>
            <div className="nytenging-umsokn__fylg-demo-tint">
              <div className="nytenging-umsokn__fylg-demo-price-row nytenging-umsokn__fylg-demo-price-row--simple">
                <p className="nytenging-umsokn__fylg-demo-line-title">400A-3 fasa bráðabirgða</p>
                <p className="nytenging-umsokn__fylg-demo-line-price">16.000.000 kr</p>
              </div>
              <p className="nytenging-umsokn__fylg-demo-lorem">{FYLGISKJOL_DEMO_LOREM}</p>
            </div>
          </div>
        </div>

        <div className="nytenging-umsokn__fylg-demo-foot">
          <div className="nytenging-umsokn__fylg-demo-total">
            <span className="nytenging-umsokn__fylg-demo-total-label">Heildarverð m. VSK</span>
            <span className="nytenging-umsokn__fylg-demo-total-value">30.000.000 kr</span>
          </div>
          <div id={descriptionId} className="nytenging-umsokn__fylg-demo-note">
            <span className="nytenging-umsokn__fylg-demo-note-icon" aria-hidden>
              <IconInfo />
            </span>
            <p className="nytenging-umsokn__fylg-demo-note-text">
              Áætlað verð er samkvæmt gildandi verðskrá hverju sinni og getur tekið breytingum. Nánari
              skýringar á verðum má{' '}
              <a href="#verdskra" className="nytenging-umsokn__fylg-demo-note-link" onClick={(e) => e.preventDefault()}>
                finna hér.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function FylgiskjolDropZone({ inputId, roundedLg }) {
  const [dragOver, setDragOver] = useState(false)
  const dropClass = [
    'nytenging-umsokn__fylg-drop',
    roundedLg ? 'nytenging-umsokn__fylg-drop--lg' : '',
    dragOver ? 'nytenging-umsokn__fylg-drop--over' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={dropClass}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)
      }}
    >
      <input id={inputId} type="file" className="nytenging-umsokn__sr-only" />
      <div className="nytenging-umsokn__fylg-drop-inner">
        <div className="nytenging-umsokn__fylg-drop-icon-wrap">
          <IconFileArrowUp />
        </div>
        <p className="nytenging-umsokn__fylg-drop-text">
          Dragðu inn skjal eða{' '}
          <label htmlFor={inputId} className="nytenging-umsokn__fylg-drop-browse">
            veldu hér
          </label>
        </p>
      </div>
    </div>
  )
}

function FylgiskjolItemRow({ title, description, dropRoundedLg }) {
  const inputId = useId().replace(/:/g, '')

  return (
    <div className="nytenging-umsokn__fylg-item">
      <div className="nytenging-umsokn__fylg-item-top">
        <h4 className="nytenging-umsokn__fylg-item-title">{title}</h4>
      </div>
      <p className="nytenging-umsokn__fylg-item-desc">{description}</p>
      <FylgiskjolDropZone inputId={inputId} roundedLg={dropRoundedLg} />
    </div>
  )
}

function FylgiskjolStepContent({ type, addressLine, onBack, onContinue }) {
  return (
    <div className="nytenging-umsokn__uply nytenging-umsokn__uply--greidendur">
      <header className="nytenging-umsokn__uply-lead">
        <h2 className="nytenging-umsokn__uply-title">{addressLine}</h2>
        <p className="nytenging-umsokn__uply-sub">{FORM_LEAD_TITLE[type]}</p>
      </header>

      <div className="nytenging-umsokn__uply-stack">
        {FYLGISKJOL_SECTIONS.map((section) => (
          <section
            key={section.key}
            className="nytenging-umsokn__fylg-section"
            aria-labelledby={`fylg-sec-${section.key}`}
          >
            <div className="nytenging-umsokn__fylg-section-inner">
              <div className="nytenging-umsokn__fylg-section-content">
                <div className="nytenging-umsokn__fylg-section-head" id={`fylg-sec-${section.key}`}>
                  <span className="nytenging-umsokn__fylg-vidhengi">Viðhengi</span>
                  <span
                    className={`nytenging-umsokn__fylg-cat nytenging-umsokn__fylg-cat--${section.tagVariant}`}
                  >
                    {section.tag}
                  </span>
                </div>
                <div className="nytenging-umsokn__fylg-items">
                  {section.items.map((item) => (
                    <div key={item.title} className="nytenging-umsokn__fylg-item-card">
                      <FylgiskjolItemRow
                        title={item.title}
                        description={item.description}
                        dropRoundedLg={item.dropRoundedLg}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="nytenging-umsokn__uply-actions">
        <button
          type="button"
          className="nytenging-umsokn__modal-btn nytenging-umsokn__modal-btn--secondary nytenging-umsokn__uply-back"
          onClick={onBack}
        >
          <IconArrowLeft />
          Til baka
        </button>
        <button type="button" className="nytenging-umsokn__footer-cta" onClick={onContinue}>
          Halda áfram
          <IconArrowRight />
        </button>
      </div>
    </div>
  )
}

function UmsoknMottekinModal({ open, onClose, titleId, descriptionId }) {
  const navigate = useNavigate()
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="nytenging-umsokn__modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="nytenging-umsokn__mottekin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="nytenging-umsokn__mottekin-close"
          onClick={onClose}
          aria-label="Loka glugga"
        >
          <IconCloseModal />
        </button>
        <div className="nytenging-umsokn__mottekin-inner">
          <div className="nytenging-umsokn__mottekin-left">
            <div className="nytenging-umsokn__mottekin-text">
              <h2 id={titleId} className="nytenging-umsokn__mottekin-title">
                Umsókn móttekin!
              </h2>
              <p id={descriptionId} className="nytenging-umsokn__mottekin-sub">
                Hvað gerist næst?
              </p>
            </div>
            <button
              type="button"
              className="nytenging-umsokn__mottekin-cta"
              onClick={() => {
                onClose()
                navigate('/')
              }}
            >
              Mínar umsóknir
            </button>
          </div>
          <ol className="nytenging-umsokn__mottekin-stepper" aria-label="Næstu skref">
            <li className="nytenging-umsokn__mottekin-step-block">
              <div className="nytenging-umsokn__mottekin-step">
                <div className="nytenging-umsokn__mottekin-step-icon nytenging-umsokn__mottekin-step-icon--done">
                  <IconCheck />
                </div>
                <span className="nytenging-umsokn__mottekin-step-label">Umsókn móttekin</span>
              </div>
              <div
                className="nytenging-umsokn__mottekin-step-line nytenging-umsokn__mottekin-step-line--active"
                aria-hidden
              />
            </li>
            <li className="nytenging-umsokn__mottekin-step-block">
              <div className="nytenging-umsokn__mottekin-step">
                <div className="nytenging-umsokn__mottekin-step-icon nytenging-umsokn__mottekin-step-icon--current">
                  <span aria-hidden>2</span>
                </div>
                <span className="nytenging-umsokn__mottekin-step-label">Bíður samþykktar</span>
              </div>
              <div className="nytenging-umsokn__mottekin-step-line" aria-hidden />
            </li>
            <li className="nytenging-umsokn__mottekin-step-block">
              <div className="nytenging-umsokn__mottekin-step">
                <div className="nytenging-umsokn__mottekin-step-icon nytenging-umsokn__mottekin-step-icon--muted">
                  <span aria-hidden>3</span>
                </div>
                <span className="nytenging-umsokn__mottekin-step-label nytenging-umsokn__mottekin-step-label--muted">
                  Starfsfólk Veitna fer yfir umsókn
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function YfirlitStepContent({ type, addressLine, onBack, onSubmit }) {
  const [termsOk, setTermsOk] = useState(false)
  const [annad, setAnnad] = useState('')
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [verdSkyringarOpen, setVerdSkyringarOpen] = useState(false)
  const successTitleId = useId()
  const successDescId = useId()
  const verdSkyringarTitleId = useId()
  const verdSkyringarDescId = useId()

  return (
    <div className="nytenging-umsokn__uply nytenging-umsokn__uply--greidendur">
      <header className="nytenging-umsokn__uply-lead">
        <h2 className="nytenging-umsokn__uply-title">{addressLine}</h2>
        <p className="nytenging-umsokn__uply-sub">{FORM_LEAD_TITLE[type]}</p>
      </header>

      <div className="nytenging-umsokn__uply-stack">
        <YfirlitPriceCard onSjaskyringarClick={() => setVerdSkyringarOpen(true)} />

        <section className="nytenging-umsokn__yfirlit-card" aria-labelledby="yfirlit-annad-title">
          <div className="nytenging-umsokn__yfirlit-card-head">
            <h3 id="yfirlit-annad-title" className="nytenging-umsokn__yfirlit-card-title">
              Annað
            </h3>
          </div>
          <div className="nytenging-umsokn__yfirlit-card-body">
            <label className="nytenging-umsokn__sr-only" htmlFor="yfirlit-annad">
              Annað
            </label>
            <div className="nytenging-umsokn__yfirlit-ta-wrap">
              <textarea
                id="yfirlit-annad"
                className="nytenging-umsokn__yfirlit-ta"
                placeholder="Annað sem þú vilt koma á framfæri."
                maxLength={500}
                value={annad}
                onChange={(e) => setAnnad(e.target.value)}
                rows={5}
              />
              <p className="nytenging-umsokn__yfirlit-ta-count" aria-live="polite">
                {annad.length}/500 stafir
              </p>
            </div>
          </div>
        </section>

        <section className="nytenging-umsokn__yfirlit-card" aria-labelledby="yfirlit-skilmalar-title">
          <div className="nytenging-umsokn__yfirlit-card-head nytenging-umsokn__yfirlit-card-head--split">
            <h3 id="yfirlit-skilmalar-title" className="nytenging-umsokn__yfirlit-card-title">
              Skilmálar
            </h3>
            <a
              href="#skilmalar"
              className="nytenging-umsokn__yfirlit-text-link"
              onClick={(e) => e.preventDefault()}
            >
              Lesa skilmála
            </a>
          </div>
          <div className="nytenging-umsokn__yfirlit-card-body">
            <div className="nytenging-umsokn__yfirlit-skilmalar-box">
              <label className="nytenging-umsokn__yfirlit-check">
                <input
                  type="checkbox"
                  className="nytenging-umsokn__yfirlit-check-input"
                  checked={termsOk}
                  onChange={(e) => setTermsOk(e.target.checked)}
                />
                <span className="nytenging-umsokn__yfirlit-check-text">
                  Ég hef kynnt mér og samþykki{' '}
                  <a
                    href="#skilmalar-veitur"
                    className="nytenging-umsokn__yfirlit-check-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    skilmála Veitna
                  </a>
                </span>
              </label>
            </div>
          </div>
        </section>
      </div>

      <div className="nytenging-umsokn__uply-actions">
        <button
          type="button"
          className="nytenging-umsokn__modal-btn nytenging-umsokn__modal-btn--secondary nytenging-umsokn__uply-back"
          onClick={onBack}
        >
          <IconArrowLeft />
          Til baka
        </button>
        <button
          type="button"
          className="nytenging-umsokn__footer-cta"
          disabled={!termsOk}
          onClick={() => {
            if (!termsOk) return
            onSubmit?.()
            setSuccessModalOpen(true)
          }}
        >
          Senda umsókn
          <IconArrowRight />
        </button>
      </div>

      <FylgiskjolDemoModal
        open={verdSkyringarOpen}
        onClose={() => setVerdSkyringarOpen(false)}
        titleId={verdSkyringarTitleId}
        descriptionId={verdSkyringarDescId}
      />

      <UmsoknMottekinModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        titleId={successTitleId}
        descriptionId={successDescId}
      />
    </div>
  )
}

function TengilidirFagilarStepContent({ type, addressLine, onBack, onContinue }) {
  const [tengilidirSami, setTengilidirSami] = useState(false)
  const [tengilidirKt, setTengilidirKt] = useState('')
  const [tengilidirNafn, setTengilidirNafn] = useState('')
  const [tengilidirNetfang, setTengilidirNetfang] = useState('')
  const [tengilidirSimi, setTengilidirSimi] = useState('')
  const [fagRafLeit, setFagRafLeit] = useState('')
  const [fagPipaLeit, setFagPipaLeit] = useState('')

  const toggleTengilidirSami = () => {
    const next = !tengilidirSami
    setTengilidirSami(next)
    if (next) {
      setTengilidirKt(TENGILIDUR_APPLICANT.kennitala)
      setTengilidirNafn(TENGILIDUR_APPLICANT.nafn)
      setTengilidirNetfang(TENGILIDUR_APPLICANT.netfang)
      setTengilidirSimi(TENGILIDUR_APPLICANT.simi)
    } else {
      setTengilidirKt('')
      setTengilidirNafn('')
      setTengilidirNetfang('')
      setTengilidirSimi('')
    }
  }

  return (
    <div className="nytenging-umsokn__uply nytenging-umsokn__uply--greidendur">
      <header className="nytenging-umsokn__uply-lead">
        <h2 className="nytenging-umsokn__uply-title">{addressLine}</h2>
        <p className="nytenging-umsokn__uply-sub">{FORM_LEAD_TITLE[type]}</p>
      </header>

      <div className="nytenging-umsokn__uply-stack">
        <section className="nytenging-umsokn__form-card" aria-labelledby="card-tengilidir">
          <div className="nytenging-umsokn__form-card-head nytenging-umsokn__form-card-head--solo" id="card-tengilidir">
            Tengiliður
          </div>
          <div className="nytenging-umsokn__form-card-body nytenging-umsokn__form-card-body--stack">
            <div className="nytenging-umsokn__form-panel">
              <div className="nytenging-umsokn__greid-tenging-row">
                <button
                  type="button"
                  id="switch-tengilidir-sami"
                  role="switch"
                  aria-checked={tengilidirSami}
                  className={
                    tengilidirSami
                      ? 'nytenging-umsokn__switch nytenging-umsokn__switch--on'
                      : 'nytenging-umsokn__switch'
                  }
                  onClick={toggleTengilidirSami}
                >
                  <span className="nytenging-umsokn__switch-thumb" />
                </button>
                <p className="nytenging-umsokn__greid-tenging-q">
                  <span className="nytenging-umsokn__greid-tenging-q-strong">
                    Tengiliður er sami og umsækjandi
                  </span>
                </p>
              </div>
              <div className="nytenging-umsokn__field nytenging-umsokn__field--input-only">
                <input
                  id="tengilidir-kt"
                  type="text"
                  inputMode="numeric"
                  className="nytenging-umsokn__input-like"
                  placeholder="Kennitala"
                  autoComplete="off"
                  aria-label="Kennitala"
                  value={tengilidirKt}
                  onChange={(e) => setTengilidirKt(e.target.value)}
                />
              </div>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor="tengilidir-nafn">
                  Nafn
                </label>
                <input
                  id="tengilidir-nafn"
                  type="text"
                  className="nytenging-umsokn__input-like"
                  placeholder="Nafn"
                  autoComplete="name"
                  value={tengilidirNafn}
                  onChange={(e) => setTengilidirNafn(e.target.value)}
                />
              </div>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor="tengilidir-netfang">
                  Netfang
                </label>
                <input
                  id="tengilidir-netfang"
                  type="email"
                  className="nytenging-umsokn__input-like"
                  placeholder="Netfang"
                  autoComplete="email"
                  value={tengilidirNetfang}
                  onChange={(e) => setTengilidirNetfang(e.target.value)}
                />
              </div>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor="tengilidir-simi">
                  Símanúmer
                </label>
                <input
                  id="tengilidir-simi"
                  type="tel"
                  className="nytenging-umsokn__input-like"
                  placeholder="Símanúmer"
                  autoComplete="tel"
                  value={tengilidirSimi}
                  onChange={(e) => setTengilidirSimi(e.target.value)}
                />
              </div>
              <div className="nytenging-umsokn__info-row">
                <IconInfo />
                <p className="nytenging-umsokn__info-text">{TENGILIDUR_INFO}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="nytenging-umsokn__form-card" aria-labelledby="card-rafverktaki">
          <div className="nytenging-umsokn__form-card-head nytenging-umsokn__form-card-head--solo" id="card-rafverktaki">
            Rafverktaki
          </div>
          <div className="nytenging-umsokn__form-card-body nytenging-umsokn__form-card-body--stack">
            <div className="nytenging-umsokn__form-panel">
              <p className="nytenging-umsokn__fag-panel-lead">Skráðu þann fagaðila sem á að vinna verkið.</p>
              <div className="nytenging-umsokn__fag-search">
                <input
                  id="fag-raf-leit"
                  type="text"
                  className="nytenging-umsokn__fag-search-input"
                  placeholder="Sláðu inn nafn, kennitölu eða netfang"
                  autoComplete="off"
                  value={fagRafLeit}
                  onChange={(e) => setFagRafLeit(e.target.value)}
                  aria-label="Leit að rafverktaka"
                />
                <span className="nytenging-umsokn__fag-search-icon" aria-hidden>
                  <IconSearch />
                </span>
              </div>
              <SelectLikeField id="fag-raf-simi" label="Símanúmer" placeholder="Símanúmer" />
            </div>
          </div>
        </section>

        <section className="nytenging-umsokn__form-card" aria-labelledby="card-pipari">
          <div className="nytenging-umsokn__form-card-head nytenging-umsokn__form-card-head--solo" id="card-pipari">
            Pípulagningameistari
          </div>
          <div className="nytenging-umsokn__form-card-body nytenging-umsokn__form-card-body--stack">
            <div className="nytenging-umsokn__form-panel">
              <p className="nytenging-umsokn__fag-panel-lead">Skráðu þann fagaðila sem á að vinna verkið.</p>
              <div className="nytenging-umsokn__fag-search">
                <input
                  id="fag-pipa-leit"
                  type="text"
                  className="nytenging-umsokn__fag-search-input"
                  placeholder="Sláðu inn nafn, kennitölu eða netfang"
                  autoComplete="off"
                  value={fagPipaLeit}
                  onChange={(e) => setFagPipaLeit(e.target.value)}
                  aria-label="Leit að pípulagningameistara"
                />
                <span className="nytenging-umsokn__fag-search-icon" aria-hidden>
                  <IconSearch />
                </span>
              </div>
              <div className="nytenging-umsokn__field">
                <label className="nytenging-umsokn__field-label" htmlFor="fag-pipa-simi">
                  Símanúmer
                </label>
                <input
                  id="fag-pipa-simi"
                  type="tel"
                  className="nytenging-umsokn__input-like"
                  placeholder="Símanúmer"
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="nytenging-umsokn__uply-actions">
        <button
          type="button"
          className="nytenging-umsokn__modal-btn nytenging-umsokn__modal-btn--secondary nytenging-umsokn__uply-back"
          onClick={onBack}
        >
          <IconArrowLeft />
          Til baka
        </button>
        <button type="button" className="nytenging-umsokn__footer-cta" onClick={onContinue}>
          Halda áfram
          <IconArrowRight />
        </button>
      </div>
    </div>
  )
}

function GreidendurStepContent({ type, addressLine, onBack, onContinue }) {
  const [greidandiTengingar, setGreidandiTengingar] = useState(true)
  const [greidUpplRowId, setGreidUpplRowId] = useState(null)
  const [meterPayers, setMeterPayers] = useState(() => {
    const base = Object.fromEntries(GREID_METER_ROWS.map((r) => [r.id, null]))
    const draft = readGreidendurOrkumaelaDraft(addressLine)
    if (!draft || typeof draft !== 'object') return base
    const next = { ...base }
    for (const r of GREID_METER_ROWS) {
      const v = draft[r.id]
      if (v && typeof v === 'object' && (v.nafn || v.kennitala || v.simi)) {
        next[r.id] = { kennitala: v.kennitala ?? '', nafn: v.nafn ?? '', simi: v.simi ?? '' }
      }
    }
    return next
  })

  const saveGreidandiFromModal = (payload) => {
    const { meterRowId: rowId, einnGreidandi: einn, kennitala, nafn, simanumer } = payload
    const entry = { kennitala, nafn, simi: simanumer }
    setMeterPayers((prev) => {
      const next = { ...prev }
      if (einn) {
        for (const r of GREID_METER_ROWS) {
          next[r.id] = entry
        }
      } else {
        next[rowId] = entry
      }
      saveGreidendurOrkumaelaDraft(addressLine, next)
      return next
    })
  }

  return (
    <div className="nytenging-umsokn__uply nytenging-umsokn__uply--greidendur">
      <header className="nytenging-umsokn__uply-lead">
        <h2 className="nytenging-umsokn__uply-title">{addressLine}</h2>
        <p className="nytenging-umsokn__uply-sub">{FORM_LEAD_TITLE[type]}</p>
      </header>

      <div className="nytenging-umsokn__uply-stack">
        <section className="nytenging-umsokn__form-card" aria-labelledby="card-greid-tengingar">
          <div className="nytenging-umsokn__form-card-head nytenging-umsokn__form-card-head--solo" id="card-greid-tengingar">
            Greiðandi tengingar
          </div>
          <div className="nytenging-umsokn__form-card-body">
            <div className="nytenging-umsokn__form-panel">
              <div className="nytenging-umsokn__greid-tenging-row">
                <button
                  type="button"
                  id="switch-greid-tengingar"
                  role="switch"
                  aria-checked={greidandiTengingar}
                  className={
                    greidandiTengingar
                      ? 'nytenging-umsokn__switch nytenging-umsokn__switch--on'
                      : 'nytenging-umsokn__switch'
                  }
                  onClick={() => setGreidandiTengingar((v) => !v)}
                >
                  <span className="nytenging-umsokn__switch-thumb" />
                </button>
                <p className="nytenging-umsokn__greid-tenging-q">
                  <span className="nytenging-umsokn__greid-tenging-q-reg">Er </span>
                  <span className="nytenging-umsokn__greid-tenging-q-strong">{DEMO_LOGGED_IN_NAME} </span>
                  <span className="nytenging-umsokn__greid-tenging-q-reg">greiðandi þessara umsóknar?</span>
                </p>
              </div>
              {!greidandiTengingar ? (
                <>
                  <div className="nytenging-umsokn__field nytenging-umsokn__field--input-only">
                    <InputLikeField id="greid-kt" placeholder="Kennitala" />
                  </div>
                  <div className="nytenging-umsokn__info-row">
                    <IconInfo />
                    <p className="nytenging-umsokn__info-text">
                      Valin aðili mun fá tilkynningu með beiðni um að staðfesta að hann samþykki að vera
                      skráður sem greiðandi tengingar
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section
          className="nytenging-umsokn__greid-ork-card"
          aria-labelledby="card-greid-ork-title"
        >
          <div className="nytenging-umsokn__greid-ork-head">
            <h3 className="nytenging-umsokn__greid-ork-title" id="card-greid-ork-title">
              Greiðendur orkumæla
            </h3>
            <p className="nytenging-umsokn__greid-ork-desc">{GREID_ORKU_COPY}</p>
          </div>
          <div className="nytenging-umsokn__greid-ork-body">
            <div className="nytenging-umsokn__greid-ork-body-inner">
              <div className="nytenging-umsokn__greid-table-wrap">
                <div
                  className="nytenging-umsokn__greid-thead nytenging-umsokn__greid-thead--quad"
                  role="row"
                >
                  <div className="nytenging-umsokn__greid-th" role="columnheader">
                    Mælir
                  </div>
                  <div className="nytenging-umsokn__greid-th" role="columnheader">
                    Greiðandi
                  </div>
                  <div className="nytenging-umsokn__greid-th" role="columnheader">
                    Tengiliðaupplýsingar
                  </div>
                  <div
                    className="nytenging-umsokn__greid-th nytenging-umsokn__greid-th--trail"
                    aria-hidden
                  />
                </div>
                <div className="nytenging-umsokn__greid-tbody" role="rowgroup">
                  {GREID_METER_ROWS.map((row) => {
                    const payer = meterPayers[row.id]
                    return (
                      <div
                        key={row.id}
                        className="nytenging-umsokn__greid-tr nytenging-umsokn__greid-tr--quad"
                        role="row"
                      >
                        <div
                          className="nytenging-umsokn__greid-td nytenging-umsokn__greid-td--meter"
                          role="cell"
                        >
                          {row.label}
                        </div>
                        <div
                          className={
                            payer
                              ? 'nytenging-umsokn__greid-td nytenging-umsokn__greid-td--value'
                              : 'nytenging-umsokn__greid-td nytenging-umsokn__greid-td--err'
                          }
                          role="cell"
                        >
                          {payer ? (
                            <p className="nytenging-umsokn__greid-payer-lines">
                              {payer.nafn}
                              <br />
                              {payer.kennitala}
                            </p>
                          ) : (
                            'Upplýsingar vantar'
                          )}
                        </div>
                        <div
                          className={
                            payer
                              ? 'nytenging-umsokn__greid-td nytenging-umsokn__greid-td--value'
                              : 'nytenging-umsokn__greid-td nytenging-umsokn__greid-td--err'
                          }
                          role="cell"
                        >
                          {payer ? payer.simi : 'Upplýsingar vantar'}
                        </div>
                        <div
                          className="nytenging-umsokn__greid-td nytenging-umsokn__greid-td--link"
                          role="cell"
                        >
                          <button
                            type="button"
                            className="nytenging-umsokn__greid-link"
                            onClick={() => setGreidUpplRowId(row.id)}
                          >
                            Skrá greiðanda
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="nytenging-umsokn__greid-footnote">
                <span className="nytenging-umsokn__greid-footnote-icon" aria-hidden>
                  <IconInfo />
                </span>
                <p className="nytenging-umsokn__greid-footnote-text">{GREID_ORKU_COPY}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="nytenging-umsokn__uply-actions">
        <button
          type="button"
          className="nytenging-umsokn__modal-btn nytenging-umsokn__modal-btn--secondary nytenging-umsokn__uply-back"
          onClick={onBack}
        >
          <IconArrowLeft />
          Til baka
        </button>
        <button type="button" className="nytenging-umsokn__footer-cta" onClick={onContinue}>
          Halda áfram
          <IconArrowRight />
        </button>
      </div>

      {greidUpplRowId !== null ? (
        <GreidandiUpplModal
          key={greidUpplRowId}
          meterRowId={greidUpplRowId}
          initialPayer={meterPayers[greidUpplRowId]}
          onClose={() => setGreidUpplRowId(null)}
          onConfirm={saveGreidandiFromModal}
        />
      ) : null}
    </div>
  )
}

function AddressConfirmModal({ open, onClose, onConfirm, titleId, descriptionId }) {
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="nytenging-umsokn__modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="nytenging-umsokn__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="nytenging-umsokn__modal-close"
          onClick={onClose}
          aria-label="Loka glugga"
        >
          <IconCloseModal />
        </button>
        <div className="nytenging-umsokn__modal-inner">
          <div className="nytenging-umsokn__modal-text">
            <h2 id={titleId} className="nytenging-umsokn__modal-title">
              Rétt heimilsfang?
            </h2>
            <div id={descriptionId} className="nytenging-umsokn__modal-body">
              <p>Athugaðu að valið heimilisfang þarf að vera rétt skráð hjá HMS.</p>
              <p>Veitur geta aðeins haldið umsókn áfram ef skráningin er rétt.</p>
            </div>
          </div>
          <div className="nytenging-umsokn__modal-actions">
            <button
              type="button"
              className="nytenging-umsokn__modal-btn nytenging-umsokn__modal-btn--secondary"
              onClick={onClose}
            >
              Aftur í heimilisfang
            </button>
            <button
              type="button"
              className="nytenging-umsokn__footer-cta"
              onClick={onConfirm}
            >
              Halda áfram
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function NytengingUmsokn() {
  const { type } = useParams()
  const [wizardStep, setWizardStep] = useState(0)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const modalTitleId = useId()
  const modalDescId = useId()
  const continueBtnRef = useRef(null)
  const mainScrollRef = useRef(null)
  const prevWizardStepRef = useRef(0)

  useLayoutEffect(() => {
    if (wizardStep > prevWizardStepRef.current) {
      mainScrollRef.current?.scrollTo(0, 0)
      window.scrollTo(0, 0)
    }
    prevWizardStepRef.current = wizardStep
  }, [wizardStep])

  const closeAddressModal = useCallback(() => {
    setAddressModalOpen(false)
    window.requestAnimationFrame(() => continueBtnRef.current?.focus())
  }, [])

  const confirmAddressModal = useCallback(() => {
    setAddressModalOpen(false)
    setWizardStep(1)
  }, [])

  if (type !== 'husnaedis' && type !== 'innvidi') {
    return <Navigate to="/umsokn/nytenging/husnaedis" replace />
  }
  const title = TITLES[type]
  const currentStepIndex = wizardStep

  return (
    <div className="minar-umsoknir nytenging-umsokn">
      <header className="minar-umsoknir__nav">
        <Link to="/" className="minar-umsoknir__logo">
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
          <UserMenu name={DEMO_LOGGED_IN_NAME} />
        </div>
      </header>

      <div
        className={
          wizardStep >= 1
            ? 'nytenging-umsokn__layout nytenging-umsokn__layout--upplysingar'
            : 'nytenging-umsokn__layout'
        }
      >
        <aside
          className={
            wizardStep >= 1
              ? 'nytenging-umsokn__sidenav nytenging-umsokn__sidenav--step2'
              : 'nytenging-umsokn__sidenav'
          }
        >
          <div className="nytenging-umsokn__sidenav-inner">
            {wizardStep === 0 ? <h1 className="nytenging-umsokn__title">{title}</h1> : null}

            {wizardStep === 0 ? (
              <>
                <div className="nytenging-umsokn__stadsetning-block">
                  <h2 className="nytenging-umsokn__section-label">Staðsetning</h2>
                  <div
                    className="nytenging-umsokn__search-field"
                    role="group"
                    aria-label="Leit að heimilisfangi"
                  >
                    <span>{SAMPLE_ADDRESS}</span>
                    <IconSearch />
                  </div>
                </div>

                <hr className="nytenging-umsokn__divider" />

                <div className="nytenging-umsokn__address-block">
                  <p className="nytenging-umsokn__address-line">{SAMPLE_ADDRESS}</p>
                  <div className="nytenging-umsokn__stadfang-row">
                    <span>Staðfanganúmer:</span>
                    <span>1234567</span>
                  </div>
                  <ServiceTags />
                </div>

                <hr className="nytenging-umsokn__divider" />
              </>
            ) : (
              <>
                <div className="nytenging-umsokn__stodu-header">
                  <span className="nytenging-umsokn__stodu-title">Stöðuyfirlit</span>
                </div>
              </>
            )}

            <VerticalStepper currentIndex={currentStepIndex} />

            {wizardStep >= 1 ? (
              <div className="nytenging-umsokn__side-accordions">
                <div className="nytenging-umsokn__acc-card nytenging-umsokn__acc-card--open">
                  <div className="nytenging-umsokn__acc-card-head">
                    <span>Staðsetning</span>
                    <IconCaretDown size={24} />
                  </div>
                  <div className="nytenging-umsokn__acc-card-body">
                    <p className="nytenging-umsokn__acc-address">{SAMPLE_ADDRESS}</p>
                    <ServiceTags />
                  </div>
                </div>
                <div className="nytenging-umsokn__acc-card nytenging-umsokn__acc-card--shut">
                  <div className="nytenging-umsokn__acc-card-head">
                    <span>Umsækjandi</span>
                    <span className="nytenging-umsokn__acc-caret nytenging-umsokn__acc-caret--flip" aria-hidden>
                      <IconCaretDown size={24} />
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {wizardStep === 0 ? (
            <button
              ref={continueBtnRef}
              type="button"
              className="nytenging-umsokn__footer-cta"
              onClick={() => setAddressModalOpen(true)}
            >
              Halda áfram
              <IconArrowRight />
            </button>
          ) : null}
        </aside>

        <div className="nytenging-umsokn__main">
          {wizardStep === 0 ? (
            <div className="nytenging-umsokn__map-panel">
              <img src={ASSETS.mapSnapshot} alt="" />
            </div>
          ) : (
            <div ref={mainScrollRef} className="nytenging-umsokn__main-scroll">
              {wizardStep === 1 ? (
                <UpplisingarStepContent
                  type={type}
                  addressLine={SAMPLE_ADDRESS}
                  onBack={() => setWizardStep(0)}
                  onContinue={() => setWizardStep(2)}
                />
              ) : wizardStep === 2 ? (
                <GreidendurStepContent
                  type={type}
                  addressLine={SAMPLE_ADDRESS}
                  onBack={() => setWizardStep(1)}
                  onContinue={() => setWizardStep(3)}
                />
              ) : wizardStep === 3 ? (
                <TengilidirFagilarStepContent
                  type={type}
                  addressLine={SAMPLE_ADDRESS}
                  onBack={() => setWizardStep(2)}
                  onContinue={() => setWizardStep(4)}
                />
              ) : wizardStep === 4 ? (
                <FylgiskjolStepContent
                  type={type}
                  addressLine={SAMPLE_ADDRESS}
                  onBack={() => setWizardStep(3)}
                  onContinue={() => setWizardStep(5)}
                />
              ) : wizardStep === 5 ? (
                <YfirlitStepContent
                  type={type}
                  addressLine={SAMPLE_ADDRESS}
                  onBack={() => setWizardStep(4)}
                  onSubmit={() => {}}
                />
              ) : null}
            </div>
          )}
        </div>
        {SHOW_12_COL_GRID_OVERLAY && wizardStep >= 1 ? (
          <div className="nytenging-umsokn__grid-12-overlay" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="nytenging-umsokn__grid-12-overlay__col" />
            ))}
          </div>
        ) : null}
      </div>

      <AddressConfirmModal
        open={addressModalOpen}
        onClose={closeAddressModal}
        onConfirm={confirmAddressModal}
        titleId={modalTitleId}
        descriptionId={modalDescId}
      />
    </div>
  )
}
