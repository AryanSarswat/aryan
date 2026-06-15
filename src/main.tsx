import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import './styles/globals.css'
import App from './App'
import { scrollState } from './three/scrollState'
import { MOBILE_BREAKPOINT } from './data/config'

gsap.registerPlugin(ScrollTrigger)

// Consistent three.js colour management across the app.
THREE.ColorManagement.enabled = true

// Resolve device/motion profile before first paint so the scene builds the
// correct particle density and respects reduced-motion immediately.
scrollState.isMobile = window.innerWidth < MOBILE_BREAKPOINT
scrollState.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
