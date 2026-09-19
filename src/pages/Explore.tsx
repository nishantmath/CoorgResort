import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import {
  EASE_OUT_EXPO,
  EASE_CINEMATIC,
  EASE_IN_OUT_QUART,
  VIEWPORT_ONCE,
  fadeUp,
  textReveal,
  staggerContainer,
} from '../lib/animation'
import {
  imgRajaSeat,
  imgCariappaMuseum,
  imgOmkareshwarTemple,
  imgAbbeyFalls,
} from '../lib/images'

const serif = { fontFamily: 'Playfair Display, Georgia, serif' }

// ─────────────────────────────────────────────────────────────────────────
// DATA — all existing content preserved exactly
// ─────────────────────────────────────────────────────────────────────────
const places = [
  {
    index: '01',
    name: "Raja's Seat",
    dist: '5 km',
    tagline: 'Royal Garden & Sunset Viewpoint',
    desc: "The beloved garden of the Kodagu kings, built to watch sunsets over misty green valleys. Manicured lawns, a musical fountain, and sweeping views make it Coorg's most visited landmark.",
    img: imgRajaSeat,
    // Bottom-left text — light forest sky at top stays clear
    textPosition: 'bottom-left' as const,
    // Gradient serves the text corner only
    gradient: 'linear-gradient(135deg, rgba(10,16,10,0.88) 0%, rgba(10,16,10,0.38) 42%, transparent 68%), linear-gradient(to top, rgba(10,16,10,0.65) 0%, transparent 38%)',
  },
  {
    index: '02',
    name: 'Field Marshal Cariappa Museum',
    dist: '5 km',
    tagline: "Tribute to India's First Field Marshal",
    desc: "A rich collection of artefacts, photographs, and memorabilia celebrating Field Marshal K.M. Cariappa — born in Coorg and the first Commander-in-Chief of independent India's army.",
    img: imgCariappaMuseum,
    // Bottom-right — alternates rhythm
    textPosition: 'bottom-right' as const,
    gradient: 'linear-gradient(to left, rgba(10,16,10,0.88) 0%, rgba(10,16,10,0.38) 48%, transparent 72%), linear-gradient(to top, rgba(10,16,10,0.6) 0%, transparent 35%)',
  },
  {
    index: '03',
    name: 'Omkareshwar Temple',
    dist: '5 km',
    tagline: '19th-Century Shiva Temple',
    desc: 'Built in 1820 with a striking blend of Islamic and Gothic architecture, the temple sits over a serene water tank. One of the most atmospheric religious sites in all of Coorg.',
    img: imgOmkareshwarTemple,
    // Upper-left — shifts vertical placement for variety
    textPosition: 'top-left' as const,
    gradient: 'linear-gradient(to bottom, rgba(10,16,10,0.88) 0%, rgba(10,16,10,0.38) 42%, transparent 65%), linear-gradient(to right, rgba(10,16,10,0.5) 0%, transparent 55%)',
  },
  {
    index: '04',
    name: 'Abbey Falls',
    dist: '10 km',
    tagline: '70-Foot Waterfall in Coffee Country',
    desc: 'Hidden within a private coffee and spice plantation, Abbey Falls plunges 70 feet into a rocky gorge surrounded by lush forest. Best visited during the monsoon when the flow peaks.',
    img: imgAbbeyFalls,
    // Bottom-center — the waterfall is a strong vertical subject;
    // center-bottom keeps foreground mist clear
    textPosition: 'bottom-center' as const,
    gradient: 'linear-gradient(to top, rgba(10,16,10,0.92) 0%, rgba(10,16,10,0.42) 38%, transparent 60%)',
  },
]

// ─────────────────────────────────────────────────────────────────────────
// Masked line component
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
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        {children}
      </motion.span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// DestinationScene — one cinematic destination, full-bleed
// ─────────────────────────────────────────────────────────────────────────
function DestinationScene({
  place,
}: {
  place: (typeof places)[number]
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Subtle parallax on the image
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  // Position classes for the text overlay
  const positionClasses: Record<typeof place.textPosition, string> = {
    'bottom-left':   'justify-end items-start   text-left',
    'bottom-right':  'justify-end items-end     text-right',
    'top-left':      'justify-start items-start text-left',
    'bottom-center': 'justify-end items-center  text-center',
  }

  const isRight   = place.textPosition === 'bottom-right'
  const isCenter  = place.textPosition === 'bottom-center'
  const isTop     = place.textPosition === 'top-left'

  const paddingClass = isTop
    ? 'pt-24 md:pt-36 pb-8 px-6 md:px-16'
    : 'pt-8 pb-14 md:pb-20 px-6 md:px-16'

  // Clip direction alternates: even = left-to-right, odd = right-to-left
  const isEven = places.indexOf(place) % 2 === 0
  const clipVariant = {
    hidden:  { clipPath: isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.3, ease: EASE_IN_OUT_QUART },
    },
  }

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: 'clamp(540px, 88vh, 960px)' }}
      variants={clipVariant}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {/* Image with parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: reduce ? 0 : imgY, scale: 1.08 }}
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 2.0, ease: EASE_CINEMATIC }}
      >
        <img
          src={place.img}
          alt={place.name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient — two-layer, follows image composition */}
      <div
        className="absolute inset-0"
        style={{ background: place.gradient }}
      />

      {/* Large ghost number — sits in the background of the text area */}
      <div
        className={`absolute inset-0 flex ${positionClasses[place.textPosition]} pointer-events-none select-none`}
        style={{ padding: '0 1.5rem' }}
      >
        <motion.span
          style={{
            ...serif,
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.06)',
            lineHeight: 1,
            userSelect: 'none',
            // shift the number slightly outward from text block
            ...(isRight   ? { marginRight: '-0.05em' } : {}),
            ...(isCenter  ? {} : {}),
          }}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
        >
          {place.index}
        </motion.span>
      </div>

      {/* Text overlay */}
      <div
        className={`absolute inset-0 flex flex-col ${positionClasses[place.textPosition]} ${paddingClass}`}
      >
        <div style={{ maxWidth: isCenter ? '42ch' : '38ch' }}>

          {/* Eyebrow — index + label */}
          <motion.p
            className="text-xs tracking-[0.32em] uppercase mb-4"
            style={{ color: 'rgba(200,169,110,0.9)' }}
            variants={fadeUp}
            custom={0.1}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {place.index} — {place.dist}
          </motion.p>

          {/* Destination name — masked reveal */}
          <h2
            style={{
              ...serif,
              fontStyle: 'italic',
              fontSize: 'clamp(2.4rem, 4.5vw, 4.8rem)',
              color: '#fff',
              fontWeight: 400,
              lineHeight: 1.02,
            }}
            className="mb-5"
          >
            {place.name.split(' ').length > 2
              ? // Break longer names at a natural mid-point
                (() => {
                  const words = place.name.split(' ')
                  const mid   = Math.ceil(words.length / 2)
                  const l1    = words.slice(0, mid).join(' ')
                  const l2    = words.slice(mid).join(' ')
                  return (
                    <>
                      <MaskLine delay={0.18}>{l1}</MaskLine>
                      <MaskLine delay={0.32}>{l2}</MaskLine>
                    </>
                  )
                })()
              : <MaskLine delay={0.18}>{place.name}</MaskLine>
            }
          </h2>

          {/* Tagline */}
          <motion.p
            className="text-xs tracking-[0.2em] uppercase mb-5"
            style={{ color: 'rgba(255,255,255,0.42)' }}
            variants={fadeUp}
            custom={0.42}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {place.tagline}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.58)' }}
            variants={fadeUp}
            custom={0.52}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {place.desc}
          </motion.p>
        </div>
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────
export default function Explore() {
  const reduce    = useReducedMotion()
  const headerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  })
  const headerImgY = useTransform(headerScroll, [0, 1], ['0%', '20%'])

  return (
    <div style={{ backgroundColor: '#f4ede0' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div
        ref={headerRef}
        style={{ backgroundColor: '#7a3e2e', minHeight: '58vh' }}
        className="relative overflow-hidden flex items-end pt-32 pb-14 px-6 md:px-16"
      >
        {/* subtle texture overlay — very faint noise on the terra block */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
        />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.p
            className="text-xs tracking-[0.3em] text-white/50 uppercase mb-6"
            variants={fadeUp}
            custom={0.1}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            NEARBY · MADIKERI · COORG
          </motion.p>

          <h1
            style={{
              ...serif,
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              color: '#fff',
              fontWeight: 400,
              lineHeight: 0.97,
            }}
          >
            {['Your base for', 'exploring Coorg.'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  variants={textReveal}
                  custom={0.22 + i * 0.15}
                  initial={reduce ? false : 'hidden'}
                  animate="visible"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Animated rule */}
          <motion.div
            className="mt-10 h-px bg-white/20"
            style={{ maxWidth: '40rem' }}
            initial={reduce ? false : { scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.0, delay: 0.65, ease: EASE_OUT_EXPO }}
          />

          <motion.p
            className="text-white/55 text-sm mt-6 max-w-lg leading-relaxed"
            variants={fadeUp}
            custom={0.78}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            We sit at the{' '}
            <strong className="text-white/90 font-medium">
              centre point of every major destination
            </strong>{' '}
            in Coorg — no long drives, no missed sunsets. Four landmark sites,
            all within 10 km.
          </motion.p>
        </div>
      </div>

      {/* ── JOURNEY INTRODUCTION ──────────────────────────── */}
      {/*
          A sparse editorial strip that sets up the "journey" idea —
          the resort as origin point with distances extending outward.
          Numbers are large and gold; place names sit below in small type.
          A horizontal thread connects them, drawing left to right.
      */}
      <div
        style={{ backgroundColor: '#0a160a' }}
        className="px-6 md:px-16 py-10 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.p
            className="text-xs tracking-[0.3em] text-white/35 uppercase mb-10"
            variants={fadeUp}
            custom={0}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            THE JOURNEY FROM THE RESORT
          </motion.p>

          {/* Route strip */}
          <div className="flex items-center gap-0 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>

            {/* RESORT origin node */}
            <motion.div
              className="shrink-0 text-center"
              variants={fadeUp}
              custom={0.05}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <div
                className="w-2 h-2 rounded-full mx-auto mb-3"
                style={{ backgroundColor: '#c8a96e' }}
              />
              <p className="text-xs text-white/30 uppercase tracking-widest whitespace-nowrap">
                Resort
              </p>
              <p
                className="text-xs uppercase tracking-widest whitespace-nowrap mt-0.5"
                style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.65rem' }}
              >
                0 km
              </p>
            </motion.div>

            {/* Connectors + destination nodes */}
            {places.map((p, i) => (
              <div key={p.name} className="flex items-center">
                {/* Thread line — grows left to right */}
                <motion.div
                  className="h-px shrink-0"
                  style={{
                    width: 'clamp(40px, 8vw, 100px)',
                    backgroundColor: 'rgba(200,169,110,0.22)',
                    transformOrigin: 'left',
                  }}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.14 + 0.1,
                    ease: EASE_OUT_EXPO,
                  }}
                />

                {/* Destination node */}
                <motion.div
                  className="shrink-0 text-center"
                  variants={fadeUp}
                  custom={i * 0.1 + 0.15}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full mx-auto mb-3"
                    style={{ backgroundColor: 'rgba(200,169,110,0.5)' }}
                    initial={reduce ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.14 + 0.3,
                      ease: EASE_OUT_EXPO,
                    }}
                  />
                  <p
                    className="text-xs text-white/50 whitespace-nowrap leading-snug"
                    style={{ maxWidth: '9rem' }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="text-xs uppercase tracking-widest whitespace-nowrap mt-0.5"
                    style={{ color: '#c8a96e', opacity: 0.7, fontSize: '0.65rem' }}
                  >
                    {p.dist}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESTINATION SCENES ────────────────────────────── */}
      <div>
        {places.map((place) => (
          <DestinationScene key={place.name} place={place} />
        ))}
      </div>

      {/* ── INTERSTITIAL — between scenes 2 and 3 ─────────── */}
      {/* A breathing moment with the journey copy */}
      <div
        className="px-6 md:px-16 py-12 border-t border-black/6"
        style={{ backgroundColor: '#f4ede0' }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-2">
            <p className="text-xs tracking-[0.2em] uppercase opacity-30">
              EXPLORE
            </p>
          </div>
          <div className="md:col-span-6">
            <h3
              style={{
                ...serif,
                fontStyle: 'italic',
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                fontWeight: 400,
                lineHeight: 1.12,
              }}
            >
              <MaskLine delay={0}>Every landmark,</MaskLine>
              <MaskLine delay={0.13}>minutes from your door.</MaskLine>
            </h3>
          </div>
          <motion.div
            className="md:col-span-4 md:text-right"
            variants={fadeUp}
            custom={0.25}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <p className="text-sm opacity-50 leading-relaxed max-w-xs md:ml-auto">
              Madikeri town is 5 km away. Raja's Seat, the museum, the temple —
              all walkable from the same central axis. Abbey Falls at 10 km is
              the furthest you'll need to go.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── CLOSING CTA ───────────────────────────────────── */}
      <section
        style={{ backgroundColor: '#2a4a32' }}
        className="px-6 md:px-16 py-16 text-center text-white"
      >
        <motion.p
          className="text-xs tracking-[0.3em] uppercase opacity-40 mb-8"
          variants={fadeUp}
          custom={0}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          THE CENTRE POINT OF COORG
        </motion.p>
        <h2
          style={{
            ...serif,
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
          className="max-w-3xl mx-auto mb-10"
        >
          <MaskLine style={{ color: '#fff' }} delay={0.1}>
            The centre point of
          </MaskLine>
          <MaskLine style={{ color: '#fff' }} delay={0.24}>
            all Coorg's tourist places.
          </MaskLine>
        </h2>
        <motion.div
          variants={fadeUp}
          custom={0.4}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <a
            href="tel:9019563004"
            className="inline-block text-xs tracking-widest px-8 py-4 border border-white/50 text-white uppercase hover:bg-white hover:text-[#2a4a32] transition-colors"
          >
            BOOK YOUR STAY · 9019563004
          </a>
        </motion.div>
      </section>
    </div>
  )
}
