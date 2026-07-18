import React from 'react'
import { useTransitionContext } from '../components/Transition/TransitionContext'

const NotFound = () => {
  const { triggerTransition } = useTransitionContext()

  return (
    <div className="relative min-h-screen pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl w-full mx-auto space-y-8 animate-fade-rise">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            Error 404
          </span>
          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.0] tracking-tight font-display"
          >
            Lost in <em className="not-italic text-muted-foreground">Silence</em>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
            The coordinate you requested does not exist or has drifted away from the studio.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => triggerTransition('/')}
            className="liquid-glass rounded-full px-8 py-3.5 text-xs uppercase tracking-widest text-foreground hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer inline-block shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
