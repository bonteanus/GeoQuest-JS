import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

// Import API and Utility functions
// Note: Ensure these files exist in your project structure
import { recordFindOnServer } from "../services/api"; 
import { savePointsLocal } from "../utils/storage"; 

/**
 * The Haversine formula to calculate physical meters between two GPS coordinates
 */
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
  const { cache } = route.params || {};
  const [proofPhotoUri, setProofPhotoUri] = useState(null);

  // --- CAMERA & PHOTO LOGIC ---
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Camera Permission Needed",
          "Please allow camera access to take a proof photo."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProofPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking proof photo:", error);
      Alert.alert("Error", "Could not open the camera.");
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Library Permission Needed",
          "Please allow photo library access to choose a proof photo."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProofPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error choosing proof photo:", error);
      Alert.alert("Error", "Could not open the photo library.");
    }
  };

  // --- GPS VERIFICATION LOGIC ---
  const handleLogFind = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is needed to verify this find."
        );
        return;
      }

      Alert.alert(
        "Verifying...",
        "Checking your GPS location against the cache..."
      );

      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLat = userLocation.coords.latitude;
      const userLon = userLocation.coords.longitude;
      const cacheLat = Number(cache.CacheLatitude || cache.latitude);
      const cacheLon = Number(cache.CacheLongitude || cache.longitude);

      if (!cacheLat || !cacheLon || isNaN(cacheLat) || isNaN(cacheLon)) {
        Alert.alert(
          "Data Error",
          "This cache has invalid GPS coordinates in the database."
        );
        return;
      }

      const distance = getDistanceFromLatLonInM(
        userLat,
        userLon,
        cacheLat,
        cacheLon
      );

      // Distance check: must be within 50 meters
      if (distance <= 50) {
        const dummyPlayerID = "1";
        const cacheID = cache.CacheID || cache.id;

        const apiResult = await recordFindOnServer(dummyPlayerID, cacheID);

        if (apiResult) {
          const earnedPoints = Number(cache.CachePoints || cache.points || 10);
          await savePointsLocal(earnedPoints);

          Alert.alert(
            "🎉 Cache Found!",
            `Verification successful! ${earnedPoints} points recorded.`
          );
        } else {
          Alert.alert(
            "Server Error",
            "Distance verified, but could not sync with the GeoQuest API."
          );
        }
      } else {
        Alert.alert(
          "Too Far Away!",
          `You are ${Math.round(distance)} meters away. You must be within 50m to log this find.`
        );
      }
    } catch (error) {
      console.error("Log Find Error:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while verifying your location."
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

        {/* --- CAMERA UI SECTION --- */}
        <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
          Proof Photo (Optional)
        </Text>
        <View style={styles.photoButtonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleTakePhoto}
          >
            <Text style={styles.secondaryButtonText}>Take Photo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleChoosePhoto}
          >
            <Text style={styles.secondaryButtonText}>Choose Photo</Text>
          </Pressable>
        </View>

        {proofPhotoUri ? (
          <Image source={{ uri: proofPhotoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>
              No proof photo added yet.
            </Text>
          </View>
        )}

        {/* --- MAIN ACTION BUTTON --- */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleLogFind}
        >
          <Text style={styles.buttonText}>Log Find</Text>
        </Pressable>
      </View>
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
  photoButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#0f1b2d",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#fff", fontWeight: "bold" },
  photoPreview: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2e4057",
  },
  placeholderBox: {
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2e4057",
    backgroundColor: "#0f1b2d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: { color: "#aaa", fontSize: 14 },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});