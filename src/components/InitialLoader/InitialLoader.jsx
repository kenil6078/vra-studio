import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useTransitionContext } from '../Transition/TransitionContext'

// ── Logo text split into characters + registered symbol ──
const LOGO_TEXT = 'VRA-STUDIO'
const LOGO_CHARS = LOGO_TEXT.split('')

export default function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  // Refs — every animated element gets its own ref for precise GSAP control
  const containerRef = useRef(null)
  const burstRef = useRef(null)
  const vignetteRef = useRef(null)
  const grainRef = useRef(null)
  const bloomRef = useRef(null)
  const logoRef = useRef(null)
  const registeredRef = useRef(null)
  const counterRef = useRef(null)
  const counterObj = useRef({ value: 0 })
  const charRefs = useRef([])
  const lastMilestone = useRef(-1)
  // Store context values in refs so useEffect doesn't re-fire on context changes
  const transitionCtx = useTransitionContext()
  const ctxValuesRef = useRef(transitionCtx)
  ctxValuesRef.current = transitionCtx

  // Store char refs via callback
  const setCharRef = useCallback((el, index) => {
    if (el) charRefs.current[index] = el
  }, [])

  // ── Single-fire effect: runs ONCE on mount ──
  useEffect(() => {

    document.body.classList.add('freeze-scroll')
    const currentLenis = ctxValuesRef.current.lenis
    if (currentLenis) currentLenis.stop()

    // ── GSAP Context for clean teardown ──
    const ctx = gsap.context(() => {
      const chars = charRefs.current.filter(Boolean)

      // ═══════════════════════════════════════
      // AMBIENT LOOPS — run independently, killed on context revert
      // These must NOT be inside the master timeline or they block onComplete
      // ═══════════════════════════════════════

      // Slow burst rotation (ambient, imperceptible)
      gsap.to(burstRef.current, {
        rotation: 3,
        duration: 20,
        ease: 'none',
        force3D: true,
      })

      // Bloom breathing loop
      gsap.to(bloomRef.current, {
        scale: 1.06,
        opacity: 0.65,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.9,
        force3D: true,
      })

      // ═══════════════════════════════════════
      // MASTER TIMELINE — orchestrates the cinematic sequence
      // onComplete fires as soon as the last positioned tween ends
      // ═══════════════════════════════════════

      const masterTl = gsap.timeline({
        defaults: { force3D: true },
        onComplete: () => {
          document.body.classList.remove('freeze-scroll')
          const lenis = ctxValuesRef.current.lenis
          if (lenis) lenis.start()
          setIsDone(true)
          if (onComplete) onComplete()
          const { completeEnterPhase } = ctxValuesRef.current
          if (completeEnterPhase) completeEnterPhase()
        }
      })

      // ── 0.0s — Background layers fade in ──
      masterTl.to(burstRef.current, {
        opacity: 0.6,
        duration: 1.0,
        ease: 'power2.out',
      }, 0)

      masterTl.to(vignetteRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.1)

      masterTl.to(grainRef.current, {
        opacity: 0.025,
        duration: 0.6,
        ease: 'none',
      }, 0.15)

      masterTl.to(bloomRef.current, {
        opacity: 0.5,
        duration: 0.5,
        ease: 'power2.out',
      }, 0.2)

      // ── 0.4s — SplitText character reveal ──
      masterTl.fromTo(chars, {
        opacity: 0,
        y: 60,
        rotateX: 70,
        scale: 0.85,
      }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.035,
        ease: 'back.out(1.2)',
        transformOrigin: '50% 100%',
      }, 0.4)

      // ── After chars — ® symbol independent animation ──
      const regDelay = 0.4 + (LOGO_CHARS.length * 0.035) + 0.15
      masterTl.fromTo(registeredRef.current, {
        opacity: 0,
        scale: 0.4,
        rotation: -30,
      }, {
        opacity: 0.7,
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'back.out(1.8)',
      }, regDelay)

      // Tiny ® glow pulse
      masterTl.to(registeredRef.current, {
        textShadow: '0 0 8px rgba(0, 180, 255, 0.5)',
        duration: 0.25,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      }, regDelay + 0.2)

      // ── 1.0s — Counter (000 → 100) ──
      masterTl.to(counterObj.current, {
        value: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = Math.floor(counterObj.current.value)
          setProgress(val)

          // Milestone pulse every 10%
          const milestone = Math.floor(val / 10) * 10
          if (milestone > 0 && milestone !== lastMilestone.current && val === milestone) {
            lastMilestone.current = milestone
            gsap.to(counterRef.current, {
              scale: 1.05,
              opacity: 0.4,
              duration: 0.07,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
              force3D: true,
            })
          }
        },
      }, 1.0)

      // ── 2.5s — Logo breathing (gentle scale pulse) ──
      masterTl.to(logoRef.current, {
        scale: 1.015,
        duration: 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      }, 2.5)

      // ── 3.0s — Cinematic reveal sequence ──

      // Logo scales up elegantly
      masterTl.to(logoRef.current, {
        scale: 1.12,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      }, 3.0)

      // Counter fades
      masterTl.to(counterRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: 'power2.in',
      }, 3.0)

      // Background brightens — burst scales up
      masterTl.to(burstRef.current, {
        scale: 1.3,
        opacity: 0.85,
        duration: 0.45,
        ease: 'power2.in',
      }, 3.0)

      // Vignette fades for the reveal
      masterTl.to(vignetteRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 3.05)

      // ── 3.2s — Clip-path mask reveal ──
      masterTl.fromTo(containerRef.current, {
        clipPath: 'circle(150% at 50% 50%)',
      }, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.65,
        ease: 'power3.inOut',
      }, 3.2)

    }, containerRef)

    return () => {
      ctx.revert() // Kills ALL tweens (ambient + timeline) cleanly
      document.body.classList.remove('freeze-scroll')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isDone) return null

  return (
    <div ref={containerRef} className="loader-container">
      {/* Layer 1: Procedural radial burst */}
      <div ref={burstRef} className="loader-radial-burst" />

      {/* Layer 2: Cinematic vignette */}
      <div ref={vignetteRef} className="loader-vignette" />

      {/* Layer 3: Film grain noise */}
      <div ref={grainRef} className="loader-grain" />

      {/* Layer 4: Breathing bloom glow */}
      <div ref={bloomRef} className="loader-bloom" />

      {/* Layer 5: Logo — split characters + ® */}
      <div className="loader-logo-wrapper">
        <h1 ref={logoRef} className="loader-logo">
          {LOGO_CHARS.map((char, i) => (
            <span
              key={i}
              ref={(el) => setCharRef(el, i)}
              className="loader-char"
            >
              {char}
            </span>
          ))}
          <span ref={registeredRef} className="loader-registered">®</span>
        </h1>
      </div>

      {/* Layer 6: Bottom counter */}
      <div className="loader-counter-wrapper">
        <div ref={counterRef} className="loader-counter">
          {String(progress).padStart(3, '0')}
        </div>
      </div>
    </div>
  )
}
