import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { FieldLabel } from "./FieldLabel";

type SingleProps = {
  label: string;
  options: string[];
  multi?: false;
  value: string;
  onChange: (next: string) => void;
};

type MultiProps = {
  label: string;
  options: string[];
  multi: true;
  value: string[];
  onChange: (next: string[]) => void;
};

export function ChoiceChips(props: SingleProps | MultiProps) {
  const isActive = (option: string) =>
    props.multi ? props.value.includes(option) : props.value === option;

  const handlePress = (option: string) => {
    if (props.multi) {
      const next = props.value.includes(option)
        ? props.value.filter((v) => v !== option)
        : [...props.value, option];
      props.onChange(next);
    } else {
      props.onChange(option);
    }
  };

  return (
    <View style={styles.fieldBlock}>
      <FieldLabel>{props.label}</FieldLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {props.options.map((option) => {
          const active = isActive(option);
          return (
            <Pressable key={option} onPress={() => handlePress(option)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    gap: 8,
  },
  chipRow: {
    gap: 8,
    paddingRight: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  chipActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  chipText: {
    color: COLORS.ink,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    flexShrink: 1,
  },
  chipTextActive: {
    color: COLORS.white,
  },
});
