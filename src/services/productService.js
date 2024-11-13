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
