import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export function SectionHeader({ title, caption }: { title: string; caption?: string }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 12,
    },
    title: {
      color: c.ink,
      fontSize: 22,
      lineHeight: 28,
      fontFamily: "DMSerifDisplay_400Regular",
    },
    caption: {
      color: c.muted,
      fontSize: 12,
      fontFamily: "PlusJakartaSans_400Regular",
      flexShrink: 1,
      textAlign: "right",
    },
  });
}
