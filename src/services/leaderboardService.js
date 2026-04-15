import { geoquestFetch } from "./api";

export async function getGlobalLeaderboard() {
  try {
    // 1. Fetch all the relational data from the university API
    const [users, finds, caches] = await Promise.all([
      geoquestFetch("/users"),
      geoquestFetch("/finds"),
      geoquestFetch("/caches"),
    ]);

    // 2. Create a dictionary to track everyone's points
    const userPoints = {};
    users.forEach((u) => {
      userPoints[u.UserID] = 0;
    });

    // 3. Loop through all the "Finds" to calculate scores
    finds.forEach((find) => {
      const cacheFound = caches.find((c) => c.CacheID === find.FindCacheID);
      if (cacheFound && userPoints[find.FindPlayerID] !== undefined) {
        userPoints[find.FindPlayerID] += cacheFound.CachePoints;
      }
    });

    // 4. Format it exactly how your UI expects it and sort highest to lowest
    const leaderboard = users.map((user) => ({
      uid: user.UserID,
      displayName:
        user.UserUsername || user.UserFirstname || `Player ${user.UserID}`,
      points: userPoints[user.UserID] || 0,
    }));

    return leaderboard.sort((a, b) => b.points - a.points);
  } catch (error) {
    console.error("Error calculating leaderboard:", error);
    return [];
  }
}
