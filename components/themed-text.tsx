import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

export function ThemedText({ type = "default", className = "", ...rest }: ThemedTextProps) {
  const typeClass = {
    default: "text-base leading-6",
    defaultSemiBold: "text-base leading-6 font-semibold",
    title: "text-3xl font-bold",
    subtitle: "text-xl font-bold",
    link: "text-base leading-8 text-cyan-600",
  }[type];

  const hasCustomColor = className.includes("text-");
  const defaultColor = hasCustomColor ? "" : "text-black dark:text-white";

  return <Text className={`${defaultColor} ${typeClass} ${className}`} {...rest} />;
}
