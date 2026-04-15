import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getGlobalLeaderboard } from "../services/leaderboardService";

export default function LeaderboardScreen() {
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      const data = await getGlobalLeaderboard();
      setGlobalData(data);
      setLoading(false);
    }
    loadLeaderboard();
  }, []);

  function getRankColor(index) {
    if (index === 0) return "#FFD700"; // Gold
    if (index === 1) return "#C0C0C0"; // Silver
    if (index === 2) return "#CD7F32"; // Bronze
    return "#aaa";
  }

  function renderEntry({ item, index }) {
    // For now, we highlight User 1 as our "Logged in" player
    const isCurrentUser = item.uid === 1;

    return (
      <View style={[styles.row, isCurrentUser && styles.currentUserRow]}>
        <Text style={[styles.rank, { color: getRankColor(index) }]}>
          #{index + 1}
        </Text>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {item.displayName}
            {isCurrentUser ? " (you)" : ""}
          </Text>
        </View>
        <Text style={styles.points}>{item.points} pts</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Calculating ranks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Leaderboard</Text>

      {globalData.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={globalData}
          keyExtractor={(item) => item.uid.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderEntry}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1b2d", paddingTop: 60 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f1b2d",
  },
  loadingText: { color: "#aaa", marginTop: 10 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  list: { padding: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e2d3d",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2e4057",
  },
  currentUserRow: { borderColor: "#4CAF50", backgroundColor: "#182b3c" },
  rank: { fontSize: 16, fontWeight: "bold", width: 44 },
  playerInfo: { flex: 1 },
  playerName: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  points: { color: "#4CAF50", fontSize: 15, fontWeight: "bold" },
  emptyText: { color: "#aaa", fontSize: 15, textAlign: "center" },
});
