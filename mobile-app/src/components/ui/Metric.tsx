import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export function Metric({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  if (!value) {
    return null;
  }

  return (
    <View style={styles.metricCard}>
      <Ionicons name={icon} size={18} color={colors.ocean} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    metricCard: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 14,
      gap: 6,
      minWidth: "44%",
    },
    metricLabel: {
      color: c.tealMuted,
      fontSize: 12,
      fontFamily: "PlusJakartaSans_700Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    metricValue: {
      color: c.white,
      fontFamily: "PlusJakartaSans_500Medium",
      fontSize: 15,
    },
  });
}
