// features/ingredientsSlice.js
import { createSlice } from '@reduxjs/toolkit';

function processIngredientData(ingredient) {
    let unitQuantity, unitDescription, unitPrice, processedPrice;

    // מחשבים את המחיר ללא מע"מ (בהנחה שמחיר המוזן כולל מע"מ של 17%)
    const priceExcludingVAT = ingredient.price / 1.17;

    if (ingredient.unit === 'ק"ג') {
        unitQuantity = 0.1; // 100 גרם
        unitDescription = '100 גרם';
        unitPrice = priceExcludingVAT * unitQuantity; // חישוב המחיר ל-100 גרם
    } else if (ingredient.unit === 'ליטר') {
        unitQuantity = 0.1; // 100 מ"ל
        unitDescription = '100 מ"ל';
        unitPrice = priceExcludingVAT * unitQuantity; // חישוב המחיר ל-100 מ"ל
    } else if (ingredient.unit === 'יחידות') {
        unitQuantity = 1; // יחידה בודדת
        unitDescription = 'יחידה';
        unitPrice = priceExcludingVAT / ingredient.quantity; // חישוב המחיר ליחידה בודדת
    }

    // חישוב מחיר מעובד אם מדובר ברכיב למיץ
    if (ingredient.isJuice) {
        processedPrice = unitPrice / (ingredient.juiceRatio || 1); // חישוב מחיר מעובד לפי יחס המיץ
    }

    return {
        ...ingredient,
        priceExcludingVAT: priceExcludingVAT.toFixed(2), // מחיר ללא מע"מ
        unitQuantity,                                    // כמות ליחידת משנה
        unitDescription,                                 // תיאור יחידת משנה
        unitPrice: unitPrice.toFixed(2),                 // מחיר ליחידת משנה לפי המחיר נטו
        processedPrice: processedPrice ? processedPrice.toFixed(2) : null // מחיר מעובד
    };
}

const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState: [],
    reducers: {
        addIngerdientsState: (state, action) => {
            return action.payload.map(processIngredientData); // עיבוד כל הרשימה
        },
        addOrUpdateIngredientState: (state, action) => {
            const newIngredient = processIngredientData(action.payload);
            const existingIndex = state.findIndex((ingredient) => ingredient._id === newIngredient._id);

            if (existingIndex !== -1) {
                state[existingIndex] = newIngredient;
            } else {
                state.unshift(newIngredient);
            }
        },
        updateIngredientState: (state, action) => {
            const updatedIngredient = processIngredientData(action.payload);
            return state.map((ingredient) =>
                ingredient._id === updatedIngredient._id ? updatedIngredient : ingredient
            );
        },
        deleteIngredientState: (state, action) => {
            const deletedIngredientId = action.payload._id;
            return state.filter((ingredient) => ingredient._id !== deletedIngredientId);
        },
    },
});

export const {
    addIngerdientsState,
    addOrUpdateIngredientState,
    updateIngredientState,
    deleteIngredientState,
} = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
