// src/context/subcontexts/IngredientContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addMenuCategoryAPI, deleteMenuCategoryAPI, updateMenuCategoryAPI } from '../../services/categoryService';

const CategoryContext = createContext();

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const addCategory = async (category) => {
        setLoading(true);
        try {
            await addMenuCategoryAPI(category);
            message.success('הקטגוריה נוספה בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error adding category:', error);
            message.error('שגיאה בהוספת הקטגוריה');
            setLoading(false);
        }
    };

    const updateCategory = async (updatedCategory) => {
        setLoading(true);
        try {
            await updateMenuCategoryAPI(updatedCategory);
            message.success('הקטגוריה עודכנה בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error updating category:', error);
            message.error('שגיאה בעדכון הקטגוריה');
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryId) => {
        setLoading(true);
        try {
            await deleteMenuCategoryAPI(categoryId);
            message.success('הקטגוריה נמחקה בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('שגיאה במחיקת הקטגוריה');
            setLoading(false);
        }
    };
    return (
        <CategoryContext.Provider value={{
            addCategory,
            updateCategory,
            deleteCategory,
            loading
        }}>
            {children}
        </CategoryContext.Provider>
    );
};
