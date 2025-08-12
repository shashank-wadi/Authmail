import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Create context
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure correct name
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);  // Initialize as null to reflect no user data initially

  // Function to check authentication state
  const getAuthstate = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      toast.error("Error checking authentication: " + error.message);
    }
  };

  // Function to get user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error("Error fetching user data: " + data.message);
      }
    } catch (error) {
      toast.error("Error fetching user data: " + error.message);
    }
  };

  useEffect(() => {
    getAuthstate();
  }, []);  // Run only once on mount to get authentication state

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthstate
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
