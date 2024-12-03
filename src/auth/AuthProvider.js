import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('site') || '');
  const navigate = useNavigate();

  // Function to log in a user
  const loginAction = async (data) => {
    const uri = `http://localhost:3000/auth/login`;
    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (res) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('site', res.token);
        navigate('/dashboard');
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Function to log out a user
  const logOut = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('site');
    navigate('/login');
  };

  // Function to restore the session from the token
  const restoreSession = async () => {
    const savedToken = localStorage.getItem('site');
    if (savedToken) {
      try {
        // Validate the token with your backend (replace `/auth/validate` with your endpoint)
        const response = await fetch(`http://localhost:3000/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const res = await response.json();
        if (res.user) {
          setUser(res.user);
          setToken(savedToken);
        } else {
          logOut(); // If the token is invalid, log out the user
        }
      } catch (err) {
        console.error('Session restoration error:', err);
        logOut();
      }
    }
  };

  // Automatically restore session on component mount
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;