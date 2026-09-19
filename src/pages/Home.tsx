import { Link } from 'react-router'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  imgHero,
  imgNature,
  imgLandscape,
  imgRainDance,
  imgBonfire,
  imgNightStairs,
  imgRoomHillView,
  imgRoomBalcony,
} from '../lib/images'
import {
  EASE_OUT_EXPO,
  EASE_IN_OUT_QUART,
  EASE_CINEMATIC,
  EASE_BREATHE,
  VIEWPORT_ONCE,
  fadeUp,
  textReveal,
  staggerContainer,
  scaleIn,
  clipRevealY,
} from '../lib/animation'

const serif = { fontFamily: 'Playfair Display, Georgia, serif' }

// ─────────────────────────────────────────────────────────────────────────
// Masked text line — used for hero (animate) and sections (whileInView)
// ─────────────────────────────────────────────────────────────────────────
function MaskLine({
  children,
  delay = 0,
  style = {},
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <span className={`block overflow-hidden ${className}`} style={style}>
      <motion.span
        className="block"
        variants={textReveal}
        custom={delay}
        initial={reduce ? false : 'hidden'}
        animate="visible"
      >
        {children}
      </motion.span>
    </span>
  )
}

function SectionHeading({
  children,
  delay = 0,
  style = {},
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <span className={`block overflow-hidden ${className}`} style={style}>
      <motion.span
        className="block"
        variants={textReveal}
        custom={delay}
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        {children}
      </motion.span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// Welcome intro overlay
// Sequence:
//   0.0s  — screen is dark
//   0.2s  — "Welcome to" fades/slides up
//   0.7s  — "Coorg" reveals through mask, letter-spacing breathes out
//   1.6s  — intro begins to exit (curtain drops down, opacity out)
//   2.0s  — intro unmounts, hero starts its own reveal
// ─────────────────────────────────────────────────────────────────────────
function WelcomeIntro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    // For reduced motion: skip immediately
    const duration = reduce ? 0 : 2200
    const id = setTimeout(onDone, duration)
    return () => clearTimeout(id)
  }, [reduce, onDone])

  if (reduce) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0a160a' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        // Curtain: the overlay slides upward to reveal the hero beneath
        y: '-100%',
        transition: { duration: 0.85, delay: 0, ease: EASE_IN_OUT_QUART },
      }}
    >
      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div className="relative text-center px-6">
        {/* "Welcome to" — fades and lifts in */}
        <motion.p
          className="text-xs tracking-[0.45em] uppercase mb-5"
          style={{ color: 'rgba(200,169,110,0.7)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
        >
          Welcome to
        </motion.p>

        {/* "Coorg" — masked reveal with letter-spacing breathing */}
        <div className="overflow-hidden">
          <motion.h1
            style={{
              ...serif,
              fontStyle: 'italic',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              color: '#fff',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
            initial={{ y: '110%', opacity: 0, letterSpacing: '0.12em' }}
            animate={{ y: '0%', opacity: 1, letterSpacing: '-0.02em' }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE_OUT_EXPO }}
          >
            Coorg.
          </motion.h1>
        </div>

        {/* Location tagline — appears last */}
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mt-5"
          style={{ color: 'rgba(255,255,255,0.28)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
        >
          Madikeri · Karnataka · India
        </motion.p>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef  = useRef<HTMLElement>(null)
  const natureRef = useRef<HTMLElement>(null)
  const reduce   = useReducedMotion()

  // Controls whether the intro overlay is showing
  const [introVisible, setIntroVisible] = useState(!reduce)
  // Controls whether hero content has started its own entrance
  // (we add a small offset so hero starts just as the curtain exits)
  const [heroReady, setHeroReady] = useState(!!reduce)

  const handleIntroDone = () => {
    setIntroVisible(false)
    // Hero entrance starts 100ms after curtain begins lifting
    setTimeout(() => setHeroReady(true), 100)
  }

  // Parallax on hero image
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroImgY          = useTransform(heroScroll, [0, 1], ['0%', '18%'])
  const heroOverlayOpacity = useTransform(heroScroll, [0, 0.6], [1, 0.55])

  // Parallax on nature section
  const { scrollYProgress: natureScroll } = useScroll({
    target: natureRef,
    offset: ['start end', 'end start'],
  })
  const natureImgY = useTransform(natureScroll, [0, 1], ['-8%', '8%'])

  return (
    <>
      {/* ── WELCOME INTRO ─────────────────────────────────── */}
      <AnimatePresence>
        {introVisible && (
          <WelcomeIntro key="intro" onDone={handleIntroDone} />
        )}
      </AnimatePresence>

      <div style={{ backgroundColor: '#f4ede0' }}>

        {/* ── HERO ────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative w-full overflow-hidden"
          style={{ height: '100dvh' }}
        >
          {/* Image: zooms in from 1.08 once hero is ready, parallax on scroll */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={reduce ? false : { scale: 1.08 }}
            animate={heroReady ? { scale: 1 } : {}}
            transition={{ duration: 2.6, ease: EASE_CINEMATIC }}
            style={{ y: reduce ? 0 : heroImgY }}
          >
            <img
              src={imgHero}
              alt="Coorg Heritage Hill View Resort"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlay — linked to scroll so it gets slightly lighter as user scrolls */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={heroReady ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              opacity: reduce ? 1 : heroOverlayOpacity,
              backgroundImage:
                'linear-gradient(160deg, rgba(10,16,10,0.75) 0%, rgba(10,16,10,0.1) 55%, rgba(10,16,10,0.85) 100%)',
            }}
          />

          {/* Location label — top left */}
          <motion.div
            className="absolute top-24 left-6 md:left-16"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={heroReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
          >
            <p className="text-xs tracking-[0.3em] text-white/50 uppercase">
              MADIKERI · COORG · KARNATAKA
            </p>
          </motion.div>

          {/* Headline — masked line reveals, staggered */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-16">
            <h1
              style={{
                ...serif,
                fontStyle: 'italic',
                fontSize: 'clamp(3.2rem, 8vw, 7.5rem)',
                lineHeight: 0.95,
                color: '#fff',
                fontWeight: 400,
              }}
              className="mb-8 max-w-4xl"
            >
              {heroReady || reduce ? (
                <>
                  <MaskLine delay={0.1}>A quiet stay,</MaskLine>
                  <MaskLine delay={0.26}>in the hills</MaskLine>
                  <MaskLine delay={0.42}>of Coorg.</MaskLine>
                </>
              ) : null}
            </h1>

            <motion.div
              className="flex items-center gap-8 flex-wrap"
              initial={{ opacity: 0, y: 16 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT_EXPO }}
            >
              <a
                href="tel:9019563004"
                className="text-xs tracking-[0.2em] px-7 py-3.5 text-white uppercase border border-white/60 hover:bg-white hover:text-[#2a4a32] transition-colors"
              >
                BOOK NOW · 9019563004
              </a>
              <Link
                to="/rooms"
                className="text-xs tracking-[0.2em] text-white/60 uppercase hover:text-white transition-colors"
              >
                VIEW ROOMS →
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={heroReady ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.4, ease: 'easeOut' }}
          >
            <motion.div
              className="w-px bg-white/30"
              initial={{ height: 0 }}
              animate={heroReady ? { height: 48 } : {}}
              transition={{ duration: 0.8, delay: 1.5, ease: EASE_OUT_EXPO }}
            />
            <p
              className="text-xs text-white/30 tracking-widest"
              style={{ writingMode: 'vertical-rl' }}
            >
              SCROLL
            </p>
          </motion.div>
        </section>

        {/* ── INTRO ───────────────────────────────────────── */}
        <section className="px-6 md:px-16 pt-16 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <motion.div
                className="md:col-span-2"
                variants={fadeUp}
                custom={0}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <p className="text-xs tracking-[0.2em] uppercase opacity-35 mt-2">ABOUT</p>
              </motion.div>
              <motion.div
                className="md:col-span-7"
                variants={fadeUp}
                custom={0.1}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <p
                  style={{
                    ...serif,
                    fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
                    lineHeight: 1.45,
                    fontWeight: 400,
                  }}
                  className="text-gray-800"
                >
                  A peaceful base for experiencing Coorg's natural landscape — 13
                  rooms nestled in the hills, your centre point for everything the
                  district has to offer.
                </p>
              </motion.div>
              <motion.div
                className="md:col-span-3 md:pt-2 space-y-6"
                variants={staggerContainer}
                custom={0.06}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                {[
                  ['13', 'Rooms'],
                  ['5 km', "To Raja's Seat"],
                  ['10 km', 'To Abbey Falls'],
                ].map(([n, l]) => (
                  <motion.div key={l} className="border-t border-gray-300 pt-4" variants={fadeUp} custom={0}>
                    <p style={{ ...serif, fontSize: '1.6rem', fontWeight: 400 }}>{n}</p>
                    <p className="text-xs opacity-40 mt-0.5">{l}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HILL VIEW (Nature) — parallax + width expand ── */}
        <section
          ref={natureRef}
          className="relative overflow-hidden"
          style={{ height: 'clamp(400px, 60vw, 720px)' }}
        >
          <motion.div
            className="absolute inset-0 origin-center"
            initial={reduce ? false : { scaleX: 0.9, opacity: 0.7 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
            style={{ y: reduce ? 0 : natureImgY }}
          >
            <img src={imgNature} alt="Coorg estate" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-6 md:left-16"
            variants={fadeUp}
            custom={0.2}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <p className="text-xs tracking-[0.25em] text-white/60 uppercase bg-black/20 px-3 py-1.5 backdrop-blur-sm">
              SURROUNDINGS · MADIKERI, COORG
            </p>
          </motion.div>
        </section>

        {/* ── NATURE LABEL ──────────────────────────────────── */}
        <section className="px-6 md:px-16 py-14 border-b border-gray-200">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <h2
                style={{
                  ...serif,
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.05,
                }}
              >
                <SectionHeading>Nature sets the pace.</SectionHeading>
              </h2>
            </div>
            <motion.div
              className="md:col-span-4"
              variants={fadeUp}
              custom={0.25}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <p className="text-sm opacity-55 leading-relaxed">
                Positioned at the heart of the Coorg hills, the resort is framed
                by coffee estates, spice gardens, and the Western Ghats at every turn.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── SIGNATURE ACTIVITIES ─────────────────────────── */}
        <section className="pt-16 pb-0">
          <div className="px-6 md:px-16 mb-10">
            <div className="max-w-7xl mx-auto flex items-baseline justify-between flex-wrap gap-4">
              <div>
                <motion.p
                  className="text-xs tracking-[0.25em] uppercase opacity-35 mb-3"
                  variants={fadeUp}
                  custom={0}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  ★ SIGNATURE EXPERIENCES
                </motion.p>
                <h2
                  style={{
                    ...serif,
                    fontStyle: 'italic',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 400,
                  }}
                >
                  <SectionHeading delay={0.08}>
                    Fire Camp · Rain Dance · Hill View
                  </SectionHeading>
                </h2>
              </div>
              <motion.div
                variants={fadeUp}
                custom={0.15}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <Link
                  to="/activities"
                  className="text-xs tracking-[0.2em] uppercase border-b border-current pb-0.5 opacity-45 hover:opacity-100 transition-opacity shrink-0"
                >
                  ALL ACTIVITIES →
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Asymmetric grid */}
          <div className="grid md:grid-cols-12 gap-1">
            <motion.div
              className="md:col-span-7 overflow-hidden"
              style={{ height: 'clamp(400px, 55vw, 680px)' }}
              variants={scaleIn}
              custom={0}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <motion.img
                src={imgBonfire}
                alt="Fire Camp"
                className="w-full h-full object-cover"
                initial={reduce ? false : { scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 1.8, ease: EASE_CINEMATIC }}
              />
              <div className="px-6 md:px-8 pt-4 pb-8" style={{ backgroundColor: '#191d17' }}>
                <p className="text-xs tracking-widest text-white/80 font-medium uppercase flex items-center gap-2">
                  <span style={{ color: '#c8a96e' }}>★</span> FIRE CAMP
                </p>
              </div>
            </motion.div>
            <div className="md:col-span-5 flex flex-col gap-1">
              <motion.div
                className="overflow-hidden flex-1"
                style={{ minHeight: 280 }}
                variants={scaleIn}
                custom={0.12}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <img src={imgRainDance} alt="Rain Dance" className="w-full h-full object-cover" style={{ minHeight: 280 }} />
                <div className="px-5 pt-3 pb-6" style={{ backgroundColor: '#2a4a32' }}>
                  <p className="text-xs tracking-widest text-white/80 font-medium uppercase flex items-center gap-2">
                    <span style={{ color: '#c8a96e' }}>★</span> RAIN DANCE
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="overflow-hidden flex-1"
                style={{ minHeight: 280 }}
                variants={scaleIn}
                custom={0.22}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <img src={imgNightStairs} alt="Hill View" className="w-full h-full object-cover" style={{ minHeight: 280 }} />
                <div className="px-5 pt-3 pb-6" style={{ backgroundColor: '#7a3e2e' }}>
                  <p className="text-xs tracking-widest text-white/80 font-medium uppercase flex items-center gap-2">
                    <span style={{ color: '#c8a96e' }}>★</span> HILL VIEW
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── ROOMS PREVIEW ─────────────────────────────────── */}
        <section style={{ backgroundColor: '#191d17' }} className="px-6 md:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12 items-start mb-14">
              <div className="md:col-span-5">
                <motion.p
                  className="text-xs tracking-[0.25em] text-white/40 uppercase mb-4"
                  variants={fadeUp}
                  custom={0}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  ACCOMMODATION
                </motion.p>
                <h2
                  style={{
                    ...serif,
                    fontStyle: 'italic',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    color: '#fff',
                    fontWeight: 400,
                    lineHeight: 1.1,
                  }}
                >
                  <SectionHeading style={{ color: '#fff' }} delay={0.05}>Thirteen rooms,</SectionHeading>
                  <SectionHeading style={{ color: '#fff' }} delay={0.18}>surrounded</SectionHeading>
                  <SectionHeading style={{ color: '#fff' }} delay={0.3}>by nature.</SectionHeading>
                </h2>
                <motion.div
                  variants={fadeUp}
                  custom={0.4}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  <Link
                    to="/rooms"
                    className="inline-block mt-8 text-xs tracking-[0.2em] uppercase border-b border-white/40 pb-0.5 text-white/50 hover:text-white hover:border-white transition-colors"
                  >
                    VIEW ALL ROOMS →
                  </Link>
                </motion.div>
              </div>
              <div className="md:col-span-7 grid grid-cols-2 gap-2">
                <motion.div
                  className="overflow-hidden"
                  style={{ aspectRatio: '3/4' }}
                  variants={clipRevealY}
                  custom={0}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  <img src={imgRoomHillView} alt="Hill View Room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </motion.div>
                <motion.div
                  className="overflow-hidden mt-10"
                  style={{ aspectRatio: '3/4' }}
                  variants={clipRevealY}
                  custom={0.2}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  <img src={imgRoomBalcony} alt="Balcony Room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </motion.div>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10"
              variants={staggerContainer}
              custom={0.08}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              {['AC Rooms', 'Non-AC Rooms', 'Restaurant', 'Room Service'].map((a) => (
                <motion.div key={a} className="flex items-center gap-2" variants={fadeUp} custom={0}>
                  <span style={{ color: '#c8a96e', fontSize: '0.6rem' }}>●</span>
                  <p className="text-xs text-white/50">{a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── EXPLORE TEASER ────────────────────────────────── */}
        <section style={{ backgroundColor: '#7a3e2e' }} className="px-6 md:px-16 py-16 text-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-end">
            <h2
              style={{
                ...serif,
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 4vw, 3.8rem)',
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              <SectionHeading style={{ color: '#fff' }} delay={0}>The centre point of</SectionHeading>
              <SectionHeading style={{ color: '#fff' }} delay={0.14}>all Coorg's tourist places.</SectionHeading>
            </h2>
            <div>
              <motion.div
                className="grid grid-cols-2 gap-6 mb-8"
                variants={staggerContainer}
                custom={0.1}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                {[
                  ["Raja's Seat", '5 km'],
                  ['Cariappa Museum', '5 km'],
                  ['Omkareshwar Temple', '5 km'],
                  ['Abbey Falls', '10 km'],
                ].map(([place, dist]) => (
                  <motion.div key={place} className="border-t border-white/20 pt-4" variants={fadeUp} custom={0}>
                    <p className="text-xs text-white/40 mb-1">{dist}</p>
                    <p className="text-sm text-white/80 leading-snug">{place}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                custom={0.45}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <Link
                  to="/explore"
                  className="inline-block text-xs tracking-[0.2em] uppercase border-b border-white/40 pb-0.5 text-white/55 hover:text-white hover:border-white transition-colors"
                >
                  EXPLORE COORG →
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── LANDSCAPE PANORAMA ────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ height: 'clamp(360px, 50vw, 620px)' }}>
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 1.6, ease: EASE_CINEMATIC }}
          >
            <img src={imgLandscape} alt="Coorg estate panorama" className="w-full h-full object-cover" />
          </motion.div>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,18,10,0.5) 0%, transparent 50%)' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10"
            variants={fadeUp}
            custom={0.2}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <p className="text-xs tracking-[0.3em] text-white/50 uppercase">
              IN THE MIDDLE OF THE LANDSCAPE.
            </p>
          </motion.div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="px-6 md:px-16 py-20" style={{ backgroundColor: '#f4ede0' }}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 items-end gap-12">
            <div className="md:col-span-8">
              <motion.p
                className="text-xs tracking-[0.2em] uppercase opacity-30 mb-10"
                variants={fadeUp}
                custom={0}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                COORG HERITAGE HILL VIEW RESORT
              </motion.p>
              <h2
                style={{
                  ...serif,
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.8rem, 7vw, 7rem)',
                  fontWeight: 400,
                  lineHeight: 0.95,
                }}
              >
                <SectionHeading delay={0.05}>Come for</SectionHeading>
                <SectionHeading delay={0.18}>the hills.</SectionHeading>
                <SectionHeading delay={0.3}>Stay for</SectionHeading>
                <SectionHeading delay={0.42}>the experience.</SectionHeading>
              </h2>
            </div>
            <motion.div
              className="md:col-span-4 flex flex-col gap-5 items-start"
              variants={staggerContainer}
              custom={0.1}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <motion.a
                href="tel:9019563004"
                style={{ backgroundColor: '#2a4a32' }}
                className="text-xs tracking-[0.2em] px-8 py-4 text-white uppercase hover:opacity-85 transition-opacity"
                variants={fadeUp}
                custom={0}
              >
                CALL · 9019563004
              </motion.a>
              <motion.a
                href="mailto:coorgheritagehillviewresort@gmail.com"
                className="text-xs tracking-[0.2em] uppercase border-b border-current pb-0.5 opacity-40 hover:opacity-100 transition-opacity"
                variants={fadeUp}
                custom={0}
              >
                EMAIL US
              </motion.a>
              <motion.div variants={fadeUp} custom={0}>
                <Link
                  to="/contact"
                  className="text-xs tracking-[0.2em] uppercase border-b border-current pb-0.5 opacity-40 hover:opacity-100 transition-opacity"
                >
                  SEND ENQUIRY
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
