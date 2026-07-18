import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTransitionContext } from './Transition/TransitionContext'

const navLinks = [
  { name: 'Home', path: '/', end: true },
  { name: 'Studio', path: '/studio' },
  { name: 'About', path: '/about' },
  { name: 'Journal', path: '/journal' },
  { name: 'Reach Us', path: '/contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { triggerTransition } = useTransitionContext()

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleTransitionLink = (e, path) => {
    e.preventDefault()
    if (location.pathname === path) return
    triggerTransition(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:py-6">
      {/* Floating Pill Container */}
      <div className="max-w-6xl mx-auto">
        <div className="liquid-glass rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="px-8 md:px-12 py-3.5 flex items-center justify-between w-full">
            {/* Logo */}
            <NavLink
              to="/"
              onClick={(e) => handleTransitionLink(e, '/')}
              className="text-2xl sm:text-3xl tracking-tight text-foreground transition-opacity hover:opacity-90 flex items-center font-display no-underline"
            >
              VRA-Studio<sup className="text-xs ml-0.5">®</sup>
            </NavLink>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.end}
                  onClick={(e) => handleTransitionLink(e, link.path)}
                  className={({ isActive }) =>
                    `relative py-1 text-sm tracking-wide font-medium transition-colors duration-300 group no-underline ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {/* Animated sliding underline */}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-white transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Desktop CTA */}
            <button
              onClick={() => triggerTransition('/contact')}
              className="hidden md:block liquid-glass rounded-full px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Begin Journey
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 p-1.5 cursor-pointer bg-transparent border-none rounded-full hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                  }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                  }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-foreground transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${isOpen
          ? 'max-h-[380px] opacity-100 translate-y-0 mt-3'
          : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
          }`}
        style={{ overflow: 'hidden' }}
      >
        <div className="liquid-glass rounded-2xl px-6 py-6 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={(e) => {
                setIsOpen(false)
                handleTransitionLink(e, link.path)
              }}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 py-1.5 no-underline ${isActive ? 'text-foreground border-l-2 border-white pl-2' : 'text-muted-foreground hover:text-foreground pl-0'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setIsOpen(false)
              triggerTransition('/contact')
            }}
            className="liquid-glass rounded-full px-6 py-3 text-xs uppercase tracking-widest text-foreground hover:scale-[1.03] transition-all duration-200 cursor-pointer w-full text-center mt-2"
          >
            Begin Journey
          </button>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
