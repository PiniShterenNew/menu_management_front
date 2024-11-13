// src/components/SupplierList.jsx - רשימת ספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { List, Card, Button, Modal, Space, Popconfirm } from 'antd';
import SupplierForm from './SupplierForm';
import './SupplierList.css';
import { useSelector } from 'react-redux';
import { useSupplierContext } from '../../context/subcontexts/SupplierContext';
import { DeleteOutlined } from '@ant-design/icons';

const SupplierList = ({ sortKey }) => {
  const { updateSupplier, deleteSupplier } = useSupplierContext();
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
                <Popconfirm
                  title="האם אתה בטוח שברצונך למחוק את הספק?"
                  onConfirm={() => deleteSupplier(supplier._id)}
                  okText="כן"
                  cancelText="לא"
                >
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>
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
        open={isModalVisible}
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
