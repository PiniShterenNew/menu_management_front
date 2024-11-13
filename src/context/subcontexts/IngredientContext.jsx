// src/context/subcontexts/IngredientContext.js
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import { addIngredientAPI, updateIngredientAPI, deleteIngredientAPI } from '../../services/ingredientService';

const IngredientContext = createContext();

export const useIngredientContext = () => useContext(IngredientContext);

export const IngredientProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const addIngredient = async (ingredient) => {
    setLoading(true);
    try {
      await addIngredientAPI(ingredient);
      message.success('החומר גלם נוסף בהצלחה');
      setLoading(false);
    } catch (error) {
      message.error('שגיאה בהוספת חומר הגלם');
      setLoading(false);
    }
  };

  const updateIngredient = async (updatedIngredient) => {
    setLoading(true);
    try {
      await updateIngredientAPI(updatedIngredient);
      message.success('החומר גלם עודכן בהצלחה');
      setLoading(false);
    } catch (error) {
      message.error('שגיאה בעדכון חומר הגלם');
      setLoading(false);
    }
  };

  const deleteIngredient = async (ingredientId) => {
    setLoading(true);
    try {
      await deleteIngredientAPI(ingredientId);
      message.success('החומר גלם נמחק בהצלחה');
      setLoading(false);
    } catch (error) {
      message.error('שגיאה במחיקת חומר הגלם');
      setLoading(false);
    }
  };

  return (
    <IngredientContext.Provider value={{ addIngredient, updateIngredient, deleteIngredient, loading }}>
      {children}
    </IngredientContext.Provider>
  );
};
