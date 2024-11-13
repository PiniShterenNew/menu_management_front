// src/store/employeesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const employeesSlice = createSlice({
  name: 'employees',
  initialState: [],
  reducers: {
    setEmployees: (state, action) => action.payload,
    addOrUpdateEmployee: (state, action) => {
      const newEmployee = action.payload;
      const existingIndex = state.findIndex((employee) => employee._id === newEmployee._id);
      if (existingIndex !== -1) {
        state[existingIndex] = newEmployee;
      } else {
        state.push(newEmployee);
      }
    },
    updateEmployee: (state, action) => {
      const updatedEmployee = action.payload;
      const index = state.findIndex((employee) => employee._id === updatedEmployee._id);
      if (index !== -1) {
        state[index] = updatedEmployee;
      }
    },
    deleteEmployee: (state, action) => state.filter((employee) => employee._id !== action.payload)
  }
});

export const { setEmployees, addOrUpdateEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
