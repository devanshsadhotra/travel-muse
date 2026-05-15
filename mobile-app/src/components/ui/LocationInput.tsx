import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

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
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <Ionicons name="location-sharp" size={18} color={colors.coral} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      {onMapPress ? (
        <Pressable onPress={onMapPress} hitSlop={10} style={styles.mapBtn}>
          <Ionicons name="map-outline" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: c.paper,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: c.line,
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
      color: c.ink,
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
}
