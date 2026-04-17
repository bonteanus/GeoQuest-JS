import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { createPrivateEvent } from "../services/api";
import { useUser } from "../context/UserContext";

export default function CreateEventScreen({ navigation }) {
  const { user } = useUser();
  const [eventName, setEventName] = useState("");
  const [duration, setDuration] = useState("24"); // Mandatory: Time window
  const [inviteCode, setInviteCode] = useState("");

  // Generates a random 6-character code (Mandatory: Invite code)
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInviteCode(code);
  };

  const handleCreateEvent = async () => {
    if (!eventName || !inviteCode) {
      Alert.alert("Error", "Please name your event and generate a code.");
      return;
    }

    const eventData = {
      EventName: eventName,
      EventCode: inviteCode,
      EventOwnerID: user?.uid || 1, // Fallback if user context is missing
      EventActive: 1,
      EventDuration: duration,
    };

    try {
      const result = await createPrivateEvent(eventData);

      if (result) {
        Alert.alert(
          "Success!",
          `Event '${eventName}' created. Share your code: ${inviteCode}`,
        );
        navigation.goBack();
      } else {
        throw new Error("Server rejected the request");
      }
    } catch (error) {
      console.error("Event Creation Error:", error);
      Alert.alert("Error", "Could not save the event to the GeoQuest server.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Create Private Event</Text>
      <Text style={styles.subHeader}>
        Set up a private world for your group.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={eventName}
          onChangeText={setEventName}
          placeholder="e.g. Campus Quest 2026"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Time Window (Hours)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="24"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.label}>Invite Code</Text>
        <View style={styles.codeRow}>
          <View style={styles.codeDisplayContainer}>
            <Text style={styles.codeDisplay}>{inviteCode || "------"}</Text>
          </View>
          <Pressable style={styles.genButton} onPress={generateCode}>
            <Text style={styles.genButtonText}>Generate</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.createButton,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={handleCreateEvent}
      >
        <Text style={styles.createButtonText}>Launch Event</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1b2d" },
  content: { padding: 25 },
  header: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  subHeader: { fontSize: 16, color: "#aaa", marginBottom: 30 },
  inputGroup: { marginBottom: 25 },
  label: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#1e2d3d",
    color: "#fff",
    padding: 18,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2e4057",
  },
  codeSection: { marginBottom: 40 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  codeDisplayContainer: {
    flex: 1,
    backgroundColor: "#1e2d3d",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
  },
  codeDisplay: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 4,
  },
  genButton: { backgroundColor: "#2e4057", padding: 18, borderRadius: 12 },
  genButtonText: { color: "#fff", fontWeight: "bold" },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
