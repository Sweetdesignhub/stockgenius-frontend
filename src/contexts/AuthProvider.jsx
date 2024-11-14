/**
 * File: AuthProvider
 * Description: This component is a context provider that manages authentication state and session expiration in a React application. It utilizes cookies to store the authentication token (access_token), monitors the token's expiration, and triggers actions such as showing a logout warning and logging the user out when the session expires.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);

  useEffect(() => {
    // console.log("Available cookies:", Cookies.get());

    const token = Cookies.get("access_token");
    // console.log("Retrieved token:", token);

    if (token) {
      try {
        // Decode the JWT token to get expiration time
        const parts = token.split(".");
        if (parts.length === 3) {
          const decodedToken = JSON.parse(atob(parts[1]));
          const expirationTime = decodedToken.exp * 1000 - Date.now();
          const warningTime = expirationTime - 5000; // Show warning 5 seconds before logout

          if (expirationTime <= 0) {
            handleLogout();
          } else {
            const timer = setTimeout(() => {
              setShowLogoutWarning(true);
            }, warningTime);

            const logoutTimer = setTimeout(() => {
              handleLogout();
            }, expirationTime);

            // Cleanup timers on component unmount
            return () => {
              clearTimeout(timer);
              clearTimeout(logoutTimer);
            };
          }
        } else {
          // console.error("Invalid token format");
          handleLogout();
        }
      } catch (error) {
        // console.error("Token decoding error", error);
        handleLogout();
      }
    } else {
      // console.warn("No token found, user might be logged out");
    }
  }, [navigate]);

  const handleLogout = () => {
    axios
      .post("/api/v1/auth/sign-out")
      .then(() => {
        Cookies.remove("access_token");
        navigate("/sign-in");
      })
      .catch((err) => {
        // console.error("Logout error", err);
      });
  };

  return (
    <AuthContext.Provider value={{ handleLogout, showLogoutWarning }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
