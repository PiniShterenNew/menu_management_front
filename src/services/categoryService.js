// src/services/categoryService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addCategoryAPI = (category) => axios.post(`${API_URL}/categories`, category);

export const updateCategoryAPI = (updatedCategory) => {
  const encodedId = encodeURIComponent(updatedCategory._id);
  return axios.put(`${API_URL}/categories/${encodedId}`, updatedCategory);
};

export const deleteCategoryAPI = (categoryId) => axios.delete(`${API_URL}/categories/${categoryId}`);

export const fetchAllCategories = () => axios.get(`${API_URL}/categories`);
