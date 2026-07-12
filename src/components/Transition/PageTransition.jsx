import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTransitionContext } from './TransitionContext'

export const PageTransition = () => {
  const {
    isTransitioning,
    screenshot,
    transitionPhase,
    completeExitPhase,
    completeEnterPhase,
  } = useTransitionContext()

  const containerRef = useRef(null)
  const gridRef = useRef(null)
  
  // Balanced grid resolution for smooth horizontal row sliding
  const [grid, setGrid] = useState({ cols: 16, rows: 4 })

  // Determine grid dimensions based on viewport width (responsiveness)
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w >= 1024) {
        setGrid({ cols: 16, rows: 4 })
      } else if (w >= 768) {
        setGrid({ cols: 12, rows: 3 })
      } else {
        setGrid({ cols: 8, rows: 2 })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isTransitioning || !gridRef.current) return

    const cells = gridRef.current.children
    if (cells.length === 0) return

    // Clean up active tweens to prevent memory leaks and frame skips
    gsap.killTweensOf(cells)
    gsap.killTweensOf(containerRef.current)

    if (transitionPhase === 'exit') {
      // ── EXIT PHASE: Horizontal Checkered Row Slide (Left-to-Right & Right-to-Left) ──
      const tl = gsap.timeline({
        onComplete: () => {
          completeExitPhase()
        }
      })

      // Soft container scale pulse
      tl.fromTo(containerRef.current, {
        scale: 1,
      }, {
        scale: 0.98,
        duration: 0.4,
        ease: "power2.inOut",
      }, 0)

      // Animate cells horizontally: alternate rows left-side and right-side close
      tl.fromTo(cells, {
        y: 0, // No vertical movement
        x: (i) => {
          const row = Math.floor(i / grid.cols)
          // Odd rows: slide in from left, Even rows: slide in from right
          return (row % 2 === 0 ? -1.25 : 1.25) * window.innerWidth
        },
        rotation: () => gsap.utils.random(-1.5, 1.5),
        scale: () => gsap.utils.random(0.98, 1.02),
        opacity: 0,
      }, {
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power3.inOut",
        delay: (i) => {
          const col = i % grid.cols
          const row = Math.floor(i / grid.cols)
          // Odd rows: stagger left-to-right, Even rows: stagger right-to-left
          if (row % 2 === 0) {
            return (col / (grid.cols - 1)) * 0.35
          } else {
            return ((grid.cols - 1 - col) / (grid.cols - 1)) * 0.35
          }
        }
      }, 0)

    } else if (transitionPhase === 'enter') {
      // ── ENTER PHASE: Horizontal Checkered Row Slide Outwards ──
      const tl = gsap.timeline({
        onComplete: () => {
          completeEnterPhase()
        }
      })

      // Scale container back up to normal size only if a screenshot exists
      if (screenshot) {
        tl.fromTo(containerRef.current, {
          scale: 0.98,
        }, {
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        }, 0)
      }

      // Animate cells horizontally away: odd rows to left, even rows to right
      tl.fromTo(cells, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
      }, {
        x: (i) => {
          const row = Math.floor(i / grid.cols)
          return (row % 2 === 0 ? -1.25 : 1.25) * window.innerWidth
        },
        rotation: () => gsap.utils.random(-2, 2),
        scale: () => gsap.utils.random(0.97, 1.03),
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        delay: (i) => {
          const col = i % grid.cols
          const row = Math.floor(i / grid.cols)
          // Stagger center-outwards: reveals center of the screen first
          const centerCol = (grid.cols - 1) / 2
          const distFromCenter = Math.abs(col - centerCol)
          const maxDist = centerCol
          return (distFromCenter / maxDist) * 0.35
        }
      }, 0)
    }
  }, [transitionPhase, isTransitioning, grid])

  if (!isTransitioning) return null

  const totalCells = grid.cols * grid.rows

  return (
    <div
      ref={containerRef}
      className={`transition-overlay active ${transitionPhase === 'exit' ? 'chromatic-aberration' : ''}`}
    >
      {/* Noise filter overlay */}
      <div className="transition-noise" />

      {/* Grid Layout */}
      <div
        ref={gridRef}
        className="transition-grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          const col = i % grid.cols
          const row = Math.floor(i / grid.cols)

          // Grid coordinates converted to percentage offsets
          const cellWidth = 100 / grid.cols
          const cellHeight = 100 / grid.rows
          const leftPercent = col * cellWidth
          const topPercent = row * cellHeight

          return (
            <div
              key={i}
              className="transition-cell"
              style={{
                backgroundColor: screenshot ? 'transparent' : 'var(--color-background)',
              }}
            >
              {screenshot && (
                <div
                  className="transition-cell-bg"
                  style={{
                    backgroundImage: `url(${screenshot})`,
                    backgroundPosition: `${-leftPercent}vw ${-topPercent}vh`,
                    width: '100vw',
                    height: '100vh',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
