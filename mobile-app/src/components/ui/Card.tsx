import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

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
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return <View style={[styles[variant], style]}>{children}</View>;
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    default: {
      backgroundColor: c.paper,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    dark: {
      backgroundColor: c.surfaceDark,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000000",
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    muted: {
      backgroundColor: c.mist,
      borderRadius: 20,
      padding: 20,
    },
  });
}
