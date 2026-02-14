import { useState, useEffect } from 'react';
import client from '../api/client';

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    client.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, []);

  const addCategory = async (name, color) => {
    const res = await client.post('/api/categories', { name, color });
    setCategories(prev => {
      if (prev.some(c => c.id === res.data.id)) return prev;
      return [...prev, res.data];
    });
    return res.data;
  };

  const updateCategory = async (id, data) => {
    const res = await client.put(`/api/categories/${id}`, data);
    setCategories(prev => prev.map(c => c.id === id ? res.data : c));
    return res.data;
  };

  const removeCategory = async (id) => {
    await client.delete(`/api/categories/${id}`);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return { categories, addCategory, updateCategory, removeCategory };
};

export default useCategories;
