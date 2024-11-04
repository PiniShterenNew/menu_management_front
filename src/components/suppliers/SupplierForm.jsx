// src/components/SupplierForm.jsx - טופס להוספה/עריכת ספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useEffect } from 'react';
import { Card, Form as AntdForm, Input, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './SupplierForm.css';

const SupplierForm = ({ addSupplier, initialValues, onClose }) => {
    const [form] = AntdForm.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    const onFinish = (values) => {
        addSupplier({ ...initialValues, ...values });
        form.resetFields();
        onClose();
    };

    return (
        <Card className="supplier-form-card">
            <AntdForm form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
                <AntdForm.Item
                    label="שם ספק"
                    name="name"
                    rules={[{ required: true, message: 'אנא הזן שם ספק' }]}
                >
                    <Input />
                </AntdForm.Item>

                <AntdForm.Item
                    label="טלפון"
                    name="phone"
                    rules={[{ required: false, message: 'אנא הזן מספר טלפון' }]}
                >
                    <Input />
                </AntdForm.Item>

                <AntdForm.Item
                    label="אימייל"
                    name="email"
                    rules={[{ required: false, type: 'email', message: 'אנא הזן כתובת אימייל תקינה' }]}
                >
                    <Input />
                </AntdForm.Item>

                <AntdForm.Item>
                    <Button type="primary" htmlType="submit" className="supplier-form-button">
                        {initialValues ? "עדכן ספק" : "הוסף ספק"}
                    </Button>
                </AntdForm.Item>
            </AntdForm>
        </Card>
    );
};

export default SupplierForm;
