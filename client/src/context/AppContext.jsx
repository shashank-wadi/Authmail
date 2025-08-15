import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-switch backend URL for local vs Vercel
  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://authmail-server.vercel.app"
      : "http://localhost:4000";

  axios.defaults.withCredentials = true; // Send cookies automatically

  const getUserData = async (silent = false) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.user);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Not logged in - only log if not silent
        if (!silent) console.warn("User not logged in yet.");
        setUserData(null);
        setIsLoggedin(false);
      } else {
        console.error("Error fetching user data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    await getUserData(); // Re-fetch after successful login
  };

  const logout = () => {
    setUserData(null);
    setIsLoggedin(false);
  };

  // Run only once, silently (no error spam if not logged in)
  useEffect(() => {
    getUserData(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedin,
        getUserData,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
