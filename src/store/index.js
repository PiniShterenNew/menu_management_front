import { configureStore } from "@reduxjs/toolkit";
import suppliers from "./suppliers";
import ingredients from "./ingredients";
import products from "./products";
import dashboard from "./dashboard";
import mixesSlice from "./mixes";
import categories from "./categories";
import employees from "./employees";
import employeeHours from "./employeeHours";
import profitabilitySettingsSlice from "./profitabilitySettingsSlice";

const store = configureStore({
    reducer: {
        suppliers: suppliers,
        ingredients: ingredients,
        products: products,
        dashboard: dashboard,
        mixes: mixesSlice,
        categories: categories,
        employees: employees,
        employeeHours: employeeHours,
        profitabilitySettingsSlice: profitabilitySettingsSlice
    }
});

export default store;