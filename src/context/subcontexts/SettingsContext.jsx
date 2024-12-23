import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import {
    fetchAllSettingsAPI,
    updateSettingValueAPI,
    addCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI,
} from '../../services/settingsService';
import {
    setSettings,
    updateSettingValue,
    addCategory,
    updateCategory,
    deleteCategory,
    setLoading,
} from '../../store/settings';

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.settings);

    const fetchSettings = async () => {
        dispatch(setLoading(true));
        try {
            const { data } = await fetchAllSettingsAPI();
            dispatch(setSettings(data));
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateSetting = async (key, value) => {
        dispatch(setLoading(true));
        try {
            await updateSettingValueAPI(key, value);
            dispatch(updateSettingValue({ key, value }));
            message.success('הערך עודכן בהצלחה');
        } catch (error) {
            console.error('Error updating setting:', error);
            message.error('שגיאה בעדכון ההגדרה');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const addCategory = async (category) => {
        dispatch(setLoading(true));
        try {
            const { data } = await addCategoryAPI(category);
            dispatch(addCategory(data));
            message.success('הקטגוריה נוספה בהצלחה');
        } catch (error) {
            console.error('Error adding category:', error);
            message.error('שגיאה בהוספת הקטגוריה');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateCategory = async (categoryId, updatedCategory) => {
        dispatch(setLoading(true));
        try {
            await updateCategoryAPI(categoryId, updatedCategory);
            dispatch(updateCategory(updatedCategory));
            message.success('הקטגוריה עודכנה בהצלחה');
        } catch (error) {
            console.error('Error updating category:', error);
            message.error('שגיאה בעדכון הקטגוריה');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const deleteCategory = async (categoryId) => {
        dispatch(setLoading(true));
        try {
            await deleteCategoryAPI(categoryId);
            dispatch(deleteCategory(categoryId));
            message.success('הקטגוריה נמחקה בהצלחה');
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('שגיאה במחיקת הקטגוריה');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                settings,
                loading,
                fetchSettings,
                updateSetting,
                addCategory,
                updateCategory,
                deleteCategory,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
