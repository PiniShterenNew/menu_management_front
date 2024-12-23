import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { selectAverageHourlyRate } from './employeeHours';

const VAT_RATE = 1.17;

const productsSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    setProductsState: (state, action) => {
      const { products, ingredientsState, mixesState, averageHourlyRate } = action.payload;
      return products;
    },
    addOrUpdateProductState: (state, action) => {
      const { newProduct, ingredientsState, mixesState, averageHourlyRate } = action.payload;
      const updatedProduct = newProduct;

      const existingIndex = state.findIndex((product) => product._id === newProduct._id);
      if (existingIndex !== -1) {
        state[existingIndex] = updatedProduct;
      } else {
        state.unshift(updatedProduct);
      }
    },
    updateProductState: (state, action) => {
      const { updatedProduct, ingredientsState, mixesState, averageHourlyRate } = action.payload;
      const updatedProductState = updatedProduct;
      return state.map((product) =>
        product._id === updatedProduct._id ? updatedProductState : product
      );
    },
    deleteProductState: (state, action) => {
      const deletedProductId = action.payload._id;
      return state.filter((product) => product._id !== deletedProductId);
    },
  },
});

export const { setProductsState, addOrUpdateProductState, updateProductState, deleteProductState } = productsSlice.actions;
export default productsSlice.reducer;