// store/profitabilitySettingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const profitabilitySettingsSlice = createSlice({
  name: 'profitabilitySettings',
  initialState: {
    // ערכי ברירת מחדל לאחוזי התמחור
    materialCostRate: 25,       // אחוז עלות חומרי גלם
    laborCostRate: 12,          // אחוז עלות עבודה
    fixedExpensesRate: 30,      // אחוז השתתפות בהוצאות קבועות
    profitRate: 33,             // אחוז רווח

    // טווחים מומלצים
    materialCostRange: { min: 20, max: 30 },
    laborCostRange: { min: 10, max: 15 },
    fixedExpensesRange: { min: 25, max: 35 },
    profitRange: { min: 25, max: 35 }
  },
  reducers: {
    // עדכון אחוזי תמחור
    setMaterialCostRate: (state, action) => {
      state.materialCostRate = action.payload;
    },
    setLaborCostRate: (state, action) => {
      state.laborCostRate = action.payload;
    },
    setFixedExpensesRate: (state, action) => {
      state.fixedExpensesRate = action.payload;
    },
    setProfitRate: (state, action) => {
      state.profitRate = action.payload;
    },

    // עדכון טווחים
    setMaterialCostRange: (state, action) => {
      state.materialCostRange = action.payload;
    },
    setLaborCostRange: (state, action) => {
      state.laborCostRange = action.payload;
    },
    setFixedExpensesRange: (state, action) => {
      state.fixedExpensesRange = action.payload;
    },
    setProfitRange: (state, action) => {
      state.profitRange = action.payload;
    }
  }
});

// ייצוא הפעולות
export const {
  setMaterialCostRate,
  setLaborCostRate,
  setFixedExpensesRate,
  setProfitRate,
  setMaterialCostRange,
  setLaborCostRange,
  setFixedExpensesRange,
  setProfitRange
} = profitabilitySettingsSlice.actions;

export default profitabilitySettingsSlice.reducer;
