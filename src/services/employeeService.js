// src/services/employeeService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const addEmployeeAPI = (employee) =>
  axios.post(`${API_URL}/employees`, employee);

export const updateEmployeeAPI = (employee) => {
  const encodedId = encodeURIComponent(employee._id);
  return axios.put(`${API_URL}/employees/${encodedId}`, employee);
};

export const deleteEmployeeAPI = (employeeId) =>
  axios.delete(`${API_URL}/employees/${employeeId}`);

export const fetchAllEmployees = (id, data) =>
  axios.get(`${API_URL}/employees?${data ? "data=" + data : ""}${id ? "&id=" + id : ""}`);
