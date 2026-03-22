// src/utils/theme.js
export const colors = {
  // Brand
  primary: '#00D4FF',
  primaryDark: '#0099BB',
  accent: '#FF6B35',
  gold: '#FFB800',

  // Background
  bg: '#0A0E1A',
  bgCard: '#111827',
  bgCardAlt: '#1A2236',
  bgInput: '#1E2A3D',

  // Text
  textPrimary: '#F0F4FF',
  textSecondary: '#8896A8',
  textMuted: '#4A5568',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  // Business type chips
  amazonFba: '#FF9500',
  shopify: '#96BF48',
  ecom: '#00D4FF',
  saas: '#A855F7',
  content: '#22C55E',
  agency: '#F59E0B',
  dropshipping: '#FF6B6B',

  // UI
  border: '#1E2A3D',
  divider: '#1A2236',
  overlay: 'rgba(0,0,0,0.7)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};

export const shadows = {
  card: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
};
