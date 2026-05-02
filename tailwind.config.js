const { colors } = require("./constants/colors");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: colors.brandPrimary,
        secondary: colors.brandSecondary,
        background: colors.background,
        "background-secondary": colors.backgroundSecondary,
        "background-dark": colors.backgroundDark,
        "background-secondary-dark": colors.backgroundSecondaryDark,
        "text-primary": colors.textPrimary,
        "text-secondary": colors.textSecondary,
        "text-disabled": colors.textDisabled,
        "text-primary-dark": colors.textPrimaryDark,
        "text-secondary-dark": colors.textSecondaryDark,
        border: colors.border,
        "border-secondary": colors.borderSecondary,
        "border-dark": colors.borderDark,
        "border-secondary-dark": colors.borderSecondaryDark,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
      },
    },
  },
  plugins: [],
};
