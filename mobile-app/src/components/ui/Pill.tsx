import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

type PillVariant = "soft" | "coral" | "dark" | "ghost" | "outline";

export function Pill({ label, variant = "soft" }: { label: string; variant?: PillVariant }) {
  return (
    <View style={[pillStyles.base, pillStyles[variant]]}>
      <Text style={[textStyles.base, textStyles[variant]]}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  soft: { backgroundColor: COLORS.mist },
  coral: { backgroundColor: COLORS.coral },
  dark: { backgroundColor: COLORS.ink },
  ghost: { backgroundColor: "rgba(255,255,255,0.14)" },
  outline: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
});

const textStyles = StyleSheet.create({
  base: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  soft: { color: COLORS.ink, fontFamily: "PlusJakartaSans_700Bold" },
  coral: { color: COLORS.white, fontFamily: "PlusJakartaSans_700Bold" },
  dark: { color: COLORS.white, fontFamily: "PlusJakartaSans_700Bold" },
  ghost: { color: COLORS.white, fontFamily: "PlusJakartaSans_500Medium" },
  outline: { color: COLORS.ink, fontFamily: "PlusJakartaSans_500Medium" },
});
