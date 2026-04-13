import { useNavigate } from 'react-router-dom'
import './VelduAdgang.css'

const ASSETS = {
  logo: '/figma-assets/d34fa6c5a18c064370f1e0cf9cc7b3a3d28d5fa7.png',
  hero: `${import.meta.env.BASE_URL}figma-assets/login-hero.png`,
}

function Tag({ children }) {
  return <span className="veldu-adgang__tag">{children}</span>
}

function AccessCard({ name, kt, tag, onClick }) {
  return (
    <button type="button" className="veldu-adgang__card" onClick={onClick}>
      <div className="veldu-adgang__card-row">
        <div className="veldu-adgang__card-name">{name}</div>
        <Tag>{tag}</Tag>
      </div>
      <div className="veldu-adgang__card-kt">{kt}</div>
    </button>
  )
}

export default function VelduAdgang() {
  const navigate = useNavigate()

  return (
    <div className="veldu-adgang">
      <header className="veldu-adgang__nav" aria-label="Veitur">
        <a href="/" className="veldu-adgang__logo" aria-label="Veitur">
          <img src={ASSETS.logo} alt="Veitur" width={160} height={36} />
        </a>
      </header>

      <main className="veldu-adgang__main">
        <section className="veldu-adgang__image" aria-hidden>
          <img src={ASSETS.hero} alt="" />
        </section>

        <section className="veldu-adgang__content" aria-labelledby="veldu-title">
          <div className="veldu-adgang__form">
            <div className="veldu-adgang__title">
              <h1 id="veldu-title" className="veldu-adgang__title-line veldu-adgang__title-line--bold">
                Veldu aðgang
              </h1>
              <p className="veldu-adgang__title-line">hjá Veitum</p>
            </div>

            <div className="veldu-adgang__groups">
              <div className="veldu-adgang__group">
                <div className="veldu-adgang__group-label">Minn aðgangur</div>
                <AccessCard
                  name="Jónatan Gunnlaugsson"
                  kt="260956-1236"
                  tag="GREIÐANDI"
                  onClick={() => navigate('/')}
                />
              </div>

              <div className="veldu-adgang__group">
                <div className="veldu-adgang__group-label">Fagaðali</div>
                <AccessCard name="Jónatan Gunnlaugsson" kt="260956-1236" tag="PÍPARI" />
                <AccessCard name="Jónatan Gunnlaugsson" kt="260956-1236" tag="RAFVERKTAKI" />
              </div>

              <div className="veldu-adgang__group">
                <div className="veldu-adgang__group-label">Umboðsaðili</div>
                <AccessCard name="Guðrún Guðmundsdóttir" kt="101034-2349" tag="FULLT UMBOÐ" />
                <AccessCard name="Jóna Jónatansdóttir" kt="260990-4679" tag="LESAAÐGANGUR" />
              </div>

              <div className="veldu-adgang__group">
                <div className="veldu-adgang__group-label">Fyrirtæki</div>
                <AccessCard name="Hótelkeðja Íslands hf." kt="501099-2350" tag="UMSJÓN" />
              </div>
            </div>

            <button
              type="button"
              className="veldu-adgang__logout"
              onClick={() => navigate('/login')}
            >
              Útskrá
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

