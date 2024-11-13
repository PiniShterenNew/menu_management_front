// src/store/categoriesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [],
  reducers: {
    setCategories: (state, action) => {
      // הגדרת הנתונים הראשוניים בטעינה ראשונה
      return action.payload;
    },
    addOrUpdateCategory: (state, action) => {
      const newCategory = action.payload;
      const existingIndex = state.findIndex((category) => category._id === newCategory._id);
      if (existingIndex !== -1) {
        // אם הקטגוריה כבר קיימת, מחליפים אותה
        state[existingIndex] = newCategory;
      } else {
        // אם הקטגוריה חדשה, מוסיפים אותה לראש הרשימה
        state.unshift(newCategory);
      }
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      const index = state.findIndex((category) => category._id === updatedCategory._id);
      if (index !== -1) {
        state[index] = updatedCategory;
      }
    },
    deleteCategory: (state, action) => {
      const deletedCategoryId = action.payload;
      return state.filter((category) => category._id !== deletedCategoryId);
    }
  }
});

export const {
  setCategories,
  addOrUpdateCategory,
  updateCategory,
  deleteCategory
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
