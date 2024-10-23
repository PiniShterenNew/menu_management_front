// src/pages/MenuPage.jsx - דף התפריט עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Button, Modal } from 'antd';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import './MenuPage.css';
import CategoryForm from '../components/CategoryForm';

function MenuPage() {
  const { addProduct } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleAddCategory = (categoryName) => {
    addCategory({ id: `${categoryName}-${Date.now()}`, name: categoryName });
    setIsCategoryModalVisible(false);
  };

  return (
    <div style={{ padding: '0px 20px' }} className="scrollable-content menu-page-container">
      <div className="menu-controls">
        <Button type="primary" onClick={showModal} className="add-product-button">
          <strong> הוסף מוצר חדש</strong>
        </Button>
        <Button className="add-product-button" type="default" onClick={() => setIsCategoryModalVisible(true)} style={{ marginLeft: '10px' }}>
          הוסף קטגוריה חדשה
        </Button>
      </div>

      <ProductList />

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
