import React, { createContext, useState, useEffect, useContext } from "react";
import { geoquestFetch, getEventByCode } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [foundCaches, setFoundCaches] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    async function loadBulletproofData() {
      try {
        const allPlayers = await geoquestFetch("/players");
        if (!allPlayers || allPlayers.length === 0)
          throw new Error("Database empty");

        const activePlayer = allPlayers[0];
        const userDetails = activePlayer.PlayerUser || {};

        setUser({
          uid: activePlayer.PlayerID,
          displayName:
            userDetails.UserUsername ||
            userDetails.UserFirstname ||
            `Player ${activePlayer.PlayerID}`,
        });

        // 2. THE FIX: Do NOT ask the API for a specific player's finds. It will crash if they have 0.
        // Instead, ask for ALL finds (this endpoint is safe and won't 404).
        const allFinds = await geoquestFetch("/finds");

        // 3. Filter them locally on your computer instead of trusting the server.
        const myFinds = allFinds.filter(
          (find) => find.FindPlayerID === activePlayer.PlayerID,
        );

        setFoundCaches(myFinds);
      } catch (error) {
        console.warn("API error caught. Using safe fallback data.");
        setUser({ uid: 999, displayName: "Guest Explorer" });
        setFoundCaches([]);
      }
    }
    loadBulletproofData();
  }, []);

  const joinEventByCode = async (inviteCode) => {
    try {
      const eventData = await getEventByCode(inviteCode);

      if (!eventData) {
        return {
          success: false,
          message: "Invalid invite code.",
        };
      }

      const resolvedEvent =
        Array.isArray(eventData) && eventData.length > 0 ? eventData[0] : eventData;

      const resolvedEventId =
        resolvedEvent.EventID ||
        resolvedEvent.eventId ||
        resolvedEvent.id ||
        null;

      if (!resolvedEventId) {
        return {
          success: false,
          message: "Valid event response, but no EventID was found.",
        };
      }

      setActiveEventId(resolvedEventId);
      setActiveEvent(resolvedEvent);

      return {
        success: true,
        message: "Joined event successfully.",
        event: resolvedEvent,
      };
    } catch (error) {
      console.error("Failed to join event:", error);
      return {
        success: false,
        message: "Failed to verify invite code.",
      };
    }
  };

  const leaveEvent = () => {
    setActiveEventId(null);
    setActiveEvent(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        foundCaches,
        activeEventId,
        activeEvent,
        setActiveEventId,
        setActiveEvent,
        joinEventByCode,
        leaveEvent,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
