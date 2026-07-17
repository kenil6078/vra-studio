import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// --- HERO-SIZED GEOMETRY ---
// Giant intertwining infinity loops scaled for a 1920x1080 viewport.
const PATHS = {
    // Top Vine: Starts center, loops UP, crosses DOWN, loops back to center.
    path1: "M -200 540 C 200 540, 200 140, 600 140 C 1000 140, 1000 540, 600 540 C 200 540, 200 940, 600 940 C 1000 940, 1000 540, 1400 540 C 1800 540, 1800 140, 2200 140 C 2600 140, 2600 540, 2200 540 C 1800 540, 1800 940, 2200 940 C 2600 940, 2600 540, 3000 540 C 3400 540, 3400 140, 3800 140 C 4200 140, 4200 540, 3800 540 C 3400 540, 3400 940, 3800 940 C 4200 940, 4200 540, 4600 540",

    // Bottom Vine: Mirrored perfectly to create the braided/mandala core effect.
    path2: "M -200 540 C 200 540, 200 940, 600 940 C 1000 940, 1000 540, 600 540 C 200 540, 200 140, 600 140 C 1000 140, 1000 540, 1400 540 C 1800 540, 1800 940, 2200 940 C 2600 940, 2600 540, 2200 540 C 1800 540, 1800 140, 2200 140 C 2600 140, 2600 540, 3000 540 C 3400 540, 3400 940, 3800 940 C 4200 940, 4200 540, 3800 540 C 3400 540, 3400 140, 3800 140 C 4200 140, 4200 540, 4600 540"
};

// Swapped the floral separator for a digital/pixel block (■) to match the Doto font.
const TEXT_DATA = {
    top: "GEN-AI VISUAL ■ 3D MATRIX ■ FLUID UI ■ PIXEL PERFECT ■ VISUAL STRATEGY ■ ".repeat(8),
    bottom: "CORE-SITE ■ LOGIC BUILD ■ CREATIVE DIRECTION ■ MOTION ■ TYPE SYSTEM ■ ".repeat(8)
};

export default function HeroPixelTypography() {
    const sectionRef = useRef(null);
    const textPathTopRef = useRef(null);
    const textPathBottomRef = useRef(null);

    const charsTopRef = useRef([]);
    const charsBottomRef = useRef([]);

    // Char-by-Char split for GSAP entrance animation
    const renderSplitText = (text, refArray) => {
        return text.split('').map((char, index) => (
            <tspan
                key={index}
                ref={(el) => (refArray[index] = el)}
                className="pixel-char"
                style={{ opacity: 0 }} // Hidden until GSAP fires the decoding entrance
            >
                {char === ' ' ? '\u00A0' : char}
            </tspan>
        ));
    };

    useEffect(() => {
        // 1. Initialize Lenis Smooth Scrolling
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        lenis.on('scroll', ScrollTrigger.update);
        const raf = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0, 0);

        const ctx = gsap.context(() => {

            // 2. Pixel "Decode" Entrance Animation
            gsap.to(charsTopRef.current, {
                opacity: 1,
                duration: 0.15,
                stagger: 0.01, // Very fast stagger for a digital feel
                ease: "none",
                delay: 0.2
            });

            gsap.to(charsBottomRef.current, {
                opacity: 0.4, // Faded lower layer for visual 3D depth
                duration: 0.15,
                stagger: 0.01,
                ease: "none",
                delay: 0.6
            });

            // 3. Intricate Scroll Pinning & Scrubbing
            if (textPathTopRef.current && textPathBottomRef.current) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=300%", // Pin the hero for a substantial scroll distance
                        pin: true,
                        scrub: 1.5, // Smooth interpolation
                    }
                });

                // Top strand weaves rapidly through the giant loops
                tl.fromTo(textPathTopRef.current,
                    { attr: { startOffset: "0%" } },
                    { attr: { startOffset: "-60%" }, ease: "none" },
                    0
                );

                // Bottom strand weaves backward
                tl.fromTo(textPathBottomRef.current,
                    { attr: { startOffset: "-60%" } },
                    { attr: { startOffset: "0%" }, ease: "none" },
                    0
                );
            }
        }, sectionRef);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(raf);
            ctx.revert();
        };
    }, []);

    return (
        <>
            <style>{`
        /* Import the exact requested fonts */
        @import url('https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=New+Rocker&display=swap');
        
        .font-pixel {
          font-family: 'Doto', sans-serif;
          letter-spacing: 0.15em; /* Extra spacing highlights the pixel look */
          text-transform: uppercase;
        }
        
        .pixel-char {
          will-change: opacity, fill;
          transition: fill 0.2s ease, text-shadow 0.2s ease;
          fill: currentColor;
        }
        
        /* Interactive Digital Glow */
        text:hover .pixel-char {
          fill: #f97316; /* Orange brand color */
          text-shadow: 0px 0px 10px #f97316;
        }
      `}</style>

            {/* Hero Section Container */}
            <section
                ref={sectionRef}
                className="relative w-full h-screen bg-transparent overflow-hidden flex items-center justify-center text-inherit"
            >
                {/* Massive viewBox (1920x1080) to cover the entire screen elegantly */}
                <svg
                    className="w-full h-full pointer-events-auto"
                    viewBox="0 0 1920 1080"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <path id="hero-path-1" d={PATHS.path1} />
                        <path id="hero-path-2" d={PATHS.path2} />
                    </defs>

                    {/* Render Text on the Giant Ornamental Paths */}
                    <text className="font-pixel font-bold" fontSize="72">
                        <textPath
                            ref={textPathTopRef}
                            href="#hero-path-1"
                            startOffset="0%"
                            alignmentBaseline="middle"
                        >
                            {renderSplitText(TEXT_DATA.top, charsTopRef.current)}
                        </textPath>
                    </text>

                    <text className="font-pixel font-bold" fontSize="56">
                        <textPath
                            ref={textPathBottomRef}
                            href="#hero-path-2"
                            startOffset="0%"
                            alignmentBaseline="middle"
                        >
                            {renderSplitText(TEXT_DATA.bottom, charsBottomRef.current)}
                        </textPath>
                    </text>
                </svg>
            </section>
        </>
    );
}