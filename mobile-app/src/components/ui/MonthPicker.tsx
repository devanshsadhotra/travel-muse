import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

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
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.selectField} onPress={onOpen}>
        <Text style={styles.selectFieldText}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={onClose} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose travel month</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={20} color={COLORS.ink} />
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
                    {active ? <Ionicons name="checkmark" size={18} color={COLORS.white} /> : null}
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

const styles = StyleSheet.create({
  fieldBlock: {
    gap: 10,
  },
  fieldLabel: {
    color: COLORS.ink,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  selectField: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  selectFieldText: {
    color: COLORS.ink,
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
    backgroundColor: "rgba(20,27,32,0.32)",
  },
  modalSheet: {
    backgroundColor: COLORS.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: "70%",
    gap: 14,
  },
  modalHandle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.line,
    alignSelf: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modalTitle: {
    color: COLORS.ink,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  modalOptions: {
    gap: 10,
    paddingBottom: 8,
  },
  modalOption: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  modalOptionActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  modalOptionText: {
    color: COLORS.ink,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
    flexShrink: 1,
  },
  modalOptionTextActive: {
    color: COLORS.white,
  },
});
