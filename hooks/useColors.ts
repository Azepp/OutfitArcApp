// hooks/useColors.ts
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/constants/colors";

export function useColors() {
    const { isDark } = useTheme();

    return {
        textPrimary: isDark ? colors.textPrimaryDark : colors.textPrimary,
        textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondary,
        textDisabled: colors.textDisabled,
        background: isDark ? colors.backgroundDark : colors.background,
        backgroundSecondary: isDark ? colors.backgroundSecondaryDark : colors.backgroundSecondary,
        backgroundGradient: isDark
            ? (["#35383D", "#2A2C2E"] as [string, string])
            : ([colors.backgroundSecondary, colors.backgroundSecondary] as [string, string]),
        border: isDark ? colors.borderDark : colors.border,
        borderSecondary: isDark ? colors.borderSecondaryDark : colors.borderSecondary,
        primary: colors.brandPrimary,
        secondary: colors.brandSecondary,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
    };
}