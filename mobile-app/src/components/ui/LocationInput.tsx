import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

export function LocationInput({
  value,
  onChangeText,
  onMapPress,
  placeholder = "Where are you going?",
}: {
  value: string;
  onChangeText: (v: string) => void;
  onMapPress?: () => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="location-sharp" size={18} color={COLORS.coral} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        style={styles.input}
      />
      {onMapPress ? (
        <Pressable onPress={onMapPress} hitSlop={10} style={styles.mapBtn}>
          <Ionicons name="map-outline" size={18} color={COLORS.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  input: {
    flex: 1,
    color: COLORS.ink,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
    padding: 0,
  },
  mapBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
