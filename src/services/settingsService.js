import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// שליפת כל ההגדרות
export const fetchAllSettingsAPI = () => axios.get(`${API_URL}/settings`);

// עדכון ערך של הגדרה מסוימת
export const updateSettingValueAPI = (key, value) => {
    const encodedKey = encodeURIComponent(key);
    return axios.put(`${API_URL}/settings/${encodedKey}`, { value });
};

// הוספת קטגוריה חדשה
export const addCategoryAPI = (category) => axios.post(`${API_URL}/settings/categories`, category);

// עדכון קטגוריה קיימת
export const updateCategoryAPI = (categoryId, updatedCategory) => {
    return axios.put(`${API_URL}/settings/categories/${categoryId}`, updatedCategory);
};

// מחיקת קטגוריה
export const deleteCategoryAPI = (categoryId) => {
    return axios.delete(`${API_URL}/settings/categories/${categoryId}`);
};
