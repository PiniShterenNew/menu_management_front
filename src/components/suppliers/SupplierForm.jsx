// src/components/SupplierForm.jsx - טופס להוספה/עריכת ספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './SupplierForm.css';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const SupplierForm = ({ addSupplier, initialValues, onClose }) => {
    const [form] = AntdForm.useForm();
    const supplierState = useSelector((state) => state.suppliers);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    const onFinish = (values) => {
        if (supplierState.some((supplier) => supplier.name === values.name.trim())) {
            setErrorMessage('קיים כבר ספק בעל שם דומה');
            return;
        }
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
                {errorMessage && <Text type="danger" className="error-message">{errorMessage}</Text>}
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
