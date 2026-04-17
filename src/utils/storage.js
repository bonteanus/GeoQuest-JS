import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "https://mark0s.com/geoquest/v1/api";
const API_KEY = "16gv8f"; // Public key from your brief [cite: 3]

// --- API INTEGRATION (MANDATORY REQUIREMENT) ---
export const recordFindOnServer = async (playerId, cacheId) => {
  try {
    const response = await fetch(`${API_BASE}/finds?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        FindPlayerID: playerId,
        FindCacheID: cacheId,
        FindDatetime: new Date().toISOString(), // ISO 8601 format [cite: 3]
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

// --- LOCAL BACKUP (FOR OFFLINE/SMOOTH UI) ---
export const savePointsLocal = async (newPoints) => {
  try {
    const currentPoints = await loadPointsLocal();
    const total = currentPoints + newPoints;
    await AsyncStorage.setItem("@total_points", total.toString());
    return total;
  } catch (e) {
    console.error(e);
  }
};

export const loadPointsLocal = async () => {
  try {
    const p = await AsyncStorage.getItem("@total_points");
    return p ? parseInt(p) : 0;
  } catch (e) {
    return 0;
  }
};
