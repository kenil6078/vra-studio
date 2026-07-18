import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import InitialLoader from './components/InitialLoader/InitialLoader'
import Home from './pages/Home'
import Studio from './pages/Studio'
import About from './pages/About'
import Journal from './pages/Journal'
import Contact from './pages/Contact'
import ImageTrail from './components/ImageTrail/ImageTrail'
import Footer from './components/Footer/Footer'
import { TransitionProvider } from './components/Transition/TransitionContext'
import { PageTransition } from './components/Transition/PageTransition'
import Grainient from './components/Grainient/Grainient'

const trailImages = [
  'https://picsum.photos/300/300?grayscale&random=101',
  'https://picsum.photos/300/300?grayscale&random=102',
  'https://picsum.photos/300/300?grayscale&random=103',
  'https://picsum.photos/300/300?grayscale&random=104',
  'https://picsum.photos/300/300?grayscale&random=105',
  'https://picsum.photos/300/300?grayscale&random=106',
  'https://picsum.photos/300/300?grayscale&random=107',
  'https://picsum.photos/300/300?grayscale&random=108',
  'https://picsum.photos/300/300?grayscale&random=109',
  'https://picsum.photos/300/300?grayscale&random=110',
  'https://picsum.photos/300/300?grayscale&random=111',
  'https://picsum.photos/300/300?grayscale&random=112'
]

const App = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const isHome = pathname === '/'
  const isStudio = pathname === '/studio'

  return (
    <TransitionProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        {/* Global Cinematic Grainient Background */}
        <div className="fixed inset-0 h-full w-full pointer-events-none select-none">
          <Grainient
            color1="#696969"
            color2="#111111"
            color3="#000000"
            timeSpeed={1.55}
            colorBalance={0.0}
            warpStrength={1.0}
            warpFrequency={5.0}
            warpSpeed={2.0}
            warpAmplitude={50.0}
            blendAngle={-116}
            blendSoftness={0.05}
            rotationAmount={500.0}
            noiseScale={2.0}
            grainAmount={0.1}
            grainScale={2.0}
            grainAnimated={false}
            contrast={1.5}
            gamma={1.0}
            saturation={1.0}
            centerX={0.0}
            centerY={0.0}
            zoom={1.85}
          />
        </div>
        {/* Dynamic Ambient Blur/Overlay depending on active page */}
        <div
          className={`fixed inset-0 z-1 pointer-events-none transition-all duration-700 ease-in-out ${isHome
            ? 'bg-black/20 backdrop-blur-none'
            : isStudio
              ? 'bg-transparent backdrop-blur-none'
              : 'bg-transparent backdrop-blur-none'
            }`}
        />

        {/* Global Interactive Image Trail - hidden on studio to avoid mouse hover conflicts */}
        {!isStudio && (
          <div className="fixed inset-0 z-2 pointer-events-none overflow-hidden">
            <ImageTrail items={trailImages} variant={2} />
          </div>
        )}

        {/* Foreground Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-between">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/about" element={<About />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          {!isStudio && <Footer />}
        </div>

        {/* Premium Awwwards transition overlay */}
        <PageTransition />

        {/* Initial loading screen with progress indicator */}
        <InitialLoader />
      </div>
    </TransitionProvider>
  )
}

export default App