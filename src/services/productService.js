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

export const fetchProduct = (id) => axios.get(`${API_URL}/products/${id}`);


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




// הבאת וריאציה לפי ID בתוך גודל מסוים
export const fetchVariationByIdAPI = (sizeId, variationId) =>
  axios.get(`${API_URL}/variations/${sizeId}/${variationId}`);

// הוספת וריאציה חדשה לגודל מסוים
export const addVariationAPI = (sizeId, variation) =>
  axios.post(`${API_URL}/variations/${sizeId}`, variation);

// עדכון וריאציה לפי ID בתוך גודל מסוים
export const updateVariationAPI = (sizeId, variationId, updatedVariation) =>
  axios.put(`${API_URL}/variations/${sizeId}/${variationId}`, updatedVariation);

// מחיקת וריאציה לפי ID מתוך גודל מסוים
export const deleteVariationAPI = (sizeId, variationId) =>
  axios.delete(`${API_URL}/variations/${sizeId}/${variationId}`);

