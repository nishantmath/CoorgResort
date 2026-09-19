import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import {
  imgRoomHillView, imgRoomBalcony, imgRoomGlass,
  imgRoomWooden2, imgRoomAC, imgRoomFloral,
  imgRoomWooden, imgRoomWindows, imgRoomGlass2,
  imgLandscape, imgNature,
} from '../lib/images'
import {
  EASE_OUT_EXPO,
  EASE_CINEMATIC,
  VIEWPORT_ONCE,
  fadeUp,
  fadeIn,
  textReveal,
  staggerContainer,
  scaleIn,
  clipRevealY,
} from '../lib/animation'

const serif = { fontFamily: 'Playfair Display, Georgia, serif' }

const roomTypes = [
  { img: imgRoomHillView, name: 'Hill View Room',      type: 'Non-AC', desc: 'Glass walls on three sides frame unbroken views of the Western Ghats. Wake to mist over the forest canopy.',         features: ['Glass walls', 'Forest panorama', 'Fan-cooled'] },
  { img: imgRoomAC,       name: 'AC Deluxe Room',      type: 'AC',     desc: 'Climate-controlled comfort with warm terracotta interiors, red accents, and art above the headboard.',               features: ['Air conditioning', 'Twin or double', 'Forest window'] },
  { img: imgRoomBalcony,  name: 'Balcony Room',        type: 'Non-AC', desc: 'Step straight onto a private balcony with sweeping hill views. Wooden ceiling, warm natural ventilation.',           features: ['Private balcony', 'Hill views', 'Wooden ceiling'] },
  { img: imgRoomFloral,   name: 'AC Heritage Room',    type: 'AC',     desc: 'Floral-wallpapered accent wall, double bed, wicker chairs, and a kettle corner — ideal for couples.',               features: ['Air conditioning', 'Floral décor', 'Double bed'] },
  { img: imgRoomGlass,    name: 'Glass Suite',         type: 'Non-AC', desc: 'Full-wall windows facing the valley. Wicker chairs, curtained alcoves — indoors and outdoors blur.',                features: ['Full-wall windows', 'Valley view', 'Wicker seating'] },
  { img: imgRoomWooden2,  name: 'Wooden Cottage Room', type: 'Non-AC', desc: 'High wooden ceiling, warm laminate floors, twin beds — cosy and perfect for families or small groups.',             features: ['Wooden ceiling', 'Twin beds', 'Warm floors'] },
]

// ─── Gallery images for horizontal scroll strip ───────────────────────────
const galleryImages = [
  { src: imgRoomHillView,  alt: 'Hill View Room' },
  { src: imgRoomBalcony,   alt: 'Balcony Room' },
  { src: imgRoomGlass,     alt: 'Glass Suite' },
  { src: imgRoomWooden2,   alt: 'Wooden Cottage' },
  { src: imgRoomAC,        alt: 'AC Deluxe Room' },
  { src: imgRoomFloral,    alt: 'AC Heritage Room' },
  { src: imgRoomWooden,    alt: 'Room Interior' },
  { src: imgRoomWindows,   alt: 'Room Windows' },
  { src: imgRoomGlass2,    alt: 'Glass Room' },
]

// ─── Masked heading (scroll-triggered) ───────────────────────────────────
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

// ─── Single gallery card — scales as it enters viewport ──────────────────
function GalleryCard({ src, alt, index }: { src: string; alt: string; index: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({
    container: ref,
    axis: 'x',
  })

  return (
    <motion.div
      ref={ref}
      className="relative shrink-0 overflow-hidden"
      style={{ width: 'clamp(260px, 32vw, 420px)', aspectRatio: '3/4' }}
      variants={scaleIn}
      custom={index * 0.06}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px 0px' }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={reduce ? false : { scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-60px 0px' }}
        transition={{ duration: 1.4, ease: EASE_CINEMATIC }}
      />
    </motion.div>
  )
}

export default function Rooms() {
  const reduce = useReducedMotion()
  const headerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Parallax for the header background image
  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  })
  const headerImgY = useTransform(headerScroll, [0, 1], ['0%', '20%'])

  return (
    <div style={{ backgroundColor: '#f4ede0' }}>

      {/* ── Full-bleed header ─────────────────────────────── */}
      <div
        ref={headerRef}
        className="relative overflow-hidden"
        style={{ minHeight: '56vh', backgroundColor: '#2a4a32' }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: reduce ? 0 : headerImgY }}
        >
          <img
            src={imgNature}
            alt="Estate"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        </motion.div>

        <div
          className="relative pt-32 pb-24 px-6 md:px-16 flex flex-col justify-end h-full"
          style={{ minHeight: '56vh' }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <motion.p
              className="text-xs tracking-[0.3em] text-white/45 uppercase mb-5"
              variants={fadeUp}
              custom={0}
              initial={reduce ? false : 'hidden'}
              animate="visible"
            >
              ACCOMMODATION · 13 ROOMS
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
              {['Thirteen rooms,', 'surrounded', 'by nature.'].map(
                (line, i) => (
                  <span key={line} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      variants={textReveal}
                      custom={0.15 + i * 0.14}
                      initial={reduce ? false : 'hidden'}
                      animate="visible"
                    >
                      {line}
                    </motion.span>
                  </span>
                )
              )}
            </h1>

            <motion.div
              className="mt-10 flex flex-wrap gap-2"
              variants={staggerContainer}
              custom={0.07}
              initial={reduce ? false : 'hidden'}
              animate="visible"
            >
              {['AC Rooms', 'Non-AC Rooms', 'Restaurant', 'Room Service'].map(
                (a) => (
                  <motion.span
                    key={a}
                    className="text-xs px-3 py-1.5 border border-white/25 text-white/60 rounded-full"
                    variants={fadeUp}
                    custom={0.6}
                  >
                    {a}
                  </motion.span>
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Intro text strip ──────────────────────────────── */}
      <div className="px-6 md:px-16 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8">
          <motion.div
            className="md:col-span-2"
            variants={fadeUp}
            custom={0}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <p className="text-xs tracking-[0.2em] uppercase opacity-35 mt-1">ROOMS</p>
          </motion.div>
          <motion.p
            className="md:col-span-7 text-sm leading-relaxed opacity-60"
            variants={fadeUp}
            custom={0.1}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            Every room has been designed to blend into the landscape — wooden
            ceilings, wide windows framing the hills, and warm interiors. Both
            AC and non-AC options available across 13 rooms. Amenities include
            an on-site restaurant and room service.
          </motion.p>
        </div>
      </div>

      {/* ── Room grid — editorial sizing ─────────────────── */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-7xl mx-auto">

          {/* Row 1: large left + smaller right */}
          <div className="grid md:grid-cols-12 gap-4 mb-4">
            <motion.div
              className="md:col-span-8 group overflow-hidden"
              style={{ aspectRatio: '16/10' }}
              variants={clipRevealY}
              custom={0}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <img
                src={roomTypes[0].img}
                alt={roomTypes[0].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div
              className="md:col-span-4 group overflow-hidden"
              style={{ aspectRatio: '3/4' }}
              variants={clipRevealY}
              custom={0.18}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <img
                src={roomTypes[1].img}
                alt={roomTypes[1].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* Room info row 1 */}
          <div className="grid md:grid-cols-12 gap-4 mb-16">
            <motion.div
              className="md:col-span-8 pt-4"
              variants={fadeUp}
              custom={0}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 style={{ ...serif, fontSize: '1.15rem', fontWeight: 400 }}>
                    {roomTypes[0].name}
                  </h3>
                  <p className="text-xs opacity-50 mt-1 leading-relaxed max-w-sm">
                    {roomTypes[0].desc}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 shrink-0"
                  style={{ backgroundColor: '#7a3e2e', color: '#fff' }}
                >
                  {roomTypes[0].type}
                </span>
              </div>
            </motion.div>
            <motion.div
              className="md:col-span-4 pt-4"
              variants={fadeUp}
              custom={0.1}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 style={{ ...serif, fontSize: '1.15rem', fontWeight: 400 }}>
                    {roomTypes[1].name}
                  </h3>
                  <p className="text-xs opacity-50 mt-1 leading-relaxed">
                    {roomTypes[1].desc}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-1 shrink-0"
                  style={{ backgroundColor: '#2a4a32', color: '#fff' }}
                >
                  {roomTypes[1].type}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Row 2: 3 equal */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {roomTypes.slice(2, 5).map((room, i) => (
              <motion.div
                key={room.name}
                className="group overflow-hidden"
                style={{ aspectRatio: '4/3' }}
                variants={scaleIn}
                custom={i * 0.1}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <img
                  src={room.img}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {roomTypes.slice(2, 5).map((room, i) => (
              <motion.div
                key={room.name}
                className="pt-3"
                variants={fadeUp}
                custom={i * 0.08}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 style={{ ...serif, fontSize: '1.05rem', fontWeight: 400 }}>
                      {room.name}
                    </h3>
                    <p className="text-xs opacity-50 mt-1 leading-relaxed">
                      {room.desc}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 shrink-0 mt-0.5"
                    style={{
                      backgroundColor: room.type === 'AC' ? '#2a4a32' : '#7a3e2e',
                      color: '#fff',
                    }}
                  >
                    {room.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 3: remaining + extra photos */}
          <div className="grid md:grid-cols-12 gap-4 mb-4">
            <motion.div
              className="md:col-span-4 group overflow-hidden"
              style={{ aspectRatio: '3/4' }}
              variants={clipRevealY}
              custom={0}
              initial={reduce ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <img
                src={roomTypes[5].img}
                alt={roomTypes[5].name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <div className="md:col-span-8 grid grid-rows-2 gap-4">
              <motion.div
                className="group overflow-hidden"
                style={{ aspectRatio: '16/7' }}
                variants={clipRevealY}
                custom={0.14}
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
              >
                <img
                  src={imgRoomWooden}
                  alt="Room"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="group overflow-hidden"
                  style={{ aspectRatio: '4/3' }}
                  variants={scaleIn}
                  custom={0.22}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  <img
                    src={imgRoomWindows}
                    alt="Room"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
                <motion.div
                  className="group overflow-hidden"
                  style={{ aspectRatio: '4/3' }}
                  variants={scaleIn}
                  custom={0.3}
                  initial={reduce ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                >
                  <img
                    src={imgRoomGlass2}
                    alt="Room"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div
            className="pt-3 md:w-1/3"
            variants={fadeUp}
            custom={0}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 style={{ ...serif, fontSize: '1.05rem', fontWeight: 400 }}>
                  {roomTypes[5].name}
                </h3>
                <p className="text-xs opacity-50 mt-1 leading-relaxed">
                  {roomTypes[5].desc}
                </p>
              </div>
              <span
                className="text-xs px-2 py-1 shrink-0"
                style={{ backgroundColor: '#7a3e2e', color: '#fff' }}
              >
                {roomTypes[5].type}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY — horizontal scroll strip ─────────────── */}
      <section className="py-16 overflow-hidden">
        {/* Section label */}
        <motion.div
          className="px-6 md:px-16 mb-8"
          variants={fadeUp}
          custom={0}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <div className="max-w-7xl mx-auto flex items-baseline justify-between">
            <p className="text-xs tracking-[0.25em] uppercase opacity-35">
              ALL ROOMS · GALLERY
            </p>
            <p className="text-xs opacity-30 hidden md:block">
              scroll →
            </p>
          </div>
        </motion.div>

        {/* Scrollable strip — no scrollbar */}
        <div
          ref={galleryRef}
          className="flex gap-3 px-6 md:px-16 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
          onMouseDown={(e) => {
            const el = e.currentTarget
            el.style.cursor = 'grabbing'
            const startX = e.pageX - el.offsetLeft
            const scrollLeft = el.scrollLeft
            const onMove = (ev: MouseEvent) => {
              const x = ev.pageX - el.offsetLeft
              el.scrollLeft = scrollLeft - (x - startX)
            }
            const onUp = () => {
              el.style.cursor = 'grab'
              window.removeEventListener('mousemove', onMove)
              window.removeEventListener('mouseup', onUp)
            }
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onUp)
          }}
        >
          {galleryImages.map((img, i) => (
            <GalleryCard key={img.alt + i} src={img.src} alt={img.alt} index={i} />
          ))}
        </div>
      </section>

      {/* ── Landscape break — full bleed ──────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ height: 'clamp(300px, 40vw, 500px)' }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 1.6, ease: EASE_CINEMATIC }}
        >
          <img
            src={imgLandscape}
            alt="Estate panorama"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,18,10,0.45) 0%, transparent 60%)',
          }}
        />
        <motion.div
          className="absolute bottom-8 left-6 md:left-16"
          variants={fadeUp}
          custom={0.2}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <p className="text-xs tracking-[0.25em] text-white/55 uppercase">
            THE ESTATE · MADIKERI, COORG
          </p>
        </motion.div>
      </div>

      {/* ── Book CTA ──────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-end">
          <h2
            style={{
              ...serif,
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            <SectionHeading delay={0}>Ready to book</SectionHeading>
            <SectionHeading delay={0.14}>your stay?</SectionHeading>
          </h2>
          <motion.div
            className="flex flex-col gap-4 items-start"
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
              className="text-xs tracking-[0.2em] uppercase border-b border-current pb-0.5 opacity-45 hover:opacity-100 transition-opacity"
              variants={fadeUp}
              custom={0}
            >
              EMAIL US
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
