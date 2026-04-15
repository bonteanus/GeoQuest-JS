import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const { user, foundCaches } = useUser();

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {user.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{user.displayName}</Text>
        <Text style={styles.statsText}>
          Total Caches Found: {foundCaches.length}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your Discovery History</Text>

      {foundCaches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't found any caches yet.
          </Text>
          <Text style={styles.emptySubtext}>
            Check the map to start your first quest!
          </Text>
        </View>
      ) : (
        <FlatList
          data={foundCaches}
          keyExtractor={(item) => item.FindID.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.findCard}>
              <Text style={styles.findText}>
                Found Cache #{item.FindCacheID}
              </Text>
              <Text style={styles.dateText}>
                {new Date(item.FindDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => console.log("Log out tapped")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1b2d",
    padding: 24,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f1b2d",
  },
  loadingText: { color: "#aaa", marginTop: 12, fontSize: 16 },
  headerCard: {
    alignItems: "center",
    backgroundColor: "#1e2d3d",
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#2e4057",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#fff" },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  statsText: { fontSize: 16, color: "#aaa" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  list: { paddingBottom: 20 },
  emptyContainer: { alignItems: "center", marginTop: 20 },
  emptyText: { color: "#fff", fontSize: 16, marginBottom: 8 },
  emptySubtext: { color: "#aaa", fontSize: 14 },
  findCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e2d3d",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2e4057",
  },
  findText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  dateText: { color: "#aaa", fontSize: 14 },
  logoutButton: {
    backgroundColor: "#e53935",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
