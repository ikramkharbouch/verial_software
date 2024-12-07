import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginAction = async (username, password) => {
    console.log(username, password);
    try {
      const response = await axios.post(
        'http://localhost:3000/auth/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response);

      const { accessToken, user } = response.data;

      // console.log("response data", accessToken);

      sessionStorage.setItem('accessToken', accessToken); // Store access token in memory
      setUser(response.data.user);
      setIsAuthenticated(true);
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.post(
      'http://localhost:3000/auth/logout',
      {},
      { withCredentials: true },
    );
    sessionStorage.removeItem('accessToken'); // Clear access token
    setUser(null);
    setIsAuthenticated(false);
  };

  const restoreSession = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        const response = await axios.post(
          'http://localhost:3000/auth/refresh',
          {},
          { withCredentials: true },
        );
        sessionStorage.setItem('accessToken', response.data.accessToken);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.warn('Session restoration failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession(); // Restore session on component mount
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loginAction, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

// Default export for the AuthProvider
export default AuthProvider;
