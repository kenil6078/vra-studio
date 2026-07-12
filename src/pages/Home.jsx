import React, { useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useTransitionContext } from '../components/Transition/TransitionContext'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridDistortion from '../components/GridDistortion/GridDistortion'
import InfiniteMenu from '../components/InfiniteMenu/InfiniteMenu'
import HorizontalStory from '../components/HorizontalStory/HorizontalStory'

gsap.registerPlugin(ScrollTrigger)

const journalItems = [
  {
    image: 'https://picsum.photos/600/600?grayscale&random=1',
    link: '/journal',
    title: 'The Art of Silence',
    description: 'Minimizing cognitive load in interface design.'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=2',
    link: '/journal',
    title: 'WebGL Physics & Attention',
    description: 'Finding the balance in interactive motion.'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=3',
    link: '/journal',
    title: 'Beyond the Flat Screen',
    description: 'How spatial interfaces shape creative concentration.'
  }
]

const Home = () => {
  const navigate = useNavigate()
  const { triggerTransition } = useTransitionContext()
  const mainRef = useRef(null)
  const textRef = useRef(null)
  const revealRef = useRef(null)

  const titleText = "Where dreams rise through the silence."
  const titleWords = titleText.split(' ')

  const subText = "We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work."
  const subTextWords = subText.split(' ')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Title & Paragraph entrance animation (Slide Up into Mask)
      gsap.from(".hero-word", {
        opacity: 0,
        y: "110%",
        rotate: 3,
        stagger: 0.08,
        duration: 1.2,
        ease: "power4.out"
      })

      gsap.from(".hero-sub-word", {
        opacity: 0,
        y: "110%",
        stagger: 0.012,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out"
      })

      gsap.from(".hero-cta", {
        opacity: 0,
        y: 20,
        delay: 1.0,
        duration: 0.8,
        ease: "power3.out"
      })

      // 2. Hero Text Scroll-Linked Exit Mask Effect (Slides Up/Away on scroll)
      gsap.fromTo(".hero-word", {
        y: "0%",
        rotate: 0,
        opacity: 1
      }, {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
        y: "-110%",
        rotate: -3,
        opacity: 0,
        ease: "none",
        immediateRender: false
      })

      gsap.fromTo(".hero-sub-word", {
        y: "0%",
        opacity: 1
      }, {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
        y: "-110%",
        opacity: 0,
        ease: "none",
        immediateRender: false
      })

      // 3. Sticky Scroll-tied Zoom text & Clip-Path reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".zoom-sticky-wrapper",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        }
      })

      tl.fromTo(textRef.current, {
        scale: 1,
        opacity: 1
      }, {
        scale: 75,
        opacity: 0,
        ease: "power2.inOut",
        immediateRender: false
      }, 0)

      tl.fromTo(revealRef.current, {
        clipPath: "circle(0% at 50% 50%)"
      }, {
        clipPath: "circle(120% at 50% 50%)",
        ease: "power2.inOut",
        immediateRender: false,
        onUpdate: function () {
          if (revealRef.current) {
            // Force redraw on every frame to solve browser clip-path reverse scroll repaint glitches
            revealRef.current.style.transform = 'translate3d(0, 0, 0.1px)';
          }
        }
      }, 0)

      // 4. Stagger philosophy grid elements (both text & images)
      gsap.from(".philosophy-item", {
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 75%",
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      })

      // 5. Stagger journal showcase
      gsap.from(".journal-showcase-container", {
        scrollTrigger: {
          trigger: ".journal-section",
          start: "top 70%",
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out"
      })

    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="relative w-full min-h-screen overflow-x-hidden bg-black/10">

      {/* Section 1: Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-7xl mx-auto pt-32 pb-32">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground font-display">
            {titleWords.map((word, index) => (
              <span key={index} className="inline-block overflow-hidden mr-3 md:mr-4 py-1">
                <span className="hero-word inline-block origin-bottom-left">
                  {word === "dreams" || word === "silence." ? (
                    <em className="not-italic text-muted-foreground">{word}</em>
                  ) : (
                    word
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-sub text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
            {subTextWords.map((word, index) => (
              <span key={index} className="inline-block overflow-hidden mr-1.5 py-0.5">
                <span className="hero-sub-word inline-block origin-bottom-left">
                  {word}
                </span>
              </span>
            ))}
          </p>

          <button
            onClick={() => {
              const target = document.querySelector(".zoom-sticky-wrapper");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="hero-cta liquid-glass rounded-full px-12 py-4.5 text-xs uppercase tracking-widest text-foreground mt-12 hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(255,255,255,0.12)]"
          >
            Begin Journey
          </button>
        </div>
      </section>

      {/* Section 2: Sticky Zoom-Through Transition */}
      <div className="zoom-sticky-wrapper">
        <div className="zoom-sticky-container">
          <h2 ref={textRef} className="zoom-text">
            VRA-Studio
          </h2>

          {/* Revealable Section 3 Content inside CSS Circular Clip Path */}
          <div ref={revealRef} className="reveal-content-container">
            <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16">
              <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-6 text-left">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    WebGL Distortion
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.0] tracking-tight font-display text-foreground">
                    Bending reality in <br />
                    <em className="not-italic text-muted-foreground">real-time.</em>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                    Move your cursor over the screen to bend space. We forge WebGL frameworks that respect the physics of interaction.
                  </p>
                  <button
                    onClick={() => triggerTransition('/studio')}
                    className="liquid-glass rounded-full px-8 py-3.5 text-xs uppercase tracking-widest text-foreground hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer inline-block"
                  >
                    Enter Studio
                  </button>
                </div>

                <div className="lg:col-span-7 relative w-full aspect-[4/3] rounded-3xl overflow-hidden liquid-glass border border-white/5 shadow-2xl">
                  <GridDistortion
                    imageSrc="https://picsum.photos/1000/750?grayscale&random=99"
                    grid={20}
                    mouse={0.35}
                    strength={0.15}
                    relaxation={0.9}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Philosophy & Media Grid */}
      <section className="philosophy-section py-32 px-4 sm:px-6 md:px-8 relative z-10 bg-transparent">
        <div className="max-w-5xl w-full mx-auto space-y-20 text-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Our Core philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight font-display">
              We design with <em className="not-italic text-muted-foreground">intent.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {/* Column 1 */}
            <div className="space-y-8">
              <div className="philosophy-item philosophy-card liquid-glass rounded-3xl">
                <div className="p-8 space-y-4">
                  <span className="text-xs text-muted-foreground/60 tracking-wider uppercase font-mono">01 / SILENCE</span>
                  <h3 className="text-2xl font-normal font-display text-foreground">Cognitive Clarity</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We eliminate noise, unnecessary borders, and distracting animation layers. Your workspace should breathe.
                  </p>
                </div>
              </div>

              <div className="philosophy-item relative w-full aspect-[3/4] rounded-3xl overflow-hidden liquid-glass border border-white/5 shadow-xl group">
                <img
                  src="https://picsum.photos/600/800?grayscale&random=15"
                  alt="Minimalist design environment"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-8 md:translate-y-12">
              <div className="philosophy-item relative w-full aspect-[3/4] rounded-3xl overflow-hidden liquid-glass border border-white/5 shadow-xl group">
                <img
                  src="https://picsum.photos/600/800?grayscale&random=16"
                  alt="Abstract tactile texture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="philosophy-item philosophy-card liquid-glass rounded-3xl">
                <div className="p-8 space-y-4">
                  <span className="text-xs text-muted-foreground/60 tracking-wider uppercase font-mono">02 / PHYSICS</span>
                  <h3 className="text-2xl font-normal font-display text-foreground">Tactile Interaction</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We render interfaces that react directly to touch and movement, utilizing WebGL-driven physics grids.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-8">
              <div className="philosophy-item philosophy-card liquid-glass rounded-3xl">
                <div className="p-8 space-y-4">
                  <span className="text-xs text-muted-foreground/60 tracking-wider uppercase font-mono">03 / TYPOGRAPHY</span>
                  <h3 className="text-2xl font-normal font-display text-foreground">Extreme Contrast</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We prioritize functional hierarchy, pairing structured body types with expressive serif headings.
                  </p>
                </div>
              </div>

              <div className="philosophy-item relative w-full aspect-[3/4] rounded-3xl overflow-hidden liquid-glass border border-white/5 shadow-xl group">
                <img
                  src="https://picsum.photos/600/800?grayscale&random=17"
                  alt="Architectural structure contrast"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Journal Showcase */}
      <section className="journal-section py-32 px-4 sm:px-6 md:px-8 relative z-10 bg-transparent">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
              The Journal
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight font-display">
              Interactive <br />
              <em className="not-italic text-muted-foreground">dispatches.</em>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              We write dispatches about design frameworks, minimalist architecture, and motion kinetics. Spin the 3D grid sphere to explore them.
            </p>
            <button
              onClick={() => triggerTransition('/journal')}
              className="liquid-glass rounded-full px-8 py-3.5 text-xs uppercase tracking-widest text-foreground hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer inline-block"
            >
              Browse Journal
            </button>
          </div>

          <div className="lg:col-span-7 journal-showcase-container w-full h-[400px] relative rounded-3xl overflow-hidden liquid-glass border border-white/5 shadow-2xl">
            <InfiniteMenu items={journalItems} scale={0.9} />
          </div>
        </div>
      </section>

      {/* Cinematic Horizontal Storytelling */}
      <HorizontalStory />

    </div>
  )
}

export default Home
