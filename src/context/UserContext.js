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

        const me = userData[0];
        setUser({
          uid: me.UserID,
          displayName: me.UserUsername || me.UserFirstname || "Player 1",
        });

        const userFinds = await geoquestFetch("/finds/players/276");
        setFoundCaches(userFinds || []);
      } catch (error) {
        console.warn("Could not load user data from API");
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
