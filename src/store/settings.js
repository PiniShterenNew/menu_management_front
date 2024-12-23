// src/store/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: null, // כל מסמך ההגדרות
    loading: false, // מצב טעינה
  },
  reducers: {
    setSettings: (state, action) => {
      // הגדרת ההגדרות בעת טעינה ראשונית
      state.settings = action.payload;
    },
    updateSettingValue: (state, action) => {
      const { key, value } = action.payload;
      if (state.settings && state.settings[key]) {
        state.settings[key].value = value;
        state.settings[key].lastUpdated = new Date().toISOString();
      }
    },
    addCategory: (state, action) => {
      const newCategory = action.payload;
      if (state.settings && state.settings.materialCategories) {
        state.settings.materialCategories.value.push(newCategory);
        state.settings.materialCategories.lastUpdated = new Date().toISOString();
      }
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      if (state.settings && state.settings.materialCategories) {
        const index = state.settings.materialCategories.value.findIndex(
          (category) => category._id === updatedCategory._id
        );
        if (index !== -1) {
          state.settings.materialCategories.value[index] = updatedCategory;
          state.settings.materialCategories.lastUpdated = new Date().toISOString();
        }
      }
    },
    deleteCategory: (state, action) => {
      const categoryId = action.payload;
      if (state.settings && state.settings.materialCategories) {
        state.settings.materialCategories.value = state.settings.materialCategories.value.filter(
          (category) => category._id !== categoryId
        );
        state.settings.materialCategories.lastUpdated = new Date().toISOString();
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setSettings,
  updateSettingValue,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
} = settingsSlice.actions;

export default settingsSlice.reducer;
