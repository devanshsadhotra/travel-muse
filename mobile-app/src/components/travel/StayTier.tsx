import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { StayOption } from "../../types/travel";

export function StayTier({
  label,
  icon,
  stays,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  stays: StayOption[];
}) {
  if (!stays.length) {
    return null;
  }

  return (
    <View style={styles.stayTierCard}>
      <View style={styles.stayTierHeader}>
        <View style={styles.stayTierBadge}>
          <Ionicons name={icon} size={16} color={COLORS.ocean} />
        </View>
        <Text style={styles.stayTierTitle}>{label}</Text>
      </View>
      {stays.map((stay, index) => (
        <View key={`${label}-${stay.name}-${index}`} style={styles.stayOptionCard}>
          <View style={styles.stayOptionTopRow}>
            <View style={styles.stayOptionText}>
              <Text style={styles.stayName}>{stay.name}</Text>
              <Text style={styles.stayMeta}>
                {stay.type} in {stay.area}
              </Text>
            </View>
            <Text style={styles.stayPrice}>{stay.priceRange}</Text>
          </View>
          <Text style={styles.stayReason}>{stay.whyStayHere}</Text>
          {!!stay.bestFor?.length && <Text style={styles.stayBestFor}>Best for: {stay.bestFor.join(" • ")}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stayTierCard: {
    backgroundColor: COLORS.paper,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 14,
  },
  stayTierHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stayTierBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E7F1EF",
    alignItems: "center",
    justifyContent: "center",
  },
  stayTierTitle: {
    color: COLORS.ink,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  stayOptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  stayOptionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  stayOptionText: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  stayName: {
    color: COLORS.ink,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_700Bold",
    flexShrink: 1,
  },
  stayMeta: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans_400Regular",
    textTransform: "capitalize",
    flexShrink: 1,
  },
  stayPrice: {
    color: COLORS.coral,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "right",
    flexShrink: 1,
  },
  stayReason: {
    color: COLORS.ink,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  stayBestFor: {
    color: COLORS.ocean,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans_500Medium",
  },
});
