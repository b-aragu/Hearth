// Premium UI Theme Constants
// Consistent design system for Hearth mobile app

import { Platform } from 'react-native';

// --- PRIMARY COLOR PALETTE ---
// Soft, warm, and cohesive colors inspired by cozy, intimate aesthetics

export const COLORS = {
    // Base
    background: '#FDF8F6',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    white: '#FFFFFF',

    // Text
    textPrimary: '#3D3A3A',
    textSecondary: '#8A8585',
    textMuted: '#B5AEAE',

    // Primary Accent - Soft Rose
    accent: '#E8B4B8',
    accentLight: '#F5E1E3',
    accentDark: '#D49CA0',

    // Secondary Accent - Sage/Mint
    sage: '#B8D4C8',
    sageLight: '#D5EBE2',
    sageDark: '#9CC4B3',

    // Tertiary - Lavender
    lavender: '#D4B8E0',
    lavenderLight: '#EBE0F0',
    lavenderDark: '#C4A0D4',

    // Warm Neutrals
    cream: '#FFF9F0',
    beige: '#F5F0ED',
    warmGray: '#E8E4E1',

    // Status Colors
    streakBg: '#FFF1F2',
    streakText: '#C77D7D',
    success: '#9CC4B3',
    warning: '#ECC68A',
    error: '#E0A0A0',

    // Avatar Colors
    avatarYou: '#D4B8E0', // Soft lavender
    avatarPartner: '#B8D4C8', // Soft sage

    // Button Colors
    buttonPrimary: '#E8B4B8',
    buttonSecondary: '#D4C5B8',

    // Glow
    glow: '#F5D0D3',

    // Overlays
    overlay: 'rgba(0,0,0,0.5)',
    overlayLight: 'rgba(0,0,0,0.25)',
    glassBg: 'rgba(255, 255, 255, 0.85)',

    // Legacy (for backward compatibility)
    coral: '#E8B4B8',
    coralLight: '#F5E1E3',
    peach: '#F5E1E3',
    mint: '#B8D4C8',
    mintLight: '#D5EBE2',
    charcoal: '#3D3A3A',
    sky: '#B4D8E8',
    gold: '#ECC68A',
    rose: '#FFE4E6',
};

// --- GRADIENTS ---
export const GRADIENTS = {
    // Primary gradient
    primary: ['#E8B4B8', '#D4B8E0'] as const,
    primarySoft: ['#F5E1E3', '#EBE0F0'] as const,

    // Accent gradients
    rose: ['#E8B4B8', '#F5E1E3'] as const,
    sage: ['#B8D4C8', '#D5EBE2'] as const,
    lavender: ['#D4B8E0', '#EBE0F0'] as const,

    // Warm background
    warmBg: ['rgba(245, 208, 211, 0.12)', 'transparent', 'rgba(212, 197, 184, 0.08)'] as const,

    // Card overlays
    cardOverlay: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)'] as const,

    // Legacy (for backward compatibility)
    coralPeach: ['#E8B4B8', '#F5E1E3'] as const,
    mintSky: ['#B8D4C8', '#B4D8E8'] as const,
    lavenderRose: ['#D4B8E0', '#F5E1E3'] as const,
    goldPeach: ['#ECC68A', '#F5E1E3'] as const,
    cream: ['#FDF8F6', '#FFFFFF'] as const,
    sunset: ['#F5E1E3', '#EBE0F0', '#FDF8F6'] as const,
    ocean: ['#B4D8E8', '#B8D4C8'] as const,
};

// --- TYPOGRAPHY ---
export const TYPOGRAPHY = {
    display: {
        fontSize: 36,
        fontFamily: 'Outfit_700Bold',
        lineHeight: 44,
        letterSpacing: -0.5,
    },
    h1: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        lineHeight: 36,
    },
    h2: {
        fontSize: 22,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 28,
    },
    h3: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 24,
    },
    body: {
        fontSize: 15,
        fontFamily: 'DMSans_400Regular',
        lineHeight: 22,
    },
    bodyMedium: {
        fontSize: 15,
        fontFamily: 'DMSans_500Medium',
        lineHeight: 22,
    },
    bodySemiBold: {
        fontSize: 15,
        fontFamily: 'DMSans_600SemiBold',
        lineHeight: 22,
    },
    caption: {
        fontSize: 13,
        fontFamily: 'DMSans_400Regular',
        lineHeight: 18,
    },
    captionMedium: {
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
        lineHeight: 18,
    },
    label: {
        fontSize: 11,
        fontFamily: 'DMSans_600SemiBold',
        lineHeight: 14,
        letterSpacing: 0.8,
        textTransform: 'uppercase' as const,
    },
};

// --- SHADOWS ---
// Cross-platform shadows: native shadow* props for iOS, elevation for Android, boxShadow for Web
const createShadow = (
    color: string,
    offsetY: number,
    opacity: number,
    radius: number,
    elevation: number
) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
    // Web-compatible boxShadow
    ...(Platform.OS === 'web' ? {
        boxShadow: `0px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    } : {}),
});

const createGlowShadow = (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    // Web-compatible boxShadow with color
    ...(Platform.OS === 'web' ? {
        boxShadow: `0px 0px 16px ${color}40`,
    } : {}),
});

export const SHADOWS = {
    xs: createShadow('#000', 1, 0.03, 2, 1),
    sm: createShadow('#000', 2, 0.04, 4, 2),
    md: createShadow('#000', 4, 0.06, 12, 4),
    lg: createShadow('#000', 8, 0.08, 24, 8),
    glow: createGlowShadow('#E8B4B8'),
    sageGlow: createGlowShadow('#B8D4C8'),
    lavenderGlow: createGlowShadow('#D4B8E0'),
    // Legacy
    mintGlow: createGlowShadow('#B8D4C8'),
};

// Export helpers for custom inline shadows
export const createCustomShadow = createShadow;
export const createCustomGlow = createGlowShadow;

// --- SPACING ---
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// --- BORDER RADIUS ---
export const RADIUS = {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
};

// --- ANIMATION ---
export const ANIMATION = {
    quick: 120,
    normal: 200,
    slow: 350,
    gentle: 500,
    spring: {
        damping: 15,
        stiffness: 120,
    },
    springBouncy: {
        damping: 12,
        stiffness: 150,
    },
};

// --- TAB BAR ---
export const TAB_BAR = {
    height: 80,
    paddingBottom: 16,
    backgroundColor: 'rgba(253, 248, 246, 0.95)',
    activeColor: '#E8B4B8',
    inactiveColor: '#B5AEAE',
    iconSize: 22,
};
