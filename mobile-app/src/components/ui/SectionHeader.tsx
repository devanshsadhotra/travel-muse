import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

export function SectionHeader({ title, caption }: { title: string; caption?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  title: {
    color: COLORS.ink,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  caption: {
    color: COLORS.muted,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    flexShrink: 1,
    textAlign: "right",
  },
});
