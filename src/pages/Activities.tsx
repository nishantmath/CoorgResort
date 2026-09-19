import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import {
  imgBonfire,
  imgRainDance,
  imgNightStairs,
  imgPuppets,
  imgNature,
  imgLandscape,
} from '../lib/images'
import {
  EASE_OUT_EXPO,
  EASE_CINEMATIC,
  EASE_IN_OUT_QUART,
  VIEWPORT_ONCE,
  fadeUp,
  textReveal,
} from '../lib/animation'

const serif = { fontFamily: 'Playfair Display, Georgia, serif' }

// ─────────────────────────────────────────────────────────────────────────
// Masked heading — scroll triggered
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
// ActivityScene — generic full-bleed cinematic scene
//
// Layout options:
//   textPosition: 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-left-cream'
//
// Each scene:
//   1. Image starts at scale 1.06, settles to 1 as it enters
//   2. Image has subtle scroll-linked parallax
//   3. Eyebrow reveals first (fadeUp)
//   4. Title reveals through vertical mask, line by line
//   5. Description follows with stagger
// ─────────────────────────────────────────────────────────────────────────
type TextPosition = 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-left-cream'

interface SceneProps {
  img: string
  alt: string
  number: string
  label: string
  signature?: boolean
  title: string[]            // array of lines for masked reveal
  body: string
  height: string
  textPosition: TextPosition
  gradient: string | string[] // one or two gradient strings layered
}

function ActivityScene({
  img, alt, number, label, signature, title, body,
  height, textPosition, gradient,
}: SceneProps) {
  const reduce  = useReducedMotion()
  const ref     = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax: image moves opposite to scroll direction, text moves subtly with it
  const imgY  = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])

  const gradients = Array.isArray(gradient) ? gradient : [gradient]

  // Position mapping
  const flexClass: Record<TextPosition, string> = {
    'bottom-left':        'flex-col justify-end items-start   text-left',
    'bottom-right':       'flex-col justify-end items-end     text-right',
    'top-center':         'flex-col justify-start items-center text-center',
    'bottom-left-cream':  'flex-col justify-end items-start   text-left',
  }
  const paddingClass: Record<TextPosition, string> = {
    'bottom-left':        'px-6 md:px-16 pb-14 md:pb-22',
    'bottom-right':       'px-6 md:px-16 pb-14 md:pb-22',
    'top-center':         'px-6 pt-24 md:pt-32 pb-8',
    'bottom-left-cream':  'px-6 md:px-16 pb-14 md:pb-20',
  }

  const isCream  = textPosition === 'bottom-left-cream'
  const isRight  = textPosition === 'bottom-right'
  const isCenter = textPosition === 'top-center'

  const eyebrowColor = isCream
    ? 'rgba(122,62,46,0.85)'    // terracotta on cream
    : 'rgba(200,169,110,0.9)'   // gold on dark

  const titleColor  = isCream ? '#1e1e1e' : '#fff'
  const bodyColor   = isCream
    ? 'rgba(30,30,30,0.58)'
    : 'rgba(255,255,255,0.62)'

  // Max-width for the text block
  const textMaxWidth = isCenter ? '44ch' : isRight ? '34ch' : '40ch'

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* ── Image: scale-in + parallax ── */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={reduce ? false : { scale: 1.07 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 1.9, ease: EASE_CINEMATIC }}
        style={{ y: reduce ? 0 : imgY }}
      >
        <img
          src={img}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ── Gradient layers ── */}
      {gradients.map((g, i) => (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{ background: g }}
        />
      ))}

      {/* ── Text block: moves at slightly different rate to image ── */}
      <motion.div
        className={`absolute inset-0 flex ${flexClass[textPosition]} ${paddingClass[textPosition]}`}
        style={{ y: reduce ? 0 : textY }}
      >
        <div style={{ maxWidth: textMaxWidth }}>

          {/* Eyebrow */}
          <motion.p
            className="text-xs tracking-[0.32em] uppercase mb-5 flex items-center gap-2.5"
            style={{ color: eyebrowColor }}
            variants={fadeUp}
            custom={0}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {signature && (
              <span style={{ color: isCream ? '#7a3e2e' : '#c8a96e' }}>★</span>
            )}
            {number} — {label}{signature ? ' · SIGNATURE' : ''}
          </motion.p>

          {/* Title — each line reveals through a vertical mask */}
          <h2
            style={{
              ...serif,
              fontStyle: 'italic',
              // Cream scenes slightly smaller to balance the lighter contrast
              fontSize: isCream
                ? 'clamp(2.6rem, 4.5vw, 4.2rem)'
                : 'clamp(3.2rem, 6.5vw, 6rem)',
              color: titleColor,
              fontWeight: 400,
              lineHeight: 1.02,
            }}
            className="mb-6"
          >
            {title.map((line, i) => (
              <MaskLine key={line} delay={0.12 + i * 0.16} style={{ color: titleColor }}>
                {line}
              </MaskLine>
            ))}
          </h2>

          {/* Description */}
          <motion.p
            className="text-base leading-relaxed"
            style={{ color: bodyColor, maxWidth: textMaxWidth }}
            variants={fadeUp}
            custom={0.12 + title.length * 0.16 + 0.1}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            {body}
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────
export default function Activities() {
  const reduce    = useReducedMotion()
  const headerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  })
  const headerImgY = useTransform(headerScroll, [0, 1], ['0%', '22%'])

  return (
    <div style={{ backgroundColor: '#f4ede0' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div
        ref={headerRef}
        className="relative overflow-hidden"
        style={{ height: '75vh', minHeight: '520px' }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: reduce ? 0 : headerImgY }}
        >
          <img
            src={imgNightStairs}
            alt="Estate at night"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,16,10,0.7) 0%, rgba(10,16,10,0.15) 45%, rgba(10,16,10,0.85) 100%)',
          }}
        />
        <div
          className="relative flex flex-col justify-end px-6 md:px-16 pb-20 pt-32"
          style={{ height: '75vh', minHeight: '520px' }}
        >
          <motion.p
            className="text-xs tracking-[0.3em] text-white/45 uppercase mb-5"
            variants={fadeUp}
            custom={0.1}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            ON THE ESTATE · 5 ACTIVITIES
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
            {['Simple ways to', 'spend the day.'].map((line, i) => (
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
          <motion.p
            className="text-white/50 text-sm mt-6 max-w-md leading-relaxed"
            variants={fadeUp}
            custom={0.62}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            Five activities — all on-site, all designed to bring you closer to
            the landscape and the rhythms of Coorg.
          </motion.p>
        </div>
      </div>

      {/* ── INTRO STRIP ───────────────────────────────────── */}
      <motion.div
        className="px-6 md:px-16 py-10 border-b border-black/8"
        variants={fadeUp}
        custom={0}
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <div className="max-w-7xl mx-auto flex items-baseline gap-6">
          <span style={{ color: '#c8a96e' }} className="text-base leading-none">★</span>
          <p className="text-xs tracking-[0.25em] uppercase opacity-40">
            HIGHLIGHTED ACTIVITIES — FIRE CAMP · RAIN DANCE · HILL VIEW
          </p>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          01 — HILL VIEW
          Bottom-left. Diagonal gradient from bottom-left corner.
          Strong title — the hillscape has a clear sky to contrast.
      ═════════════════════════════════════════════════════════ */}
      <ActivityScene
        img={imgNature}
        alt="Hill view, Coorg"
        number="01"
        label="HILL VIEW"
        title={['Sunrise and sunset', 'over the Western Ghats.']}
        body="Take the lit stairway to the estate's highest terrace for panoramic views of the valley and the Ghats — best at dawn, and again as the lights come on across the hills at dusk."
        height="clamp(580px, 90vh, 980px)"
        textPosition="bottom-left"
        gradient={[
          'linear-gradient(140deg, rgba(10,16,10,0.92) 0%, rgba(10,16,10,0.5) 40%, transparent 68%)',
          'linear-gradient(to top, rgba(10,16,10,0.75) 0%, transparent 42%)',
        ]}
      />

      {/* ══════════════════════════════════════════════════════
          02 — WATER STREAM
          Bottom-right — alternates rhythm.
          Right-side gradient leaves the landscape visible.
      ═════════════════════════════════════════════════════════ */}
      <ActivityScene
        img={imgLandscape}
        alt="Water stream, Coorg estate"
        number="02"
        label="WATER STREAM"
        title={['Follow the forest', 'to running water.']}
        body="A short nature walk through the estate leads to a natural stream — ideal for quiet mornings or a cool afternoon. Let the forest quiet the mind."
        height="clamp(540px, 85vh, 900px)"
        textPosition="bottom-right"
        gradient={[
          'linear-gradient(to left, rgba(10,16,10,0.92) 0%, rgba(10,16,10,0.45) 46%, transparent 72%)',
          'linear-gradient(to top, rgba(10,16,10,0.65) 0%, transparent 38%)',
        ]}
      />

      {/* ══════════════════════════════════════════════════════
          03 — FIRE CAMP  ★ SIGNATURE
          The centrepiece. Night photograph — deepest, tallest.
          Bottom-left. Very restrained gradient — the bonfire
          glow provides its own light. Largest title on the page.
      ═════════════════════════════════════════════════════════ */}
      <ActivityScene
        img={imgBonfire}
        alt="Rooftop bonfire, Coorg"
        number="03"
        label="FIRE CAMP"
        signature
        title={['Rooftop bonfires', 'under open skies.']}
        body="Gather around a rooftop fire pit as night falls over the Ghats. Chai, local snacks, and the sound of the forest — the signature way to end an evening at the resort."
        height="clamp(620px, 95vh, 1040px)"
        textPosition="bottom-left"
        gradient={[
          'linear-gradient(to top, rgba(10,16,10,0.95) 0%, rgba(10,16,10,0.4) 38%, transparent 62%)',
          'linear-gradient(to right, rgba(10,16,10,0.55) 0%, transparent 52%)',
        ]}
      />

      {/* ══════════════════════════════════════════════════════
          04 — RAIN DANCE  ★ SIGNATURE
          Top-center — foreground activity stays fully visible.
          Gradient from top only.
      ═════════════════════════════════════════════════════════ */}
      <ActivityScene
        img={imgRainDance}
        alt="Rain dance, Coorg"
        number="04"
        label="RAIN DANCE"
        signature
        title={['Mist, colour, and', 'the open Coorg sky.']}
        body="Our open-air rain dance platform uses mist jets and coloured lights against the backdrop of the misty hills — a signature, immersive experience unique to the resort."
        height="clamp(580px, 90vh, 980px)"
        textPosition="top-center"
        gradient={[
          'linear-gradient(to bottom, rgba(10,16,10,0.92) 0%, rgba(10,16,10,0.45) 44%, transparent 68%)',
        ]}
      />

      {/* ══════════════════════════════════════════════════════
          05 — INDOOR GAMES
          Cream gradient rising from bottom — text in dark ink.
          Slightly smaller title and shorter scene height to
          signal a secondary activity with a lighter tone.
      ═════════════════════════════════════════════════════════ */}
      <ActivityScene
        img={imgPuppets}
        alt="Indoor games, Coorg"
        number="05"
        label="INDOOR GAMES"
        title={['Unwind between', 'the hills.']}
        body="Traditional and modern indoor games — carrom, chess, and more — perfect for families and groups looking to relax together between excursions."
        height="clamp(480px, 75vh, 820px)"
        textPosition="bottom-left-cream"
        gradient={[
          'linear-gradient(to top, rgba(244,237,224,0.97) 0%, rgba(244,237,224,0.62) 24%, transparent 52%)',
        ]}
      />

      {/* ── CTA ───────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: '#2a4a32' }}
        className="px-6 md:px-16 py-16 text-white text-center"
      >
        <motion.p
          className="text-xs tracking-[0.3em] uppercase opacity-40 mb-6"
          variants={fadeUp}
          custom={0}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          ALL ACTIVITIES INCLUDED
        </motion.p>
        <h2
          style={{
            ...serif,
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <MaskLine style={{ color: '#fff' }} delay={0.1}>
            Ready to experience it?
          </MaskLine>
        </h2>
        <motion.a
          href="tel:9019563004"
          className="inline-block text-xs tracking-[0.2em] px-8 py-4 border border-white/50 text-white uppercase hover:bg-white hover:text-[#2a4a32] transition-colors"
          variants={fadeUp}
          custom={0.28}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          BOOK NOW · 9019563004
        </motion.a>
      </section>
    </div>
  )
}
