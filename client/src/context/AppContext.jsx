import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const backendUrl = "http://localhost:4000";

  axios.defaults.withCredentials = true;

  // Fetch user data
  const getUserData = async () => {
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
      console.error("Error fetching user data:", error);
      setUserData(null);
      setIsLoggedin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function to be used after successful authentication
  const login = async () => {
    await getUserData();
  };

  // Logout function
  const logout = () => {
    setUserData(null);
    setIsLoggedin(false);
  };

  // Run once on mount to check if user is already logged in
  useEffect(() => {
    getUserData();
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
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

