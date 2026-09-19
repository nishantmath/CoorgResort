import { NavLink, useLocation } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from '../lib/animation'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'Activities', to: '/activities' },
  { label: 'Explore', to: '/explore' },
  { label: 'Contact', to: '/contact' },
]

export function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const reduceMotion = useReducedMotion()

  // Track whether the user has scrolled past the hero (100dvh)
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    if (!isHome) {
      setPastHero(true)
      return
    }
    setPastHero(false)

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.85
      setPastHero(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  // Compact = after hero on home page, or always on other pages
  const compact = pastHero

  // Transparent = on home page before scrolling past hero
  const transparent = isHome && !pastHero

  const bgColor = transparent ? 'rgba(0,0,0,0)' : '#2a4a32'
  const borderOpacity = transparent ? 0 : 0.12

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      animate={
        reduceMotion
          ? { backgroundColor: bgColor }
          : {
              backgroundColor: bgColor,
              paddingTop: compact ? '0.625rem' : '1rem',
              paddingBottom: compact ? '0.625rem' : '1rem',
            }
      }
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        borderBottom: `1px solid rgba(255,255,255,${borderOpacity})`,
      }}
    >
      {/* Logo */}
      <motion.div
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        initial={reduceMotion ? {} : { opacity: 0, y: -8 }}
        transition={{ duration: 0.7, delay: 1.8, ease: EASE_OUT_EXPO }}
      >
        <NavLink to="/" className="flex flex-col leading-tight">
          <span className="text-xs tracking-[0.15em] font-semibold text-white">COORG HERITAGE</span>
          <span
            className="text-xs tracking-[0.15em] font-semibold transition-opacity"
            style={{ color: '#c8a96e', opacity: compact ? 1 : 0.85 }}
          >
            HILL VIEW RESORT
          </span>
        </NavLink>
      </motion.div>

      {/* Desktop links */}
      <motion.div
        className="hidden md:flex items-center gap-6"
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        initial={reduceMotion ? {} : { opacity: 0, y: -8 }}
        transition={{ duration: 0.7, delay: 2.0, ease: EASE_OUT_EXPO }}
      >
        {links.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `text-xs tracking-widest uppercase transition-opacity ${
                isActive
                  ? 'text-white opacity-100 border-b border-white pb-0.5'
                  : 'text-white opacity-60 hover:opacity-100'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.a
        href="tel:9019563004"
        className="text-xs tracking-widest px-4 py-2 border border-white text-white uppercase hover:bg-white hover:text-[#2a4a32] transition-colors hidden sm:block"
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        initial={reduceMotion ? {} : { opacity: 0, y: -8 }}
        transition={{ duration: 0.7, delay: 2.15, ease: EASE_OUT_EXPO }}
      >
        BOOK NOW
      </motion.a>
    </motion.nav>
  )
}
