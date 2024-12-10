import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addSettingAPI, updateSettingAPI, deleteSettingAPI, fetchAllSettingsAPI } from '../../services/settingsService';

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState([]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await fetchAllSettingsAPI();
            setSettings(data);
            message.success('ההגדרות נטענו בהצלחה');
        } catch (error) {
            console.error('Error fetching settings:', error);
            message.error('שגיאה בטעינת ההגדרות');
        } finally {
            setLoading(false);
        }
    };

    const addSetting = async (setting) => {
        setLoading(true);
        try {
            await addSettingAPI(setting);
            message.success('ההגדרה נוספה בהצלחה');
            await fetchSettings(); // טען מחדש את ההגדרות
        } catch (error) {
            console.error('Error adding setting:', error);
            message.error('שגיאה בהוספת ההגדרה');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (updatedSetting) => {
        setLoading(true);
        try {
            await updateSettingAPI(updatedSetting);
            message.success('ההגדרה עודכנה בהצלחה');
            await fetchSettings(); // טען מחדש את ההגדרות
        } catch (error) {
            console.error('Error updating setting:', error);
            message.error('שגיאה בעדכון ההגדרה');
        } finally {
            setLoading(false);
        }
    };

    const deleteSetting = async (key) => {
        setLoading(true);
        try {
            await deleteSettingAPI(key);
            message.success('ההגדרה נמחקה בהצלחה');
            await fetchSettings(); // טען מחדש את ההגדרות
        } catch (error) {
            console.error('Error deleting setting:', error);
            message.error('שגיאה במחיקת ההגדרה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            loading,
            fetchSettings,
            addSetting,
            updateSetting,
            deleteSetting,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
