import { useColors } from "@/hooks/useColors";
import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={f.field}>
      <Typography variant="label" color={c.textSecondary} weight="semibold" style={{ marginBottom: 6 }}>
        {label}
      </Typography>
      {children}
    </View>
  );
}

const f = {
  field: { gap: 6 },
};
