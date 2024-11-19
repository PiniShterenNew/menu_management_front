// Settings.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOverallAverageHourlyRate } from '../store/employeeHours';
import { setMaterialCostRate, setLaborCostRate, setFixedExpensesRate, setProfitRate } from '../store/profitabilitySettingsSlice';
import { Modal } from 'antd';

export default function Settings({ flag, setFlag }) {
  const dispatch = useDispatch();
  const averageHourlyRate = useSelector((state) => state.employeeHours.overallAverageHourlyRate);
  const {
    materialCostRate,
    laborCostRate,
    fixedExpensesRate,
    profitRate,
    materialCostRange,
    laborCostRange,
    fixedExpensesRange,
    profitRange
  } = useSelector((state) => state.profitabilitySettingsSlice);

  const [newHourlyRate, setNewHourlyRate] = useState(averageHourlyRate);
  const [materialCost, setMaterialCost] = useState(materialCostRate);
  const [laborCost, setLaborCost] = useState(laborCostRate);
  const [fixedExpenses, setFixedExpenses] = useState(fixedExpensesRate);
  const [profit, setProfit] = useState(profitRate);

  const handleSave = () => {
    dispatch(setOverallAverageHourlyRate(Number(newHourlyRate)));
    dispatch(setMaterialCostRate(Number(materialCost)));
    dispatch(setLaborCostRate(Number(laborCost)));
    dispatch(setFixedExpensesRate(Number(fixedExpenses)));
    dispatch(setProfitRate(Number(profit)));
    setFlag(); // סגירת הפאנל אחרי השמירה
  };

  return (
    <Modal open={flag} onCancel={setFlag} onOk={handleSave}>
      <div className="settings-panel">
        <h3>הגדרות תמחור ועיצוב</h3>
        
        {/* הגדרת צבע רקע ונושא */}
        <div className="setting-option">
          <label>בחר צבע רקע:</label>
          <input type="color" onChange={(e) => document.body.style.backgroundColor = e.target.value} />
        </div>
        
        <div className="setting-option">
          <label>בחר נושא:</label>
          <select onChange={(e) => document.body.className = e.target.value}>
            <option value="">ברירת מחדל</option>
            <option value="dark-theme">כהה</option>
            <option value="light-theme">בהיר</option>
          </select>
        </div>
        
        {/* הגדרת ממוצע לשעת עבודה */}
        <div className="setting-option">
          <label>ממוצע לשעת עבודה:</label>
          <input
            type="number"
            value={newHourlyRate}
            onChange={(e) => setNewHourlyRate(e.target.value)}
          />
        </div>

        {/* הגדרת אחוזי תמחור */}
        <div className="setting-option">
          <label>אחוז עלות חומרי גלם (טווח: {materialCostRange.min}%-{materialCostRange.max}%):</label>
          <input
            type="number"
            value={materialCost}
            onChange={(e) => setMaterialCost(e.target.value)}
            min={materialCostRange.min}
            max={materialCostRange.max}
          /> %
        </div>

        <div className="setting-option">
          <label>אחוז עלות עבודה (טווח: {laborCostRange.min}%-{laborCostRange.max}%):</label>
          <input
            type="number"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
            min={laborCostRange.min}
            max={laborCostRange.max}
          /> %
        </div>

        <div className="setting-option">
          <label>אחוז השתתפות בהוצאות קבועות (טווח: {fixedExpensesRange.min}%-{fixedExpensesRange.max}%):</label>
          <input
            type="number"
            value={fixedExpenses}
            onChange={(e) => setFixedExpenses(e.target.value)}
            min={fixedExpensesRange.min}
            max={fixedExpensesRange.max}
          /> %
        </div>

        <div className="setting-option">
          <label>אחוז רווח (טווח: {profitRange.min}%-{profitRange.max}%):</label>
          <input
            type="number"
            value={profit}
            onChange={(e) => setProfit(e.target.value)}
            min={profitRange.min}
            max={profitRange.max}
          /> %
        </div>
      </div>
    </Modal>
  );
}
