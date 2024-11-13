import { addOrUpdateSupplierState, deleteSupplierState, updateSupplierState } from '../store/suppliers';
import { addOrUpdateIngredientState, deleteIngredientState, updateIngredientState } from '../store/ingredients';
import { addOrUpdateProductState, deleteProductState, updateProductState } from '../store/products';
import { addOrUpdateMixState, deleteMixState, updateMixState } from '../store/mixes';
import { addOrUpdateCategory, updateCategory, deleteCategory } from '../store/categories';
import { addOrUpdateEmployee, deleteEmployee, updateEmployee } from '../store/employees';
import { addOrUpdateEmployeeHoursState, deleteEmployeeHoursState, updateEmployeeHoursState } from '../store/employeeHours';

export const handleSocketEvents = (socket, dispatch) => {
  // Listen for specific events
  socket.on('ingredientAdded', (newIngredient) => {
    dispatch(addOrUpdateIngredientState(newIngredient))
  });
  socket.on('ingredientUpdated', (updatedIngredient) => {
    dispatch(updateIngredientState(updatedIngredient))
  });
  socket.on('ingredientDeleted', (deletedIngredient) => {
    dispatch(deleteIngredientState(deletedIngredient))
  });

  // Listen for specific events for suppliers
  socket.on('supplierAdded', (newSupplier) => {
    dispatch(addOrUpdateSupplierState(newSupplier))
  });

  socket.on('supplierUpdated', (updatedSupplier) => {
    dispatch(updateSupplierState(updatedSupplier))
  });

  socket.on('supplierDeleted', (deletedSupplier) => {
    dispatch(deleteSupplierState(deletedSupplier))
  });

  socket.on('productAdded', (newProduct) => {
    dispatch((dispatch, getState) => {
      const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
      const mixesState = getState().mixes; // מקבל את mixesState העדכני
      dispatch(addOrUpdateProductState({ newProduct, ingredientsState, mixesState }));
    });
  });

  socket.on('productUpdated', (newProduct) => {
    dispatch((dispatch, getState) => {
      const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
      const mixesState = getState().mixes; // מקבל את mixesState העדכני
      dispatch(addOrUpdateProductState({ newProduct, ingredientsState, mixesState }));
    });
  });

  socket.on('productDeleted', (deletedProduct) => {
    dispatch(deleteProductState(deletedProduct));
  });

  // Listen for specific events for categories
  socket.on('categoryAdded', (newCategory) => {
    dispatch(addOrUpdateCategory(newCategory));
  });

  socket.on('categoryUpdated', (updatedCategory) => {
    dispatch(updateCategory(updatedCategory));
  });

  socket.on('categoryDeleted', (deletedCategory) => {
    dispatch(deleteCategory(deletedCategory._id));
  });

  // Listen for specific events for mixes
  socket.on('mixAdded', (newMix) => {
    dispatch((dispatch, getState) => {
      const ingredientsState = getState().ingredients;
      dispatch(addOrUpdateMixState({ newMix, ingredientsState }));
    });
  });

  socket.on('mixUpdated', (updatedMix) => {
    dispatch((dispatch, getState) => {
      const ingredientsState = getState().ingredients;
      dispatch(updateMixState({ updatedMix, ingredientsState }));
    });
  });

  socket.on('mixDeleted', (deletedMix) => {
    dispatch(deleteMixState(deletedMix));
  });

  // הוספת מאזינים עבור עובדים ב-handleSocketEvents
  socket.on('employeeAdded', (newEmployee) => {
    dispatch(addOrUpdateEmployee(newEmployee));
  });

  socket.on('employeeUpdated', (updatedEmployee) => {
    dispatch(updateEmployee(updatedEmployee));
  });

  socket.on('employeeDeleted', (deletedEmployee) => {
    dispatch(deleteEmployee(deletedEmployee._id));
  });

  // מאזין להוספת רשומה חדשה של שעות עבודה
  socket.on('employeeHoursAdded', (newEmployeeHours) => {
    dispatch(addOrUpdateEmployeeHoursState(newEmployeeHours));
  });

  // מאזין לעדכון רשומה קיימת של שעות עבודה
  socket.on('employeeHoursUpdated', (updatedEmployeeHours) => {
    dispatch(updateEmployeeHoursState(updatedEmployeeHours));
  });

  // מאזין למחיקת רשומת שעות עבודה
  socket.on('employeeHoursDeleted', (deletedEmployeeHours) => {
    dispatch(deleteEmployeeHoursState({ _id: deletedEmployeeHours._id }));
  });

};
