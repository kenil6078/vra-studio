import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TransitionContext = createContext(null)

export const useTransitionContext = () => useContext(TransitionContext)

export const TransitionProvider = ({ children }) => {
  const navigate = useNavigate()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [pendingRoute, setPendingRoute] = useState(null)
  const [transitionPhase, setTransitionPhase] = useState('idle') // 'idle' | 'exit' | 'enter'
  const [lenisRef, setLenisRef] = useState(null)

  // Initialize Lenis smooth scroll and synchronize with GSAP ticker & ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false,
    })

    // Update ScrollTrigger on Lenis scroll updates
    lenis.on('scroll', ScrollTrigger.update)

    // Run Lenis tick loop on GSAP ticker RAF
    const updateRaf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateRaf)
    gsap.ticker.lagSmoothing(0)

    setLenisRef(lenis)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateRaf)
    }
  }, [])

  const triggerTransition = async (to) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTransitionPhase('exit')
    setPendingRoute(to)

    // Freeze scroll via Lenis and fallback CSS class
    if (lenisRef) lenisRef.stop()
    document.body.classList.add('freeze-scroll')

    try {
      // Capture viewport using html2canvas
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: window.devicePixelRatio > 1 ? 1.5 : 1,
        scrollX: 0,
        scrollY: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        backgroundColor: '#000000',
      })
      const dataUrl = canvas.toDataURL('image/webp', 0.75)
      setScreenshot(dataUrl)
    } catch (e) {
      console.warn('html2canvas capture failed, running fallback transition', e)
      setScreenshot(null)
    }
  };

  const completeExitPhase = () => {
    if (pendingRoute) {
      navigate(pendingRoute)
      setTransitionPhase('enter')
      // Reset scroll position cleanly using Lenis
      if (lenisRef) {
        lenisRef.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  };

  const completeEnterPhase = () => {
    setIsTransitioning(false)
    setTransitionPhase('idle')
    setScreenshot(null)
    setPendingRoute(null)
    
    // Release scroll lock
    document.body.classList.remove('freeze-scroll')
    if (lenisRef) lenisRef.start()
  };

  const startPageReveal = () => {
    setIsTransitioning(true)
    setTransitionPhase('enter')
    setScreenshot(null)
    setPendingRoute(null)
    if (lenisRef) lenisRef.stop()
    document.body.classList.add('freeze-scroll')
  };

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        screenshot,
        transitionPhase,
        triggerTransition,
        completeExitPhase,
        completeEnterPhase,
        startPageReveal,
        lenis: lenisRef,
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}
