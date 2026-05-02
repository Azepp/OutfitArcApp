export const colors = {
    // brand
    brandPrimary: '#01AED6',
    brandSecondary: '#0C679C',

    // background
    background: '#EEEFF3',
    backgroundSecondary: '#FEFEFE',
    backgroundDark: '#141517',
    backgroundSecondaryDark: '#2A2C2E',

    // text
    textPrimary: '#020305',
    textSecondary: '#4A4E51',
    textDisabled: '#A0A0A0',
    textPrimaryDark: '#F5F6F8',
    textSecondaryDark: '#A6AAB3',

    // border
    border: '#ECEDEF',
    borderSecondary: '#F4F6F5',
    borderDark: '#1E2327',
    borderSecondaryDark: '#1D2124',

    // status
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
} as const;

export type ColorKey = keyof typeof colors;