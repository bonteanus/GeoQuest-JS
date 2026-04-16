import React, { createContext, useState, useEffect, useContext } from "react";
import { geoquestFetch } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [foundCaches, setFoundCaches] = useState([]);

  useEffect(() => {
    async function loadBulletproofData() {
      try {
        // 1. Safely grab the first player in the database
        const allPlayers = await geoquestFetch("/players");

        if (!allPlayers || allPlayers.length === 0) {
          throw new Error("Database empty");
        }

        const activePlayer = allPlayers[0];
        const userDetails = activePlayer.PlayerUser || {};

        setUser({
          uid: activePlayer.PlayerID,
          displayName:
            userDetails.UserUsername ||
            userDetails.UserFirstname ||
            `Player ${activePlayer.PlayerID}`,
        });

        // 2. Get all finds instead of querying a specific player endpoint
        const allFinds = await geoquestFetch("/finds");

        // 3. Filter locally for this player's finds
        const myFinds = allFinds.filter(
          (find) => find.FindPlayerID === activePlayer.PlayerID,
        );

        setFoundCaches(myFinds);
      } catch (error) {
        console.warn("API error caught. Using safe fallback data.", error);
        setUser({ uid: 999, displayName: "Guest Explorer" });
        setFoundCaches([]);
      }
    }
    loadBulletproofData();
  }, []);

  return (
    <UserContext.Provider value={{ user, foundCaches }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
