"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Preload } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { useTransitionContext } from "../Transition/TransitionContext";

// ============================================================================
// Slide Data & Textures
// ============================================================================
const SLIDES = [
  {
    image:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260603_103210_011cd963-b5c2-4511-b475-d4b6b0e85805.png&w=1920&q=85",
    title: "DREAMS",
  },
  {
    image:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260701_081051_370f3ba8-678f-4e98-8d04-cbbc22281be6.png&w=1920&q=85",
    title: "SILENCE",
  },
  {
    image:
      "https://xgdzyqfalbibzelpdpvr.supabase.co/storage/v1/object/public/motion-thumbnails/bg-batch2-9.jpg",
    title: "INTENT",
  },
  {
    image:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260622_230307_4c84f036-eb95-493a-babe-1e2158e94de5.png&w=1920&q=85",
    title: "STUDIO",
  },
];

// ============================================================================
// Cinematic Liquid Tear Shader
// ============================================================================
const CinematicMorphShader = {
  uniforms: {
    uTex1: { value: null },
    uTex2: { value: null },
    uProgress: { value: 0.0 },
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uProgress;
    uniform float uTime;
    uniform vec2 uResolution;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x * x0.x  + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      vec2 centeredUV = uv - 0.5;

      float rippleIntensity = sin(uProgress * 3.14159265);

      float waveX = sin(uv.y * 12.0 + uTime * 5.0) * 0.12 * rippleIntensity;
      float waveY = cos(uv.x * 12.0 + uTime * 5.0) * 0.06 * rippleIntensity;

      vec2 waveDisplacement = vec2(waveX, waveY);

      vec2 uv1 = centeredUV * (1.0 - uProgress * 0.1) + 0.5 + waveDisplacement;
      vec2 uv2 = centeredUV * (1.1 - (1.0 - uProgress) * 0.1) + 0.5 + waveDisplacement;

      float sweep = uv.y + uv.x * 0.5;
      float noiseVal = snoise(uv * 4.0 + uTime * 0.25);
      float sweepFront = sweep + (noiseVal * 0.12 + waveX) * rippleIntensity;

      float threshold = mix(1.5, -0.5, uProgress);
      float mask = smoothstep(threshold - 0.15, threshold + 0.15, sweepFront);

      float splitDist = rippleIntensity * 0.012;

      float r1 = texture2D(uTex1, uv1 + vec2(splitDist, 0.0)).r;
      float g1 = texture2D(uTex1, uv1).g;
      float b1 = texture2D(uTex1, uv1 - vec2(splitDist, 0.0)).b;
      vec4 color1 = vec4(r1, g1, b1, 1.0);

      float r2 = texture2D(uTex2, uv2 + vec2(splitDist, 0.0)).r;
      float g2 = texture2D(uTex2, uv2).g;
      float b2 = texture2D(uTex2, uv2 - vec2(splitDist, 0.0)).b;
      vec4 color2 = vec4(r2, g2, b2, 1.0);

      vec4 finalColor = mix(color1, color2, mask);

      float grain = fract(sin(dot(uv, vec2(12.9898, 78.233)) + uTime) * 43758.5453) * 0.02;
      finalColor.rgb -= grain;

      gl_FragColor = finalColor;
    }
  `,
};

// ============================================================================
// 3D Scene Components
// ============================================================================
function Scene({ currentIndex, nextIndex, progressRef }) {
  const { viewport } = useThree();
  const textures = useTexture(SLIDES.map((s) => s.image));
  const materialRef = useRef();
  const meshRef = useRef();

  const shaderArgs = useMemo(() => {
    return {
      uniforms: THREE.UniformsUtils.clone(CinematicMorphShader.uniforms),
      vertexShader: CinematicMorphShader.vertexShader,
      fragmentShader: CinematicMorphShader.fragmentShader,
    };
  }, []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTex1.value = textures[currentIndex];
      materialRef.current.uniforms.uTex2.value = textures[nextIndex];
      materialRef.current.uniforms.uProgress.value = 0;
      progressRef.current.value = 0;
    }
  }, [currentIndex, nextIndex, textures, progressRef]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uProgress.value = progressRef.current.value;
    }

    const intensity = Math.sin(progressRef.current.value * Math.PI);

    state.camera.position.x = Math.sin(time * 0.2) * 0.02;
    state.camera.position.y = Math.cos(time * 0.15) * 0.02;
    state.camera.position.z = THREE.MathUtils.lerp(1, 1.15, intensity);
    state.camera.lookAt(0, 0, 0);

    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + intensity * 0.04);
      meshRef.current.rotation.z = intensity * 0.015;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry
        args={[viewport.width * 1.5, viewport.height * 1.5, 64, 64]}
      />
      <shaderMaterial ref={materialRef} args={[shaderArgs]} transparent />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.05;
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t;
      particlesRef.current.rotation.z = t * 0.5;
    }
  });
  return (
    <points ref={particlesRef}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <pointsMaterial
        color="#ffffff"
        size={0.005}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// Custom Premium Split Text Component
// ============================================================================
const SplitText = ({ text, charClass }) => {
  return (
    <div className="flex justify-center flex-wrap">
      {text.split("").map((char, i) => (
        <div key={i} className="overflow-hidden">
          <span
            className={`${charClass} inline-block transform-gpu origin-bottom opacity-0`}
            style={{ transform: "translateY(120%) rotateX(-90deg)" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// Main Application Component
// ============================================================================
export default function LuxuryHeroEngine() {
  const { lenis } = useTransitionContext();
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const progressRef = useRef({ value: 0 });
  const masterTlRef = useRef(null);
  const holdTimerRef = useRef(null);
  const mountedRef = useRef(true);

  // Timing constants — single source of truth, no more mismatched
  // setInterval vs timeline durations.
  const HOLD_MS = 2600; // how long a slide sits still before transitioning
  const EXIT_DUR = 0.55; // title exit
  const SHADER_DUR = 1.3; // shader morph duration
  const SHADER_OVERLAP = 0.15; // shader starts slightly after exit begins
  const ENTRANCE_DELAY = 0.05; // gap after shader completes before new title enters
  const ENTRANCE_DUR = 1.15; // title entrance

  useEffect(() => {
    mountedRef.current = true;

    // Brand header entrance
    gsap.fromTo(
      ".brand-char",
      { y: "120%", rotationX: -90, opacity: 0 },
      {
        y: "0%",
        rotationX: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.5,
      },
    );

    // Subtitle copy entrance
    gsap.to(".hero-sub", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 1.0,
      ease: "power3.out",
    });

    // CTA button entrance
    gsap.to(".hero-cta", {
      opacity: 1,
      y: 0,
      duration: 1.0,
      delay: 1.4,
      ease: "power3.out",
    });

    // First title entrance (initial mount, index 0)
    gsap.fromTo(
      ".title-char",
      { y: "120%", rotationX: -90, opacity: 0 },
      {
        y: "0%",
        rotationX: 0,
        opacity: 1,
        duration: ENTRANCE_DUR,
        stagger: 0.045,
        ease: "power4.out",
        delay: 0.65,
      },
    );

    scheduleNextTransition();

    return () => {
      mountedRef.current = false;
      clearTimeout(holdTimerRef.current);
      if (masterTlRef.current) masterTlRef.current.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleNextTransition = () => {
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      runTransition();
    }, HOLD_MS);
  };

  const runTransition = () => {
    if (!mountedRef.current) return;
    if (masterTlRef.current) masterTlRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        if (!mountedRef.current) return;
        setIndex((prev) => (prev + 1) % SLIDES.length);
        setNextIndex((prev) => (prev + 1) % SLIDES.length);
        scheduleNextTransition();
      },
    });
    masterTlRef.current = tl;

    // 1. Exit the current title cleanly first.
    tl.to(
      ".title-char",
      {
        y: "-120%",
        rotationX: 90,
        opacity: 0,
        duration: EXIT_DUR,
        stagger: 0.02,
        ease: "power4.in",
      },
      0,
    );

    // 2. Shader morph — starts just before exit finishes so the liquid
    //    sweep and the outgoing letters feel connected, not staggered apart.
    tl.to(
      progressRef.current,
      {
        value: 1.0,
        duration: SHADER_DUR,
        ease: "power2.inOut",
      },
      EXIT_DUR - SHADER_OVERLAP,
    );

    // 3. The React state swap (index/nextIndex) happens in onComplete, right
    //    as the shader finishes — so the new title node mounts exactly when
    //    the background image swap has visually resolved. The entrance
    //    animation for `.title-char` is driven by the index-change effect
    //    below, so it can't fire before the DOM for the new title exists.
  };

  // New title entrance — fires whenever `index` changes (i.e. after the
  // transition timeline swaps slides), fully decoupled from the exit tween
  // so there is no timing collision between the two.
  useEffect(() => {
    const entranceTl = gsap.timeline({ delay: ENTRANCE_DELAY });
    entranceTl.fromTo(
      ".title-char",
      { y: "120%", rotationX: -90, opacity: 0 },
      {
        y: "0%",
        rotationX: 0,
        opacity: 1,
        duration: ENTRANCE_DUR,
        stagger: 0.045,
        ease: "power4.out",
      },
    );
    return () => entranceTl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#050505] text-[#eaeaea] font-body">
      {/* 3D WebGL Background Layer */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 1], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene
              currentIndex={index}
              nextIndex={nextIndex}
              progressRef={progressRef}
            />
            <FloatingParticles />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* Grid Overlay / Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none transition-all">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] mix-blend-multiply" />
      </div>

      {/* HTML UI Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center justify-center mix-blend-overlay">
          <div style={{ perspective: "1000px" }} className="mb-4 md:mb-5 flex items-center justify-center">
            <SplitText
              text="VRA-Studio"
              charClass="brand-char text-[4vw] md:text-[2.2vw] font-normal italic tracking-wider text-white/85 font-display"
            />
            <sup className="text-xs md:text-sm font-sans font-medium text-white/75 ml-1 self-start pt-1.5 md:pt-2">®</sup>
          </div>

          <div style={{ perspective: "1000px" }}>
            <SplitText
              key={index}
              text={SLIDES[index].title}
              charClass="title-char text-[16vw] md:text-[12vw] font-normal italic leading-[0.85] text-white font-display tracking-normal"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center max-w-2xl text-center px-6 pointer-events-auto">
          <p
            className="hero-sub text-white/90 text-sm sm:text-base md:text-lg leading-relaxed opacity-0 transform translate-y-6 font-body font-normal"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
          </p>

          <button
            onClick={() => {
              const target = document.querySelector(".zoom-sticky-wrapper");
              if (target && lenis) {
                lenis.scrollTo(target);
              } else if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="hero-cta liquid-glass rounded-full px-10 py-4.5 text-xs font-bold uppercase tracking-widest text-white mt-8 hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(255,255,255,0.12)] opacity-0 transform translate-y-6"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
          >
            Begin Journey
          </button>
        </div>
      </div>
    </div>
  );
}