import { useLayoutEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Panel data (no backgrounds — transparent overlay) ──
const PANELS = [
  {
    headline: "WE DON'T BUILD WEBSITES",
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
    shape: { bg: 'rgba(255,255,255,0.04)', size: '45vmax', x: '65%', y: '25%' },
  },
  {
    headline: 'WE DESIGN DIGITAL EXPERIENCES',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    shape: { bg: 'rgba(255,255,255,0.03)', size: '50vmax', x: '20%', y: '70%' },
  },
  {
    headline: 'THAT PEOPLE REMEMBER',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    shape: { bg: 'rgba(255,255,255,0.035)', size: '40vmax', x: '75%', y: '60%' },
  },
  {
    headline: 'CRAFTED WITH MOTION',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    shape: { bg: 'rgba(255,255,255,0.04)', size: '55vmax', x: '30%', y: '35%' },
  },
  {
    headline: 'VRA-Studio®',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    shape: { bg: 'rgba(255,255,255,0.05)', size: '60vmax', x: '50%', y: '50%' },
  },
]

const PANEL_UNIT = 1000

const ORIGINAL_5_PANEL_PATH =
  'M 180 470 C 280 364 380 286 470 286 C 585 286 650 364 710 430 C 760 486 820 600 900 620 C 990 642 1082 540 1140 480 C 1210 405 1288 316 1380 302 C 1490 285 1560 352 1628 438 C 1698 530 1768 632 1875 648 C 1988 665 2068 576 2126 505 C 2196 420 2274 334 2388 332 C 2508 330 2582 450 2648 548 C 2718 652 2806 736 2918 714 C 3028 692 3092 572 3158 486 C 3230 394 3324 328 3436 338 C 3560 349 3628 454 3688 544 C 3750 635 3838 720 3948 728 C 4060 736 4138 650 4198 578 C 4260 504 4332 420 4446 402 C 4554 384 4646 426 4726 486 C 4800 541 4870 618 4920 646'

/** Per-panel Bezier templates — large smooth curves, offset per panel index. */
const PANEL_CURVES = [
  [[100, -106], [200, -184], [290, -184]],
  [[115, -184], [185, -106], [240, -40]],
  [[290, 16], [360, 130], [440, 150]],
  [[530, 172], [622, 70], [680, 10]],
]

/** Build a continuous flowing Bezier path for any panel count. */
function buildStoryPath(panelCount) {
  if (panelCount === 5) return ORIGINAL_5_PANEL_PATH

  let d = 'M 180 470'

  for (let p = 0; p < panelCount; p++) {
    const ox = p * PANEL_UNIT
    PANEL_CURVES.forEach(([c1, c2, end]) => {
      d += ` C ${ox + c1[0]} ${470 + c1[1]}, ${ox + c2[0]} ${470 + c2[1]}, ${ox + end[0]} ${470 + end[1]}`
    })
  }

  const tail = panelCount * PANEL_UNIT
  d += ` C ${tail - 140} 541, ${tail - 70} 618, ${tail - 40} 646`
  return d
}

/** Generate organic image-mask rects distributed across the full SVG width. */
function buildImageMasks(panelCount) {
  const offsets = [
    { dx: 710, y: 250, w: 280, h: 360, rx: 30 },
    { dx: 740, y: 220, w: 300, h: 380, rx: 34 },
    { dx: 720, y: 240, w: 300, h: 360, rx: 28 },
    { dx: 720, y: 210, w: 300, h: 390, rx: 32 },
    { dx: 300, y: 190, w: 360, h: 420, rx: 36 },
  ]

  return Array.from({ length: panelCount }, (_, i) => {
    const o = offsets[i % offsets.length]
    return {
      x: i * PANEL_UNIT + o.dx,
      y: o.y,
      width: o.w,
      height: o.h,
      rx: o.rx,
    }
  })
}

function SplitHeadline({ text, panelIndex }) {
  const hasReg = text.endsWith('®')
  const cleanText = hasReg ? text.slice(0, -1) : text
  const words = cleanText.split(' ')
  
  return (
    <h2 className={`hstory-headline flex items-center justify-center flex-wrap ${panelIndex === 4 ? 'italic font-normal' : ''}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, ci) => (
            <span key={ci} className="hstory-char-mask">
              <span
                className={`hstory-char hstory-char-p${panelIndex}`}
                style={{ transform: 'translate3d(0, 120%, 0) rotateX(55deg) scale(0.9)' }}
              >
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
      {hasReg && (
        <sup className="text-xs md:text-sm lg:text-base font-sans font-medium text-white/50 align-super self-start mt-[-0.2em] md:mt-[-0.4em]">
          ®
        </sup>
      )}
    </h2>
  )
}

export default function HorizontalStory() {
  const outerRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const glowRef = useRef(null)

  const panelCount = PANELS.length
  const trackWidthVw = panelCount * 100
  const svgViewBox = `0 0 ${panelCount * PANEL_UNIT} ${PANEL_UNIT}`

  const storyPath = useMemo(() => buildStoryPath(panelCount), [panelCount])
  const imageMasks = useMemo(() => buildImageMasks(panelCount), [panelCount])

  useLayoutEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    const path = pathRef.current
    const glow = glowRef.current
    const svg = svgRef.current
    if (!outer || !track || !path || !glow || !svg) return

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)

    const length = path.getTotalLength()
    gsap.set([path, glow], {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    })

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: outer,
            start: 'top top+=1',
            end: () => `+=${getDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: -1,
          },
          defaults: { ease: 'none', force3D: true },
        })

        masterTl.to(track, { x: () => -getDistance(), duration: 1 }, 0)

        masterTl.to(svg, { x: () => -getDistance() * 0.55, duration: 1 }, 0)

        masterTl.fromTo(
          [path, glow],
          { strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 1 },
          0,
        )

        const panelSlot = 1 / panelCount
        const CHAR_STAGGER = 0.003
        const CHAR_REVEAL = 0.05
        const CHAR_EXIT = 0.04
        const OVERLAP = 0.025

        PANELS.forEach((_, i) => {
          const start = i * panelSlot
          const chars = `.hstory-char-p${i}`

          masterTl.fromTo(
            `.hstory-shape-${i}`,
            { x: '12%' },
            { x: '-12%', duration: panelSlot, immediateRender: false },
            start,
          )

          masterTl.fromTo(
            chars,
            { y: '120%', rotateX: 55, scale: 0.9 },
            {
              y: '0%',
              rotateX: 0,
              scale: 1,
              duration: CHAR_REVEAL,
              stagger: CHAR_STAGGER,
              ease: 'power4.out',
              immediateRender: false,
            },
            start + 0.01,
          )

          masterTl.fromTo(
            `.hstory-img-${i}`,
            { clipPath: 'inset(100% 0 0 0 round 24px)' },
            {
              clipPath: 'inset(0% 0 0 0 round 24px)',
              duration: 0.07,
              ease: 'power3.inOut',
              immediateRender: false,
            },
            start + 0.02,
          )

          masterTl.fromTo(
            `.hstory-img-${i} img`,
            { scale: 1.18, rotation: -1.5 },
            { scale: 1, rotation: 0, duration: 0.09, ease: 'power2.out', immediateRender: false },
            start + 0.02,
          )

          masterTl.fromTo(
            `.hstory-counter-${i}`,
            { y: 14 },
            { y: 0, duration: 0.03, ease: 'power2.out', immediateRender: false },
            start + 0.01,
          )

          if (i < panelCount - 1) {
            const exitAt = start + panelSlot - OVERLAP - CHAR_EXIT

            masterTl.fromTo(
              chars,
              { y: '0%', rotateX: 0, scale: 1 },
              {
                y: '-120%',
                rotateX: -45,
                scale: 0.9,
                duration: CHAR_EXIT,
                stagger: CHAR_STAGGER * 0.8,
                ease: 'power3.in',
                immediateRender: false,
              },
              exitAt,
            )

            masterTl.fromTo(
              `.hstory-counter-${i}`,
              { y: 0 },
              { y: -10, duration: 0.02, ease: 'power2.in', immediateRender: false },
              exitAt,
            )

            masterTl.fromTo(
              `.hstory-img-${i}`,
              { clipPath: 'inset(0% 0 0 0 round 24px)' },
              {
                clipPath: 'inset(0 0 100% 0 round 24px)',
                duration: 0.04,
                ease: 'power3.in',
                immediateRender: false,
              },
              exitAt + 0.01,
            )
          }
        })

        const onRefresh = () => ScrollTrigger.refresh()
        window.addEventListener('resize', onRefresh)
        return () => window.removeEventListener('resize', onRefresh)
      })

      mm.add('(max-width: 767px)', () => {
        gsap.set(track, { x: 0, clearProps: 'transform' })
        gsap.set(svg, { x: 0, clearProps: 'transform' })

        PANELS.forEach((_, i) => {
          const panel = `.hstory-panel-${i}`
          const chars = `.hstory-char-p${i}`

          gsap.fromTo(
            chars,
            { y: '120%', rotateX: 55, scale: 0.9 },
            {
              y: '0%',
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.02,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 72%',
                end: 'top 35%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )

          gsap.fromTo(
            `.hstory-img-${i}`,
            { clipPath: 'inset(100% 0 0 0 round 20px)' },
            {
              clipPath: 'inset(0% 0 0 0 round 20px)',
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: panel,
                start: 'top 65%',
                end: 'top 30%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )

          gsap.fromTo(
            [path, glow],
            { strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top 80%',
                end: 'top 20%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        })
      })
    }, outer)

    const refreshAfterLoad = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') {
      refreshAfterLoad()
    } else {
      window.addEventListener('load', refreshAfterLoad, { once: true })
    }

    return () => ctx.revert()
  }, [panelCount, storyPath])

  const counterLabel = (i) =>
    `${String(i + 1).padStart(2, '0')} / ${String(panelCount).padStart(2, '0')}`

  return (
    <section ref={outerRef} className="hstory-outer relative z-10">
      <div
        ref={viewportRef}
        className="hstory-viewport relative h-svh w-full overflow-hidden"
      >
        {/* Single continuous SVG — absolute inside pin, never fixed */}
        <div
          ref={svgRef}
          className="hstory-svg-wrap absolute top-0 left-0 h-full pointer-events-none"
          style={{ width: `${trackWidthVw}vw` }}
        >
          <svg
            viewBox={svgViewBox}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="storyGradientGlow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient
                id="storyGradientMain"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
              </linearGradient>
              <clipPath id="storyImageMask">
                {imageMasks.map((rect, index) => (
                  <rect
                    key={index}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    rx={rect.rx}
                    ry={rect.rx}
                  />
                ))}
              </clipPath>
            </defs>

            <path
              ref={glowRef}
              d={storyPath}
              fill="none"
              stroke="url(#storyGradientGlow)"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ willChange: 'stroke-dashoffset, transform' }}
            />
            <path
              ref={pathRef}
              d={storyPath}
              fill="none"
              stroke="url(#storyGradientMain)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#storyImageMask)"
              style={{ willChange: 'stroke-dashoffset, transform' }}
            />
          </svg>
        </div>

        <div className="hstory-grain absolute inset-0 z-3 pointer-events-none" />

        <div
          ref={trackRef}
          className="hstory-track relative z-4 flex h-full"
          style={{ width: `${trackWidthVw}vw` }}
        >
          {PANELS.map((panel, i) => (
            <div key={i} className={`hstory-panel hstory-panel-${i}`}>
              <div
                className={`hstory-shape hstory-shape-${i}`}
                style={{
                  background: panel.shape.bg,
                  width: panel.shape.size,
                  height: panel.shape.size,
                  left: panel.shape.x,
                  top: panel.shape.y,
                  transform: 'translate3d(-50%, -50%, 0)',
                  filter: 'blur(80px)',
                }}
              />

              <div
                className={`hstory-image-wrap hstory-img-${i}`}
                style={{
                  right: '6vw',
                  bottom: '8vh',
                  width: 'clamp(180px, 22vw, 320px)',
                  height: 'clamp(240px, 30vh, 400px)',
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
                {counterLabel(i)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
