import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

export function Metric({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.metricCard}>
      <Ionicons name={icon} size={18} color={COLORS.ocean} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    color: "#B7D9DA",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metricValue: {
    color: COLORS.white,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
  },
});
