// src/services/mixService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addMixAPI = (mix) => axios.post(`${API_URL}/mixes`, mix);

export const updateMixAPI = (updatedMix) => {
  const encodedId = encodeURIComponent(updatedMix._id);
  return axios.put(`${API_URL}/mixes/${encodedId}`, updatedMix);
};

export const deleteMixAPI = (mixId) => axios.delete(`${API_URL}/mixes/${mixId}`);

export const fetchAllMixes = () => axios.get(`${API_URL}/mixes`);
