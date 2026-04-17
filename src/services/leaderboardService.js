const API_BASE = "https://mark0s.com/geoquest/v1/api";
const API_KEY = "16gv8f";

export const getGlobalLeaderboard = async () => {
  try {
    // 1. Fetch absolutely all finds from the GeoQuest API
    const response = await fetch(`${API_BASE}/finds?key=${API_KEY}`);
    const finds = await response.json();

    //Tally up the points for each player
    const playerScores = {};

    finds.forEach((find) => {
      const playerId = find.FindPlayerID;
      // The API nests the Cache object inside the Find object. Points are grabbed safely
      const points = find.FindCache?.CachePoints || 10;
      // Grab their username, or give them a fallback name
      const playerName =
        find.FindPlayer?.PlayerUser?.UserUsername ||
        find.FindPlayer?.PlayerUser?.UserFirstname ||
        `Player ${playerId}`;

      // If they aren't on the scoreboard yet, add them
      if (!playerScores[playerId]) {
        playerScores[playerId] = {
          id: playerId,
          name: playerName,
          points: 0,
        };
      }

      // Add the points for this specific cache find
      playerScores[playerId].points += Number(points);
    });

    const leaderboardArray = Object.values(playerScores).sort(
      (a, b) => b.points - a.points,
    );
    return leaderboardArray;
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return []; // Return an empty array so the app doesn't crash!
  }
};
