// src/components/SupplierList.jsx - רשימת ספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { List, Card, Button, Modal, Space } from 'antd';
import { AppContext } from '../../context/AppContext';
import SupplierForm from './SupplierForm';
import './SupplierList.css';
import { useSelector } from 'react-redux';

const SupplierList = ({ sortKey }) => {
  const { updateSupplier, deleteSupplier } = useContext(AppContext);
  const supplierState = useSelector((state) => state.suppliers);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingSupplier(null);
    setIsModalVisible(false);
  };

  const sortedData = [...supplierState].sort((a, b) => {
    if (sortKey === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <Card title="רשימת ספקים" className="supplier-list-card">
      <List
        itemLayout="vertical"
        className="supplier-list-card"
        dataSource={sortedData}
        renderItem={(supplier) => (
          <List.Item
            key={supplier._id}
            className="supplier-item"
            actions={[
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Button type="link" onClick={() => handleEdit(supplier)}>ערוך</Button>,
                <Button type="link" danger onClick={() => deleteSupplier(supplier._id)}>מחק</Button>
              </div>
            ]}
          >
            <List.Item.Meta
              title={supplier.name}
              description={
                <div>
                  <p>טלפון: {supplier.phone}</p>
                  <p>אימייל: {supplier.email}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingSupplier ? "ערוך ספק" : "הוסף ספק חדש"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        className='popup-modal'
        footer={null}
      >
        <SupplierForm
          addSupplier={updateSupplier}
          initialValues={editingSupplier}
          onClose={handleModalClose}
        />
      </Modal>
    </Card>
  );
};

export default SupplierList;
