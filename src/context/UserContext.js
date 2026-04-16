import React, { createContext, useState, useEffect, useContext } from "react";
import { geoquestFetch } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [foundCaches, setFoundCaches] = useState([]);

  useEffect(() => {
    async function loadPlayerContext() {
      try {
        // Step 1: Fetch player records, not users
        const players = await geoquestFetch("/players");

        if (!Array.isArray(players) || players.length === 0) {
          throw new Error("No players returned from API");
        }

        // Step 2: Pick the first available player for now
        const currentPlayer = players[0];

        // Step 3: Extract the nested user data from the player object
        const nestedUser =
          currentPlayer.User ||
          currentPlayer.user ||
          currentPlayer.PlayerUser ||
          currentPlayer.playerUser ||
          null;

        setUser({
          uid:
            currentPlayer.PlayerID ||
            currentPlayer.playerId ||
            currentPlayer.id ||
            0,
          displayName:
            (nestedUser &&
              (nestedUser.UserUsername ||
                nestedUser.UserFirstname ||
                nestedUser.username ||
                nestedUser.firstname)) ||
            currentPlayer.PlayerName ||
            `Player ${
              currentPlayer.PlayerID ||
              currentPlayer.playerId ||
              currentPlayer.id ||
              ""
            }`,
        });

        // Step 4: Use PlayerID, not UserID, for finds
        const playerId =
          currentPlayer.PlayerID ||
          currentPlayer.playerId ||
          currentPlayer.id;

        if (!playerId) {
          throw new Error("PlayerID missing from player record");
        }

        try {
          const playerFinds = await geoquestFetch(`/finds/players/${playerId}`);
          setFoundCaches(Array.isArray(playerFinds) ? playerFinds : []);
        } catch (findsError) {
          console.warn(
            "Could not load finds for this player. Using empty list.",
            findsError
          );
          setFoundCaches([]);
        }
      } catch (error) {
        console.warn(
          "Could not load player context from API. Falling back to local empty state.",
          error
        );

        setUser({
          uid: 999,
          displayName: "Guest Explorer",
        });
        setFoundCaches([]);
      }
    }

    loadPlayerContext();
  }, []);

  return (
    <UserContext.Provider value={{ user, foundCaches }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);