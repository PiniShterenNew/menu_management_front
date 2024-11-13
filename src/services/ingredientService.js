// src/services/ingredientService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addIngredientAPI = (ingredient) => axios.post(`${API_URL}/ingredients`, ingredient);

export const updateIngredientAPI = (updatedIngredient) => {
  const encodedId = encodeURIComponent(updatedIngredient._id);
  return axios.put(`${API_URL}/ingredients/${encodedId}`, updatedIngredient);
};

export const deleteIngredientAPI = (ingredientId) => axios.delete(`${API_URL}/ingredients/${ingredientId}`);

export const fetchAllIngredients = () => axios.get(`${API_URL}/ingredients`);
