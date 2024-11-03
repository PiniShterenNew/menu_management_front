// features/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const suppliers = createSlice({
    name: 'suppliers',
    initialState: [],
    reducers: {
        addSuppliersState: (state, action) => {
            return action.payload;  // מחליף את כל ה-state במערך החדש
        },
        addOrUpdateSupplierState: (state, action) => {
            const newSupplier = action.payload;
            const existingIndex = state.findIndex((supplier) => supplier._id === newSupplier._id);

            if (existingIndex !== -1) {
                // אם הספק קיים, נעדכן את המידע שלו
                state[existingIndex] = newSupplier;
            } else {
                // אם הספק לא קיים, נוסיף אותו לראש הרשימה
                state.unshift(newSupplier);
            }
        },
        updateSupplierState: (state, action) => {
            const updatedSupplier = action.payload;
            return state.map((supplier) =>
                supplier._id === updatedSupplier._id ? updatedSupplier : supplier
            );
        },
        deleteSupplierState: (state, action) => {
            const deletedSupplierId = action.payload._id;
            return state.filter((supplier) => supplier._id !== deletedSupplierId);
        },
    },
});

export const { addSuppliersState, addOrUpdateSupplierState, updateSupplierState, deleteSupplierState } = suppliers.actions;
export default suppliers.reducer;
