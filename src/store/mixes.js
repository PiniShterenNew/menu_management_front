import { createSlice } from "@reduxjs/toolkit";

// פונקציה לחישוב עלות רכיבים במיקס, משקל רכיבים והעלות הכוללת של המיקס
// פונקציה לחישוב עלות רכיבים במיקס, משקל רכיבים והעלות הכוללת של המיקס
function calculateMixCost(mix, ingredientsState) {
  let totalCost = 0;
  let totalWeight = 0;

  // עדכון כל רכיב במיקס עם העלות והמשקל המחושבים
  const updatedIngredients = mix.ingredients.map(ingredient => {
    const ingredientData = ingredientsState.find(item => item._id === ingredient.ingredientId?._id);

    if (ingredientData) {
      const costPerUnit = parseFloat(ingredientData.priceExcludingVAT) / ingredientData.quantity;
      const cost = costPerUnit * ingredient.quantity;
      totalCost += cost;

      // חישוב משקל או נפח רכיב, בהתחשב אם מדובר ביחידות שיש להן משקל/נפח ליחידה
      const weight = (ingredientData.unit === "יחידות" && ingredientData.type !== "מכלים ואביזרים")
        ? ingredient.quantity * (ingredientData.weightOrVolumePerUnit || 0)
        : ingredient.quantity;

      totalWeight += weight;

      return {
        ...ingredient,
        cost,
        weight
      };
    }

    return ingredient;
  });

  return {
    ...mix,
    ingredients: updatedIngredients,
    totalCost,
    totalWeight
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
