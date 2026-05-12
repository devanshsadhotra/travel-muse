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
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/theme";
import { TravelChatMessage } from "../../types/travel";

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
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ask about your trip</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={COLORS.ink} />
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
                <Text style={styles.chatBubbleTextAssistant}>Thinking about your trip...</Text>
              </View>
            ) : null}
          </ScrollView>
          <TextInput
            value={question}
            onChangeText={onChangeQuestion}
            placeholder="Ask something travel-related..."
            placeholderTextColor="#91A0A8"
            style={styles.assistantInput}
            onSubmitEditing={onSubmit}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <Pressable style={styles.ctaButton} onPress={onSubmit} disabled={loading}>
            <LinearGradient colors={["#20313C", "#2E7D8A"]} style={styles.ctaGradient}>
              <>
                <Text style={styles.ctaText}>Send</Text>
                <Ionicons name="paper-plane-outline" size={18} color={COLORS.white} />
              </>
            </LinearGradient>
          </Pressable>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: "78%",
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
  assistantHint: {
    color: COLORS.muted,
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
    backgroundColor: COLORS.ink,
  },
  chatBubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  chatBubbleTextUser: {
    color: COLORS.white,
  },
  chatBubbleTextAssistant: {
    color: COLORS.ink,
  },
  assistantInput: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.line,
    color: COLORS.ink,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
    minHeight: 84,
  },
  ctaButton: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 4,
  },
  ctaGradient: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  errorText: {
    color: COLORS.coral,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans_500Medium",
  },
});
