import { Routes, Route } from 'react-router-dom'
import MinarUmsoknir from './pages/MinarUmsoknir.jsx'
import StofnaUmsokn from './pages/StofnaUmsokn.jsx'
import NytengingUmsokn from './pages/NytengingUmsokn.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MinarUmsoknir />} />
      <Route path="/stofna-umsokn" element={<StofnaUmsokn />} />
      <Route path="/umsokn/nytenging/:type" element={<NytengingUmsokn />} />
    </Routes>
  )
}

export default App
