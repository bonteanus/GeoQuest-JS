import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

export default function CacheDetailScreen({ route }) {
  const { cache } = route.params || {};

  if (!cache) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No cache data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{cache.title}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.text}>{cache.description}</Text>

        <Text style={styles.label}>Clue</Text>
        <Text style={styles.text}>{cache.clue}</Text>

        <Text style={styles.label}>Points</Text>
        <Text style={styles.text}>{cache.points}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => console.log('Found it!')}
        >
          <Text style={styles.buttonText}>Log Find</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f1b2d',
    padding: 16,
  },
  card: {
    backgroundColor: '#1e2d3d',
    borderWidth: 1,
    borderColor: '#2e4057',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    color: '#aaa',
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});