import React, { createContext, useState, useEffect, useContext } from "react";
import { geoquestFetch } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [foundCaches, setFoundCaches] = useState([]);

  useEffect(() => {
    async function loadDummyUser() {
      try {
        // Step 1: Try fetching ALL users, not just ID 1
        const allUsers = await geoquestFetch("/users");

        // Step 2: If we got data back, use the first person in the database
        if (allUsers && allUsers.length > 0) {
          const me = allUsers[0];
          setUser({
            uid: me.UserID,
            displayName:
              me.UserUsername || me.UserFirstname || `Player ${me.UserID}`,
          });

          // Step 3: Fetch the finds for this specific user
          const userFinds = await geoquestFetch(`/finds/players/${me.UserID}`);
          setFoundCaches(userFinds || []);
        } else {
          // If the array is empty, force an error to trigger the fallback
          throw new Error("User list is empty");
        }
      } catch (error) {
        console.warn(
          "API User missing or 404 error. Falling back to local dummy data.",
        );
        // Step 4: The Fallback. This stops the app from crashing.
        setUser({ uid: 999, displayName: "Guest Explorer" });
        setFoundCaches([]);
      }
    }
    loadDummyUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, foundCaches }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
