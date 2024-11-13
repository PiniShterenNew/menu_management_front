// src/services/supplierService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addSupplierAPI = (supplier) => axios.post(`${API_URL}/suppliers`, supplier);

export const updateSupplierAPI = (updatedSupplier) => {
  const encodedId = encodeURIComponent(updatedSupplier._id);
  return axios.put(`${API_URL}/suppliers/${encodedId}`, updatedSupplier);
};

export const deleteSupplierAPI = (supplierId) => axios.delete(`${API_URL}/suppliers/${supplierId}`);

export const fetchAllSuppliers = () => axios.get(`${API_URL}/suppliers`);
