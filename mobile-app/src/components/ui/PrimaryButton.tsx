import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable style={styles.button} onPress={onPress} disabled={disabled || loading}>
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Text style={styles.label}>{label}</Text>
            {icon ? <Ionicons name={icon} size={18} color={colors.white} /> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    button: {
      borderRadius: 14,
      overflow: "hidden",
    },
    inner: {
      backgroundColor: c.coral,
      paddingHorizontal: 18,
      paddingVertical: 17,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },
    label: {
      color: c.white,
      fontSize: 16,
      fontFamily: "PlusJakartaSans_700Bold",
    },
  });
}
