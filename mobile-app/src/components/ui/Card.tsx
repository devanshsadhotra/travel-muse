import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../../constants/theme";

type CardVariant = "default" | "dark" | "muted";

export function Card({
  children,
  variant = "default",
  style,
}: {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
}) {
  return <View style={[styles[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: COLORS.paper,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dark: {
    backgroundColor: COLORS.ink,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  muted: {
    backgroundColor: COLORS.mist,
    borderRadius: 20,
    padding: 20,
  },
});
