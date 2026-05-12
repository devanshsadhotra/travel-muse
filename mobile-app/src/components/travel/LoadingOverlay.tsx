import React from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/theme";

export function LoadingOverlay({
  opacity,
  message,
}: {
  opacity: Animated.Value;
  message: string;
}) {
  return (
    <Animated.View style={[styles.loadingOverlay, { opacity }]}>
      <LinearGradient colors={["rgba(32,49,60,0.92)", "rgba(46,125,138,0.9)"]} style={styles.loadingCard}>
        <View style={styles.loadingOrb}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
        <Text style={styles.loadingTitle}>Designing your journey</Text>
        <Text style={styles.loadingMessage}>{message}</Text>
        <Text style={styles.loadingCaption}>Longer trips can take a little extra time.</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,27,32,0.28)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 34,
    alignItems: "center",
    gap: 14,
  },
  loadingOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  loadingTitle: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 34,
    textAlign: "center",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  loadingMessage: {
    color: "#E6F2F0",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  loadingCaption: {
    color: "#BCD6D5",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: "PlusJakartaSans_400Regular",
  },
});
