import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Tooltip, Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const SettingsForm = ({
  loading = false,
  settings = {},
  handleSaveGeneralSettings
}) => {
  const [form] = Form.useForm();
  const [calculatedRates, setCalculatedRates] = useState({
    foodCost: 0,
    laborCost: 0,
    fixedCosts: 0
  });

  const tooltipInfo = (info) => (
    <Tooltip title={info}>
      <InfoCircleOutlined className="ml-2 text-black-400" />
    </Tooltip>
  );

  // הפונקציה שמחשבת את האחוזים המותאמים
  const calculateAdjustedRates = (values) => {
    const fixedProfitRate = parseFloat(values?.profitRate) || 25;
    const totalRates =
      parseFloat(values?.foodCost || 0) +
      parseFloat(values?.laborCost || 0) +
      parseFloat(values?.fixedCosts || 0);

    if (totalRates === 0) return;

    const adjustRate = (rate) => (rate / totalRates) * (100 - fixedProfitRate);

    setCalculatedRates({
      foodCost: adjustRate(parseFloat(values?.foodCost || 0)),
      laborCost: adjustRate(parseFloat(values?.laborCost || 0)),
      fixedCosts: adjustRate(parseFloat(values?.fixedCosts || 0))
    });
  };

  // קומפוננטה להצגת קלט עם תיאור ושם
  const RateInput = ({
    label,
    name,
    tooltip
  }) => (
    <Form.Item
      label={
        <div className="flex items-center">
           {tooltipInfo(tooltip)}
          <span>{label}</span>
        </div>
      }
      name={name}
      rules={[
        { required: true, message: 'שדה חובה' },
        {
          type: 'number',
          min: 0,
          max: 100,
          message: 'האחוז חייב להיות בין 0 ל-100'
        }
      ]}
    >
      <InputNumber
        className="w-full"
        min={0}
        max={100}
        placeholder={`הכנס ${label}`}
        onChange={() => {
          calculateAdjustedRates(form.getFieldsValue());
        }}
        addonAfter="%"
      />
    </Form.Item>
  );

  // קומפוננטה להצגת תיבת מידע מחושב
  const CalculatedRateBox = ({ title, currentValue, bgColor, textColor }) => (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className={`text-xl font-bold ${textColor}`}>
        {currentValue.toFixed(2)}%
      </div>
    </div>
  );

  useEffect(() => {
    if (settings) {
      const initialValues = {
        foodCost: settings?.foodCost?.value ?? null,
        laborCost: settings?.laborCost?.value ?? null,
        fixedCosts: settings?.fixedCosts?.value ?? null,
        profitRate: settings?.profitRate?.value ?? null,
        vatRate: settings?.vatRate?.value ?? null,
      };
      form.setFieldsValue(initialValues);
      calculateAdjustedRates(initialValues);
    }
  }, [settings, form]);

  const handleSubmit = async (values) => {
    try {
      const isValid = Object.values(values).every(
        value => value !== null && value >= 0 && value <= 100
      );

      if (!isValid) {
        return;
      }

      await handleSaveGeneralSettings(values);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // חישוב הסה"כ הכולל
  const totalPercentage = ((parseFloat(calculatedRates.foodCost) || 0) + 
                         (parseFloat(calculatedRates.laborCost) || 0) + 
                         (parseFloat(calculatedRates.fixedCosts) || 0) + 
                         (parseFloat(form.getFieldValue('profitRate')) || 0));

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onValuesChange={(_, allValues) => {
        calculateAdjustedRates(allValues);
      }}
      className="space-y-6"
    >
      {/* תיבות תצוגת החישובים */}
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 mb-6">
        <CalculatedRateBox
          title="פודקוסט מחושב"
          currentValue={form.getFieldValue('foodCost') || 0}
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <CalculatedRateBox
          title="עלות עבודה מחושב"
          currentValue={form.getFieldValue('laborCost') || 0}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <CalculatedRateBox
          title="הוצאות קבועות מחושב"
          currentValue={form.getFieldValue('fixedCosts') || 0}
          bgColor="bg-purple-50"
          textColor="text-purple-700"
        />
        <CalculatedRateBox
          title="רווח רצוי"
          currentValue={form.getFieldValue('fixedCosts') || 0}
          bgColor="bg-orange-50"
          textColor="text-orange-700"
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
            <div className="text-sm font-medium">סה״כ</div>
            <div className="text-lg font-bold text-blue-700">{totalPercentage.toFixed(2)}%</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">פודקוסט</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600">{form.getFieldValue('foodCost') || 0}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">עלות עבודה</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600">{form.getFieldValue('laborCost') || 0}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">הוצאות קבועות</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-purple-600">{form.getFieldValue('fixedCosts') || 0}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">רווח רצוי</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-600">{form.getFieldValue('profitRate') || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* שדות הקלט */}
      <div className="">
        <RateInput
          label="פודקוסט (%)"
          name="foodCost"
          tooltip="האחוז המיועד לחישוב עלויות חומרי גלם מתוך סך ההכנסות"
        />
        <RateInput
          label="עלות עבודה (%)"
          name="laborCost"
          tooltip="האחוז המיועד לעלויות עבודה מתוך סך ההכנסות הכוללות"
        />
        <RateInput
          label="הוצאות קבועות (%)"
          name="fixedCosts"
          tooltip="האחוז המיועד להוצאות קבועות מתוך סך ההכנסות"
        />
        <RateInput
          label="רווח רצוי (%)"
          name="profitRate"
          tooltip="אחוז הרווח הנקי מתוך סך ההכנסות הכוללות (קבוע)"
        />
      </div>
      <div className="border-b border-gray-200 my-6" />
      <RateInput
        label='מע"מ (%)'
        name="vatRate"
        tooltip="אחוז המע״מ"
      />

      <Form.Item className="flex justify-center">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          className="px-8"
        >
          {loading ? 'שומר...' : 'שמור הגדרות'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SettingsForm;