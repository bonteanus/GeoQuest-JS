// src/services/cacheService.js

import { geoquestFetch } from './api';

export async function fetchLiveCaches() {
  try {
    // Hit the exact endpoint requested in the brief
    const data = await geoquestFetch('/caches');
    
    // Translate the database columns into standard camelCase properties
    return data.map(apiCache => ({
      cacheId: apiCache.CacheID.toString(),
      title: apiCache.CacheName,
      description: apiCache.CacheDescription || 'A hidden treasure!',
      coordinates: { 
        latitude: apiCache.CacheLatitude, 
        longitude: apiCache.CacheLongitude 
      },
      clue: apiCache.CacheClue || '',
      points: apiCache.CachePoints || 0
    }));
  } catch (error) {
    console.error("Error fetching caches:", error);
    return []; // Return empty array on failure so the app doesn't crash
  }
}