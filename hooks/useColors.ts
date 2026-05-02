import { useColorScheme } from 'react-native';
import { colors } from '@/constants/colors';

export function useColors() {
    const scheme = useColorScheme() ?? 'light';
    const isDark = scheme === 'dark';

    return {
        textPrimary: isDark ? colors.textPrimaryDark : colors.textPrimary,
        textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondary,
        textDisabled: colors.textDisabled,
        background: isDark ? colors.backgroundDark : colors.background,
        backgroundSecondary: isDark ? colors.backgroundSecondaryDark : colors.backgroundSecondary,
        border: isDark ? colors.borderDark : colors.border,
        borderSecondary: isDark ? colors.borderSecondaryDark : colors.borderSecondary,
        primary: colors.brandPrimary,
        secondary: colors.brandSecondary,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
    };
}