/**
 * TypographyStoryScroll.jsx
 * ─────────────────────────────────────────────────────────────
 * Full-screen, scroll-linked editorial typography section.
 * CORRECTED for "Snake Moving" effect:
 * 1. Words follow an S-Curve (snake) motion path.
 * 2. Words share the exact same path and speed but are staggered
 *    in time, making them travel like connected train cars.
 * 3. ZERO vertical gaps: Tightly packed stacking.
 * 4. Text remains strictly horizontal (no rotation).
 *
 * MODIFIED: Background made fully transparent and black UI accents removed.
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

const ALL_WORDS = [...LEFT_WORDS, ...RIGHT_WORDS];

const DEPTH_STYLE = {
  bg: { opacityMax: 0.25 },
  mid: { opacityMax: 0.6 },
  accent: { opacityMax: 1.0 },
};

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
  scrollLength = "300vh",
  className = "",
  imageSrc = null,
  imageCaption = "( 品牌策略導向 )",
}) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const wordRefs = useRef([]);
  const imgRef = useRef(null);

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
          wordStart,
        );

        master
          .fromTo(
            el,
            { opacity: 0 },
            {
              opacity: opacityMax,
              duration: wordDur * 0.15,
              ease: "power2.out",
            },
            wordStart,
          )
          .to(
            el,
            { opacity: 0, duration: wordDur * 0.15, ease: "power2.in" },
            wordStart + wordDur - wordDur * 0.15,
          );

        master.fromTo(
          chars,
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: wordDur * 0.15,
            ease: "power3.out",
            stagger: { each: 0.005, from: "start" },
          },
          wordStart,
        );
        master.to(
          chars,
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: wordDur * 0.15,
            ease: "power2.in",
            stagger: { each: 0.005, from: "start" },
          },
          wordStart + wordDur - wordDur * 0.15,
        );
      });

      if (imgRef.current) {
        gsap.set(imgRef.current, { opacity: 0, scale: 0.96 });
        master.fromTo(
          imgRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
          0,
        );
        master.to(
          imgRef.current,
          { scale: 1.03, duration: 0.7, ease: "sine.inOut" },
          0.3,
        );
      }

      st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
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
  }, []);

  return (
    <section
      ref={rootRef}
      className={`tss-root ${className}`}
      style={{ height: scrollLength }}
    >
      <div className="tss-stage" ref={stageRef}>
        {/* Top Nav Pill */}
        <div className="tss-nav">
          <svg className="tss-nav-icon" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="6"
              width="18"
              height="12"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <svg className="tss-nav-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4h3l7 16h-3z" />
            <path d="M18 4h-3L8 20h3z" opacity="0.7" />
          </svg>
          <svg className="tss-nav-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 10h16M4 14h16"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Dynamic Eyebrow Group */}
        <div className="tss-eyebrow-group">
          <span className="tss-eyebrow-left">核點創意</span>
          <div className="tss-eyebrow-center">
            <span className="tss-eyebrow-title">VISUAL STRATEGY</span>
            <span className="tss-eyebrow-subtitle">
              （ 守護美學核心・定義數位熱點 ）
            </span>
          </div>
          <span className="tss-eyebrow-right">BRAND IDENTITY</span>
        </div>

        {/* Small Fixed Tech List on Right */}
        <div className="tss-tiny-list">
          <span>MOTION DESIGN</span>
          <span>MICRO INTERACTIONS</span>
          <span>TYPE SYSTEM</span>
          <span>CREATIVE DIRECTION</span>
          <span>設計語言</span>
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
              ref={(el) => {
                if (el) wordRefs.current[i] = { el, cfg };
              }}
            >
              <Chars text={cfg.text} />
            </div>
          ))}
        </div>

        {/* Centered Image */}
        <div className="tss-image-wrap">
          <div className="tss-image" ref={imgRef}>
            {imageSrc ? (
              <img src={imageSrc} alt="" className="tss-image-img" />
            ) : (
              <div className="tss-image-placeholder" />
            )}
            <span className="tss-image-caption">{imageCaption}</span>
          </div>
        </div>

        {/* Bottom Left "N" Dot Logo */}
        <div className="tss-dot-logo">
          <svg viewBox="0 0 40 60" fill="currentColor">
            <circle cx="8" cy="8" r="4" />
            <circle cx="8" cy="20" r="4" />
            <circle cx="8" cy="32" r="4" />
            <circle cx="8" cy="44" r="4" />
            <circle cx="8" cy="56" r="4" />
            <circle cx="20" cy="20" r="4" />
            <circle cx="20" cy="44" r="4" />
            <circle cx="32" cy="8" r="4" />
            <circle cx="32" cy="20" r="4" />
            <circle cx="32" cy="32" r="4" />
            <circle cx="32" cy="44" r="4" />
            <circle cx="32" cy="56" r="4" />
          </svg>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="tss-scrollcue">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 8l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              d="M6 14l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              opacity="0.5"
            />
          </svg>
          <span>DOWN</span>
        </div>
      </div>

      <style>{`
        .tss-root { 
          position: relative; 
          width: 100%; 
          /* REMOVED: Dark radial gradient background */
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
          /* CHANGED: Swapped solid #111111 for a sleek frosted transparent glass look */
          background: rgba(255, 255, 255, 0.08); 
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 10;
          /* CHANGED: Lightened shadow profile for transparent blending */
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .tss-nav-icon { width: 16px; height: 16px; color: #f5f3ee; }
        .tss-nav-logo { width: 20px; height: 20px; color: #f5f3ee; }

        .tss-eyebrow-group {
          position: absolute; top: 18%; width: 100%;
          display: flex; justify-content: center; align-items: flex-start;
          font-family: "Helvetica Neue", Arial, sans-serif;
          z-index: 4; font-size: 0.75rem; letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.5);
        }
        .tss-eyebrow-left { position: absolute; left: 35%; top: 10px; }
        .tss-eyebrow-right { position: absolute; right: 35%; top: -10px; }
        .tss-eyebrow-center {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .tss-eyebrow-title { font-size: 0.85rem; letter-spacing: 0.12em; color: rgba(255, 255, 255, 0.7); }
        .tss-eyebrow-subtitle { font-size: 0.7rem; letter-spacing: 0.05em; }

        .tss-tiny-list {
          position: absolute; right: 18%; top: 40%;
          display: flex; flex-direction: column; gap: 6px;
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-size: 0.65rem; color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.05em; z-index: 4; text-align: left;
        }
        
        .tss-dotted-line {
          position: absolute; left: 32%; top: 60%;
          display: flex; gap: 4px; z-index: 4;
        }
        .tss-dotted-line span {
          width: 3px; height: 3px; background: rgba(255,255,255,0.7); border-radius: 50%;
        }

        /* --- GSAP Word Field --- */
        .tss-field { position: absolute; inset: 0; z-index: 2; }
        
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

        /* --- Center Image & Text Overlay --- */
        .tss-image-wrap {
          position: absolute; inset: 0; display: flex;
          align-items: center; justify-content: center;
          z-index: 3; pointer-events: none;
        }
        .tss-image {
          position: relative; width: 320px; aspect-ratio: 4 / 3;
          overflow: hidden; 
          /* CHANGED: Smoothed out the dynamic wrapper overlay shadow */
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .tss-image-img { width: 100%; height: 100%; object-fit: cover; }
        .tss-image-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #f7f1e3 0%, #ff9f43 50%, #ee5253 100%);
        }
        .tss-image-caption {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-size: 1.1rem; font-weight: 500;
          letter-spacing: 0.1em; color: #54a0ff;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          white-space: nowrap;
        }

        /* --- Bottom Left Dot Logo --- */
        .tss-dot-logo {
          position: absolute; left: 40px; bottom: 40px;
          width: 40px; height: 60px; color: #ffffff; z-index: 5;
        }

        /* --- Bottom Scroll Cue --- */
        .tss-scrollcue {
          position: absolute; left: 50%; bottom: 30px;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: #ffffff; z-index: 5;
        }
        .tss-scrollcue svg { width: 24px; height: 24px; }
        .tss-scrollcue span {
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-size: 0.6rem; letter-spacing: 0.15em; font-weight: 500;
        }

        @media (max-width: 860px) {
          .tss-eyebrow-group, .tss-tiny-list, .tss-dotted-line { display: none; }
          .tss-image { width: 240px; }
          .tss-bg { font-size: 1rem; }
          .tss-mid { font-size: 1.4rem; }
          .tss-accent { font-size: 1.6rem; }
        }
      `}</style>
    </section>
  );
}