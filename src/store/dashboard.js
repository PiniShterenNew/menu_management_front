// features/todoSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Thunk לשליפת נתונים מהסלייסים האחרים
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (_, { getState }) => {
        const state = getState();
        // here you can access to state

        // מבנה נתונים מסוכם לדשבורד
        return {

        };
    }
);

const dashboard = createSlice({
    name: 'dashboard',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
            })
            .addCase(fetchDashboardData.rejected, (state) => {
            });
    },
});

export default dashboard.reducer;
