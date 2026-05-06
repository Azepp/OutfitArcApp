import { Pressable, PressableProps, View, StyleSheet, ViewStyle } from "react-native";
import { Typography } from "./typography";
import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
type Size = "sm" | "md" | "lg";

type ButtonProps = PressableProps & {
  children: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  gradientColors?: [string, string, ...string[]];
  style?: ViewStyle;
};

const sizeStyle: Record<Size, ViewStyle> = {
  sm: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  md: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  lg: { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 16 },
};

const labelSize: Record<Size, "label" | "caption" | "bodyMedium"> = {
  sm: "label",
  md: "caption",
  lg: "bodyMedium",
};

export function Button({ children, label, icon, iconPosition = "left", variant = "primary", size = "md", fullWidth = false, disabled = false, gradientColors, onPress, style, ...rest }: ButtonProps) {
  const c = useColors();

  const variantStyle: Record<Variant, { base: ViewStyle; pressed: ViewStyle; labelColor: string }> = {
    primary: {
      base: { backgroundColor: c.secondary, borderWidth: 1.5, borderColor: c.border },
      pressed: { backgroundColor: c.secondary, opacity: 0.8 },
      labelColor: "#fff",
    },
    secondary: {
      base: { backgroundColor: c.backgroundSecondary },
      pressed: { backgroundColor: c.border },
      labelColor: c.textPrimary,
    },
    outline: {
      base: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: c.primary },
      pressed: { backgroundColor: c.primary + "15", borderWidth: 1.5, borderColor: c.primary },
      labelColor: c.primary,
    },
    ghost: {
      base: { backgroundColor: "transparent" },
      pressed: { backgroundColor: c.primary + "15" },
      labelColor: c.primary,
    },
    danger: {
      base: { backgroundColor: "#F44336" },
      pressed: { backgroundColor: "#C62828" },
      labelColor: "#fff",
    },
    gradient: {
      base: { backgroundColor: "transparent" },
      pressed: { backgroundColor: "transparent" },
      labelColor: "#fff",
    },
  };

  const config = variantStyle[variant];
  const defaultGradient: [string, string] = [c.primary, c.secondary ?? "#0C679C"];

  const renderContent = (pressed: boolean) => {
    if (variant === "gradient") {
      return (
        <LinearGradient colors={gradientColors ?? defaultGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFillObject, { opacity: pressed ? 0.8 : 1 }]}>
          <View style={styles.gradientInner}>{renderChildren(config.labelColor)}</View>
        </LinearGradient>
      );
    }
    return renderChildren(config.labelColor);
  };

  const renderChildren = (labelColor: string) => {
    // kalau ada label dan icon
    if (label && icon) {
      return (
        <View style={styles.row}>
          {iconPosition === "left" && icon}
          <Typography variant={labelSize[size]} color={labelColor}>
            {label}
          </Typography>
          {iconPosition === "right" && icon}
        </View>
      );
    }

    // kalau hanya label string
    if (label) {
      return (
        <Typography variant={labelSize[size]} color={labelColor}>
          {label}
        </Typography>
      );
    }

    return <View style={styles.column}>{children}</View>;
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: disabled ? 0.5 : 1,
          overflow: "hidden",
        } as ViewStyle,
        sizeStyle[size],
        variant !== "gradient" ? (pressed ? config.pressed : config.base) : undefined,
        style,
      ]}
      {...rest}
    >
      {({ pressed }) => renderContent(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  gradientInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
