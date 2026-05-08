export const colors = {
    // brand
    brandPrimary: '#ff5a00',
    brandSecondary: '#ff9a00',

    // background
    background: '#EEEFF3',
    backgroundSecondary: '#FEFEFE',
    backgroundDark: '#141517',
    backgroundSecondaryDark: '#2A2C2E',
    backgroundGradientDark: ['#35383D', '#2A2C2E'] as [string, string],

    // text
    textPrimary: '#020305',
    textSecondary: '#4A4E51',
    textDisabled: '#A0A0A0',
    textPrimaryDark: '#F5F6F8',
    textSecondaryDark: '#A6AAB3',

    // border
    border: '#ECEDEF',
    borderSecondary: '#D1D3D4',
    borderDark: '#1E2327',
    borderSecondaryDark: '#4A4E51',

    // status
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
} as const;

export type ColorKey = keyof typeof colors;