// src/components/employees/EmployeeForm.jsx
import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Typography, InputNumber, Select, Space } from 'antd';
import './EmployeeForm.css';
import { useSelector } from 'react-redux';

const { Text } = Typography;
const { Option } = Select;

const EmployeeForm = ({ addEmployee, initialValues, onClose }) => {
  const [form] = AntdForm.useForm();
  const employeeState = useSelector((state) => state.employees);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    if (employeeState.some((employee) => employee.name === values.name.trim() && (!initialValues || employee._id !== initialValues._id))) {
      setErrorMessage('קיים כבר עובד בעל שם דומה');
      return;
    }
    addEmployee({ ...initialValues, ...values });
    form.resetFields();
    onClose();
  };

  return (
    <Card className="employee-form-card">
      <AntdForm form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
        <AntdForm.Item label="שם עובד" name="name" rules={[{ required: true, message: 'אנא הזן שם עובד' }]}>
          <Input />
        </AntdForm.Item>

        <AntdForm.Item label="תפקיד" name="position">
          <Input placeholder="הזן תפקיד" />
        </AntdForm.Item>

        <AntdForm.Item label="תעריף שעתי" name="hourlyRate" rules={[{ required: true, message: 'אנא הזן תעריף שעתי' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </AntdForm.Item>

        <AntdForm.Item label="סטטוס" name="status" initialValue="active" rules={[{ required: true }]}>
          <Select>
            <Option value="active">פעיל</Option>
            <Option value="inactive">לא פעיל</Option>
            <Option value="on_leave">בחופשה</Option>
            <Option value="terminated">סיים העסקה</Option>
          </Select>
        </AntdForm.Item>

        {errorMessage && (
          <Space style={{ display: 'block', marginBottom: '10px' }}>
            <Text type="danger" className="error-message">{errorMessage}</Text>
          </Space>
        )}

        <AntdForm.Item>
          <Button type="primary" htmlType="submit" className="employee-form-button">
            {initialValues ? "עדכן עובד" : "הוסף עובד"}
          </Button>
          <Button className='employee-form-button' onClick={onClose} style={{ marginLeft: '8px' }}>ביטול</Button>
        </AntdForm.Item>
      </AntdForm>
    </Card>
  );
};

export default EmployeeForm;
