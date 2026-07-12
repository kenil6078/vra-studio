import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Panel data ──
const PANELS = [
  {
    headline: "WE DON'T BUILD WEBSITES",
    counter: '01 / 05',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
    gradient: 'radial-gradient(ellipse 80% 80% at 30% 60%, rgba(10,30,60,0.9) 0%, rgba(4,10,20,1) 70%)',
    shape: { bg: 'rgba(0,120,200,0.06)', size: '45vmax', x: '65%', y: '25%' },
  },
  {
    headline: 'WE DESIGN DIGITAL EXPERIENCES',
    counter: '02 / 05',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    gradient: 'radial-gradient(ellipse 80% 80% at 70% 40%, rgba(15,35,70,0.9) 0%, rgba(4,10,20,1) 70%)',
    shape: { bg: 'rgba(0,80,180,0.05)', size: '50vmax', x: '20%', y: '70%' },
  },
  {
    headline: 'THAT PEOPLE REMEMBER',
    counter: '03 / 05',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gradient: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(8,25,55,0.9) 0%, rgba(4,10,20,1) 70%)',
    shape: { bg: 'rgba(0,150,200,0.05)', size: '40vmax', x: '75%', y: '60%' },
  },
  {
    headline: 'CRAFTED WITH MOTION',
    counter: '04 / 05',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    gradient: 'radial-gradient(ellipse 80% 80% at 40% 30%, rgba(12,28,58,0.9) 0%, rgba(4,10,20,1) 70%)',
    shape: { bg: 'rgba(0,100,220,0.06)', size: '55vmax', x: '30%', y: '35%' },
  },
  {
    headline: 'VRA-STUDIO®',
    counter: '05 / 05',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    gradient: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,40,80,0.9) 0%, rgba(4,10,20,1) 70%)',
    shape: { bg: 'rgba(0,180,255,0.07)', size: '60vmax', x: '50%', y: '50%' },
  },
]

// One continuous path that carries the visual language across the entire 5-panel journey.
const STORY_PATH =
  'M 180 470 C 280 364 380 286 470 286 C 585 286 650 364 710 430 C 760 486 820 600 900 620 C 990 642 1082 540 1140 480 C 1210 405 1288 316 1380 302 C 1490 285 1560 352 1628 438 C 1698 530 1768 632 1875 648 C 1988 665 2068 576 2126 505 C 2196 420 2274 334 2388 332 C 2508 330 2582 450 2648 548 C 2718 652 2806 736 2918 714 C 3028 692 3092 572 3158 486 C 3230 394 3324 328 3436 338 C 3560 349 3628 454 3688 544 C 3750 635 3838 720 3948 728 C 4060 736 4138 650 4198 578 C 4260 504 4332 420 4446 402 C 4554 384 4646 426 4726 486 C 4800 541 4870 618 4920 646'

const IMAGE_MASK_RECTS = [
  { x: 710, y: 250, width: 280, height: 360, rx: 30 },
  { x: 1740, y: 220, width: 300, height: 380, rx: 30 },
  { x: 2720, y: 240, width: 300, height: 360, rx: 30 },
  { x: 3720, y: 210, width: 300, height: 390, rx: 30 },
  { x: 4300, y: 190, width: 360, height: 420, rx: 32 },
]

function SplitHeadline({ text, panelIndex }) {
  const words = text.split(' ')
  return (
    <h2 className="hstory-headline">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, ci) => (
            <span key={ci} className="hstory-char-mask">
              <span
                className={`hstory-char hstory-char-p${panelIndex}`}
                style={{ transform: 'translateY(120%) rotateX(55deg) scale(0.9)', opacity: 0 }}
              >
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  )
}

export default function HorizontalStory() {
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const svgBehindLayerRef = useRef(null)
  const svgFrontLayerRef = useRef(null)
  const pathRef = useRef(null)
  const shadowRef = useRef(null)
  const panelCount = PANELS.length
  const sectionHeight = `${panelCount * 100}vh`
  const trackWidth = `${panelCount * 100}vw`

  useLayoutEffect(() => {
    const path = pathRef.current
    const shadow = shadowRef.current
    if (!path || !shadow) return

    const length = path.getTotalLength()
    gsap.set([path, shadow], {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const track = trackRef.current
        if (!track) return

        // Use precise pixel measurements so the pinned section ends exactly when the horizontal track finishes.
        const trackScrollWidth = track.scrollWidth
        const horizontalDistance = trackScrollWidth - window.innerWidth

        // Set the outer section height so the page reserves exactly the amount of scroll needed.
        if (outerRef.current) {
          outerRef.current.style.height = `${horizontalDistance + window.innerHeight}px`
        }

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: outerRef.current,
            pin: true,
            pinSpacing: true,
            scrub: 0.9,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
          defaults: { force3D: true, ease: 'none' },
        })

        masterTl.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          duration: 1,
          ease: 'none',
        }, 0)

        masterTl.fromTo([svgBehindLayerRef.current, svgFrontLayerRef.current], {
          x: 0,
        }, {
          x: () => -(track.scrollWidth - window.innerWidth) * 0.6,
          duration: 1,
          ease: 'none',
        }, 0)

        masterTl.fromTo([path, shadow], {
          strokeDashoffset: length,
        }, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'none',
        }, 0)

        masterTl.fromTo([path, shadow], {
          strokeWidth: 10,
          opacity: 0.45,
        }, {
          strokeWidth: 20,
          opacity: 0.95,
          duration: 0.28,
          ease: 'power2.inOut',
        }, 0)

        masterTl.to([path, shadow], {
          strokeWidth: 8,
          opacity: 0.7,
          duration: 0.25,
          ease: 'power2.inOut',
        }, 0.28)

        masterTl.to([path, shadow], {
          strokeWidth: 24,
          opacity: 1,
          duration: 0.26,
          ease: 'power2.inOut',
        }, 0.53)

        masterTl.to([path, shadow], {
          strokeWidth: 14,
          opacity: 0.9,
          duration: 0.24,
          ease: 'power2.inOut',
        }, 0.79)

        gsap.to([path, shadow], {
          x: 1,
          y: -0.35,
          opacity: 0.95,
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 50%',
        })

        gsap.to('#storyGradientBack', {
          attr: { x1: '-10%', x2: '110%' },
          duration: 16,
          ease: 'none',
          repeat: -1,
        })

        gsap.to('#storyGradientFront', {
          attr: { x1: '0%', x2: '100%' },
          duration: 20,
          ease: 'none',
          repeat: -1,
        })

        const panelWidth = 1 / PANELS.length
        const CHAR_STAGGER = 0.003
        const CHAR_REVEAL_DUR = 0.05
        const CHAR_EXIT_DUR = 0.04
        const OVERLAP = 0.025

        PANELS.forEach((_, i) => {
          const start = i * panelWidth
          const charSelector = `.hstory-char-p${i}`

          masterTl.fromTo(`.hstory-gradient-${i}`, {
            x: '8%',
          }, {
            x: '-8%',
            duration: panelWidth,
            immediateRender: false,
          }, start)

          masterTl.fromTo(`.hstory-shape-${i}`, {
            x: '15%',
          }, {
            x: '-10%',
            duration: panelWidth,
            immediateRender: false,
          }, start)

          masterTl.fromTo(charSelector, {
            y: '120%',
            rotateX: 55,
            scale: 0.9,
            opacity: 0,
          }, {
            y: '0%',
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: CHAR_REVEAL_DUR,
            stagger: CHAR_STAGGER,
            ease: 'power4.out',
            immediateRender: false,
          }, start + 0.01)

          masterTl.fromTo([path, shadow], {
            opacity: 0.45,
            scale: 0.995,
          }, {
            opacity: 0.95,
            scale: 1.003,
            duration: 0.16,
            immediateRender: false,
          }, start + 0.01)

          masterTl.fromTo(`.hstory-img-${i}`, {
            clipPath: 'inset(100% 0 0 0)',
          }, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.06,
            ease: 'power3.inOut',
            immediateRender: false,
          }, start + 0.02)

          masterTl.fromTo(`.hstory-img-${i} img`, {
            scale: 1.15,
            rotation: -1,
          }, {
            scale: 1,
            rotation: 0,
            duration: 0.08,
            ease: 'power2.out',
            immediateRender: false,
          }, start + 0.02)

          masterTl.fromTo(`.hstory-counter-${i}`, {
            opacity: 0,
            y: 10,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.03,
            ease: 'power2.out',
            immediateRender: false,
          }, start + 0.01)

          if (i < PANELS.length - 1) {
            const exitStart = start + panelWidth - OVERLAP - CHAR_EXIT_DUR
            masterTl.to(charSelector, {
              y: '-120%',
              rotateX: -45,
              opacity: 0,
              duration: CHAR_EXIT_DUR,
              stagger: CHAR_STAGGER * 0.8,
              ease: 'power3.in',
              immediateRender: false,
            }, exitStart)

            masterTl.to(`.hstory-counter-${i}`, {
              opacity: 0,
              y: -8,
              duration: 0.02,
              ease: 'power2.in',
              immediateRender: false,
            }, exitStart)

            masterTl.to(`.hstory-img-${i}`, {
              clipPath: 'inset(0 0 100% 0)',
              duration: 0.04,
              ease: 'power3.in',
              immediateRender: false,
            }, exitStart + 0.01)
          }
        })
      })

      mm.add('(max-width: 767px)', () => {
        PANELS.forEach((_, i) => {
          const charSelector = `.hstory-char-p${i}`

          gsap.fromTo(charSelector, {
            y: '120%',
            rotateX: 90,
            scale: 0.9,
            opacity: 0,
          }, {
            y: '0%',
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: `.hstory-panel-${i}`,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          })

          gsap.fromTo(`.hstory-img-${i}`, {
            clipPath: 'inset(100% 0 0 0)',
          }, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.8,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: `.hstory-panel-${i}`,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          })
        })
      })
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={outerRef} className="hstory-outer relative z-10" style={{ minHeight: sectionHeight }}>
      <div
        ref={svgBehindLayerRef}
        className="fixed inset-0 z-2 pointer-events-none hidden md:block"
        style={{ width: '500vw', height: '100vh', willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 5000 1000"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="storyGradientBack" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path
            ref={shadowRef}
            d={STORY_PATH}
            fill="none"
            stroke="url(#storyGradientBack)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
            style={{ willChange: 'stroke-dashoffset, stroke-width, opacity, transform' }}
          />
        </svg>
      </div>

      <div
        ref={svgFrontLayerRef}
        className="fixed inset-0 z-4 pointer-events-none hidden md:block mix-blend-screen"
        style={{ width: '500vw', height: '100vh', willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 5000 1000"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="storyGradientFront" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
              <stop offset="50%" stopColor="#f7fbff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.82" />
            </linearGradient>
            <clipPath id="storyImageMask">
              {IMAGE_MASK_RECTS.map((rect, index) => (
                <rect key={index} x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={rect.rx} ry={rect.rx} />
              ))}
            </clipPath>
          </defs>
          <path
            ref={pathRef}
            d={STORY_PATH}
            fill="none"
            stroke="url(#storyGradientFront)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
            clipPath="url(#storyImageMask)"
            style={{ willChange: 'stroke-dashoffset, stroke-width, opacity, transform' }}
          />
        </svg>
      </div>

      <div ref={trackRef} className="hstory-track" style={{ width: trackWidth }}>
        {PANELS.map((panel, i) => (
          <div key={i} className={`hstory-panel hstory-panel-${i}`}>
            <div
              className={`hstory-gradient hstory-gradient-${i}`}
              style={{ background: panel.gradient }}
            />

            <div className="hstory-grain" />

            <div
              className={`hstory-shape hstory-shape-${i}`}
              style={{
                background: panel.shape.bg,
                width: panel.shape.size,
                height: panel.shape.size,
                left: panel.shape.x,
                top: panel.shape.y,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(80px)',
              }}
            />

            <div
              className={`hstory-image-wrap hstory-img-${i} z-3`}
              style={{
                right: '6vw',
                bottom: '8vh',
                width: 'clamp(180px, 22vw, 320px)',
                height: 'clamp(240px, 30vh, 400px)',
                borderRadius: '0.75rem',
              }}
            >
              <img
                src={panel.image}
                alt=""
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>

            <SplitHeadline text={panel.headline} panelIndex={i} />

            <div className={`hstory-counter hstory-counter-${i}`}>
              {panel.counter}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

