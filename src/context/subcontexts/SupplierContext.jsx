// src/context/subcontexts/IngredientContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addSupplierAPI, deleteSupplierAPI, updateSupplierAPI } from '../../services/supplierService';

const SupplierContext = createContext();

export const useSupplierContext = () => useContext(SupplierContext);

export const SupplierProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // פונקציות דומות עבור ספקים, מוצרים וקטגוריות
    const addSupplier = async (supplier) => {
        setLoading(true);
        try {
            await addSupplierAPI(supplier);
            message.success('הספק נוסף בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error adding supplier:', error);
            message.error('שגיאה בהוספת הספק');
            setLoading(false);
        }
    };

    const updateSupplier = async (updatedSupplier) => {
        setLoading(true);
        try {
            await updateSupplierAPI(updatedSupplier);
            message.success('הספק עודכן בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error updating supplier:', error);
            message.error('שגיאה בעדכון הספק');
            setLoading(false);
        }
    };

    const deleteSupplier = async (supplierId) => {
        setLoading(true);
        try {
            await deleteSupplierAPI(supplierId);
            message.success('הספק נמחק בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error deleting supplier:', error);
            message.error('שגיאה במחיקת הספק');
            setLoading(false);
        }
    };

    return (
        <SupplierContext.Provider value={{
            addSupplier,
            updateSupplier,
            deleteSupplier,
            loading
        }}>
            {children}
        </SupplierContext.Provider>
    );
};
