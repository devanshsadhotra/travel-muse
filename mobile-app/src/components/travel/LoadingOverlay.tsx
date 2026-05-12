import React from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

export function LoadingOverlay({
  opacity,
  message,
}: {
  opacity: Animated.Value;
  message: string;
}) {
  return (
    <Animated.View style={[styles.backdrop, { opacity }]}>
      <View style={styles.card}>
        <View style={styles.orb}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
        <Text style={styles.title}>Designing your journey</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.caption}>Longer trips can take a little extra time.</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.ink,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 34,
    alignItems: "center",
    gap: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  orb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,56,92,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 34,
    textAlign: "center",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  message: {
    color: "#D6E4E5",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  caption: {
    color: "#B7D9DA",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: "PlusJakartaSans_400Regular",
  },
});
