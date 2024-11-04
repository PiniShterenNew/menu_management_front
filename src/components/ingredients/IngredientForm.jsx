// src/components/IngredientForm.jsx - טופס להוספה/עריכת חומרי גלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, Checkbox, InputNumber } from 'antd';
import './IngredientForm.css';
import { useSelector } from 'react-redux';

const IngredientForm = ({ addIngredient, initialValues, onClose }) => {
    const supplierState = useSelector((state) => state.suppliers);
    const [form] = AntdForm.useForm();
    const [isJuice, setIsJuice] = useState(initialValues?.isJuice || false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                quantity: Number(initialValues.quantity),
                price: Number(initialValues.price),
            });

            // בדיקה של סוגי הערכים בשדות הבעייתיים
            form.validateFields()
                .then(values => {
                    console.log("Initial Values:", values);
                    console.log("Type of quantity:", typeof values.quantity);
                    console.log("Type of price:", typeof values.price);
                })
                .catch(errorInfo => {
                    console.log("Validation failed:", errorInfo);
                });

            setIsJuice(initialValues.isJuice || false);
        }
    }, [initialValues, form]);

    const onFinish = (values) => {
        addIngredient({
            ...values,
            ...(initialValues && { _id: initialValues._id }),
            isJuice: isJuice,
        });
        form.resetFields();
        onClose();
    };

    return (
        <Card className="ingredient-form-card">
            <AntdForm form={form} layout="vertical" onFinish={onFinish}>
                <AntdForm.Item
                    label="שם חומר הגלם"
                    name="name"
                    rules={[{ required: true, message: 'אנא הזן שם חומר גלם' }]}
                >
                    <Input />
                </AntdForm.Item>

                <AntdForm.Item
                    label="ספק"
                    name="supplierId"
                    rules={[{ required: true, message: 'אנא בחר ספק' }]}
                >
                    <Select placeholder="בחר ספק"
                        popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
                        dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
                    >
                        {supplierState && supplierState.length > 0 ? (
                            supplierState.map((supplier) => (
                                <Select.Option key={supplier._id} value={supplier._id}>
                                    {supplier.name}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value="" disabled>אין ספקים זמינים</Select.Option>
                        )}
                    </Select>
                </AntdForm.Item>

                <AntdForm.Item
                    label="סוג חומר גלם"
                    name="type"
                    rules={[{ required: true, message: 'אנא בחר סוג חומר גלם' }]}
                >
                    <Select placeholder="בחר סוג חומר גלם"
                        popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
                        dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
                    >
                        <Select.Option value="פירות">פירות</Select.Option>
                        <Select.Option value="נוזלים">נוזלים</Select.Option>
                        <Select.Option value="אבקות">אבקות</Select.Option>
                        <Select.Option value="מוצקים">מוצקים</Select.Option>
                        <Select.Option value="מכלים ואביזרים">מכלים ואביזרים</Select.Option>
                    </Select>
                </AntdForm.Item>

                <AntdForm.Item
                    label="יחידת מידה"
                    name="unit"
                    rules={[{ required: true, message: 'אנא בחר יחידת מידה' }]}
                >
                    <Select placeholder="בחר יחידת מידה"
                        popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
                        dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
                    >
                        <Select.Option value={`ק"ג`}>{`ק"ג`}</Select.Option>
                        <Select.Option value="ליטר">ליטר</Select.Option>
                        <Select.Option value="יחידות">יחידות</Select.Option>
                    </Select>
                </AntdForm.Item>
                <AntdForm.Item
                    label={"כמות"}
                    name="quantity"
                    rules={[{ required: true, message: "אנא הזן כמות תקינה" }]}
                >
                    <InputNumber min={1} step="any" style={{ width: '100%' }} />
                </AntdForm.Item>

                <AntdForm.Item
                    label={"מחיר כולל (₪)"}
                    name="price"
                    rules={[{ required: true, message: "אנא הזן מחיר תקין" }]}
                >
                    <InputNumber min={1} step="any" style={{ width: '100%' }} />
                </AntdForm.Item>
                <AntdForm.Item>
                    <Checkbox checked={isJuice} onChange={(e) => setIsJuice(e.target.checked)}>
                        האם רכיב זה משמש להכנת מיץ?
                    </Checkbox>
                </AntdForm.Item>

                {isJuice && (
                    <AntdForm.Item
                        label={"יחס המיץ (כמות מיץ מתקבלת לעומת חומר גלם בשימוש)"}
                        name="juiceRatio"
                        rules={[{ required: true, type: 'number', min: 0.01, message: "אנא הזן יחס מיץ תקין (חייב להיות גדול מ-0)" }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
                    </AntdForm.Item>
                )}

                <AntdForm.Item>
                    <Button type="primary" htmlType="submit" className="ingredient-form-button">
                        {initialValues ? "עדכן חומר גלם" : "הוסף חומר גלם"}
                    </Button>
                </AntdForm.Item>
            </AntdForm>
        </Card>
    );
};

export default IngredientForm;
