import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  // In dev: VITE_BACKEND_URL = http://localhost:3000
  // In prod: VITE_BACKEND_URL = https://your-backend.com
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  axios.defaults.baseURL = `${backendUrl}/api/v1`;
  axios.defaults.withCredentials = true;

  const checkUser = async () => {
    try {
      const { data } = await axios.get('/users/me');
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/users/login', { email, password });
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/users/register', { name, email, password });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await axios.post('/users/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
