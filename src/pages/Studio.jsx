import React from "react";
import Infinite3DGallery from "../components/InfiniteGallary/Infinite3DGallery";

const Studio = () => {
  return (
    // 1. The Scroll Track: 400vh forces a native scrollbar.
    // Lenis reads this scroll data to animate the 3D gallery.
    <main className="relative w-full h-[400vh] bg-transparent selection:bg-white/30 selection:text-white">
      {/* 2. WebGL Canvas Layer: Fixed to viewport, sits at the back (z-0). */}
      {/* pointer-events-auto ensures the canvas receives hover/mouse data. */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Infinite3DGallery />
      </div>

      {/* 3. Premium UI Overlay Layer: Fixed above the gallery (z-10). */}
      {/* pointer-events-none ensures users can click/drag the 3D canvas through the empty gaps. */}
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-end pb-16 md:pb-24 px-6 sm:px-12 md:px-24">
        {/* pointer-events-auto is added strictly to the text area so it can be selected. */}
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pointer-events-auto">
          <div className="lg:col-span-7 space-y-6 animate-fade-rise">
            {/* Glassmorphic Badge */}
            <div className="inline-flex items-center gap-3 bg-white/[0.03] px-4 py-2 rounded-full border border-white/[0.05] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-mono">
                Interactive Exhibition
              </span>
            </div>

            {/* Premium Typography with Mix-Blend to interact with images passing behind it */}
            <h2 className="text-5xl sm:text-7xl md:text-[5rem] font-light leading-[0.95] tracking-tighter text-white mix-blend-difference">
              The <em className="italic text-white/50 font-serif">Studio</em>{" "}
              where <br />
              ideas gain depth.
            </h2>

            {/* Contextual Copy */}
            <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-md font-mono tracking-wide">
              Scroll to navigate the spatial gallery. Hover individual concepts
              to examine texture, scale, and lighting in real-time WebGL.
            </p>
          </div>

          {/* Optional: Right side UI element (e.g., scroll indicator) */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end pb-2">
            <div className="flex flex-col items-center gap-4 opacity-50">
              <span
                className="text-[10px] uppercase tracking-[0.2em] text-white font-mono"
                style={{ writingMode: "vertical-rl" }}
              >
                Scroll
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Studio;
