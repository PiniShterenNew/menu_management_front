// src/context/AppContext.js - ניהול המצב של המערכת עם React Context באמצעות API
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';  // ייבוא ה-message של Ant Design
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateSupplierState, addSuppliersState, deleteSupplierState, updateSupplierState } from '../store/suppliers';
import { addIngerdientsState, addOrUpdateIngredientState, deleteIngredientState, updateIngredientState } from '../store/ingredients';
import { addOrUpdateProductState, deleteProductState, setProductsState, updateProductState } from '../store/products';

export const AppContext = createContext();

message.config({
  prefixCls: 'my-message',
});

// const API_URL = 'http://192.168.1.172:5000/api'; // עדכן את כתובת ה-API שלך
// const SOCKET_URL = 'http://192.168.1.172:5000';
const API_URL = 'https://menu-management-server.onrender.com/api';
const SOCKET_URL = 'https://menu-management-server.onrender.com';

export const AppProvider = ({ children, setLoading }) => {

  const dispatch = useDispatch();

  const ingredientsState = useSelector((state) => state.ingredients);
  const productsState = useSelector((state) => state.products);

  const [categoryData, setCategoryData] = useState([]);
  const [socket, setSocket] = useState(null);


  const listeners = useCallback((newSocket) => {
    // Listen for specific events
    newSocket.on('ingredientAdded', (newIngredient) => {
      dispatch(addOrUpdateIngredientState(newIngredient))
    });
    newSocket.on('ingredientUpdated', (updatedIngredient) => {
      dispatch(updateIngredientState(updatedIngredient))
    });
    newSocket.on('ingredientDeleted', (deletedIngredient) => {
      dispatch(deleteIngredientState(deletedIngredient))
    });

    // Listen for specific events for suppliers
    newSocket.on('supplierAdded', (newSupplier) => {
      dispatch(addOrUpdateSupplierState(newSupplier))
    });

    newSocket.on('supplierUpdated', (updatedSupplier) => {
      dispatch(updateSupplierState(updatedSupplier))
    });

    newSocket.on('supplierDeleted', (deletedSupplier) => {
      dispatch(deleteSupplierState(deletedSupplier))
    });

    newSocket.on('productAdded', (newProduct) => {
      dispatch((dispatch, getState) => {
        const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
        dispatch(addOrUpdateProductState({ newProduct, ingredientsState }));
      });
    });

    newSocket.on('productUpdated', (updatedProduct) => {
      dispatch((dispatch, getState) => {
        const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
        dispatch(updateProductState({ updatedProduct, ingredientsState }));
      });
    });

    newSocket.on('productDeleted', (deletedProduct) => {
      dispatch(deleteProductState(deletedProduct));
    });

    // Listen for specific events for categories
    newSocket.on('categoryAdded', (newCategory) => {
      setCategoryData((prevData) => {
        const existingIndex = prevData.findIndex((category) => category._id === newCategory._id);
        if (existingIndex !== -1) {
          // אם קיים, מחליף אותו
          const updatedData = [...prevData];
          updatedData[existingIndex] = newCategory;
          return updatedData;
        } else {
          // אם לא קיים, מוסיף אותו
          return [newCategory, ...prevData];
        }
      });
    });

    newSocket.on('categoryUpdated', (updatedCategory) => {
      setCategoryData((prevData) =>
        prevData.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        )
      );
    });

    newSocket.on('categoryDeleted', (deletedCategory) => {
      setCategoryData((prevData) =>
        prevData.filter((category) => category._id !== deletedCategory._id)
      );
    });
  }, [dispatch]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    listeners(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ingredientsRes, suppliersRes, productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/ingredients`),
          axios.get(`${API_URL}/suppliers`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/categories`),
        ]);

        dispatch(addIngerdientsState(ingredientsRes?.data?.reverse()));
        dispatch((dispatch, getState) => {
          const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
          dispatch(setProductsState({ products: productsRes.data?.reverse(), ingredientsState }));
        });
        setCategoryData(categoriesRes.data);
        dispatch(addSuppliersState(suppliersRes?.data?.reverse()));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('שגיאה בטעינת הנתונים');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    dispatch(setProductsState({ products: productsState, ingredientsState }));
  }, [ingredientsState])

  const addIngredient = async (ingredient) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/ingredients`, ingredient);
      message.success('החומר גלם נוסף בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error adding ingredient:', error);
      message.error('שגיאה בהוספת חומר הגלם');
      setLoading(false);
    }
  };

  const updateIngredient = async (updatedIngredient) => {
    setLoading(true);
    try {
      const encodedId = encodeURIComponent(updatedIngredient._id);
      await axios.put(`${API_URL}/ingredients/${encodedId}`, updatedIngredient);
      message.success('החומר גלם עודכן בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error updating ingredient:', error);
      message.error('שגיאה בעדכון חומר הגלם');
      setLoading(false);
    }
  };

  const deleteIngredient = async (ingredientId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/ingredients/${ingredientId}`);
      message.success('החומר גלם נמחק בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      message.error('שגיאה במחיקת חומר הגלם');
      setLoading(false);
    }
  };

  // פונקציות דומות עבור ספקים, מוצרים וקטגוריות
  const addSupplier = async (supplier) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/suppliers`, supplier);
      message.success('הספק נוסף בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      message.error('שגיאה בהוספת הספק');
      setLoading(false);
    }
  };

  const updateSupplier = async (updatedSupplier) => {
    setLoading(true);
    try {
      const encodedId = encodeURIComponent(updatedSupplier._id);
      await axios.put(`${API_URL}/suppliers/${encodedId}`, updatedSupplier);
      message.success('הספק עודכן בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
      message.error('שגיאה בעדכון הספק');
      setLoading(false);
    }
  };

  const deleteSupplier = async (supplierId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/suppliers/${supplierId}`);
      message.success('הספק נמחק בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      message.error('שגיאה במחיקת הספק');
      setLoading(false);
    }
  };

  // פונקציות עבור מוצרים וקטגוריות - דומה למה שעשינו עבור חומרים וספקים
  const addProduct = async (product) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/products`, product);
      message.success('המוצר נוסף בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('שגיאה בהוספת המוצר');
      setLoading(false);
    }
  };

  const updateProduct = async (updatedProduct) => {
    setLoading(true);
    try {
      const encodedId = encodeURIComponent(updatedProduct._id);
      await axios.put(`${API_URL}/products/${encodedId}`, updatedProduct);
      message.success('המוצר עודכן בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('שגיאה בעדכון המוצר');
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      message.success('המוצר נמחק בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('שגיאה במחיקת המוצר');
      setLoading(false);
    }
  };

  const addCategory = async (category) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/categories`, category);
      message.success('הקטגוריה נוספה בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error adding category:', error);
      message.error('שגיאה בהוספת הקטגוריה');
      setLoading(false);
    }
  };

  const updateCategory = async (updatedCategory) => {
    setLoading(true);
    try {
      const encodedId = encodeURIComponent(updatedCategory._id);
      await axios.put(`${API_URL}/categories/${encodedId}`, updatedCategory);
      message.success('הקטגוריה עודכנה בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('שגיאה בעדכון הקטגוריה');
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      message.success('הקטגוריה נמחקה בהצלחה');
      setLoading(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('שגיאה במחיקת הקטגוריה');
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        addIngredient,
        updateIngredient,
        deleteIngredient,
        addSupplier,
        updateSupplier,
        deleteSupplier,
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
