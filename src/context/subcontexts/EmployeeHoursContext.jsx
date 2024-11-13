// src/context/subcontexts/EmployeeHoursContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import {
    addEmployeeHoursAPI,
    updateEmployeeHoursAPI,
    deleteEmployeeHoursAPI,
    fetchEmployeeHoursAPI
} from '../../services/employeeHoursService';

const EmployeeHoursContext = createContext();

export const useEmployeeHoursContext = () => useContext(EmployeeHoursContext);

export const EmployeeHoursProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // הוספת שעות עבודה
    const addEmployeeHours = async (employeeId, hoursData) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            try {
                const response = await addEmployeeHoursAPI(employeeId, hoursData);
                if (response?.status === 200) {
                    message.error(response.data?.message);
                    reject(false);
                    return;
                }
                message.success('שעות העבודה נוספו בהצלחה');
                resolve(true);
            } catch (error) {
                console.error('Error adding employee hours:', error);
                message.error('שגיאה בהוספת שעות עבודה');
                reject(false);
            } finally {
                setLoading(false);
            }
        });
    };

    // עדכון שעות עבודה קיימות
    const updateEmployeeHours = async (hoursId, hoursData) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            try {
                const response = await updateEmployeeHoursAPI(hoursId, hoursData);
                if(response.status !== 201){
                    reject(false);
                }else{
                    message.success('שעות העבודה עודכנו בהצלחה');
                    resolve(true);
                }
            } catch (error) {
                console.error('Error updating employee hours:', error);
                message.error('שגיאה בעדכון שעות עבודה');
                reject(false);
            } finally {
                setLoading(false);
            }
        });
    };

    // שליפת כל שעות העבודה של עובד מסוים
    const fetchEmployeeHours = async (employeeId) => {
        setLoading(true);
        try {
            const response = await fetchEmployeeHoursAPI(employeeId);
            message.success('שעות העבודה נשלפו בהצלחה');
            return response.data; // החזרת הנתונים כדי שניתן יהיה להשתמש בהם
        } catch (error) {
            console.error('Error fetching employee hours:', error);
            message.error('שגיאה בשליפת שעות עבודה');
        } finally {
            setLoading(false);
        }
    };

    // מחיקת רשומת שעות עבודה
    const deleteEmployeeHours = async (hoursId) => {
        setLoading(true);
        try {
            await deleteEmployeeHoursAPI(hoursId);
            message.success('שעות העבודה נמחקו בהצלחה');
        } catch (error) {
            console.error('Error deleting employee hours:', error);
            message.error('שגיאה במחיקת שעות עבודה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EmployeeHoursContext.Provider value={{
            loading,
            addEmployeeHours,
            updateEmployeeHours,
            deleteEmployeeHours,
            fetchEmployeeHours
        }}>
            {children}
        </EmployeeHoursContext.Provider>
    );
};
