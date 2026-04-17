import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getGlobalLeaderboard } from "../services/leaderboardService";
import { useUser } from "../context/UserContext"; // To highlight YOUR score!

export default function LeaderboardScreen() {
  const { user } = useUser();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // The function to pull data from our service
  const fetchScores = async () => {
    const data = await getGlobalLeaderboard();
    setLeaderboardData(data);
  };

  // Run this the exact second the screen opens
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchScores();
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  // Run this if the user pulls down on the screen to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScores();
    setRefreshing(false);
  };

  // How a single row on the leaderboard looks
  const renderItem = ({ item, index }) => {
    // Check if this row belongs to the person holding the phone
    const isMe = user && String(user.uid) === String(item.id);

    return (
      <View style={[styles.itemRow, isMe && styles.myRow]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>#{index + 1}</Text>
          <Text style={[styles.nameText, isMe && styles.myNameText]}>
            {item.name} {isMe ? "(You)" : ""}
          </Text>
        </View>
        <Text style={styles.pointsText}>{item.points} pts</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Rankings</Text>

      {/* User Feedback: Show a spinner while the API is thinking */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4CAF50"
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No caches have been found yet!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1b2d", padding: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  loader: { marginTop: 50 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e2d3d",
    borderRadius: 12,
    marginBottom: 12,
  },
  myRow: { borderColor: "#4CAF50", borderWidth: 2, backgroundColor: "#1a3a2a" },
  rankContainer: { flexDirection: "row", alignItems: "center" },
  rankText: {
    color: "#aaa",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 15,
  },
  nameText: { color: "#fff", fontSize: 18 },
  myNameText: { fontWeight: "bold", color: "#4CAF50" },
  pointsText: { color: "#4CAF50", fontWeight: "bold", fontSize: 18 },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
