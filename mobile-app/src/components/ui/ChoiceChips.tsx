import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
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
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

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

function makeStyles(c: Colors) {
  return StyleSheet.create({
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
      backgroundColor: c.paper,
      borderWidth: 1,
      borderColor: c.line,
    },
    chipActive: {
      backgroundColor: c.ink,
      borderColor: c.ink,
    },
    chipText: {
      color: c.ink,
      fontSize: 13,
      fontFamily: "PlusJakartaSans_500Medium",
      flexShrink: 1,
    },
    chipTextActive: {
      color: c.paper,
    },
  });
}
