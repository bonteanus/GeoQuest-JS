import React, { createContext, useState, useEffect, useContext } from "react";
import { geoquestFetch } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [foundCaches, setFoundCaches] = useState([]);

  useEffect(() => {
    async function loadValidPlayer() {
      try {
        // Step 1: Fetch ALL Players instead of Users
        const allPlayers = await geoquestFetch("/players");

        if (!allPlayers || allPlayers.length === 0) {
          throw new Error("No players found in database");
        }

        // Step 2: Grab the first available Player record
        const activePlayer = allPlayers[0];

        // Step 3: Extract the nested UserObject to display on the Profile Screen
        // Your teacher's API attaches the full user details inside 'PlayerUser'
        const userDetails = activePlayer.PlayerUser;

        setUser({
          uid: userDetails.UserID,
          displayName:
            userDetails.UserUsername ||
            userDetails.UserFirstname ||
            `Player ${activePlayer.PlayerID}`,
        });

        // Step 4: Now we can safely fetch finds using the correct PlayerID
        const playerFinds = await geoquestFetch(
          `/finds/players/${activePlayer.PlayerID}`,
        );

        setFoundCaches(playerFinds || []);
      } catch (error) {
        console.warn("API Error. Falling back to local Guest data.");
        // Fallback to prevent app crashes if the database is empty
        setUser({ uid: 999, displayName: "Guest Explorer" });
        setFoundCaches([]);
      }
    }
    loadValidPlayer();
  }, []);

  return (
    <UserContext.Provider value={{ user, foundCaches }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
