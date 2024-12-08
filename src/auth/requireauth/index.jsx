import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import PropTypes from 'prop-types';

const RequireAuth = ({ children }) => {
  RequireAuth.propTypes = {
    children: PropTypes.string,
  };
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const jwtToken = Cookies.get('jwtToken');
  const refreshToken = Cookies.get('refreshToken');

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
          `${import.meta.env.VITE_DOMAIN}api/User/RefreshJwt?refreshToken=${refreshToken}`,
        );

        Cookies.set('jwtToken', response.data.token.jwtToken, {
          expires: 30,
          path: '/',
        });
        Cookies.set('refreshToken', response.data.token.refreshToken, {
          expires: 30,
          path: '/',
        });
        Cookies.set('userRole', response.data.token.userRole, {
          expires: 30,
          path: '/',
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
