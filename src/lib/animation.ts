/**
 * Shared animation utilities for CoorgResort
 * All animations respect prefers-reduced-motion via the useReducedMotion hook.
 * Use transform + opacity only for compositor-layer performance.
 */
import { useReducedMotion, type Variants } from 'framer-motion'

// ─────────────────────────────────────────────
// Timing constants
// ─────────────────────────────────────────────
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const
export const EASE_CINEMATIC = [0.25, 0.1, 0.0, 1.0] as const
/** Very slow ease — used for the welcome intro letter-spacing expansion */
export const EASE_BREATHE = [0.4, 0, 0.2, 1] as const

// ─────────────────────────────────────────────
// viewport trigger config (used in whileInView)
// ─────────────────────────────────────────────
export const VIEWPORT_ONCE = { once: true, margin: '-80px 0px' } as const
export const VIEWPORT_REPEAT = { once: false, margin: '-100px 0px' } as const

// ─────────────────────────────────────────────
// Reusable Variants
// ─────────────────────────────────────────────

/** Masked upward text reveal — clip-path + translateY */
export const textReveal: Variants = {
  hidden: { y: '105%', opacity: 0 },
  visible: (delay: number = 0) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 1.1,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
}

/** Staggered container — staggers children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: (stagger: number = 0.12) => ({
    transition: {
      staggerChildren: stagger,
      delayChildren: 0,
    },
  }),
}

/** Fade + subtle lift — for body copy, labels, secondary elements */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
}

/** Fade in only — for overlays, backgrounds */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.9,
      delay,
      ease: 'easeOut',
    },
  }),
}

/** Horizontal slide in from right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
}

/** Horizontal slide in from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
}

/** Clip-path reveal — left to right (for images) */
export const clipRevealX: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: (delay: number = 0) => ({
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 1.2,
      delay,
      ease: EASE_IN_OUT_QUART,
    },
  }),
}

/** Clip-path reveal — bottom to top (for images) */
export const clipRevealY: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: (delay: number = 0) => ({
    clipPath: 'inset(0% 0 0 0)',
    transition: {
      duration: 1.3,
      delay,
      ease: EASE_IN_OUT_QUART,
    },
  }),
}

/** Slow image scale — hero / cinematic entrances */
export const imageScale: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: {
      duration: 2.0,
      ease: EASE_CINEMATIC,
    },
  },
}

/** Contained → expanded width (Hill View section) */
export const expandWidth: Variants = {
  hidden: { scaleX: 0.88, opacity: 0.6 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: EASE_OUT_EXPO,
    },
  },
}

/** Scale up gently on viewport enter */
export const scaleIn: Variants = {
  hidden: { scale: 0.94, opacity: 0 },
  visible: (delay: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.0,
      delay,
      ease: EASE_OUT_EXPO,
    },
  }),
}

// ─────────────────────────────────────────────
// Hook: returns safe animation props that
// collapse to no-op when reduced-motion is on
// ─────────────────────────────────────────────
export function useMotionSafe() {
  const reduce = useReducedMotion()

  function safe<T extends object>(animateProps: T): T | Record<string, never> {
    return reduce ? {} : animateProps
  }

  return { reduce: !!reduce, safe }
}
