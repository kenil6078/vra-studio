/**
 * TypographyStoryScroll.jsx
 * ─────────────────────────────────────────────────────────────
 * Full-screen, scroll-linked editorial typography section.
 * "Snake Moving" effect:
 * 1. Words follow an S-Curve (snake) motion path.
 * 2. Words share the exact same path and speed but are staggered.
 * 3. ZERO vertical gaps: Tightly packed stacking.
 * 4. Text remains strictly horizontal (no rotation).
 *
 * Stack: React 19 · GSAP 3.15+ · ScrollTrigger · MotionPathPlugin
 * ─────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const LEFT_PATH = [
  { x: 0.1, y: 1.15 },
  { x: 0.25, y: 0.85 },
  { x: 0.02, y: 0.5 },
  { x: 0.25, y: 0.15 },
  { x: 0.1, y: -0.2 },
];

const RIGHT_PATH = [
  { x: 0.9, y: 1.15 },
  { x: 0.75, y: 0.85 },
  { x: 0.98, y: 0.5 },
  { x: 0.75, y: 0.15 },
  { x: 0.9, y: -0.2 },
];

const DUR = 1.0;
const GAP = 0.045;
const TINY_GAP = 0.06;

const LEFT_WORDS = [
  { text: "CORE-SITE", depth: "bg" },
  { text: "GEN-AI VISUAL", depth: "mid" },
  { text: "( 動態流動 )", depth: "accent" },
  { text: "WEBGL REALM", depth: "bg" },
  { text: "3D MATRIX", depth: "mid" },
  { text: "INTERACTION", depth: "bg" },
  { text: "PIXEL PERFECT", depth: "bg" },
  { text: "LOGIC BUILD", depth: "mid" },
  { text: "FLUID UI", depth: "bg" },
  { text: "AERO DESIGN", depth: "bg" },
].map((w, i) => ({ ...w, start: i * GAP, dur: DUR, path: LEFT_PATH }));

const RIGHT_WORDS = [
  { text: "STRATEGY", depth: "mid" },
  { text: "DESIGN", depth: "mid" },
  { text: "( 技術 )", depth: "accent" },
  { text: "CREATIVE", depth: "mid" },
  { text: "MOTION", depth: "bg" },
  { text: "BRAND", depth: "bg" },
  { text: "FUTURE", depth: "bg" },
  { text: "VISION", depth: "mid" },
  { text: "SYSTEM", depth: "bg" },
  { text: "LABS", depth: "bg" },
].map((w, i) => ({ ...w, start: i * GAP, dur: DUR, path: RIGHT_PATH }));

const TINY_LIST_WORDS = [
  { text: "MOTION DESIGN" },
  { text: "MICRO INTERACTIONS" },
  { text: "TYPE SYSTEM" },
  { text: "CREATIVE DIRECTION" },
  { text: "設計語言" }
].map((w, i) => ({ ...w, start: 0.1 + (i * TINY_GAP), dur: DUR }));

const ALL_WORDS = [...LEFT_WORDS, ...RIGHT_WORDS];

const DEPTH_STYLE = {
  bg: { opacityMax: 0.25 },
  mid: { opacityMax: 0.6 },
  accent: { opacityMax: 1.0 },
};

const DEFAULT_IMAGES = [
  { src: "https://images.unsplash.com/photo-1783696630612-285f89e9945b?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "HELLO" },
  { src: "https://images.unsplash.com/photo-1621793280883-0bddbdc87ef3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "HOW" },
  { src: "https://images.unsplash.com/photo-1711735346428-0ceae7ddb5ae?q=80&w=626&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "ARE" },
  { src: "https://images.unsplash.com/photo-1613328007570-379c5b22317d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "YOU" },
  { src: "https://images.unsplash.com/photo-1650294534252-9b0e0d18ab06?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "WELCOME TO MY STUDIO" }
];

function Chars({ text }) {
  return text.split("").map((ch, i) => (
    <span className="tss-char-mask" key={i}>
      <span className="tss-char-inner" data-char>
        {ch === " " ? "\u00A0" : ch}
      </span>
    </span>
  ));
}

export default function TypographyStoryScroll({
  scrollLength = "450vh",
  className = "",
  images = null,
  imageCaption = null,
}) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const wordRefs = useRef([]);
  const tinyWordRefs = useRef([]);
  const imgWrapRef = useRef(null);
  const slideRefs = useRef([]);
  const captionTextRefs = useRef([]);

  const slides = (images && images.length > 0 ? images : DEFAULT_IMAGES).map(
    (img, i) => ({
      src: img.src || img,
      caption: img.caption || imageCaption || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length].caption,
    })
  );

  useEffect(() => {
    const stage = stageRef.current;
    let master = null;
    let st = null;

    const buildTimeline = () => {
      if (master) master.kill();
      if (st) st.kill();

      const rect = stage.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      master = gsap.timeline({ paused: true });

      // ── 1. Floating Snake Path Typography Loop ──
      wordRefs.current.forEach((entry) => {
        if (!entry) return;
        const { el, cfg } = entry;
        const chars = el.querySelectorAll("[data-char]");
        const { opacityMax } = DEPTH_STYLE[cfg.depth];

        const pts = cfg.path.map((p) => ({ x: p.x * W, y: p.y * H }));

        gsap.set(el, { x: pts[0].x, y: pts[0].y, opacity: 0 });
        gsap.set(chars, { yPercent: 100, autoAlpha: 0 });

        const wordStart = cfg.start;
        const wordDur = cfg.dur;

        master.to(
          el,
          {
            motionPath: { path: pts, curviness: 1.5, autoRotate: false },
            duration: wordDur,
            ease: "none",
          },
          wordStart
        );

        master
          .fromTo(el, { opacity: 0 }, { opacity: opacityMax, duration: wordDur * 0.15, ease: "power2.out" }, wordStart)
          .to(el, { opacity: 0, duration: wordDur * 0.15, ease: "power2.in" }, wordStart + wordDur - wordDur * 0.15);

        master.fromTo(
          chars,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: wordDur * 0.15, ease: "power3.out", stagger: { each: 0.005, from: "start" } },
          wordStart
        );
        master.to(
          chars,
          { yPercent: -100, autoAlpha: 0, duration: wordDur * 0.15, ease: "power2.in", stagger: { each: 0.005, from: "start" } },
          wordStart + wordDur - wordDur * 0.15
        );
      });

      // ── 2. SVG-linked Snake Motion for Tiny Technical List Text ──
      tinyWordRefs.current.forEach((entry) => {
        if (!entry) return;
        const { el, cfg } = entry;

        master.to(
          el,
          {
            motionPath: {
              path: "#tss-tiny-snake-path",
              autoRotate: false,
              align: "#tss-tiny-snake-path",
              alignOrigin: [0.5, 0.5]
            },
            duration: cfg.dur,
            ease: "none"
          },
          cfg.start
        );

        master.fromTo(
          el,
          { opacity: 0 },
          { opacity: 0.65, duration: cfg.dur * 0.2, ease: "power1.out" },
          cfg.start
        );
        master.to(
          el,
          { opacity: 0, duration: cfg.dur * 0.2, ease: "power1.in" },
          cfg.start + cfg.dur - (cfg.dur * 0.2)
        );
      });

      // ── 3. Premium Vertical Staggered Slide Reveals with Dynamic Exits ──
      if (imgWrapRef.current && slideRefs.current.length) {
        gsap.set(imgWrapRef.current, { opacity: 0, y: 50 });
        master.fromTo(imgWrapRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08, ease: "power3.out" }, 0.02);
        master.to(imgWrapRef.current, { opacity: 0, scale: 0.9, y: -60, duration: 0.08, ease: "power3.in" }, 0.92);

        const slideCount = slideRefs.current.length;
        const slideshowStart = 0.06;
        const slideshowEnd = 0.88;
        const slideshowSpan = slideshowEnd - slideshowStart;
        const perSlide = slideshowSpan / slideCount;

        const transitionDur = perSlide * 0.75;

        slideRefs.current.forEach((slideEl, i) => {
          if (!slideEl) return;
          const imgEl = slideEl.querySelector("[data-slide-img]");
          const captionEl = captionTextRefs.current[i];
          const slideStart = slideshowStart + i * perSlide;

          if (i === 0) {
            gsap.set(slideEl, { yPercent: 0, autoAlpha: 1, scale: 1, opacity: 1 });
            if (imgEl) gsap.set(imgEl, { scale: 1 });
            if (captionEl) gsap.set(captionEl, { autoAlpha: 1 });
          } else {
            gsap.set(slideEl, { yPercent: 140, autoAlpha: 0, scale: 1.05, opacity: 0 });
            if (captionEl) gsap.set(captionEl, { autoAlpha: 0 });
          }

          if (i > 0) {
            master.fromTo(
              slideEl,
              { yPercent: 140, autoAlpha: 0, scale: 1.05, opacity: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                scale: 1,
                opacity: 1,
                duration: transitionDur,
                ease: "power4.out"
              },
              slideStart
            );

            if (captionEl) {
              master.fromTo(
                captionEl,
                { autoAlpha: 0, scale: 0.9 },
                { autoAlpha: 1, scale: 1, duration: transitionDur * 0.4, ease: "back.out(1.5)" },
                slideStart + transitionDur * 0.4
              );
            }
          }

          const nextStart = slideStart + perSlide;

          if (i < slideCount - 1) {
            const nextSlideEl = slideRefs.current[i];
            const nextImgEl = nextSlideEl?.querySelector("[data-slide-img]");
            const nextCaptionEl = captionTextRefs.current[i];

            if (nextSlideEl) {
              master.to(
                nextSlideEl,
                {
                  yPercent: -60,
                  scale: 0.85,
                  opacity: 0,
                  duration: transitionDur,
                  ease: "power3.inOut"
                },
                nextStart
              );
            }

            if (nextImgEl) {
              master.to(nextImgEl, { scale: 1.1, duration: transitionDur, ease: "power3.inOut" }, nextStart);
            }

            if (nextCaptionEl) {
              master.to(nextCaptionEl, { autoAlpha: 0, duration: transitionDur * 0.3 }, nextStart);
            }
          }
        });
      }

      st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        animation: master,
        invalidateOnRefresh: true,
      });
    };

    buildTimeline();
    let resizeTO;
    const onResize = () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(buildTimeline, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTO);
      if (st) st.kill();
      if (master) master.kill();
    };
  }, [slides.length]);

  return (
    <section ref={rootRef} className={`tss-root ${className}`} style={{ height: scrollLength }}>
      <div className="tss-stage" ref={stageRef}>
        {/* Top Nav Pill */}
        <div className="tss-nav">
          <svg className="tss-nav-icon" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <svg className="tss-nav-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4h3l7 16h-3z" />
            <path d="M18 4h-3L8 20h3z" opacity="0.7" />
          </svg>
          <svg className="tss-nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M4 10h16M4 14h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Dynamic Eyebrow Group */}
        <div className="tss-eyebrow-group">
          <span className="tss-eyebrow-left">核點創意</span>
          <div className="tss-eyebrow-center">
            <span className="tss-eyebrow-title">VISUAL STRATEGY</span>
            <span className="tss-eyebrow-subtitle">（ 守護美學核心・定義數位熱點 ）</span>
          </div>
          <span className="tss-eyebrow-right">BRAND IDENTITY</span>
        </div>

        {/* Invisible SVG path container guiding our technical small text track */}
        <svg className="tss-hidden-vector-track" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            id="tss-tiny-snake-path"
            d="M 80,110 Q 65,80 82,50 Q 95,20 75,-10"
            fill="none"
          />
        </svg>

        {/* Dynamic Technical Word Field (Animate-on-scroll list) */}
        <div className="tss-tiny-moving-field">
          {TINY_LIST_WORDS.map((cfg, i) => (
            <span
              key={i + cfg.text}
              className="tss-tiny-moving-item"
              ref={(el) => { if (el) tinyWordRefs.current[i] = { el, cfg }; }}
            >
              {cfg.text}
            </span>
          ))}
        </div>

        {/* Dotted Line Divider (Left) */}
        <div className="tss-dotted-line">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        {/* HTML Word Field */}
        <div className="tss-field">
          {ALL_WORDS.map((cfg, i) => (
            <div
              key={i + cfg.text}
              className={`tss-word tss-${cfg.depth}`}
              data-depth={cfg.depth}
              ref={(el) => { if (el) wordRefs.current[i] = { el, cfg }; }}
            >
              <Chars text={cfg.text} />
            </div>
          ))}
        </div>

        {/* UNMASKED IMAGE STACK VIEWFIELD */}
        <div className="tss-image-wrap" ref={imgWrapRef}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className="tss-slide-card"
              ref={(el) => { if (el) slideRefs.current[i] = el; }}
              style={{ zIndex: i + 1 }}
            >
              <img
                src={slide.src}
                alt=""
                className="tss-image-element"
                data-slide-img
              />

              <svg
                className="tss-image-caption-svg"
                viewBox="0 0 320 120"
                preserveAspectRatio="xMidYMid meet"
                ref={(el) => { if (el) captionTextRefs.current[i] = el; }}
              >
                <path
                  id={`tss-arc-${i}`}
                  d="M 20,70 Q 160,25 300,70"
                  fill="none"
                />
                <text className="tss-image-caption-text">
                  <textPath
                    href={`#tss-arc-${i}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {slide.caption}
                  </textPath>
                </text>
              </svg>
            </div>
          ))}
        </div>

        {/* Bottom Left Logo */}
        <div className="tss-dot-logo">
          <svg viewBox="0 0 40 60" fill="currentColor">
            <circle cx="8" cy="8" r="4" /><circle cx="8" cy="20" r="4" /><circle cx="8" cy="32" r="4" /><circle cx="8" cy="44" r="4" /><circle cx="8" cy="56" r="4" />
            <circle cx="20" cy="20" r="4" /><circle cx="20" cy="44" r="4" />
            <circle cx="32" cy="8" r="4" /><circle cx="32" cy="20" r="4" /><circle cx="32" cy="32" r="4" /><circle cx="32" cy="44" r="4" /><circle cx="32" cy="56" r="4" />
          </svg>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="tss-scrollcue">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 8l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            <path d="M6 14l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" opacity="0.5" />
          </svg>
          <span>DOWN</span>
        </div>
      </div>

      <style>{`
        .tss-root { 
          position: relative; 
          width: 100%; 
          background: transparent;
        }

        .tss-stage {
          position: relative; 
          width: 100%; 
          height: 100vh;
          overflow: hidden; 
          color: #f5f3ee;
        }

        /* --- UI Chrome --- */
        .tss-nav {
          position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 40px;
          padding: 12px 24px; border-radius: 4px;
          background: rgba(255, 255, 255, 0.08); 
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 40;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .tss-nav-icon { width: 16px; height: 16px; color: #f5f3ee; }
        .tss-nav-logo { width: 20px; height: 20px; color: #f5f3ee; }

        .tss-eyebrow-group {
          position: absolute; top: 18%; width: 100%;
          display: flex; justify-content: center; align-items: flex-start;
          font-family: "Helvetica Neue", Arial, sans-serif;
          z-index: 35; font-size: 0.75rem; letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.5);
        }
        .tss-eyebrow-left { position: absolute; left: 35%; top: 10px; }
        .tss-eyebrow-right { position: absolute; right: 35%; top: -10px; }
        .tss-eyebrow-center { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .tss-eyebrow-title { font-size: 0.85rem; letter-spacing: 0.12em; color: rgba(255, 255, 255, 0.7); }
        .tss-eyebrow-subtitle { font-size: 0.7rem; letter-spacing: 0.05em; }

        /* Hidden vector track layout for absolute path references */
        .tss-hidden-vector-track {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          visibility: hidden;
        }

        /* Moving fields layout for the technical text specifications */
        .tss-tiny-moving-field {
          position: absolute;
          inset: 0;
          z-index: 36;
          pointer-events: none;
        }

        .tss-tiny-moving-item {
          position: absolute;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          letter-spacing: 0.06em;
          text-align: left;
          will-change: transform, opacity;
        }
        
        .tss-dotted-line {
          position: absolute; left: 32%; top: 60%;
          display: flex; gap: 4px; z-index: 35;
        }
        .tss-dotted-line span { width: 3px; height: 3px; background: rgba(255,255,255,0.7); border-radius: 50%; }

        /* --- GSAP Word Field --- */
        .tss-field { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
        .tss-word {
          position: absolute; top: 0; left: 0;
          display: inline-flex; white-space: nowrap;
          font-family: "Helvetica Neue", Arial, sans-serif;
          pointer-events: none;
          line-height: 1; 
          will-change: transform, opacity;
        }

        .tss-bg { font-size: clamp(1.2rem, 2.5vw, 2rem); font-weight: 400; color: rgba(255,255,255,0.7); }
        .tss-mid { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 500; color: rgba(255,255,255,0.85); }
        .tss-accent { font-size: clamp(2rem, 4vw, 3rem); font-weight: 600; color: #ffffff; }

        .tss-char-mask { display: inline-block; overflow: hidden; line-height: 1; }
        .tss-char-inner { display: inline-block; transform-origin: 50% 100%; }

        /* --- LAYERED STACK ELEMENT LAYOUT --- */
        .tss-image-wrap {
          position: absolute; 
          inset: 0; 
          display: flex;
          align-items: center; 
          justify-content: center;
          z-index: 2; 
          pointer-events: none;
          overflow: visible;
        }

        .tss-slide-card {
          position: absolute; 
          width: 290px; 
          aspect-ratio: 3 / 4;
          border-radius: 28px;
          box-shadow: 0 35px 80px rgba(0,0,0,0.5);
          will-change: transform, opacity;
          overflow: hidden;
          background: #151515;
        }

        .tss-image-element {
          width: 100%; 
          height: 100%;
          object-fit: cover;
          display: block;
          will-change: transform;
        }

        .tss-image-caption-svg {
          position: absolute; 
          top: 55%; 
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%; 
          height: auto;
          pointer-events: none;
          overflow: visible;
          z-index: 5;
        }
        .tss-image-caption-text {
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.08em;
          fill: #54a0ff;
        }
        .tss-image-caption-text textPath { dominant-baseline: middle; }

        .tss-slide-card::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* --- Footer Elements --- */
        .tss-dot-logo { position: absolute; left: 40px; bottom: 40px; width: 40px; height: 60px; color: #ffffff; z-index: 45; }
        .tss-scrollcue {
          position: absolute; left: 50%; bottom: 30px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: #ffffff; z-index: 45;
        }
        .tss-scrollcue svg { width: 24px; height: 24px; }
        .tss-scrollcue span { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; font-weight: 500; }

        @media (max-width: 860px) {
          .tss-eyebrow-group, .tss-dotted-line { display: none; }
          .tss-tiny-moving-item { font-size: 0.55rem; }
          .tss-slide-card { width: 210px; }
          .tss-bg { font-size: 1rem; }
          .tss-mid { font-size: 1.4rem; }
          .tss-accent { font-size: 1.6rem; }
          .tss-image-caption-text { font-size: 11px; }
        }
      `}</style>
    </section>
  );
}