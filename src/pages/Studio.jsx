import React, { useState } from 'react'
import GridDistortion from '../components/GridDistortion/GridDistortion'

const Studio = () => {
  const [grid, setGrid] = useState(22)
  const [mouse, setMouse] = useState(0.38)
  const [strength, setStrength] = useState(0.15)
  const [relaxation, setRelaxation] = useState(0.9)

  const resetParams = () => {
    setGrid(22)
    setMouse(0.38)
    setStrength(0.15)
    setRelaxation(0.9)
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Interactive Controls & Description - occupies 5 cols */}
        <div className="lg:col-span-5 space-y-8 animate-fade-rise">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Interactive Canvas
            </span>
            <h2
              className=" pt-5 text-5xl sm:text-5xl md:text-6xl font-normal leading-[1.0] tracking-tight font-display"
            >
              The <em className="not-italic text-muted-foreground">Studio</em> where ideas distort reality.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Hover, drag, or touch the canvas. Tweak the mathematical formulas below to control how the WebGL grid responds to your presence.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Studio
