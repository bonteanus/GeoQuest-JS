import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { createEventCache } from "../services/api";
import { useUser } from "../context/UserContext";

export default function CreateEventCacheScreen() {
  const { activeEventId } = useUser();

  const [title, setTitle] = useState("");
  const [clue, setClue] = useState("");
  const [points, setPoints] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Needed", "Location permission was denied.");
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setLatitude(String(location.coords.latitude));
      setLongitude(String(location.coords.longitude));
    } catch (error) {
      console.error("Error loading current location:", error);
      Alert.alert("Error", "Could not get current GPS coordinates.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeEventId) {
      Alert.alert("No Event", "You must join or activate an event first.");
      return;
    }

    if (!title.trim() || !clue.trim() || !points.trim()) {
      Alert.alert("Missing Information", "Please complete all fields.");
      return;
    }

    const payload = {
      EventID: activeEventId,
      CacheTitle: title,
      CacheClue: clue,
      CachePoints: Number(points),
      CacheLatitude: Number(latitude),
      CacheLongitude: Number(longitude),
    };

    try {
      const result = await createEventCache(payload);

      if (result) {
        Alert.alert("Success", "Event cache created successfully.");
        setTitle("");
        setClue("");
        setPoints("");
      } else {
        Alert.alert("Failed", "Could not create event cache.");
      }
    } catch (error) {
      console.error("Error creating event cache:", error);
      Alert.alert("Error", "Something went wrong while creating the cache.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Event Cache</Text>

        <Text style={styles.label}>Active Event ID</Text>
        <Text style={styles.valueText}>
          {activeEventId ? activeEventId : "No active event"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Cache title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Cache clue"
          placeholderTextColor="#aaa"
          value={clue}
          onChangeText={setClue}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Points"
          placeholderTextColor="#aaa"
          value={points}
          onChangeText={setPoints}
          keyboardType="numeric"
        />

        {loadingLocation ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.loadingText}>Getting current location...</Text>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              placeholderTextColor="#aaa"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Longitude"
              placeholderTextColor="#aaa"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
            />
          </>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => loadCurrentLocation()}
        >
          <Text style={styles.secondaryButtonText}>Refresh GPS Coordinates</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.buttonText}>Create Event Cache</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f1b2d",
    padding: 16,
  },
  card: {
    backgroundColor: "#1e2d3d",
    borderWidth: 1,
    borderColor: "#2e4057",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  label: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  valueText: {
    color: "#fff",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#2e4057",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    color: "#aaa",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
});