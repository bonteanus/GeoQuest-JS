import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { fetchLiveCaches } from "../services/cacheService";
import { getEventCaches } from "../services/api";
import { useUser } from "../context/UserContext";

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [caches, setCaches] = useState([]);
  const [selectedCache, setSelectedCache] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { activeEventId } = useUser();

  useEffect(() => {
    loadMapData();
  }, [activeEventId]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSelectedCache(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage("Location permission denied.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      let liveCaches = [];
      if (activeEventId) {
        liveCaches = await getEventCaches(activeEventId);
      } else {
        liveCaches = await fetchLiveCaches();
      }

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setCaches(Array.isArray(liveCaches) ? liveCaches : []);
    } catch (error) {
      console.error("Error loading map data:", error);
      setErrorMessage("Failed to load map and caches.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => loadMapData()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Unable to get your location.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activeEventId ? (
        <View style={styles.eventBanner}>
          <Text style={styles.eventBannerText}>
            Event Mode Active: Event #{activeEventId}
          </Text>
        </View>
      ) : null}

      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {caches.map((cache) => (
          <Marker
            key={String(cache.cacheId || cache.CacheID || Math.random())}
            coordinate={
              cache.coordinates || {
                latitude: cache.CacheLatitude,
                longitude: cache.CacheLongitude,
              }
            }
            title={cache.title || cache.CacheTitle}
            description={cache.description || cache.CacheDescription}
            onPress={() => setSelectedCache(cache)}
          />
        ))}
      </MapView>

      {selectedCache && (
        <View style={styles.bottomCard}>
          <Text style={styles.cacheTitle}>
            {selectedCache.title || selectedCache.CacheTitle}
          </Text>
          <Text style={styles.cachePoints}>
            {selectedCache.points || selectedCache.CachePoints || 0} points
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() =>
              navigation.navigate("CacheDetail", { cache: selectedCache })
            }
          >
            <Text style={styles.buttonText}>View Details</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1b2d",
  },
  map: {
    flex: 1,
  },
  eventBanner: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#1e2d3d",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
  },
  eventBannerText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: "#1e2d3d",
    borderWidth: 1,
    borderColor: "#2e4057",
    borderRadius: 12,
    padding: 16,
  },
  cacheTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cachePoints: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f1b2d",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});