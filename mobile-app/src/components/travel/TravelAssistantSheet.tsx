import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { TravelChatMessage } from "../../types/travel";
import { PrimaryButton } from "../ui/PrimaryButton";

export function TravelAssistantSheet({
  visible,
  messages,
  question,
  loading,
  error,
  chatScrollRef,
  onClose,
  onChangeQuestion,
  onSubmit,
}: {
  visible: boolean;
  messages: TravelChatMessage[];
  question: string;
  loading: boolean;
  error: string | null;
  chatScrollRef: React.RefObject<ScrollView | null>;
  onClose: () => void;
  onChangeQuestion: (next: string) => void;
  onSubmit: () => void;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ask about your trip</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={colors.ink} />
            </Pressable>
          </View>
          <Text style={styles.assistantHint}>
            This assistant stays within travel context like weather, packing, budgets, transport, food, and timing.
          </Text>
          <ScrollView
            ref={chatScrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {messages.map((message, index) => (
              <View
                key={`${message.role}-${index}`}
                style={[styles.chatBubble, message.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAssistant]}
              >
                <Text
                  style={[
                    styles.chatBubbleText,
                    message.role === "user" ? styles.chatBubbleTextUser : styles.chatBubbleTextAssistant,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            ))}
            {loading ? (
              <View style={[styles.chatBubble, styles.chatBubbleAssistant]}>
                <ActivityIndicator size="small" color={colors.muted} />
              </View>
            ) : null}
          </ScrollView>
          <TextInput
            value={question}
            onChangeText={onChangeQuestion}
            placeholder="Ask something travel-related..."
            placeholderTextColor={colors.muted}
            style={styles.assistantInput}
            onSubmitEditing={onSubmit}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <PrimaryButton label="Send" icon="paper-plane-outline" onPress={onSubmit} loading={loading} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
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
      maxHeight: "78%",
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
    assistantHint: {
      color: c.muted,
      fontSize: 13,
      lineHeight: 20,
      fontFamily: "PlusJakartaSans_400Regular",
    },
    chatScroll: {
      maxHeight: 260,
    },
    chatContent: {
      gap: 10,
      paddingVertical: 4,
    },
    chatBubble: {
      maxWidth: "88%",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 18,
    },
    chatBubbleUser: {
      alignSelf: "flex-end",
      backgroundColor: c.coral,
    },
    chatBubbleAssistant: {
      alignSelf: "flex-start",
      backgroundColor: c.mist,
    },
    chatBubbleText: {
      fontSize: 14,
      lineHeight: 21,
      fontFamily: "PlusJakartaSans_400Regular",
    },
    chatBubbleTextUser: {
      color: c.white,
    },
    chatBubbleTextAssistant: {
      color: c.ink,
    },
    assistantInput: {
      backgroundColor: c.mist,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: c.ink,
      fontFamily: "PlusJakartaSans_500Medium",
      fontSize: 15,
      minHeight: 80,
    },
    errorText: {
      color: c.coral,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "PlusJakartaSans_500Medium",
    },
  });
}
