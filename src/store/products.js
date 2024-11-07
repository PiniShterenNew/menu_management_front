import { createSlice } from '@reduxjs/toolkit';

const VAT_RATE = 1.17;

function processProductsData(products, ingredientsState, mixesState) {
  return ingredientsState?.length > 0 && mixesState?.length > 0 ? products.map(product => {
    const updatedIngredients = product.ingredients.map(ingredient => {
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

    const updatedMixes = product.mixes.map(mix => {
      const mixData = mixesState.find(item => item._id === mix.mixId);
      if (!mixData) return mix;

      const realQuantity = mix.quantity / mixData.totalWeight; // חישוב כמות בפועל מתוך משקל כולל המיקס
      const mixCost = realQuantity * mixData.totalCost;

      return {
        ...mix,
        actualCost: mixCost.toFixed(2),
        realQuantity: realQuantity.toFixed(2) // נפח בפועל מהמיקס
      };
    });

    const totalIngredientCost = updatedIngredients.reduce((acc, ingredient) => acc + parseFloat(ingredient.processedCost || ingredient.actualCost || 0), 0);
    const totalMixCost = updatedMixes.reduce((acc, mix) => acc + parseFloat(mix.actualCost || 0), 0);
    const totalRawCost = totalIngredientCost + totalMixCost;

    const priceWithoutVAT = product?.price / VAT_RATE;
    const totalCost = (totalRawCost + (product?.laborCost || 0) + (product?.additionalCost || 0)).toFixed(2);
    const profit = (priceWithoutVAT - totalCost).toFixed(2);
    const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';

    return {
      ...product,
      ingredients: updatedIngredients,
      mixes: updatedMixes,
      totalRawCost: totalRawCost.toFixed(2),
      profitMargin: profitMargin,
    };
  }) : products;
}

const productsSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    setProductsState: (state, action) => {
      const { products, ingredientsState, mixesState } = action.payload;
      return processProductsData(products, ingredientsState, mixesState);
    },
    addOrUpdateProductState: (state, action) => {
      const { newProduct, ingredientsState, mixesState } = action.payload;
      const updatedProduct = processProductsData([newProduct], ingredientsState, mixesState)[0];

      const existingIndex = state.findIndex((product) => product._id === newProduct._id);
      if (existingIndex !== -1) {
        state[existingIndex] = updatedProduct;
      } else {
        state.unshift(updatedProduct);
      }
    },
    updateProductState: (state, action) => {
      const { updatedProduct, ingredientsState, mixesState } = action.payload;
      const updatedProductState = processProductsData([updatedProduct], ingredientsState, mixesState)[0];
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
