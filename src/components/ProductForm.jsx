// src/components/ProductForm.jsx - טופס להוספה/עריכת מוצרים עם שימוש ב-Ant Design
import React, { useEffect, useState, useContext } from 'react';
import { Card, Form as AntdForm, Input, Button, Tabs, Select, InputNumber } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../context/AppContext';
import './ProductForm.css'; // ייבוא של קובץ CSS מותאם לנייד

const { TabPane } = Tabs;

const ProductForm = ({ addProduct, initialValues, onClose }) => {
  const [form] = AntdForm.useForm();
  const { ingredientData, categoryData } = useContext(AppContext);
  const [productIngredients, setProductIngredients] = useState(initialValues?.ingredients || []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setProductIngredients(initialValues.ingredients || []);
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    addProduct({
      ...values,
      ingredients: productIngredients,
    });
    form.resetFields();
    onClose();
  };

  const addIngredient = () => {
    setProductIngredients([...productIngredients, { ingredientId: '', quantity: 1, unit: '' }]);
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...productIngredients];
    updatedIngredients[index][field] = value;

    if (field === 'ingredientId') {
      const selectedIngredient = ingredientData.find((item) => item._id === value);
      if (selectedIngredient) {
        updatedIngredients[index].unit = selectedIngredient.unit;
      }
    }

    setProductIngredients(updatedIngredients);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = productIngredients.filter((_, i) => i !== index);
    setProductIngredients(updatedIngredients);
  };

  return (
    <Card title={initialValues ? "ערוך מוצר" : "הוסף מוצר חדש"} style={{ marginBottom: '20px' }}>
      <Tabs defaultActiveKey="1" >
        <TabPane tab="פרטי מוצר" key="1">
          <AntdForm form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <AntdForm.Item
              label="שם המוצר"
              name="name"
              rules={[{ required: true, message: 'אנא הזן שם מוצר' }]}
            >
              <Input />
            </AntdForm.Item>

            <AntdForm.Item
              label="קטגוריה"
              name="category"
              rules={[{ required: true, message: 'אנא בחר קטגוריה' }]}
            >
              <Select
                placeholder="בחר קטגוריה"
                popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
                dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
              >
                {categoryData.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </AntdForm.Item>

            <AntdForm.Item
              label="גודל"
              name="size"
              rules={[{ required: true, message: 'אנא הזן גודל מוצר' }]}
            >
              <Input />
            </AntdForm.Item>

            <AntdForm.Item
              label="מחיר נוכחי בתפריט (₪)"
              name="price"
              rules={[{ required: true, message: 'אנא הזן מחיר תקין' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </AntdForm.Item>
          </AntdForm>
        </TabPane>
        <TabPane tab="רכיבי המוצר" key="2">
          <div style={{ marginBottom: '20px' }}>
            <Button type="dashed" onClick={addIngredient}>
              הוסף רכיב
            </Button>
          </div>
          {productIngredients.map((ingredient, index) => (
            <div key={ingredient._id} className="ingredient-item">
              <Select
                popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
                dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
                showSearch
                placeholder="בחר חומר גלם"
                value={ingredient.ingredientId}
                onChange={(value) => updateIngredient(index, 'ingredientId', value)}
                style={{ flex: 3 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {ingredientData.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
              <InputNumber
                min={0}
                step={0.1}
                placeholder="כמות"
                value={ingredient.quantity}
                onChange={(value) => updateIngredient(index, 'quantity', value)}
                style={{ flex: 2 }}
              />
              <Input
                placeholder="יחידת מידה"
                value={ingredient.unit}
                disabled
                style={{ flex: 2 }}
              />
              <Button type="link" danger onClick={() => removeIngredient(index)}>
                הסר
              </Button>
            </div>
          ))}
        </TabPane>
      </Tabs>

      <AntdForm.Item style={{ marginTop: '20px' }}>
        <Button type="primary" onClick={() => form.submit()}>
          {initialValues ? "עדכן מוצר" : "הוסף מוצר"}
        </Button>
      </AntdForm.Item>
    </Card>
  );
};

export default ProductForm;
