import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { selectAverageHourlyRate } from './employeeHours';

const VAT_RATE = 1.17;

export const updateProductsWithRate = createAsyncThunk(
  'products/updateWithRate',
  async (_, { getState }) => {
    const state = getState();
    const averageHourlyRate = selectAverageHourlyRate(state); // שליפת שכר שעתי ממוצע
    const products = state.products; // מוצרים נוכחיים

    const updatedProducts = products.map(product => {
      return {
        ...product,
        sizes: product.sizes.map(size => {
          const baseIngredientCost = size.ingredients.reduce(
            (acc, ingredient) => acc + parseFloat(ingredient.processedCost || ingredient.actualCost || 0),
            0
          );

          const baseMixCost = size.mixes.reduce(
            (acc, mix) => acc + parseFloat(mix.actualCost || 0),
            0
          );

          const totalRawCost = baseIngredientCost + baseMixCost;
          const laborCost = (averageHourlyRate / 60) * size.preparationTime;
          const priceWithoutVAT = size.price / VAT_RATE;
          const totalCost = totalRawCost + laborCost;
          const profit = priceWithoutVAT - totalCost;
          const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';

          return {
            ...size,
            totalRawCost: totalRawCost.toFixed(2),
            laborCost: laborCost.toFixed(2),
            profitMargin
          };
        })
      };
    });

    return updatedProducts;
  }
);

function processProductsData(products, ingredientsState, mixesState, averageHourlyRate) {
  return products.map(product => ({
    ...product,
    sizes: product.sizes.map(size => {
      const updatedIngredients = size.ingredients.map(ingredient => {
        const ingredientData = ingredientsState.find(item => item._id === ingredient.ingredientId);
        if (!ingredientData) return ingredient;

        const quantityRatio = ingredient.quantity / ingredientData.unitQuantity;
        const ingredientCost = quantityRatio * ingredientData.unitPrice;

        const processedCost = ingredientData.isJuice
          ? (ingredient.quantity / ingredientData.unitQuantity) * ingredientData.processedPrice
          : null;

        return {
          ...ingredient,
          actualCost: ingredientCost.toFixed(2),
          processedCost: processedCost ? processedCost.toFixed(2) : null
        };
      });

      const updatedMixes = size.mixes.map(mix => {
        const mixData = mixesState.find(item => item._id === mix.mixId);
        if (!mixData) return mix;

        const realQuantity = mix.quantity / mixData.totalWeight; // כמות בפועל מהמיקס
        const mixCost = realQuantity * mixData.totalCost;

        return {
          ...mix,
          actualCost: mixCost.toFixed(2),
          realQuantity: realQuantity.toFixed(2)
        };
      });

      const totalIngredientCost = updatedIngredients.reduce((acc, ingredient) => acc + parseFloat(ingredient.processedCost || ingredient.actualCost || 0), 0);
      const totalMixCost = updatedMixes.reduce((acc, mix) => acc + parseFloat(mix.actualCost || 0), 0);
      const totalRawCost = totalIngredientCost + totalMixCost;

      const priceWithoutVAT = size.price / VAT_RATE;
      const laborCost = (averageHourlyRate / 60) * size.preparationTime;
      const totalCost = totalRawCost + laborCost;
      const profit = priceWithoutVAT - totalCost;
      const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';

      return {
        ...size,
        ingredients: updatedIngredients,
        mixes: updatedMixes,
        totalRawCost: totalRawCost.toFixed(2),
        laborCost: laborCost.toFixed(2),
        profitMargin
      };
    })
  }));
}

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
      const updatedProduct = processProductsData([newProduct], ingredientsState, mixesState, averageHourlyRate)[0];

      const existingIndex = state.findIndex((product) => product._id === newProduct._id);
      if (existingIndex !== -1) {
        state[existingIndex] = updatedProduct;
      } else {
        state.unshift(updatedProduct);
      }
    },
    updateProductState: (state, action) => {
      const { updatedProduct, ingredientsState, mixesState, averageHourlyRate } = action.payload;
      const updatedProductState = processProductsData([updatedProduct], ingredientsState, mixesState, averageHourlyRate)[0];
      return state.map((product) =>
        product._id === updatedProduct._id ? updatedProductState : product
      );
    },
    deleteProductState: (state, action) => {
      const deletedProductId = action.payload._id;
      return state.filter((product) => product._id !== deletedProductId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProductsWithRate.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { setProductsState, addOrUpdateProductState, updateProductState, deleteProductState } = productsSlice.actions;
export default productsSlice.reducer;