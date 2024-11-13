import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/he';
import WorkHoursList from '../components/workHours/WorkHoursList';
import "./WorkHoursPage.css";
import { useSelector, useDispatch } from 'react-redux';
import { setOverallAverageHourlyRate, setSelectedDate } from '../store/employeeHours';
const { MonthPicker } = DatePicker;

moment.locale('he');

const WorkHoursPage = () => {
  const dispatch = useDispatch();
  const employeeHours = useSelector((state) => state.employeeHours.data);
  const selectedDate = useSelector((state) => state.employeeHours.selectedDate);

  const handleDateChange = (date) => {
    dispatch(setSelectedDate(date.format('YYYY-MM')));
  };

  return (
    <div className='workhours-container'>
      <h1>ניהול שעות עבודה חודשיות</h1>
      <MonthPicker
        key={selectedDate}
        onChange={handleDateChange}
        placeholder="בחר חודש ושנה"
        disabledDate={(current) => current && current > moment().endOf('month')}
      />
      <WorkHoursList monthData={employeeHours} /> {/* העברת הנתונים לרכיב הרשימה */}
    </div>
  );
};

export default WorkHoursPage;
