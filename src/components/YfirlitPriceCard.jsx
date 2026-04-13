import './YfirlitPriceCard.css'

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

const YFIRLIT_SAMPLE_LINE = { label: '400A-3 fasa bráðabirgða', price: '16.000.000 kr' }

function YfirlitPriceRow({ label, price }) {
  return (
    <div className="nytenging-umsokn__yfirlit-price-row">
      <span className="nytenging-umsokn__yfirlit-price-row-label">{label}</span>
      <span className="nytenging-umsokn__yfirlit-price-row-value">{price}</span>
    </div>
  )
}

function YfirlitPriceSection({ title, icon, children }) {
  return (
    <div className="nytenging-umsokn__yfirlit-price-section">
      <div className="nytenging-umsokn__yfirlit-price-section-head">
        <span className="nytenging-umsokn__yfirlit-price-section-icon" aria-hidden>
          {icon}
        </span>
        <span className="nytenging-umsokn__yfirlit-price-section-title">{title}</span>
      </div>
      <div className="nytenging-umsokn__yfirlit-price-section-box">{children}</div>
    </div>
  )
}

/**
 * Áætlað verð kort eins og í Yfirlit skrefi nýtengingar umsóknar.
 */
export default function YfirlitPriceCard({ onSjaskyringarClick }) {
  return (
    <section
      className="nytenging-umsokn__yfirlit-card nytenging-umsokn__yfirlit-card--price"
      aria-labelledby="yfirlit-verd-title"
    >
      <div className="nytenging-umsokn__yfirlit-card-head nytenging-umsokn__yfirlit-card-head--split">
        <h3 id="yfirlit-verd-title" className="nytenging-umsokn__yfirlit-card-title">
          Áætlað verð
        </h3>
        <button
          type="button"
          className="nytenging-umsokn__yfirlit-text-link"
          onClick={() => onSjaskyringarClick?.()}
        >
          Sjá skýringar
        </button>
      </div>
      <div className="nytenging-umsokn__yfirlit-card-body nytenging-umsokn__yfirlit-card-body--price">
        <YfirlitPriceSection title="Rafmagn" icon={<IconRafmagnCard />}>
          <YfirlitPriceRow {...YFIRLIT_SAMPLE_LINE} />
          <YfirlitPriceRow {...YFIRLIT_SAMPLE_LINE} />
        </YfirlitPriceSection>
        <YfirlitPriceSection title="Heitt vatn" icon={<IconHeittVatnCard />}>
          <YfirlitPriceRow {...YFIRLIT_SAMPLE_LINE} />
        </YfirlitPriceSection>
        <YfirlitPriceSection title="Kalt vatn" icon={<IconKaltVatnCard />}>
          <YfirlitPriceRow {...YFIRLIT_SAMPLE_LINE} />
        </YfirlitPriceSection>
      </div>
      <div className="nytenging-umsokn__yfirlit-card-foot">
        <div className="nytenging-umsokn__yfirlit-total-row">
          <span>Heildarverð m. VSK</span>
          <span>30.000.000 kr</span>
        </div>
      </div>
    </section>
  )
}
