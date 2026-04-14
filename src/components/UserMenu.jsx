import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ASSETS = {
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
}

function IconCaretDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function UserMenu({ name }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        window.setTimeout(() => btnRef.current?.focus(), 0)
      }
    }

    const onPointerDown = (e) => {
      const panel = panelRef.current
      const btn = btnRef.current
      if (!panel || !btn) return
      if (panel.contains(e.target) || btn.contains(e.target)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const items = useMemo(
    () => [
      { id: 'switch', label: 'Skipta um aðgang', iconSrc: ASSETS.switchAccount, dividerAfter: true },
      { id: 'info', label: 'Mínar upplýsingar', iconSrc: ASSETS.user },
      { id: 'assets', label: 'Eignir og mælar', iconSrc: ASSETS.assetsMeters },
      { id: 'access', label: 'Aðgangar og umboð', iconSrc: ASSETS.accessDelegation },
      { id: 'payment', label: 'Greiðsluupplýsingar', iconSrc: ASSETS.paymentInfo },
      { id: 'pi', label: 'PI Port og vefþjónustur', iconSrc: ASSETS.piPort, dividerAfter: true },
      { id: 'advice', label: 'Hollráð', iconSrc: ASSETS.advice },
      { id: 'help', label: 'Aðstoð', iconSrc: ASSETS.help, dividerAfter: true },
      { id: 'logout', label: 'Útskrá', iconSrc: ASSETS.logout },
    ],
    [],
  )

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="minar-umsoknir__user-menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{name}</span>
        <IconCaretDown />
      </button>
      {open ? (
        <div ref={panelRef} className="minar-umsoknir__user-dropdown" role="menu">
          <div className="minar-umsoknir__user-dropdown-head">
            <div className="minar-umsoknir__user-dropdown-name">{name}</div>
            <button
              ref={closeBtnRef}
              type="button"
              className="minar-umsoknir__user-dropdown-close"
              onClick={() => {
                setOpen(false)
                window.setTimeout(() => btnRef.current?.focus(), 0)
              }}
              aria-label="Loka valmynd"
            >
              <img src={ASSETS.close} alt="" aria-hidden />
            </button>
          </div>
          <div className="minar-umsoknir__user-dropdown-items" role="presentation">
            {items.map((item) => (
              <div key={item.id} role="presentation">
                <button
                  type="button"
                  role="menuitem"
                  className="minar-umsoknir__user-dropdown-item"
                  onClick={() => {
                    setOpen(false)
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
    </>
  )
}

