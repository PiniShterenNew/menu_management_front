// src/context/AppContext.js - ניהול המצב של המערכת עם React Context באמצעות API
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';  // ייבוא ה-message של Ant Design

export const AppContext = createContext();

message.config({
  prefixCls: 'my-message',
});

const API_URL = 'https://menu-management-server.onrender.com/api'; // עדכן את כתובת ה-API שלך

export const AppProvider = ({ children }) => {
  const [ingredientData, setIngredientData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // קריאה ל-API כדי לקבל את הנתונים בעת הטעינה הראשונית
    const fetchData = async () => {
      try {
        const [ingredientsRes, suppliersRes, productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/ingredients`),
          axios.get(`${API_URL}/suppliers`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/categories`),
        ]);
        setIngredientData(ingredientsRes.data);
        setSupplierData(suppliersRes.data);
        setProductData(productsRes.data);
        setCategoryData(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('שגיאה בטעינת הנתונים');
      }
    };

    fetchData();
  }, []);

  const addIngredient = async (ingredient) => {
    try {
      const response = await axios.post(`${API_URL}/ingredients`, ingredient);
      setIngredientData((prevData) => [...prevData, response.data]);
      message.success('החומר גלם נוסף בהצלחה');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      message.error('שגיאה בהוספת חומר הגלם');
    }
  };

  const updateIngredient = async (updatedIngredient) => {
    try {
      await axios.put(`${API_URL}/ingredients/${updatedIngredient.id}`, updatedIngredient);
      setIngredientData((prevData) =>
        prevData.map((ingredient) => (ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient))
      );
      message.success('החומר גלם עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      message.error('שגיאה בעדכון חומר הגלם');
    }
  };

  const deleteIngredient = async (ingredientId) => {
    try {
      await axios.delete(`${API_URL}/ingredients/${ingredientId}`);
      setIngredientData((prevData) => prevData.filter((ingredient) => ingredient.id !== ingredientId));
      message.success('החומר גלם נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      message.error('שגיאה במחיקת חומר הגלם');
    }
  };

  // פונקציות דומות עבור ספקים, מוצרים וקטגוריות
  const addSupplier = async (supplier) => {
    try {
      const response = await axios.post(`${API_URL}/suppliers`, supplier);
      setSupplierData((prevData) => [...prevData, response.data]);
      message.success('הספק נוסף בהצלחה');
    } catch (error) {
      console.error('Error adding supplier:', error);
      message.error('שגיאה בהוספת הספק');
    }
  };

  const updateSupplier = async (updatedSupplier) => {
    try {
      await axios.put(`${API_URL}/suppliers/${updatedSupplier.id}`, updatedSupplier);
      setSupplierData((prevData) =>
        prevData.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier))
      );
      message.success('הספק עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating supplier:', error);
      message.error('שגיאה בעדכון הספק');
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`${API_URL}/suppliers/${supplierId}`);
      setSupplierData((prevData) => prevData.filter((supplier) => supplier.id !== supplierId));
      message.success('הספק נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      message.error('שגיאה במחיקת הספק');
    }
  };

  // פונקציות עבור מוצרים וקטגוריות - דומה למה שעשינו עבור חומרים וספקים
  const addProduct = async (product) => {
    try {
      const response = await axios.post(`${API_URL}/products`, product);
      setProductData((prevData) => [...prevData, response.data]);
      message.success('המוצר נוסף בהצלחה');
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('שגיאה בהוספת המוצר');
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      await axios.put(`${API_URL}/products/${updatedProduct.id}`, updatedProduct);
      setProductData((prevData) =>
        prevData.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
      message.success('המוצר עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('שגיאה בעדכון המוצר');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      setProductData((prevData) => prevData.filter((product) => product.id !== productId));
      message.success('המוצר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('שגיאה במחיקת המוצר');
    }
  };

  const addCategory = async (category) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, category);
      setCategoryData((prevData) => [...prevData, response.data]);
      message.success('הקטגוריה נוספה בהצלחה');
    } catch (error) {
      console.error('Error adding category:', error);
      message.error('שגיאה בהוספת הקטגוריה');
    }
  };

  const updateCategory = async (updatedCategory) => {
    try {
      await axios.put(`${API_URL}/categories/${updatedCategory.id}`, updatedCategory);
      setCategoryData((prevData) =>
        prevData.map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
      );
      message.success('הקטגוריה עודכנה בהצלחה');
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('שגיאה בעדכון הקטגוריה');
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      setCategoryData((prevData) => prevData.filter((category) => category.id !== categoryId));
      message.success('הקטגוריה נמחקה בהצלחה');
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('שגיאה במחיקת הקטגוריה');
    }
  };

  return (
    <AppContext.Provider
      value={{
        ingredientData,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        supplierData,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        productData,
        addProduct,
        updateProduct,
        deleteProduct,
        categoryData,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
