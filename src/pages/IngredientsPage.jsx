// src/pages/IngredientsPage.jsx - דף חומרי הגלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import IngredientForm from '../components/ingredients/IngredientForm';
import IngredientList from '../components/ingredients/IngredientList';
import './IngredientsPage.css';
import { useIngredientContext } from '../context/subcontexts/IngredientContext';

function IngredientsPage() {
  const { addIngredient } = useIngredientContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }} className="scrollable-content">
      <div className="ingredients-controls">
        <Button type="primary" onClick={showModal}>
          הוסף חומר גלם חדש
        </Button>
        <Select
          value={sortKey}
          onChange={(value) => setSortKey(value)}
          className="sort-select"
        >
          <Select.Option value="">מיין</Select.Option>
          <Select.Option value="name">מיין לפי שם</Select.Option>
          <Select.Option value="price">מיין לפי מחיר כולל</Select.Option>
          <Select.Option value="type">מיין לפי סוג</Select.Option>
          <Select.Option value="pricePerUnit">מיין לפי מחיר ליחידה</Select.Option>
        </Select>
      </div>

      <IngredientList sortKey={sortKey} />

      <Modal
        title="הוסף חומר גלם חדש"
        open={isModalVisible}
        onCancel={handleModalClose}
        className='popup-modal'
        footer={null}
        destroyOnClose
      >
        <IngredientForm
          addIngredient={addIngredient}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
}

export default IngredientsPage;
