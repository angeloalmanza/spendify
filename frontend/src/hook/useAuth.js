import { useState, useEffect } from 'react';
import client from '../api/client';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client.get('/api/user')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await client.post('/api/login', { email, password });
    localStorage.setItem('auth_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await client.post('/api/register', {
      name,
      email,
      password,
      password_confirmation: password,
    });
    localStorage.setItem('auth_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await client.post('/api/logout');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await client.put('/api/profile', data);
    setUser(res.data);
    return res.data;
  };

  return { user, loading, login, register, logout, updateProfile };
};

export default useAuth;
