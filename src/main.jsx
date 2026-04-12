import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DevColumnGrid from './components/DevColumnGrid.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DevColumnGrid />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
