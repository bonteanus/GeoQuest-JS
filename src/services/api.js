const BASE_URL = "https://mark0s.com/geoquest/v1/api";
const API_KEY = "16gv8f"; // Public key from your brief

/**
 * Core fetch wrapper for the GeoQuest REST API
 */
export async function geoquestFetch(endpoint, options = {}) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

/**
 * --- PERSON A: EVENT OWNER SERVICES ---
 */

// 1. Create a new private event
export const createPrivateEvent = async (eventData) => {
  try {
    return await geoquestFetch("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return null;
  }
};

// 2. Fetch all caches for a specific event
export const getEventCaches = async (eventId) => {
  try {
    return await geoquestFetch(`/caches/events/${eventId}`);
  } catch (error) {
    console.error("Failed to fetch event caches:", error);
    return [];
  }
};

// 3. Fetch leaderboard for a specific event
export const getEventLeaderboard = async (eventId) => {
  try {
    return await geoquestFetch(`/finds/events/${eventId}`);
  } catch (error) {
    console.error("Failed to fetch event leaderboard:", error);
    return [];
  }
};

/**
 * --- PERSON B: EVENT PARTICIPANT SERVICES ---
 */

// 4. Validate and join event by invite code
export const getEventByCode = async (inviteCode) => {
  try {
    return await geoquestFetch(`/events/code/${inviteCode}`);
  } catch (error) {
    console.error("Failed to verify invite code:", error);
    return null;
  }
};
