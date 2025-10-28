/**
 * ShivamModicalClinic - Acentry Motion Tokens Library
 * Complete animation system for React Native
 * Compatible with: React Native Reanimated 2.x+
 */

// ============================================
// TIMING & EASING TOKENS
// ============================================

export const DURATIONS = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
};

export const EASING = {
  // Standard Material Design easings
  standard: [0.4, 0.0, 0.2, 1],
  decelerate: [0.0, 0.0, 0.2, 1],
  accelerate: [0.4, 0.0, 1, 1],
  
  // Acentry smooth natural motion
  smooth: [0.22, 1, 0.36, 1],
  smoothOut: [0.34, 1.56, 0.64, 1],
  
  // Bouncy & playful
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: [0.34, 1.56, 0.64, 1],
  
  // Sharp & snappy
  sharp: [0.4, 0.0, 0.6, 1],
  
  // For exits
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
};

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

export const ENTRANCE = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: DURATIONS.normal,
    easing: EASING.decelerate,
  },
  
  fadeInUp: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    duration: DURATIONS.normal,
    easing: EASING.smooth,
  },
  
  fadeInDown: {
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    duration: DURATIONS.normal,
    easing: EASING.smooth,
  },
  
  slideInUp: {
    from: { translateY: 50, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    duration: DURATIONS.slow,
    easing: EASING.smooth,
  },
  
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    duration: DURATIONS.normal,
    easing: EASING.bounce,
  },
};

// ============================================
// EXIT ANIMATIONS
// ============================================

export const EXIT = {
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: DURATIONS.fast,
    easing: EASING.accelerate,
  },
  
  fadeOutUp: {
    from: { opacity: 1, translateY: 0 },
    to: { opacity: 0, translateY: -20 },
    duration: DURATIONS.fast,
    easing: EASING.easeIn,
  },
  
  slideOutDown: {
    from: { translateY: 0, opacity: 1 },
    to: { translateY: 50, opacity: 0 },
    duration: DURATIONS.normal,
    easing: EASING.easeIn,
  },
};

// ============================================
// MICRO-INTERACTIONS
// ============================================

export const MICRO = {
  // Button press
  buttonPress: {
    from: { scale: 1 },
    to: { scale: 0.98 },
    duration: DURATIONS.instant,
    easing: EASING.standard,
  },
  
  // Card tap
  cardTap: {
    from: { scale: 1 },
    to: { scale: 0.99 },
    duration: 150,
    easing: EASING.standard,
  },
};

export default {
  DURATIONS,
  EASING,
  ENTRANCE,
  EXIT,
  MICRO,
};
