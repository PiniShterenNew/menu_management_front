// src/pages/MenuPage.jsx - דף התפריט עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Button, Modal, Select } from 'antd';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import './MenuPage.css';
import CategoryForm from '../components/CategoryForm';

function MenuPage() {
  const { addProduct } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '0px 20px' }} className="scrollable-content menu-page-container">
      <div className="menu-controls">
        <div className='menu-controls-div'>
          <Button type="primary" onClick={showModal} className="add-product-button">
            <strong> הוסף מוצר חדש</strong>
          </Button>
          <Button className="add-product-button" type="default" onClick={() => setIsCategoryModalVisible(true)}>
            הוסף קטגוריה חדשה
          </Button>
        </div>
        <Select
          value={sortKey}
          className='sort-select'
          onChange={(value) => setSortKey(value)}
          style={{ width: 180 }}
          dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
        >
          <Select.Option value="">מיין</Select.Option>
          <Select.Option value="name">מיין לפי שם</Select.Option>
          <Select.Option value="price">מיין לפי מחיר</Select.Option>
        </Select>
      </div>

      <ProductList sortKey={sortKey} />

      <Modal
        title="הוסף מוצר חדש"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <ProductForm
          addProduct={addProduct}
          onClose={handleModalClose}
        />
      </Modal>
      <CategoryForm isCategoryModalVisible={isCategoryModalVisible} setIsCategoryModalVisible={setIsCategoryModalVisible} />
    </div>
  );
}

export default MenuPage;
