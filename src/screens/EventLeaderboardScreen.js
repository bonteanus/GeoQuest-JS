import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getEventLeaderboard } from "../services/api";

export default function EventLeaderboardScreen({ route }) {
  // Extract event data passed from navigation
  const { eventId, eventName } = route.params || {
    eventId: 1,
    eventName: "Private Event",
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const scores = await getEventLeaderboard(eventId);
        // Sort participants by points descending
        const sorted = scores.sort((a, b) => b.TotalPoints - a.TotalPoints);
        setData(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadScores();
  }, [eventId]);

  const renderMember = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.name}>
        {item.PlayerUsername || `Player ${item.PlayerID}`}
      </Text>
      <Text style={styles.points}>{item.TotalPoints} pts</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eventName} Ranking</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item.PlayerID ? item.PlayerID.toString() : index.toString()
          }
          renderItem={renderMember}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No finds recorded yet for this event.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1b2d", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#1e2d3d",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  rank: { color: "#4CAF50", fontWeight: "bold", width: 40 },
  name: { color: "#fff", flex: 1, fontSize: 16 },
  points: { color: "#4CAF50", fontWeight: "bold" },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontStyle: "italic",
  },
});
