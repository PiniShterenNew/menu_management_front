// Settings.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOverallAverageHourlyRate } from '../store/employeeHours';
import { setMaterialCostRate, setLaborCostRate, setFixedExpensesRate, setProfitRate } from '../store/profitabilitySettingsSlice';
import { Modal, InputNumber, Slider, Select, Input, Button, Tabs, Typography, Divider, Image } from 'antd';
import { updateProductsWithRate } from '../store/products';
import './Settings.css';
import Logo from "../assets/logo.png"
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStoreAlt } from '@fortawesome/free-solid-svg-icons';

const { Text, Title } = Typography;

export default function Settings({ flag, setFlag }) {
  const dispatch = useDispatch();

  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });

  const averageHourlyRate = useSelector((state) => state.employeeHours.overallAverageHourlyRate);
  const {
    materialCostRate,
    laborCostRate,
    fixedExpensesRate,
    profitRate,
    materialCostRange,
    laborCostRange,
    fixedExpensesRange,
    profitRange,
  } = useSelector((state) => state.profitabilitySettingsSlice);

  const navArr = [
    { key: 'design', label: '🎨 עיצוב ממשק' },
    { key: 'pricing', label: '💰 תמחור' },
  ];

  const [newHourlyRate, setNewHourlyRate] = useState(averageHourlyRate);
  const [materialCost, setMaterialCost] = useState(materialCostRate);
  const [laborCost, setLaborCost] = useState(laborCostRate);
  const [fixedExpenses, setFixedExpenses] = useState(fixedExpensesRate);
  const [profit, setProfit] = useState(profitRate);

  const [activeTab, setActiveTab] = useState(navArr[0].key);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const handleSave = () => {
    dispatch(setOverallAverageHourlyRate(Number(newHourlyRate)));
    dispatch(setMaterialCostRate(Number(materialCost)));
    dispatch(setLaborCostRate(Number(laborCost)));
    dispatch(setFixedExpensesRate(Number(fixedExpenses)));
    dispatch(setProfitRate(Number(profit)));
    setFlag();
    dispatch(updateProductsWithRate());
  };



  const tabs = {
    design: (
      <div className="setting-group">
        <div className="setting-card">
          <label>בחר צבע רקע:</label>
          <Input
            type="color"
            onChange={(e) => (document.body.style.backgroundColor = e.target.value)}
          />
        </div>

        <div className="setting-card">
          <label>בחר נושא:</label>
          <Select
            onChange={(value) => (document.body.className = value)}
            style={{ width: '100%' }}
            defaultValue=""
          >
            <Select.Option value="">ברירת מחדל</Select.Option>
            <Select.Option value="dark-theme">כהה</Select.Option>
            <Select.Option value="light-theme">בהיר</Select.Option>
          </Select>
        </div>
      </div>
    ),
    pricing: (
      <div className="setting-group">
        <div className="setting-option">
          <label>ממוצע לשעת עבודה:</label>
          <InputNumber
            value={newHourlyRate}
            onChange={setNewHourlyRate}
            style={{ width: '100%' }}
            min={0}
          />
        </div>
        {[{
          label: 'חומרי גלם',
          value: materialCost,
          setValue: setMaterialCost,
          range: materialCostRange
        },
        {
          label: 'עלות עבודה',
          value: laborCost,
          setValue: setLaborCost,
          range: laborCostRange
        },
        {
          label: 'השתתפות בהוצאות קבועות',
          value: fixedExpenses,
          setValue: setFixedExpenses,
          range: fixedExpensesRange
        },
        {
          label: 'רווח',
          value: profit,
          setValue: setProfit,
          range: profitRange
        }].map(({ label, value, setValue, range }) => (
          <div className="setting-card" key={label}>
            <label>{`אחוז ${label}:`}</label>
            <div className="slider-container">
              <Slider
                className="slider-bar"
                value={value}
                onChange={setValue}
                min={range.min}
                max={range.max}
                tooltip={{ formatter: (val) => `${val}%` }}
              />
              <div className="slider-info">
                <span>{`${value}%`}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <Modal
      open={flag}
      title="הגדרות תמחור ועיצוב"
      centered
      width={800}
      className='setting-container'
      height={600}
      footer={null}
      onCancel={() => setFlag(false)}
    >
      {isMobile ? (
        !isNavigationOpen ? (
          <div className='nav-mobile'>
            {/* תפריט ניווט לנייד */}
            <Image className='logo' src={Logo} alt='GainGuard' preview={false} />
            {navArr.map((item) => (
              <Button
                key={item.key}
                type="text"
                onClick={() => {
                  setActiveTab(item.key);
                  setIsNavigationOpen(true);
                }}
                style={{ display: 'block', width: '100%', textAlign: 'right' }}
              >
                {item.label} &gt;
              </Button>
            ))}
          </div>
        ) : (
          <div>
            {/* תוכן מסך לפי כרטיסייה נבחרת */}
            <Button
              type="link"
              onClick={() => setIsNavigationOpen(false)}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              חזור
            </Button>
            <div>
              <Title level={3} strong>{navArr?.find((e) => e.key === activeTab)?.label}</Title>
              {tabs[activeTab]}
              <Button
                type="primary"
                block
                style={{ marginTop: '20px' }}
                onClick={handleSave}
              >
                שמור שינויים
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="settings-desktop">
          {/* ניווט ליד התוכן במחשב */}
          <div className="nav-desktop">
            <div className='nav-top'>
              <Image className='logo' src={Logo} alt='GainGuard' preview={false} />
            </div>
            <Divider />
            {navArr.map((item) => (
              <Button
                key={item.key}
                type="text"
                onClick={() => setActiveTab(item.key)}
                className={activeTab === item.key ? 'link-active' : 'link'}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="tab-content">
            <Title level={3} strong>{navArr?.find((e) => e.key === activeTab)?.label}</Title>
            {tabs[activeTab]}
            <Button
              type="primary"
              block
              style={{ marginTop: '20px' }}
              onClick={handleSave}
            >
              שמור שינויים
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
