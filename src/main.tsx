import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/caveat'
import '@fontsource/special-elite'
import '@fontsource-variable/source-serif-4'
import '@fontsource/im-fell-english-sc'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
