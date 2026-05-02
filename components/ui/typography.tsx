import { Text, type TextProps } from "react-native";
import { fontFamily } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";

type Variant = "h1" | "h2" | "h3" | "body" | "bodyMedium" | "caption" | "label";
type Weight = "regular" | "medium" | "semibold" | "bold";

type TypographyProps = TextProps & {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  secondary?: boolean;
  className?: string;
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

const variantClass: Record<Variant, string> = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  body: "text-base",
  bodyMedium: "text-base",
  caption: "text-sm",
  label: "text-xs",
};

export function Typography({ variant = "body", weight, color, secondary, className = "", style, ...rest }: TypographyProps) {
  const c = useColors();

  const textColor = color ?? (secondary ? c.textSecondary : c.textPrimary);
  const resolvedFont = weight ? fontFamily[weight] : variantFont[variant];

  return <Text className={`${variantClass[variant]} ${className}`} style={[{ fontFamily: resolvedFont, color: textColor }, style]} {...rest} />;
}
