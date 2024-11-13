// src/context/subcontexts/IngredientContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addProductAPI, deleteProductAPI, updateProductAPI } from '../../services/productService';

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // פונקציות עבור מוצרים וקטגוריות - דומה למה שעשינו עבור חומרים וספקים
    const addProduct = async (product) => {
        setLoading(true);
        try {
            await addProductAPI(product);
            message.success('המוצר נוסף בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error adding product:', error);
            message.error('שגיאה בהוספת המוצר');
            setLoading(false);
        }
    };

    const updateProduct = async (updatedProduct) => {
        setLoading(true);
        try {
            await updateProductAPI(updatedProduct);
            message.success('המוצר עודכן בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error updating product:', error);
            message.error('שגיאה בעדכון המוצר');
            setLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        setLoading(true);
        try {
            await deleteProductAPI(productId);
            message.success('המוצר נמחק בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('שגיאה במחיקת המוצר');
            setLoading(false);
        }
    };

    return (
        <ProductContext.Provider value={{
            addProduct,
            updateProduct,
            deleteProduct,
            loading
        }}>
            {children}
        </ProductContext.Provider>
    );
};
