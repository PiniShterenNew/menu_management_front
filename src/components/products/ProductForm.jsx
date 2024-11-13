import React, { useEffect, useState, useContext } from 'react';
import { Card, Form as AntdForm, Input, Button, Tabs, Select, InputNumber } from 'antd';
import './ProductForm.css';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

const ProductForm = ({ addProduct, initialValues, onClose }) => {
  const [form] = AntdForm.useForm();
  const ingredientsState = useSelector((state) => state.ingredients);
  const categoriesState = useSelector((state) => state.categories);
  const mixesState = useSelector((state) => state.mixes);

  const [productIngredients, setProductIngredients] = useState(initialValues?.ingredients || []);
  const [productMixes, setProductMixes] = useState(initialValues?.mixes || []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setProductIngredients(initialValues.ingredients || []);
      setProductMixes(initialValues.mixes || []);
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    addProduct({
      ...initialValues,
      ...values,
      ...(initialValues && { _id: initialValues._id }),
      ingredients: productIngredients.filter(e => e.ingredientId),
      mixes: productMixes.filter(e => e.mixId),
    });
    form.resetFields();
    onClose();
  };

  const addIngredient = () => {
    setProductIngredients([{ ingredientId: '', quantity: 1, unit: '' }, ...productIngredients]);
  };

  const addMix = () => {
    setProductMixes([{ mixId: '', quantity: 1, unit: 'ליטר' }, ...productMixes]);
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...productIngredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };

    if (field === 'ingredientId') {
      const selectedIngredient = ingredientsState.find((item) => item._id === value);
      if (selectedIngredient) {
        updatedIngredients[index] = { ...updatedIngredients[index], unit: selectedIngredient.unit };
      }
    }
    setProductIngredients(updatedIngredients);
  };

  const updateMix = (index, field, value) => {
    const updatedMixes = [...productMixes];
    updatedMixes[index] = { ...updatedMixes[index], [field]: value };

    // הגדרת יחידת המידה כ-"ליטר" תמיד
    updatedMixes[index].unit = 'ליטר';

    setProductMixes(updatedMixes);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = productIngredients.filter((_, i) => i !== index);
    setProductIngredients(updatedIngredients);
  };

  const removeMix = (index) => {
    const updatedMixes = productMixes.filter((_, i) => i !== index);
    setProductMixes(updatedMixes);
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <Tabs defaultActiveKey="1">
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
                popupMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: '60vh' }}
              >
                {categoriesState.map((category) => (
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

            <AntdForm.Item
              label="משך זמן הכנה (בדקות)"
              name="preparationTime"
              rules={[{ required: true, message: "אנא הזן את משך זמן ההכנה בדקות" }, { required: true, message: "זמן הכנה יכול להיות מינימום דקה!" }]}
            >
              <InputNumber min={1} />
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
            <div key={index} className="ingredient-item">
              <Select
                popupMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: '60vh' }}
                showSearch
                placeholder="בחר חומר גלם"
                value={ingredient.ingredientId}
                onChange={(value) => updateIngredient(index, 'ingredientId', value)}
                style={{ flex: 3 }}
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
              <Input placeholder="יחידת מידה" value={ingredient.unit} disabled style={{ flex: 2 }} />
              <Button type="link" danger onClick={() => removeIngredient(index)}>
                הסר
              </Button>
            </div>
          ))}
        </TabPane>

        <TabPane tab="תערובות" key="3">
          <div style={{ marginBottom: '20px' }}>
            <Button type="dashed" onClick={addMix}>
              הוסף תערובת
            </Button>
          </div>
          {productMixes.map((mix, index) => (
            <div key={index} className="ingredient-item">
              <Select
                popupMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: '60vh' }}
                showSearch
                placeholder="בחר תערובת"
                value={mix.mixId}
                onChange={(value) => updateMix(index, 'mixId', value)}
                style={{ flex: 3 }}
              >
                {mixesState.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
              <InputNumber
                min={0}
                step={0.1}
                placeholder="כמות"
                value={mix.quantity}
                onChange={(value) => updateMix(index, 'quantity', value)}
                style={{ flex: 2 }}
              />
              <Button type="link" danger onClick={() => removeMix(index)}>
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
