// src/context/subcontexts/EmployeeContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addEmployeeAPI, deleteEmployeeAPI, updateEmployeeAPI } from '../../services/employeeService';

const EmployeeContext = createContext();

export const useEmployeeContext = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const addEmployee = async (employee) => {
        setLoading(true);
        try {
            await addEmployeeAPI(employee);
            message.success('העובד נוסף בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error adding employee:', error);
            message.error('שגיאה בהוספת עובד');
            setLoading(false);
        }
    };

    const updateEmployee = async (updatedEmployee) => {
        setLoading(true);
        try {
            await updateEmployeeAPI(updatedEmployee);
            message.success('העובד עודכן בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error updating employee:', error);
            message.error('שגיאה בעדכון עובד');
            setLoading(false);
        }
    };

    const deleteEmployee = async (employeeId) => {
        setLoading(true);
        try {
            await deleteEmployeeAPI(employeeId);
            message.success('העובד נמחק בהצלחה');
            setLoading(false);
        } catch (error) {
            console.error('Error deleting employee:', error);
            message.error('שגיאה במחיקת עובד');
            setLoading(false);
        }
    };

    return (
        <EmployeeContext.Provider value={{
            addEmployee,
            updateEmployee,
            deleteEmployee,
            loading
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};
