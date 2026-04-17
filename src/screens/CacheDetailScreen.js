import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";

// The Haversine formula to calculate physical meters between two GPS coordinates
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CacheDetailScreen({ route }) {
  // Extract the specific cache data passed from the Map or List screen
  const { cache } = route.params;

  // The engine that fires when the user tries to claim a cache
  const handleLogFind = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need your location to verify the find!",
        );
        return;
      }

      Alert.alert(
        "Verifying...",
        "Checking your GPS location against the cache...",
      );

      // Get user location (Balanced accuracy prevents emulator freeze)
      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLat = userLocation.coords.latitude;
      const userLon = userLocation.coords.longitude;

      // Force the data to become actual Numbers
      const cacheLat = Number(cache.CacheLatitude || cache.latitude);
      const cacheLon = Number(cache.CacheLongitude || cache.longitude);

      // THE SAFETY NET: Check if the cache coordinates are missing or invalid
      if (!cacheLat || !cacheLon || isNaN(cacheLat) || isNaN(cacheLon)) {
        Alert.alert(
          "Broken Cache",
          "This cache is missing valid GPS coordinates in the database!",
        );
        return;
      }

      // Run the math
      const distance = getDistanceFromLatLonInM(
        userLat,
        userLon,
        cacheLat,
        cacheLon,
      );

      // Enforce the 50-meter Geofence
      if (distance <= 50) {
        Alert.alert(
          "🎉 Cache Found!",
          "You are within 50 meters! Points added.",
        );
      } else {
        Alert.alert(
          "Too Far Away!",
          `You are ${Math.round(distance)} meters away. Get closer to the cache to log it.`,
        );
      }
    } catch (error) {
      console.warn("Location fetch error:", error);
      Alert.alert(
        "Error",
        "Could not get your location. Make sure your GPS is on.",
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{cache.CacheName || cache.title}</Text>

        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>
            {cache.CachePoints || cache.points} Points
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.description}>
          {cache.CacheDescription || cache.description}
        </Text>

        <Text style={styles.sectionHeader}>Clue</Text>
        <Text style={styles.clue}>{cache.CacheClue || cache.clue}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
        onPress={handleLogFind}
      >
        <Text style={styles.buttonText}>Log Find</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1b2d" },
  content: { padding: 20 },
  card: {
    backgroundColor: "#1e2d3d",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2e4057",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  pointsBadge: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  pointsText: { color: "#fff", fontWeight: "bold" },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#aaa",
    lineHeight: 24,
    marginBottom: 15,
  },
  clue: { fontSize: 16, color: "#aaa", fontStyle: "italic", lineHeight: 24 },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
