// src/context/AppContext.js - ניהול המצב של המערכת עם React Context באמצעות API
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';  // ייבוא ה-message של Ant Design
import io from 'socket.io-client';

export const AppContext = createContext();

message.config({
  prefixCls: 'my-message',
});

// const API_URL = 'http://localhost:5000/api'; // עדכן את כתובת ה-API שלך
// const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'https://menu-management-server.onrender.com/api';
const SOCKET_URL = 'https://menu-management-server.onrender.com';

export const AppProvider = ({ children }) => {
  const [ingredientData, setIngredientData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Listen for specific events
    newSocket.on('ingredientAdded', (newIngredient) => {
      setIngredientData((prevData) => [newIngredient, ...prevData]);
      message.success('חומר גלם נוסף בעדכון בזמן אמת');
    });
    newSocket.on('ingredientUpdated', (updatedIngredient) => {
      setIngredientData((prevData) =>
        prevData.map((ingredient) =>
          ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
        )
      );
      message.success('חומר גלם עודכן בעדכון בזמן אמת');
    });
    newSocket.on('ingredientDeleted', (deletedIngredient) => {
      setIngredientData((prevData) =>
        prevData.filter((ingredient) => ingredient.id !== deletedIngredient.id)
      );
      message.success('חומר גלם נמחק בעדכון בזמן אמת');
    });
    // Listen for specific events for suppliers
    newSocket.on('supplierAdded', (newSupplier) => {
      setSupplierData((prevData) => [...prevData, newSupplier]);
      message.success('ספק נוסף בעדכון בזמן אמת');
    });

    newSocket.on('supplierUpdated', (updatedSupplier) => {
      setSupplierData((prevData) =>
        prevData.map((supplier) =>
          supplier.id === updatedSupplier.id ? updatedSupplier : supplier
        )
      );
      message.success('ספק עודכן בעדכון בזמן אמת');
    });

    newSocket.on('supplierDeleted', (deletedSupplier) => {
      setSupplierData((prevData) =>
        prevData.filter((supplier) => supplier.id !== deletedSupplier.id)
      );
      message.success('ספק נמחק בעדכון בזמן אמת');
    });

    // Listen for specific events for products
    newSocket.on('productAdded', (newProduct) => {
      setProductData((prevData) => [newProduct, ...prevData]);
      message.success('מוצר נוסף בעדכון בזמן אמת');
    });

    newSocket.on('productUpdated', (updatedProduct) => {
      setProductData((prevData) =>
        prevData.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      message.success('מוצר עודכן בעדכון בזמן אמת');
    });

    newSocket.on('productDeleted', (deletedProduct) => {
      setProductData((prevData) =>
        prevData.filter((product) => product.id !== deletedProduct.id)
      );
      message.success('מוצר נמחק בעדכון בזמן אמת');
    });

    // Listen for specific events for categories
    newSocket.on('categoryAdded', (newCategory) => {
      setCategoryData((prevData) => [newCategory, ...prevData]);
      message.success('קטגוריה נוספה בעדכון בזמן אמת');
    });

    newSocket.on('categoryUpdated', (updatedCategory) => {
      setCategoryData((prevData) =>
        prevData.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
      message.success('קטגוריה עודכנה בעדכון בזמן אמת');
    });

    newSocket.on('categoryDeleted', (deletedCategory) => {
      setCategoryData((prevData) =>
        prevData.filter((category) => category.id !== deletedCategory.id)
      );
      message.success('קטגוריה נמחקה בעדכון בזמן אמת');
    });

    const fetchData = async () => {
      try {
        const [ingredientsRes, suppliersRes, productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/ingredients`),
          axios.get(`${API_URL}/suppliers`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/categories`),
        ]);

        setIngredientData(ingredientsRes.data?.reverse());
        setSupplierData(suppliersRes.data?.reverse());
        setProductData(productsRes.data?.reverse());
        setCategoryData(categoriesRes.data?.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('שגיאה בטעינת הנתונים');
      }
    };

    fetchData();

    return () => newSocket.close();
  }, []);

  const addIngredient = async (ingredient) => {
    try {
      const response = await axios.post(`${API_URL}/ingredients`, ingredient);
      // setIngredientData((prevData) => [...prevData, response.data]);
      message.success('החומר גלם נוסף בהצלחה');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      message.error('שגיאה בהוספת חומר הגלם');
    }
  };

  const updateIngredient = async (updatedIngredient) => {
    try {
      const encodedId = encodeURIComponent(updatedIngredient.id);
      await axios.put(`${API_URL}/ingredients/${encodedId}`, updatedIngredient);
      // setIngredientData((prevData) =>
      //   prevData.map((ingredient) => (ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient))
      // );
      message.success('החומר גלם עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      message.error('שגיאה בעדכון חומר הגלם');
    }
  };

  const deleteIngredient = async (ingredientId) => {
    try {
      await axios.delete(`${API_URL}/ingredients/${ingredientId}`);
      // setIngredientData((prevData) => prevData.filter((ingredient) => ingredient.id !== ingredientId));
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
      // setSupplierData((prevData) => [...prevData, response.data]);
      message.success('הספק נוסף בהצלחה');
    } catch (error) {
      console.error('Error adding supplier:', error);
      message.error('שגיאה בהוספת הספק');
    }
  };

  const updateSupplier = async (updatedSupplier) => {
    try {
      const encodedId = encodeURIComponent(updatedSupplier.id);
      await axios.put(`${API_URL}/suppliers/${encodedId}`, updatedSupplier);
      // setSupplierData((prevData) =>
      //   prevData.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier))
      // );
      message.success('הספק עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating supplier:', error);
      message.error('שגיאה בעדכון הספק');
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`${API_URL}/suppliers/${supplierId}`);
      // setSupplierData((prevData) => prevData.filter((supplier) => supplier.id !== supplierId));
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
      // setProductData((prevData) => [...prevData, response.data]);
      message.success('המוצר נוסף בהצלחה');
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('שגיאה בהוספת המוצר');
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const encodedId = encodeURIComponent(updatedProduct.id);
      await axios.put(`${API_URL}/products/${encodedId}`, updatedProduct);
      // setProductData((prevData) =>
      //   prevData.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      // );
      message.success('המוצר עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('שגיאה בעדכון המוצר');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      // setProductData((prevData) => prevData.filter((product) => product.id !== productId));
      message.success('המוצר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('שגיאה במחיקת המוצר');
    }
  };

  const addCategory = async (category) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, category);
      // setCategoryData((prevData) => [...prevData, response.data]);
      message.success('הקטגוריה נוספה בהצלחה');
    } catch (error) {
      console.error('Error adding category:', error);
      message.error('שגיאה בהוספת הקטגוריה');
    }
  };

  const updateCategory = async (updatedCategory) => {
    try {
      const encodedId = encodeURIComponent(updatedCategory.id);
      await axios.put(`${API_URL}/categories/${encodedId}`, updatedCategory);
      // setCategoryData((prevData) =>
      //   prevData.map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
      // );
      message.success('הקטגוריה עודכנה בהצלחה');
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('שגיאה בעדכון הקטגוריה');
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      // setCategoryData((prevData) => prevData.filter((category) => category.id !== categoryId));
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
