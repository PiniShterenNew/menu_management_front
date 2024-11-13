// src/pages/EmployeesPage.jsx
import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeList from '../components/employees/EmployeeList';
import './EmployeesPage.css';
import { useEmployeeContext } from '../context/subcontexts/EmployeeContext';

function EmployeesPage() {
  const { addEmployee } = useEmployeeContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }} className="scrollable-content employees-page-container">
      <div className="employees-controls">
        <Button type="primary" onClick={showModal} className="add-employee-button">
          הוסף עובד חדש
        </Button>
        <Select
          value={sortKey}
          onChange={(value) => setSortKey(value)}
          className="sort-select"
        >
          <Select.Option value="">מיין</Select.Option>
          <Select.Option value="name">מיין לפי שם</Select.Option>
        </Select>
      </div>

      <EmployeeList sortKey={sortKey} />

      <Modal
        title="הוסף עובד חדש"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <EmployeeForm addEmployee={addEmployee} onClose={handleModalClose} />
      </Modal>
    </div>
  );
}

export default EmployeesPage;
