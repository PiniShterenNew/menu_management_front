// src/store/employeeHoursSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/he';

moment.locale('he');

// פונקציה לבניית מערך הנתונים לכל הימים בחודש
export const buildMonthDataThunk = createAsyncThunk(
  'employeeHours/buildMonthData',
  async ({ selectedDate, employees, employeeHours }, { dispatch }) => {
    const daysInMonth = moment(selectedDate, 'YYYY-MM').daysInMonth();
    const monthData = Array.from({ length: daysInMonth }, (_, i) => {
      const date = moment(selectedDate, 'YYYY-MM').date(i + 1);
      const dayOfWeek = date.format('dddd');
      const isWeekend = dayOfWeek === 'שישי' || dayOfWeek === 'שבת';

      const employeesHoursForDay = employees
        .map((employee) => {
          const hoursForDay = employeeHours.find((hour) =>
            hour?.employeeId?._id === employee?._id &&
            moment(hour?.date).isSame(date, 'day')
          );

          if (!hoursForDay) return null;

          const hasError = !hoursForDay.startTime || !hoursForDay.endTime;
          return {
            hoursId: hoursForDay._id,
            employeeId: employee._id,
            name: employee.name,
            hourlyRate: employee.hourlyRate,
            hoursWorked: hoursForDay.hoursWorked,
            hours: {
              start: hoursForDay.startTime,
              end: hoursForDay.endTime,
            },
            hasError,
          };
        })
        .filter(Boolean);

      const totalHours = employeesHoursForDay.reduce((sum, emp) => sum + emp.hoursWorked, 0);
      const employeesCount = employeesHoursForDay.length;

      return {
        date: date.format('YYYY-MM-DD'),
        dayOfWeek,
        status: isWeekend ? (dayOfWeek === 'שישי' ? 'חצי יום' : 'יום מלא') : 'יום מלא',
        isPast: date.isBefore(moment(), 'day'),
        isToday: date.isSame(moment(), 'day'),
        employees: employeesHoursForDay,
        totalHours,
        employeesCount,
      };
    });

    dispatch(setEmployeeHoursState(monthData));
  }
);

const employeeHoursSlice = createSlice({
  name: 'employeeHours',
  initialState: {
    data: [],
    selectedDate: moment().startOf('month').format('YYYY-MM'), // ברירת מחדל לחודש הנוכחי
  },
  reducers: {
    setEmployeeHoursState: (state, action) => {
      state.data = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    addOrUpdateEmployeeHoursState: (state, action) => {
      const newHours = action.payload;
      const existingIndex = state.data.findIndex((hours) => hours._id === newHours._id);
      if (existingIndex !== -1) {
        state.data[existingIndex] = newHours;
      } else {
        state.data.unshift(newHours);
      }
    },
    updateEmployeeHoursState: (state, action) => {
      const updatedHours = action.payload;
      state.data = state.data.map((hours) =>
        hours._id === updatedHours._id ? updatedHours : hours
      );
    },
    deleteEmployeeHoursState: (state, action) => {
      const deletedHoursId = action.payload._id;
      state.data = state.data.filter((hours) => hours._id !== deletedHoursId);
    },
  },
});

export const {
  setEmployeeHoursState,
  addOrUpdateEmployeeHoursState,
  updateEmployeeHoursState,
  deleteEmployeeHoursState,
  setSelectedDate,
} = employeeHoursSlice.actions;

export const selectAverageHourlyRate = (state) => state.employeeHours.overallAverageHourlyRate;

export default employeeHoursSlice.reducer;
