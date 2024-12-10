import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchAllSettingsAPI = () => axios.get(`${API_URL}/settings`);

export const addSettingAPI = (setting) => axios.post(`${API_URL}/settings`, setting);

export const updateSettingAPI = (updatedSetting) => {
    const encodedKey = encodeURIComponent(updatedSetting.key);
    return axios.put(`${API_URL}/settings/${encodedKey}`, updatedSetting);
};

export const deleteSettingAPI = (key) => {
    const encodedKey = encodeURIComponent(key);
    return axios.delete(`${API_URL}/settings/${encodedKey}`);
};
