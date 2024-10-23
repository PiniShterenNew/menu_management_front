// src/components/IngredientForm.jsx - טופס להוספה/עריכת חומרי גלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, Checkbox, InputNumber } from 'antd';
import { AppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import './IngredientForm.css';

const IngredientForm = ({ addIngredient, initialValues, onClose }) => {
    const { supplierData } = useContext(AppContext);
    const [form] = AntdForm.useForm();
    const [isJuice, setIsJuice] = useState(initialValues?.isJuice || false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setIsJuice(initialValues.isJuice || false);
        }
    }, [initialValues, form]);

    const onFinish = (values) => {
        addIngredient({
            ...values,
            id: initialValues?.id || uuidv4(),
            isJuice: isJuice,
        });
        form.resetFields();
        onClose();
    };

    return (
        <Card title={initialValues ? "ערוך חומר גלם" : "הוסף חומר גלם חדש"} className="ingredient-form-card">
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
                        {supplierData && supplierData.length > 0 ? (
                            supplierData.map((supplier) => (
                                <Select.Option key={supplier.id} value={supplier.id}>
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
                    rules={[{ required: true, min: 1, message: "אנא הזן כמות תקינה" }]}
                >
                    <Input type="number" step="any" />
                </AntdForm.Item>

                <AntdForm.Item
                    label={"מחיר כולל (₪)"}
                    name="price"
                    rules={[{ required: true, min: 1, message: "אנא הזן מחיר תקין" }]}
                >
                    <Input type="number" step="any" />
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
