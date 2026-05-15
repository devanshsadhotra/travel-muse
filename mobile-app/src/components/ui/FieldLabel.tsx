import React from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export function FieldLabel({ children }: { children: string }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return <Text style={styles.label}>{children}</Text>;
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    label: {
      color: c.muted,
      fontSize: 12,
      fontFamily: "PlusJakartaSans_700Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  });
}
