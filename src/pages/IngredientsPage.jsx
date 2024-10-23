// src/pages/IngredientsPage.jsx - דף חומרי הגלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Button, Modal, Select } from 'antd';
import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import './IngredientsPage.css';

function IngredientsPage() {
  const { addIngredient } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('name');

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
          <Select.Option value="name">מיין לפי שם</Select.Option>
          <Select.Option value="price">מיין לפי מחיר כולל</Select.Option>
          <Select.Option value="type">מיין לפי סוג</Select.Option>
          <Select.Option value="pricePerUnit">מיין לפי מחיר ליחידה</Select.Option>
        </Select>
      </div>

      <IngredientList sortKey={sortKey} />

      <Modal
        title="הוסף חומר גלם חדש"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
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
