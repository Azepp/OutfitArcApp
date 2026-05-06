import { Text, type TextProps, StyleSheet } from "react-native";
import { fontFamily } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";

type Variant = "h1" | "h2" | "h3" | "body" | "bodyMedium" | "caption" | "label";
type Weight = "regular" | "medium" | "semibold" | "bold";

type TypographyProps = TextProps & {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  secondary?: boolean;
};

const variantFont: Record<Variant, string> = {
  h1: fontFamily.bold,
  h2: fontFamily.bold,
  h3: fontFamily.semibold,
  body: fontFamily.regular,
  bodyMedium: fontFamily.medium,
  caption: fontFamily.regular,
  label: fontFamily.medium,
};

const variantSize: Record<Variant, number> = {
  h1: 30,
  h2: 24,
  h3: 20,
  body: 16,
  bodyMedium: 14,
  caption: 14,
  label: 12,
};

export function Typography({ variant = "body", weight, color, secondary, style, ...rest }: TypographyProps) {
  const c = useColors();

  const textColor = color ?? (secondary ? c.textSecondary : c.textPrimary);
  const resolvedFont = weight ? fontFamily[weight] : variantFont[variant];

  return (
    <Text
      style={[
        {
          fontFamily: resolvedFont,
          fontSize: variantSize[variant],
          color: textColor,
        },
        style,
      ]}
      {...rest}
    />
  );
}
