// src/pages/SuppliersPage.jsx - דף הספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import SupplierForm from '../components/suppliers/SupplierForm';
import SupplierList from '../components/suppliers/SupplierList';
import './SuppliersPage.css';
import { useSupplierContext } from '../context/subcontexts/SupplierContext';

function SuppliersPage() {
  const { addSupplier } = useSupplierContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('');

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
          <Select.Option value="">מיין</Select.Option>
          <Select.Option value="name">מיין לפי שם</Select.Option>
        </Select>
      </div>

      <SupplierList sortKey={sortKey} />

      <Modal
        title="הוסף ספק חדש"
        open={isModalVisible}
        onCancel={handleModalClose}
        className='popup-modal'
        footer={null}
        destroyOnClose
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
