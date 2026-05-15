import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { FieldLabel } from "./FieldLabel";

export function MonthPicker({
  label,
  options,
  value,
  open,
  onOpen,
  onClose,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (next: string) => void;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.fieldBlock}>
      <FieldLabel>{label}</FieldLabel>
      <Pressable style={styles.selectField} onPress={onOpen}>
        <Text style={styles.selectFieldText}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={onClose} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose travel month</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.ink} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalOptions}>
              {options.map((option) => {
                const active = option === value;
                return (
                  <Pressable
                    key={option}
                    style={[styles.modalOption, active && styles.modalOptionActive]}
                    onPress={() => {
                      onChange(option);
                      onClose();
                    }}
                  >
                    <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>{option}</Text>
                    {active ? <Ionicons name="checkmark" size={18} color={colors.white} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    fieldBlock: {
      gap: 8,
    },
    selectField: {
      backgroundColor: c.paper,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: c.line,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      shadowColor: "#000000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    selectFieldText: {
      color: c.ink,
      fontFamily: "PlusJakartaSans_500Medium",
      fontSize: 15,
      flex: 1,
    },
    modalRoot: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(20,27,32,0.48)",
    },
    modalSheet: {
      backgroundColor: c.paper,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
      maxHeight: "70%",
      gap: 14,
      shadowColor: "#000000",
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: -4 },
      elevation: 10,
    },
    modalHandle: {
      width: 42,
      height: 4,
      borderRadius: 999,
      backgroundColor: c.line,
      alignSelf: "center",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    modalTitle: {
      color: c.ink,
      fontSize: 24,
      lineHeight: 28,
      fontFamily: "DMSerifDisplay_400Regular",
    },
    modalOptions: {
      gap: 10,
      paddingBottom: 8,
    },
    modalOption: {
      backgroundColor: c.mist,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    modalOptionActive: {
      backgroundColor: c.ink,
    },
    modalOptionText: {
      color: c.ink,
      fontSize: 15,
      fontFamily: "PlusJakartaSans_500Medium",
      flexShrink: 1,
    },
    modalOptionTextActive: {
      color: c.paper,
    },
  });
}
