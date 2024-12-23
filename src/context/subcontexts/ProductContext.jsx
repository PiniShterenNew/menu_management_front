// src/context/subcontexts/IngredientContext.js
import React, { createContext, useContext, useState } from "react";
import { message } from "antd";
import {
  addProductAPI,
  addSizeAPI,
  addVariationAPI,
  deleteProductAPI,
  deleteSizeAPI,
  deleteVariationAPI,
  fetchProduct,
  fetchSizesByProductAPI,
  fetchVariationByIdAPI,
  updateProductAPI,
  updateSizeAPI,
  updateVariationAPI,
} from "../../services/productService";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", "view"
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUpdateSize, setSelectedUpdateSize] = useState(null);

  const getProductById = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resulet = await fetchProduct(id);
        if (!resulet?.data?.error) {
          resolve(resulet?.data);
        } else {
          reject(false);
        }
      } catch (error) {
        console.error("Error get product:", error);
      }
    });
  }

  // פונקציות עבור מוצרים וקטגוריות - דומה למה שעשינו עבור חומרים וספקים
  const addProduct = (product) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const resulet = await addProductAPI(product);
        setLoading(false);
        if (!resulet?.data?.error) {
          message.success("המוצר נוסף בהצלחה");
          resolve(true);
        } else {
          message.error(resulet?.data?.error);
          reject(false);
        }
      } catch (error) {
        console.error("Error adding product:", error);
        message.error("שגיאה בהוספת המוצר");
        setLoading(false);
      }
    });
  };

  const updateProduct = (updatedProduct) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const resulet = await updateProductAPI(updatedProduct);
        setLoading(false);
        if (!resulet?.data?.error) {
          message.success("המוצר עודכן בהצלחה");
          resolve(true);
        }
        reject(false);
      } catch (error) {
        console.error("Error updating product:", error);
        message.error("שגיאה בעדכון המוצר");
        setLoading(false);
      }
    });
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await deleteProductAPI(productId);
      message.success("המוצר נמחק בהצלחה");
      setLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("שגיאה במחיקת המוצר");
      setLoading(false);
    }
  };

  // מביא את כל הגדלים למוצר מסוים
  const fetchSizesByProduct = (productId) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetchSizesByProductAPI(productId);
        setLoading(false);
        resolve(response.data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
        message.error("שגיאה בקבלת הגדלים");
        setLoading(false);
        reject(error);
      }
    });
  };

  // מוסיף גודל למוצר
  const addSize = (productId, size) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await addSizeAPI(productId, size);
        message.success("הגודל נוסף בהצלחה");
        setLoading(false);
        resolve(response.data);
      } catch (error) {
        console.error("Error adding size:", error);
        message.error("שגיאה בהוספת הגודל");
        setLoading(false);
        reject(error);
      }
    });
  };

  // מעדכן גודל מסוים
  const updateSize = (sizeId, updatedSize) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await updateSizeAPI(sizeId, updatedSize);
        message.success("הגודל עודכן בהצלחה");
        setLoading(false);
        resolve(response.data);
      } catch (error) {
        console.error("Error updating size:", error);
        message.error("שגיאה בעדכון הגודל");
        setLoading(false);
        reject(error);
      }
    });
  };

  // מוחק גודל מסוים
  const deleteSize = (productId, sizeId) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        await deleteSizeAPI(productId, sizeId);
        message.success("הגודל נמחק בהצלחה");
        setLoading(false);
        resolve(true);
      } catch (error) {
        console.error("Error deleting size:", error);
        message.error("שגיאה במחיקת הגודל");
        setLoading(false);
        reject(error);
      }
    });
  };



  // מביא וריאציה לפי ID
  const fetchVariationById = (variationId) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetchVariationByIdAPI(variationId);
        setLoading(false);
        resolve(response.data);
      } catch (error) {
        console.error("Error fetching variation:", error);
        message.error("שגיאה בקבלת הווריאציה");
        setLoading(false);
        reject(error);
      }
    });
  };

  // מוסיף וריאציה חדשה
  const addVariation = (variation) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await addVariationAPI(variation);
        message.success("הווריאציה נוספה בהצלחה");
        setLoading(false);
        resolve(response.data);
      } catch (error) {
        console.error("Error adding variation:", error);
        message.error("שגיאה בהוספת הווריאציה");
        setLoading(false);
        reject(error);
      }
    });
  };

  // מעדכן וריאציה קיימת
  const updateVariation = (variationId, updatedVariation) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await updateVariationAPI(variationId, updatedVariation);
        message.success("הווריאציה עודכנה בהצלחה");
        setLoading(false);
        resolve(response.data);
      } catch (error) {
        console.error("Error updating variation:", error);
        message.error("שגיאה בעדכון הווריאציה");
        setLoading(false);
        reject(error);
      }
    });
  };

  // מוחק וריאציה קיימת
  const deleteVariation = (variationId) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        await deleteVariationAPI(variationId);
        message.success("הווריאציה נמחקה בהצלחה");
        setLoading(false);
        resolve(true);
      } catch (error) {
        console.error("Error deleting variation:", error);
        message.error("שגיאה במחיקת הווריאציה");
        setLoading(false);
        reject(error);
      }
    });
  };

  return (
    <ProductContext.Provider
      value={{
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,

        addSize,
        updateSize,
        deleteSize,

        addVariation,
        updateVariation,
        deleteVariation,

        loading,
        isModalVisible,
        setIsModalVisible,
        modalMode,
        setModalMode,
        selectedItem,
        setSelectedItem,
        selectedUpdateSize,
        setSelectedUpdateSize
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
