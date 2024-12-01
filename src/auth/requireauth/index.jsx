import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const jwtToken = Cookies.get("jwtToken");
  const refreshToken = Cookies.get("refreshToken");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_DOMAIN}api/User/Profile`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        const response = await axios.post(
          `${
            import.meta.env.VITE_DOMAIN
          }api/User/RefreshJwt?refreshToken=${refreshToken}`
        );

        const expirationDate = new Date(
          response.data.token.refreshTokenExpiration
        );
        Cookies.set("jwtToken", response.data.token.jwtToken, {
          expires: expirationDate,
          path: "/",
        });
        Cookies.set("refreshToken", response.data.token.refreshToken, {
          expires: expirationDate,
          path: "/",
        });

        setIsAuthenticated(true);
      }
    };

    if (jwtToken) {
      verifyToken();
    } else {
      setIsAuthenticated(false);
    }
  }, [jwtToken]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default RequireAuth;
