import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { publicUrl } from '@/lib/utils'

document.documentElement.style.setProperty(
  '--paper-texture',
  `url("${publicUrl('/texture-paper.svg')}")`,
)

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename === '/' ? undefined : basename}>
    <App />
  </BrowserRouter>,
)
