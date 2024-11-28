// src/context/AppContext.js
import React, { useEffect } from 'react';
import { IngredientProvider } from './subcontexts/IngredientContext';
import { SupplierProvider } from './subcontexts/SupplierContext';
import { ProductProvider } from './subcontexts/ProductContext';
import { MixProvider } from './subcontexts/MixContext';
import { CategoryProvider } from './subcontexts/CategoryContext';
import { SocketProvider } from './SocketContext';
import { fetchAllIngredients } from '../services/ingredientService';
import { fetchAllSuppliers } from '../services/supplierService';
import { fetchAllProducts } from '../services/productService';
import { fetchAllCategories } from '../services/categoryService';
import { fetchAllMixes } from '../services/mixService';
import { useDispatch, useSelector } from 'react-redux';
import { addIngerdientsState } from '../store/ingredients';
import { setCategories } from '../store/categories';
import { message } from 'antd';
import { setMixesState } from '../store/mixes';
import { setProductsState } from '../store/products';
import { addSuppliersState } from '../store/suppliers';
import { setEmployees } from "../store/employees";
import { EmployeeProvider } from './subcontexts/EmployeeContext';
import { fetchAllEmployees } from '../services/employeeService';
import { fetchEmployeesHoursMonthAPI } from '../services/employeeHoursService';
import { buildMonthDataThunk, setEmployeeHoursState } from '../store/employeeHours';
import { EmployeeHoursProvider } from './subcontexts/EmployeeHoursContext';
import moment from 'moment';

message.config({
  prefixCls: 'my-message',
});

export const AppProvider = ({ children, setLoading }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.employeeHours.selectedDate);
  const averageHourlyRate = useSelector((state) => state.employeeHours.overallAverageHourlyRate);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentYear = moment(selectedDate).year(); // השנה הנוכחית
      const currentMonth = moment(selectedDate).month() + 1; // החודש הנוכחי (נוסיף 1 כי month() מחזיר ערך מ-0)
      try {
        const [ingredientsRes, suppliersRes, productsRes, categoriesRes, mixesRes, employeesRes, employeesHoursRes] = await Promise.all([
          fetchAllIngredients(),
          fetchAllSuppliers(),
          fetchAllProducts(),
          fetchAllCategories(),
          fetchAllMixes(),
          fetchAllEmployees(),
          fetchEmployeesHoursMonthAPI(currentMonth, currentYear),
        ]);

        dispatch(addIngerdientsState(ingredientsRes?.data?.reverse()));
        dispatch((dispatch, getState) => {
          const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
          dispatch(setMixesState({ mixes: mixesRes?.data?.reverse(), ingredientsState }));
        }); // הוספת תערובות למצב
        dispatch((dispatch, getState) => {
          const ingredientsState = getState().ingredients; // מקבל את ingredientsState העדכני
          const mixesState = getState().mixes; // מקבל את ingredientsState העדכני
          dispatch(setProductsState({ products: productsRes.data?.reverse(), ingredientsState, mixesState, averageHourlyRate }));
        });
        dispatch(setCategories(categoriesRes.data));
        dispatch(addSuppliersState(suppliersRes?.data?.reverse()));
        dispatch(setEmployees(employeesRes.data))
        dispatch(buildMonthDataThunk({
          selectedDate,
          employees: employeesRes.data,
          employeeHours: employeesHoursRes?.data
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, setLoading, selectedDate]);

  return (
    <SocketProvider>
      <IngredientProvider>
        <SupplierProvider>
          <ProductProvider>
            <MixProvider>
              <CategoryProvider>
                <EmployeeProvider>
                  <EmployeeHoursProvider>
                    {children}
                  </EmployeeHoursProvider>
                </EmployeeProvider>
              </CategoryProvider>
            </MixProvider>
          </ProductProvider>
        </SupplierProvider>
      </IngredientProvider>
    </SocketProvider>
  );
};
