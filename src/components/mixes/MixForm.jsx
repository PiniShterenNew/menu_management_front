import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, InputNumber } from 'antd';
import './MixForm.css';
import { useSelector } from 'react-redux';

const MixForm = ({ addMix, initialValues, onClose }) => {
  const [form] = AntdForm.useForm();
  const ingredientsState = useSelector((state) => state.ingredients);

  const [mixIngredients, setMixIngredients] = useState(initialValues?.ingredients || []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setMixIngredients(initialValues.ingredients || []);
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    addMix({
      ...initialValues,
      ...values,
      ...(initialValues && { _id: initialValues._id }),
      ingredients: mixIngredients,
    });
    form.resetFields();
    onClose();
  };

  const addIngredient = () => {
    setMixIngredients([...mixIngredients, { ingredientId: '', quantity: 1, unit: '' }]);
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...mixIngredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };

    if (field === 'ingredientId') {
      const selectedIngredient = ingredientsState.find((item) => item._id === value);
      if (selectedIngredient) {
        updatedIngredients[index] = { ...updatedIngredients[index], unit: selectedIngredient.unit };
      }
    }

    setMixIngredients(updatedIngredients);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = mixIngredients.filter((_, i) => i !== index);
    setMixIngredients(updatedIngredients);
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <AntdForm form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
        <AntdForm.Item
          label="שם התערובת"
          name="name"
          rules={[{ required: true, message: 'אנא הזן שם תערובת' }]}
        >
          <Input />
        </AntdForm.Item>

        <div style={{ marginBottom: '20px' }}>
          <Button type="dashed" onClick={addIngredient}>
            הוסף רכיב לתערובת
          </Button>
        </div>

        {mixIngredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            <Select
              popupMatchSelectWidth={false}
              dropdownStyle={{ maxHeight: '60vh' }}
              showSearch
              placeholder="בחר חומר גלם"
              value={ingredient.ingredientId?._id}
              onChange={(value) => updateIngredient(index, 'ingredientId', value)}
              style={{ flex: 3 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {ingredientsState.map((item) => (
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

        <AntdForm.Item style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={() => form.submit()}>
            {initialValues ? "עדכן תערובת" : "הוסף תערובת"}
          </Button>
        </AntdForm.Item>
      </AntdForm>
    </Card>
  );
};

export default MixForm;
