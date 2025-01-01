// src/services/categoryService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addMenuCategoryAPI = (category) => axios.post(`${API_URL}/categories`, category);

export const updateMenuCategoryAPI = (updatedCategory) => {
  const encodedId = encodeURIComponent(updatedCategory._id);
  return axios.put(`${API_URL}/categories/${encodedId}`, updatedCategory);
};

export const deleteMenuCategoryAPI = (categoryId) => axios.delete(`${API_URL}/categories/${categoryId}`);

export const fetchAllMenuCategories = () => axios.get(`${API_URL}/categories`);
