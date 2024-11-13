// src/services/employeeHoursService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// הוספת שעות עבודה לעובד
export const addEmployeeHoursAPI = (employeeId, hoursData) =>
  axios.post(`${API_URL}/employees/${employeeId}/hours`, hoursData);

// עדכון שעות עבודה של עובד לפי מזהה השעות
export const updateEmployeeHoursAPI = (hoursId, hoursData) =>
  axios.put(`${API_URL}/employees/hours/${hoursId}`, hoursData);

// מחיקת רשומת שעות עבודה של עובד לפי מזהה השעות
export const deleteEmployeeHoursAPI = (hoursId) =>
  axios.delete(`${API_URL}/employees/hours/${hoursId}`);

// שליפת כל שעות העבודה של עובד
export const fetchEmployeeHoursAPI = (employeeId) =>
  axios.get(`${API_URL}/employees/${employeeId}/hours`);

// שליפת כל שעות העבודה של כל העובדים לפי חודש
export const fetchEmployeesHoursMonthAPI = (month, year) =>
  axios.get(`${API_URL}/employees/hours/${year}/${month}`);

