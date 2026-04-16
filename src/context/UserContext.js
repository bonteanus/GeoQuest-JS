import React, { createContext, useState, useEffect, useContext } from "react";
import { geoquestFetch } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [foundCaches, setFoundCaches] = useState([]);

  useEffect(() => {
    async function loadDummyUser() {
      try {
        const userData = await geoquestFetch("/users");
        const me = Array.isArray(userData) && userData.length > 0 ? userData[0] : null;

        if (!me) {
          setUser({
            uid: 0,
            displayName: "Player 1",
          });
          setFoundCaches([]);
          return;
        }

        setUser({
          uid: me.UserID,
          displayName: me.UserUsername || me.UserFirstname || "Player 1",
        });

        try {
          const userFinds = await geoquestFetch(`/finds/players/${me.UserID}`);
          setFoundCaches(Array.isArray(userFinds) ? userFinds : []);
        } catch (findsError) {
          console.warn("No finds found for this user, defaulting to empty list.", findsError);
          setFoundCaches([]);
        }
      } catch (error) {
        console.warn("Could not load user data from API", error);
        setUser({
          uid: 0,
          displayName: "Player 1",
        });
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