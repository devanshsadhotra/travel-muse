import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

type PillVariant = "soft" | "coral" | "dark" | "ghost" | "outline";

export function Pill({ label, variant = "soft" }: { label: string; variant?: PillVariant }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={[styles.pillBase, styles[`pill_${variant}`]]}>
      <Text style={[styles.textBase, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    pillBase: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: "flex-start",
    },
    pill_soft: { backgroundColor: c.mist },
    pill_coral: { backgroundColor: c.coral },
    pill_dark: { backgroundColor: c.surfaceDark },
    pill_ghost: { backgroundColor: "rgba(255,255,255,0.14)" },
    pill_outline: { backgroundColor: c.paper, borderWidth: 1, borderColor: c.line },

    textBase: {
      fontSize: 12,
      textTransform: "capitalize",
    },
    text_soft: { color: c.ink, fontFamily: "PlusJakartaSans_700Bold" },
    text_coral: { color: c.white, fontFamily: "PlusJakartaSans_700Bold" },
    text_dark: { color: c.white, fontFamily: "PlusJakartaSans_700Bold" },
    text_ghost: { color: c.white, fontFamily: "PlusJakartaSans_500Medium" },
    text_outline: { color: c.ink, fontFamily: "PlusJakartaSans_500Medium" },
  });
}
