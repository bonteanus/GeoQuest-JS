import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";

export default function JoinEventScreen({ navigation }) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { joinEventByCode, activeEventId } = useUser();

  const handleJoinEvent = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Missing Code", "Please enter an invite code.");
      return;
    }

    try {
      setLoading(true);

      const result = await joinEventByCode(inviteCode.trim());

      if (result.success) {
        Alert.alert("Success", "You joined the event successfully.");
        navigation.goBack();
      } else {
        Alert.alert("Join Failed", result.message);
      }
    } catch (error) {
      console.error("Join event error:", error);
      Alert.alert("Error", "Something went wrong while joining the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Join Event</Text>
        <Text style={styles.subtitle}>
          Enter an invite code to join a private GeoQuest event.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter invite code"
          placeholderTextColor="#aaa"
          value={inviteCode}
          onChangeText={setInviteCode}
          autoCapitalize="characters"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || loading ? 0.7 : 1 },
          ]}
          onPress={() => handleJoinEvent()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Joining..." : "Join Event"}
          </Text>
        </Pressable>

        {activeEventId ? (
          <Text style={styles.eventText}>Active Event ID: {activeEventId}</Text>
        ) : (
          <Text style={styles.helperText}>You are not currently in Event Mode.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1b2d",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#1e2d3d",
    borderWidth: 1,
    borderColor: "#2e4057",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#2e4057",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  eventText: {
    color: "#4CAF50",
    marginTop: 16,
    fontWeight: "bold",
  },
  helperText: {
    color: "#aaa",
    marginTop: 16,
  },
});