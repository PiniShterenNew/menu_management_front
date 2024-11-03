// features/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const VAT_RATE = 1.17;

function processProductsData(products, ingredientsState) {
  return ingredientsState?.length > 0 ? products.map(product => {
    // מעבדים כל רכיב במוצר
    const updatedIngredients = product.ingredients.map(ingredient => {
      // מוצאים את המידע המעודכן של הרכיב
      const ingredientData = ingredientsState.find(item => item._id === ingredient.ingredientId);
      if (!ingredientData) return ingredient; // אם לא נמצא, מחזירים את הרכיב כפי שהוא

      // מחשבים את עלות הרכיב לפי המחיר ליחידה, כמות היחידה והכמות הנדרשת
      const quantityRatio = ingredient.quantity / ingredientData.unitQuantity;
      const ingredientCost = quantityRatio * ingredientData.unitPrice;

      // אם זה רכיב מיועד למיץ, נחשב את העלות המעובדת
      const processedCost = ingredientData.isJuice
        ? (ingredient.quantity / ingredientData.unitQuantity) * ingredientData.processedPrice
        : null;

      // מוסיפים מפתחות חדשים לרכיב עם עלות בפועל ועלות מעובדת
      return {
        ...ingredient,
        actualCost: ingredientCost.toFixed(2),
        processedCost: processedCost ? processedCost.toFixed(2) : null
      };
    });

    // חישוב העלות הכוללת של המוצר
    const totalRawCost = updatedIngredients.reduce((acc, ingredient) => acc + parseFloat(ingredient.processedCost || ingredient.actualCost || 0), 0);
    const priceWithoutVAT = product?.price / VAT_RATE;
    const costWithoutVAT = Number(totalRawCost) || 0;
    const totalCost = (costWithoutVAT + (product?.laborCost || 0) + (product?.additionalCost || 0)).toFixed(2);
    const profit = (priceWithoutVAT - totalCost).toFixed(2);
    const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';
    // החזרת המוצר עם העלויות המחושבות
    return {
      ...product,
      ingredients: updatedIngredients,
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
      const { products, ingredientsState } = action.payload;
      return processProductsData(products, ingredientsState); // עיבוד הנתונים
    },
    addOrUpdateProductState: (state, action) => {
      const { newProduct, ingredientsState } = action.payload;
      const updatedProduct = processProductsData([newProduct], ingredientsState)[0];

      const existingIndex = state.findIndex((product) => product._id === newProduct._id);
      if (existingIndex !== -1) {
        state[existingIndex] = updatedProduct;
      } else {
        state.unshift(updatedProduct);
      }
    },
    updateProductState: (state, action) => {
      const { updatedProduct, ingredientsState } = action.payload;
      const updatedProductState = processProductsData([updatedProduct], ingredientsState)[0];
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
