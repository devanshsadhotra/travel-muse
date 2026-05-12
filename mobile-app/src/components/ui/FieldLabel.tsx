import React from "react";
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/theme";

export function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.muted,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
