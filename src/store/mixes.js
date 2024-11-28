import { createSlice } from "@reduxjs/toolkit";

// פונקציה לחישוב עלות רכיבים במיקס, משקל רכיבים והעלות הכוללת של המיקס
function calculateMixCost(mix, ingredientsState) {
  let totalCost = 0;
  let totalWeight = 0;

  const updatedIngredients = mix.ingredients.map(ingredient => {
    const ingredientData = ingredientsState.find(item => item._id === ingredient.ingredientId?._id);

    if (ingredientData) {
      // חישוב יחס כמות
      const quantityRatio = ingredient.quantity / ingredientData.unitQuantity;

      // חישוב עלות רכיב
      const costPerUnit = parseFloat(ingredientData.priceExcludingVAT) / (ingredientData.quantity / ingredientData.unitQuantity);
      const ingredientCost = quantityRatio * costPerUnit;

      // חישוב כמות גולמית למיץ (אם מדובר במיץ)
      const rawQuantityForJuice = ingredientData.isJuice
        ? ingredient.quantity / ingredientData.juiceRatio
        : null;

      // עלות מעובדת אם מדובר במיץ
      const processedCost = ingredientData.isJuice
        ? rawQuantityForJuice * (ingredientData.processedPrice || costPerUnit) // שימוש בעלות מעובדת אם קיימת, אחרת עלות רגילה
        : null;

      // חישוב משקל/נפח רכיב
      const weight = (ingredientData.unit === "units" && ingredientData.type !== "אריזות וחד פעמי")
        ? ingredient.quantity * (ingredientData.weightOrVolumePerUnit || 0)
        : ingredient.quantity;

      totalCost += processedCost || ingredientCost; // שימוש בעלות המעובדת אם קיימת
      totalWeight += weight;

      return {
        ...ingredient,
        actualCost: ingredientCost.toFixed(2),
        processedCost: processedCost ? processedCost.toFixed(2) : null,
        weight: weight.toFixed(2),
        rawQuantityForJuice: rawQuantityForJuice ? rawQuantityForJuice.toFixed(2) : null, // כמות גולמית למיץ
      };
    }

    return ingredient; // מחזיר את המרכיב אם לא נמצא נתון תואם
  });

  return {
    ...mix,
    ingredients: updatedIngredients,
    totalCost: totalCost.toFixed(2),
    totalWeight: totalWeight.toFixed(2),
  };
}

const mixesSlice = createSlice({
  name: 'mixes',
  initialState: [],
  reducers: {
    setMixesState: (state, action) => {
      const { mixes, ingredientsState } = action.payload;
      return mixes.map(mix => calculateMixCost(mix, ingredientsState));
    },
    addOrUpdateMixState: (state, action) => {
      const { newMix, ingredientsState } = action.payload;
      const updatedMix = calculateMixCost(newMix, ingredientsState);
      const existingIndex = state.findIndex((mix) => mix._id === newMix._id);

      if (existingIndex !== -1) {
        state[existingIndex] = updatedMix;
      } else {
        state.push(updatedMix);
      }
    },
    updateMixState: (state, action) => {
      const { updatedMix, ingredientsState } = action.payload;
      const calculatedMix = calculateMixCost(updatedMix, ingredientsState);
      const existingIndex = state.findIndex((mix) => mix._id === updatedMix._id);

      if (existingIndex !== -1) {
        state[existingIndex] = calculatedMix;
      }
    },
    deleteMixState: (state, action) => {
      return state.filter((mix) => mix._id !== action.payload._id);
    },
  },
});

export const { setMixesState, addOrUpdateMixState, updateMixState, deleteMixState } = mixesSlice.actions;
export default mixesSlice.reducer;
