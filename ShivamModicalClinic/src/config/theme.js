/**
 * Design Tokens - Colors, Typography, Spacing
 */

export const COLORS = {
  // Primary Colors
  primary: '#007FFF',
  primaryDark: '#0B4F8F',
  accent: '#26C281',
  danger: '#FF4D6D',
  warning: '#FFA726',
  
  // Background
  background: '#F3F7FB',
  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFC',
  
  // Text
  textPrimary: '#1B2B3A',
  textSecondary: '#8A97A7',
  textMuted: '#B8C4D0',
  
  // Border
  border: '#E5EAF0',
  
  // Status
  success: '#26C281',
  info: '#3B82F6',
  
  // Gradients (for LinearGradient)
  gradientPrimary: ['#007FFF', '#0B4F8F'],
  gradientAccent: ['#FF6B9D', '#FFA726'],
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: '#007FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};