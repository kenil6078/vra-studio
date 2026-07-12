import React from 'react'

const About = () => {
  return (
    <div className="relative min-h-screen pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mx-auto text-center space-y-8 animate-fade-rise">
        <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
          Our Vision
        </span>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.0] tracking-tight font-display"
        >
          Our <em className="not-italic text-muted-foreground">Philosophy</em>
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          We believe in silence over noise, intent over accident, and focus over fragmentation.
          Velorah is a laboratory for digital clarity. We forge tools, interfaces, and spaces
          that respect human cognitive limits while expanding creative freedom.
        </p>

        {/* Philosophy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 text-left">
          <div className="liquid-glass rounded-3xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-all duration-500 group cursor-default">
            <div className="p-6 md:p-8 space-y-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-500 font-mono">
                01
              </div>
              <h3 className="text-xl font-medium tracking-wide">Silent Design</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interfaces that step aside and let your thoughts speak. Minimal UI, maximal utility.
              </p>
            </div>
          </div>

          <div className="liquid-glass rounded-3xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-all duration-500 group cursor-default">
            <div className="p-6 md:p-8 space-y-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-500 font-mono">
                02
              </div>
              <h3 className="text-xl font-medium tracking-wide">Fluid Movement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Subtle interactions, WebGL animations, and seamless transitions engineered with precise performance.
              </p>
            </div>
          </div>

          <div className="liquid-glass rounded-3xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-all duration-500 group cursor-default">
            <div className="p-6 md:p-8 space-y-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs border border-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-500 font-mono">
                03
              </div>
              <h3 className="text-xl font-medium tracking-wide">Pure Geometry</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bold typography contrasted against grid alignment. Clean structures reflecting deep focus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
