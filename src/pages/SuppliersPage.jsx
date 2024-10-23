// src/pages/SuppliersPage.jsx - דף הספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Button, Modal, Select } from 'antd';
import SupplierForm from '../components/SupplierForm';
import SupplierList from '../components/SupplierList';
import './SuppliersPage.css';

function SuppliersPage() {
  const { addSupplier } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('name');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }} className="scrollable-content suppliers-page-container">
      <div className="suppliers-controls">
        <Button type="primary" onClick={showModal} className="add-supplier-button">
          הוסף ספק חדש
        </Button>
        <Select
          popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
          dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
          value={sortKey}
          onChange={(value) => setSortKey(value)}
          className="sort-select"
        >
          <Select.Option value="name">מיין לפי שם</Select.Option>
        </Select>
      </div>

      <SupplierList sortKey={sortKey} />

      <Modal
        title="הוסף ספק חדש"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <SupplierForm
          addSupplier={addSupplier}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
}

export default SuppliersPage;
