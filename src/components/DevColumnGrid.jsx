import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './DevColumnGrid.css'

const COLS = 12

function readSessionFlag() {
  const v = sessionStorage.getItem('veitur-dev-grid')
  if (v === '0') return false
  if (v === '1') return true
  return null
}

export default function DevColumnGrid() {
  const [searchParams] = useSearchParams()
  const [sessionOn, setSessionOn] = useState(readSessionFlag)

  const envOn = import.meta.env.VITE_SHOW_LAYOUT_GRID === 'true'
  const q = searchParams.get('grid')
  const urlOff = q === '0' || q === 'false'
  const urlOn = q === '1' || q === 'true' || (q !== null && q !== '' && !urlOff)

  const visible = useMemo(() => {
    if (!import.meta.env.DEV) return false
    if (urlOff) return false
    if (urlOn) return true
    if (sessionOn === true) return true
    if (sessionOn === false) return false
    return envOn
  }, [envOn, urlOff, urlOn, sessionOn])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const onKey = (e) => {
      if (!e.altKey || e.key.toLowerCase() !== 'g') return
      if (e.repeat) return
      e.preventDefault()
      setSessionOn((prev) => {
        const base = prev ?? envOn
        const next = !base
        sessionStorage.setItem('veitur-dev-grid', next ? '1' : '0')
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [envOn])

  if (!visible) return null

  return (
    <>
      <div className="dev-column-grid" aria-hidden="true">
        {Array.from({ length: COLS }, (_, i) => (
          <div key={i} className="dev-column-grid__col" />
        ))}
      </div>
      <div className="dev-column-grid__hint" title="Development overlay only">
        12 col · margin 32 · gutter 16 · Alt+G toggles · ?grid=0 hides
      </div>
    </>
  )
}
