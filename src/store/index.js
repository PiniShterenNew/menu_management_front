import { configureStore } from "@reduxjs/toolkit";
import suppliers from "./suppliers";
import ingredients from "./ingredients";
import products from "./products";
import dashboard from "./dashboard";

const store = configureStore({
    reducer: {
        suppliers: suppliers,
        ingredients: ingredients,
        products: products,
        dashboard: dashboard
    }
});

export default store;