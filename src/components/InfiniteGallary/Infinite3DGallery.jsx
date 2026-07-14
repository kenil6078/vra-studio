import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ReactLenis, useLenis } from "lenis/react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// ==========================================
// 1. DATA & CONSTANTS
// ==========================================
const WORKING_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
   "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
   "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
];

const GALLERY_DATA = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  url: WORKING_IMAGES[i % WORKING_IMAGES.length],
}));

function wrapValue(val, min, max) {
  const range = max - min;
  return ((((val - min) % range) + range) % range) + min;
}

// ==========================================
// 2. SCROLL INTEGRATION
// ==========================================
function ScrollTracker({ scrollRef, velocityRef }) {
  const prevScroll = useRef(0);

  useLenis(({ scroll }) => {
    const s = scroll * 0.0055;
    scrollRef.current = s;

    const vel = s - prevScroll.current;
    prevScroll.current = s;
    velocityRef.current += (vel - velocityRef.current) * 0.15;
  });
  return null;
}

// ==========================================
// 3. SHADER MATERIAL DEFINITION (FIXED BEND)
// ==========================================
const CardShader = {
  vertexShader: `
    uniform float uBendStrength;
    uniform float uCylinderRadius;
    uniform float uVelocity;
    uniform float uHover;
    uniform float uTime;

    out vec2 vUv;
    out vec3 vViewPosition;
    out float vDepth;
    out vec3 vNormal;
    out vec3 vWorldPos;

    // Gerstner Wave function — produces rolling ocean-style displacement
    // dir: wave propagation direction, steepness: sharpness of crests, wavelength: spatial period
    vec3 gerstnerWave(vec2 dir, float steepness, float wavelength, vec2 p, float t, inout vec3 tangent, inout vec3 binormal) {
      float k = 6.28318 / wavelength; // 2*PI / wavelength
      float c = sqrt(9.8 / k);        // phase speed
      vec2 d = normalize(dir);
      float f = k * (dot(d, p) - c * t);
      float a = steepness / k;         // amplitude

      tangent += vec3(
        -d.x * d.x * steepness * sin(f),
         d.x * steepness * cos(f),
        -d.x * d.y * steepness * sin(f)
      );
      binormal += vec3(
        -d.x * d.y * steepness * sin(f),
         d.y * steepness * cos(f),
        -d.y * d.y * steepness * sin(f)
      );

      return vec3(
        d.x * a * cos(f),
        a * sin(f),
        d.y * a * cos(f)
      );
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Scroll velocity stretch
      pos.z += sin(pos.y * 2.0) * uVelocity * 2.2;

      // === GERSTNER WAVE DISTORTION ON HOVER ===
      vec3 tangent = vec3(1.0, 0.0, 0.0);
      vec3 binormal = vec3(0.0, 0.0, 1.0);
      vec2 wavePos = position.xy * 2.0; // scale position into wave space

      // Smooth flowing river currents and ocean swell wave vectors
      // Wave A: diagonal rolling swell (dir(0.8, 0.6), steepness 0.55, wavelength 2.5)
      vec3 wA = gerstnerWave(vec2(0.8, 0.6), 0.55, 2.5, wavePos, uTime * 1.8, tangent, binormal);
      // Wave B: cross-interference ocean wave (dir(-0.2, 0.9), steepness 0.4, wavelength 1.6)
      vec3 wB = gerstnerWave(vec2(-0.2, 0.9), 0.4, 1.6, wavePos, uTime * 2.2, tangent, binormal);
      // Wave C: high-frequency river ripple (dir(0.5, -0.5), steepness 0.2, wavelength 0.8)
      vec3 wC = gerstnerWave(vec2(0.5, -0.5), 0.2, 0.8, wavePos, uTime * 3.0, tangent, binormal);

      // Distort the entire mesh directly including edges (no edgeMask)
      vec3 totalWave = (wA + wB + wC) * uHover;
      pos += totalWave * 0.28;

      // Compute wave normal for specular highlights across the full card
      vec3 waveNormal = normalize(cross(binormal, tangent));
      vNormal = mix(vec3(0.0, 0.0, 1.0), waveNormal, uHover);

      // Fixed Cylindrical Curve computation
      float theta = pos.x / uCylinderRadius;
      vec3 bentPos = pos;
      bentPos.x = uCylinderRadius * sin(theta);
      bentPos.z = uCylinderRadius * (cos(theta) - 1.0);

      pos = mix(position, bentPos, uBendStrength);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = mvPosition.xyz;
      vDepth = -mvPosition.z;
      vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    uniform float uHover;
    uniform float uTime;
    uniform float uAspect;

    in vec2 vUv;
    in vec3 vViewPosition;
    in float vDepth;
    in vec3 vNormal;
    in vec3 vWorldPos;

    out vec4 fragColor;

    float sdfRoundedBox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    void main() {
      vec2 size = vec2(uAspect, 1.0);
      vec2 p = (vUv - vec2(0.5)) * size;
      float cornerRadius = 0.06;

      float d = sdfRoundedBox(p, size * 0.5, cornerRadius);
      float alpha = smoothstep(0.002, -0.002, d);
      if (alpha < 0.01) discard;

      // Depth-based mipmap blur for far cards
      float blurFactor = clamp((vDepth - 5.5) * 0.1, 0.0, 2.5);
      vec4 texColor = textureLod(uTexture, vUv, blurFactor);

      // Card surface vignette
      float cardVig = smoothstep(0.85, 0.35, length(vUv - vec2(0.5)));
      vec3 col = texColor.rgb * mix(1.0, 0.45, (1.0 - cardVig) * 0.65);

      // === GERSTNER WAVE SPECULAR HIGHLIGHTS ===
      // Compute specular reflection on wave crests (the bright white streaks in the reference)
      vec3 viewDir = normalize(-vViewPosition);
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8)); // top-right key light
      vec3 N = normalize(vNormal);
      vec3 halfVec = normalize(lightDir + viewDir);
      float specular = pow(max(dot(N, halfVec), 0.0), 64.0); // sharp, tight highlights
      // Second light for cross reflections
      vec3 lightDir2 = normalize(vec3(-0.3, 0.8, 0.5));
      vec3 halfVec2 = normalize(lightDir2 + viewDir);
      float specular2 = pow(max(dot(N, halfVec2), 0.0), 48.0);

      float totalSpec = (specular * 0.9 + specular2 * 0.5) * uHover;
      col += vec3(totalSpec);

      // Subtle Fresnel rim glow on wave edges
      float fresnel = pow(1.0 - max(dot(viewDir, N), 0.0), 3.0) * uHover * 0.3;
      col += vec3(fresnel);

      // Gloss highlight (subtle diagonal sweep when not hovered)
      float shineProgress = fract(uTime * 0.12);
      float shine = smoothstep(0.08, 0.0, abs(p.x - p.y * 1.3 - (shineProgress * 4.5 - 2.25)));
      col += vec3(shine * 0.18 * (1.0 - uHover));

      // Hover brightness boost
      col = mix(col, col * 1.15 + vec3(0.06), uHover * 0.35);

      fragColor = vec4(col, uOpacity * alpha);
    }
  `
};

// ==========================================
// 4. IMAGE CARD COMPONENT
// ==========================================
function ImageCard({ data, texture, scrollRef, velocityRef, isMobile, isTablet }) {
  const groupRef = useRef(null);
  const cardMatRef = useRef(null);

  const hoverVal = useRef({ value: 0 });

  const cardUniforms = useMemo(() => ({
    uTexture: { value: texture },
    uOpacity: { value: 0.0 },
    uBendStrength: { value: 1.0 },
    uCylinderRadius: { value: 2.2 }, // Matches tightened curve bounds
    uHover: { value: 0.0 },
    uTime: { value: 0.0 },
    uAspect: { value: data.aspect },
    uVelocity: { value: 0.0 }
  }), [texture, data.aspect]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const scroll = scrollRef.current;
    const velocity = velocityRef.current;

    const yMin = -6.5;
    const yMax = 6.5;
    const H = yMax - yMin;

    const yInitial = yMin + (data.id * (H / 18));
    const yScroll = wrapValue(yInitial + scroll, yMin, yMax);

    // FIXED: Turns increased to exactly 2.0 to create two perfect, visible loops across the layout path
    const turns = 2.0;
    const theta = (yScroll / H) * turns * Math.PI * 2.0;
    const radius = isMobile ? 2.0 : isTablet ? 2.4 : 2.8;

    const xSpiral = radius * Math.cos(theta);
    const ySpiral = yScroll;
    const zSpiral = radius * Math.sin(theta) - 2.5;

    groupRef.current.position.set(xSpiral, ySpiral, zSpiral);
    groupRef.current.rotation.set(0, theta + Math.PI / 2.0, 0);

    // Hover scale boost mechanics
    const h = hoverVal.current.value;
    const baseScale = data.scale * (isMobile ? 0.72 : isTablet ? 0.85 : 0.95);
    const targetScale = baseScale * (1.0 + h * 0.30);
    groupRef.current.scale.set(targetScale, targetScale, 1.0);

    const fadeMargin = 1.2;
    let boundaryOpacity = 1.0;
    if (yScroll < yMin + fadeMargin) {
      boundaryOpacity = (yScroll - yMin) / fadeMargin;
    } else if (yScroll > yMax - fadeMargin) {
      boundaryOpacity = (yMax - yScroll) / fadeMargin;
    }
    boundaryOpacity = Math.max(0.0, Math.min(1.0, boundaryOpacity));

    if (cardMatRef.current) {
      cardMatRef.current.uniforms.uOpacity.value = boundaryOpacity;
      cardMatRef.current.uniforms.uHover.value = h;
      cardMatRef.current.uniforms.uTime.value = time;
      cardMatRef.current.uniforms.uVelocity.value = velocity;
      cardMatRef.current.uniforms.uCylinderRadius.value = radius;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    gsap.to(hoverVal.current, { value: 1.0, duration: 0.6, ease: "power2.out" });
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
    gsap.to(hoverVal.current, { value: 0.0, duration: 0.8, ease: "power2.inOut" });
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <planeGeometry args={[data.width, data.height, 64, 48]} />
        <shaderMaterial
          ref={cardMatRef}
          glslVersion={THREE.GLSL3}
          uniforms={cardUniforms}
          vertexShader={CardShader.vertexShader}
          fragmentShader={CardShader.fragmentShader}
          transparent
          side={THREE.DoubleSide} // FIXED: Forces Three.js to render meshes when rotated backwards
        />
      </mesh>
    </group>
  );
}

// ==========================================
// 5. GALLERY SCENE CONTROLLER
// ==========================================
function GalleryScene({ scrollRef, velocityRef, isMobile, isTablet }) {
  const textures = useTexture(GALLERY_DATA.map((d) => d.url));

  const cards = useMemo(() => {
    return GALLERY_DATA.map((card) => {
      const aspect = 1.35 + (card.id % 3) * 0.1;
      const cardHeight = 1.85;

      return {
        ...card,
        width: cardHeight * aspect,
        height: cardHeight,
        aspect: aspect,
        scale: 0.95 + (card.id % 5) * 0.04,
      };
    });
  }, []);

  useFrame((state) => {
    const targetCamX = state.pointer.x * 1.2;
    const targetCamY = state.pointer.y * 1.2;
    const baseZ = isMobile ? 6.5 : isTablet ? 6.2 : 6.0;

    state.camera.position.x += (targetCamX - state.camera.position.x) * 0.045;
    state.camera.position.y += (targetCamY - state.camera.position.y) * 0.045;
    state.camera.position.z += (baseZ - state.camera.position.z) * 0.045;

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {cards.map((data, i) => (
        <ImageCard
          key={data.id}
          data={data}
          texture={textures[i]}
          scrollRef={scrollRef}
          velocityRef={velocityRef}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      ))}
    </group>
  );
}

// ==========================================
// 6. MAIN GALLERY EXPORT
// ==========================================
export default function Infinite3DGallery() {
  const globalScrollRef = useRef(0);
  const globalVelocityRef = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div className="w-full h-full min-h-screen bg-transparent overflow-hidden relative select-none">
        <ScrollTracker scrollRef={globalScrollRef} velocityRef={globalVelocityRef} />

        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="absolute inset-0 z-10 pointer-events-auto">
          <Canvas
            camera={{ position: [0, 0, 6.0], fov: 40 }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
            }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 15, 5]} intensity={1.2} />
            <pointLight position={[0, 0, 4]} intensity={0.6} />

            <Suspense fallback={null}>
              <GalleryScene
                scrollRef={globalScrollRef}
                velocityRef={globalVelocityRef}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            </Suspense>

            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={0.4} mipmapBlur intensity={0.35} radius={0.6} />
              <Vignette eskil={false} offset={0.12} darkness={1.2} />
            </EffectComposer>
          </Canvas>
        </div>
      </div>
    </ReactLenis>
  );
}