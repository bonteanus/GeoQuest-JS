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

        const allFinds = await geoquestFetch("/finds");
        const myFinds = allFinds.filter(
          (find) => find.FindPlayerID === activePlayer.PlayerID
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