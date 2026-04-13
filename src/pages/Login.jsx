import { useNavigate } from 'react-router-dom'
import './Login.css'

const ASSETS = {
  logo: '/figma-assets/d34fa6c5a18c064370f1e0cf9cc7b3a3d28d5fa7.png',
  loginHero: `${import.meta.env.BASE_URL}figma-assets/login-hero.png`,
}

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="innskraning">
      <header className="innskraning__nav" aria-label="Veitur">
        <div className="innskraning__nav-left">
          <a href="/" className="innskraning__logo" aria-label="Veitur">
            <img src={ASSETS.logo} alt="Veitur" width={160} height={36} />
          </a>
        </div>
        <div className="innskraning__nav-right" aria-hidden />
      </header>

      <main className="innskraning__main">
        <section className="innskraning__image" aria-hidden>
          <img src={ASSETS.loginHero} alt="" />
        </section>

        <section className="innskraning__content" aria-labelledby="login-title">
          <div className="innskraning__form">
            <div className="innskraning__title">
              <h1 id="login-title" className="innskraning__title-line innskraning__title-line--bold">
                Innskráning
              </h1>
              <p className="innskraning__title-line">hjá Veitum</p>
            </div>

            <div className="innskraning__body">
              <div className="innskraning__info">
                <h2 className="innskraning__info-title">Auðkenning</h2>
                <p className="innskraning__info-text">
                  Allir geta skráð sig inn á mínar síður með rafrænum skilríkjum hvort sem þeir eru
                  viðskiptavinir Veitna eða ekki.
                </p>
              </div>

              <button type="button" className="innskraning__cta" onClick={() => navigate('/veldu-adgang')}>
                Auðkenna með Kenni
              </button>
            </div>
          </div>

          <footer className="innskraning__footer" aria-label="Neðanmál">
            <a className="innskraning__footer-link" href="#personuvernd" onClick={(e) => e.preventDefault()}>
              Persónuverndarstefna Veitna
            </a>
            <a className="innskraning__footer-link" href="#skilmalar" onClick={(e) => e.preventDefault()}>
              Skilmálar
            </a>
            <a className="innskraning__footer-link" href="#en" onClick={(e) => e.preventDefault()}>
              English
            </a>
          </footer>
        </section>
      </main>
    </div>
  )
}
