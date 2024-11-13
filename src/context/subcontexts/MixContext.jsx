// src/context/subcontexts/IngredientContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addMixAPI, deleteMixAPI, updateMixAPI } from '../../services/mixService';

const MixContext = createContext();

export const useMixContext = () => useContext(MixContext);

export const MixProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const addMix = async (mix) => {
        setLoading(true);
        try {
            await addMixAPI(mix);
            message.success('התערובת נוספה בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error adding mix:', error);
            message.error('שגיאה בהוספת התערובת');
            setLoading(false);
        }
    };

    const updateMix = async (updatedMix) => {
        setLoading(true);
        try {
            await updateMixAPI(updatedMix);
            message.success('התערובת עודכנה בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error updating mix:', error);
            message.error('שגיאה בעדכון התערובת');
            setLoading(false);
        }
    };

    const deleteMix = async (mixId) => {
        setLoading(true);
        try {
            await deleteMixAPI(mixId);
            message.success('התערובת נמחקה בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error deleting mix:', error);
            message.error('שגיאה במחיקת התערובת');
            setLoading(false);
        }
    };

    return (
        <MixContext.Provider value={{
            addMix,
            updateMix,
            deleteMix,
            loading
        }}>
            {children}
        </MixContext.Provider>
    );
};
