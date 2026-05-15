import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { StayOption } from "../../types/travel";
import { Card } from "../ui/Card";

export function StayTier({
  label,
  icon,
  stays,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  stays: StayOption[];
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  if (!stays.length) {
    return null;
  }

  return (
    <Card style={{ gap: 12, padding: 18 }}>
      <View style={styles.stayTierHeader}>
        <View style={styles.stayTierBadge}>
          <Ionicons name={icon} size={16} color={colors.ocean} />
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
    </Card>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    stayTierHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    stayTierBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.mist,
      alignItems: "center",
      justifyContent: "center",
    },
    stayTierTitle: {
      color: c.ink,
      fontSize: 20,
      lineHeight: 24,
      fontFamily: "DMSerifDisplay_400Regular",
    },
    stayOptionCard: {
      backgroundColor: c.paper,
      borderRadius: 14,
      padding: 14,
      gap: 8,
      shadowColor: "#000000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
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
      color: c.ink,
      fontSize: 15,
      lineHeight: 20,
      fontFamily: "PlusJakartaSans_700Bold",
      flexShrink: 1,
    },
    stayMeta: {
      color: c.muted,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "PlusJakartaSans_400Regular",
      textTransform: "capitalize",
      flexShrink: 1,
    },
    stayPrice: {
      backgroundColor: c.peach,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      color: c.coral,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: "PlusJakartaSans_700Bold",
      textAlign: "center",
      flexShrink: 0,
      overflow: "hidden",
    },
    stayReason: {
      color: c.muted,
      fontSize: 13,
      lineHeight: 20,
      fontFamily: "PlusJakartaSans_400Regular",
    },
    stayBestFor: {
      color: c.ocean,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: "PlusJakartaSans_500Medium",
    },
  });
}
