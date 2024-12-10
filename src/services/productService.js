// src/services/productService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addProductAPI = (product) => axios.post(`${API_URL}/products`, product);

export const updateProductAPI = (updatedProduct) => {
  const encodedId = encodeURIComponent(updatedProduct._id);
  return axios.put(`${API_URL}/products/${encodedId}`, updatedProduct);
};

export const deleteProductAPI = (productId) => axios.delete(`${API_URL}/products/${productId}`);

export const fetchAllProducts = () => axios.get(`${API_URL}/products`);


// מביא את כל הגדלים למוצר מסוים
export const fetchSizesByProductAPI = (productId) =>
  axios.get(`${API_URL}/sizes/${productId}`);

// מוסיף גודל חדש למוצר מסוים
export const addSizeAPI = (productId, size) =>
  axios.post(`${API_URL}/sizes/${productId}`, size);

// מעדכן גודל מסוים לפי ID
export const updateSizeAPI = (sizeId, updatedSize) =>
  axios.put(`${API_URL}/sizes/${sizeId}`, updatedSize);

// מוחק גודל מסוים לפי ID
export const deleteSizeAPI = (productId, sizeId) =>
  axios.delete(`${API_URL}/sizes/${productId}/${sizeId}`);


// הבאת וריאציה לפי ID
export const fetchVariationByIdAPI = (variationId) =>
  axios.get(`${API_URL}/variations/${variationId}`);

// הוספת וריאציה חדשה
export const addVariationAPI = (variation) =>
  axios.post(`${API_URL}/variations`, variation);

// עדכון וריאציה לפי ID
export const updateVariationAPI = (variationId, updatedVariation) =>
  axios.put(`${API_URL}/variations/${variationId}`, updatedVariation);

// מחיקת וריאציה לפי ID
export const deleteVariationAPI = (variationId) =>
  axios.delete(`${API_URL}/variations/${variationId}`);