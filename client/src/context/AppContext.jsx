import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

const getAuthState = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
      withCredentials: true,
    });

    if (data.success) {
      setIsLoggedin(true);
      getUserData();
    } else {
      setIsLoggedin(false);
      setUserData(null);
    }
  } catch (error) {
    setIsLoggedin(false);
    setUserData(null);

    
    if (error.response?.status !== 401) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
};

  
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

  

      if (data.success) {
        
        setUserData(data.userData || data.user || null);
      } else {
        setUserData(null);
        toast.error(data.message);
      }
    } catch (error) {
      setUserData(null);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
