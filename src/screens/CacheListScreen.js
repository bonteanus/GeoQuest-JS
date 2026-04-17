import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import { fetchLiveCaches } from '../services/cacheService';

export default function CacheListScreen({ navigation }) {
  const [caches, setCaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadCaches() {
    try {
      const fetchedCaches = await fetchLiveCaches();
      setCaches(Array.isArray(fetchedCaches) ? fetchedCaches : []);
    } catch (error) {
      console.error('Error loading caches:', error);
      setCaches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCaches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCaches();
  };

  const renderCacheItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => navigation.navigate('CacheDetail', { cache: item })}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cacheName}>{item.title}</Text>
      </View>

      <Text style={styles.cacheDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardBottom}>
        <Text style={styles.points}>{item.points} pts</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Connecting to GeoQuest API...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Live Caches</Text>
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => navigation.navigate('CreateCache')}
        >
          <Text style={styles.createButtonText}>+ Add New</Text>
        </Pressable>
      </View>

      <FlatList
        data={caches}
        keyExtractor={(item) => String(item.cacheId)}
        contentContainerStyle={styles.list}
        renderItem={renderCacheItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No caches found on the server.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1b2d',
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#aaa',
    marginTop: 12,
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    padding: 24,
  },
  card: {
    backgroundColor: '#1e2d3d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2e4057',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cacheName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  cacheDescription: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  points: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 15,
    textAlign: 'center',
  },
});