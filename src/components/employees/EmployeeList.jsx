// src/components/employees/EmployeeList.jsx
import React, { useState } from 'react';
import { List, Card, Button, Modal, Space, Typography, Badge, Popconfirm } from 'antd';
import EmployeeForm from './EmployeeForm';
import './EmployeeList.css';
import { useSelector } from 'react-redux';
import { useEmployeeContext } from '../../context/subcontexts/EmployeeContext';
import { DeleteOutlined } from '@ant-design/icons';
const { Text } = Typography;

const EmployeeList = ({ sortKey }) => {
  const { updateEmployee, deleteEmployee } = useEmployeeContext();
  const employeeState = useSelector((state) => state.employees);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingEmployee(null);
    setIsModalVisible(false);
  };

  const sortedData = [...employeeState].sort((a, b) => {
    if (sortKey === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <Card title="רשימת עובדים" className="employee-list-card">
      <List
        itemLayout="vertical"
        dataSource={sortedData}
        renderItem={(employee) => (
          <List.Item
            key={employee._id}
            className="employee-item"
            actions={[
              <Button type="link" onClick={() => handleEdit(employee)}>ערוך</Button>,
              <Popconfirm
                title="האם אתה בטוח שברצונך למחוק את העובד הנוכחי?"
                onConfirm={() => deleteEmployee(employee._id)}
                okText="כן"
                cancelText="לא"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={<Text strong>{employee.name}</Text>}
              description={
                <div>
                  <p><Text strong>תפקיד:</Text> {employee.position || 'לא הוגדר'}</p>
                  <p><Text strong>תעריף שעתי:</Text> {employee.hourlyRate} ₪</p>
                  <p>
                    <Badge
                      color={getStatusColor(employee.status)}
                      text={getEmployeeStatusLabel(employee.status)}
                      style={{ marginLeft: '8px' }}
                    />
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingEmployee ? "ערוך עובד" : "הוסף עובד חדש"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <EmployeeForm addEmployee={updateEmployee} initialValues={editingEmployee} onClose={handleModalClose} />
      </Modal>
    </Card>
  );
};

// פונקציה כדי להחזיר את הסטטוס בצורה מובנת בעברית
const getEmployeeStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'פעיל';
    case 'inactive':
      return 'לא פעיל';
    case 'on_leave':
      return 'בחופשה';
    case 'terminated':
      return 'סיים העסקה';
    default:
      return 'לא ידוע';
  }
};

// פונקציה לקביעת צבע החיווי לפי הסטטוס
const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'grey';
    case 'on_leave':
      return 'orange';
    case 'terminated':
      return 'red';
    default:
      return 'blue';
  }
};

export default EmployeeList;
