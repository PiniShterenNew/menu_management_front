import React, { useContext, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import ProductForm from '../components/products/ProductForm';
import ProductList from '../components/products/ProductList';
import './MenuPage.css';
import CategoryForm from '../components/category/CategoryForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faStore, faDolly, faTruck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useProductContext } from '../context/subcontexts/ProductContext';
import { useSelector } from 'react-redux';

function MenuPage() {
  const { addProduct } = useProductContext();
  const categoriesState = useSelector((state) => state.categories);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '1em 20px' }} className="scrollable-content menu-page-container">
      <div className="menu-controls">
        <Button type="primary" onClick={showModal} className="add-product-button">
          <strong>הוסף מוצר חדש</strong>
        </Button>
        <div className="left-controls">
          <Select
            value={selectedCategory}
            showSearch
            className="category-select"
            placeholder="בחר קטגוריה"
            onChange={(value) => setSelectedCategory(value)}
            style={{ width: 180 }}
            dropdownStyle={{ maxHeight: '60vh' }}
          >
            <Select.Option value="all">הכל</Select.Option>
            {categoriesState.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                <FontAwesomeIcon icon={category.icon} style={{ marginRight: '8px' }} />
                {category.name}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="default"
            onClick={() => setIsCategoryModalVisible(true)}
            className="add-category-button"
            style={{alignSelf: "start"}}
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            הוסף קטגוריה
          </Button>
        </div>
      </div>

      <ProductList sortKey={sortKey} categoryId={selectedCategory} />

      <Modal
        title="הוסף מוצר חדש"
        open={isModalVisible}
        onCancel={handleModalClose}
        className="popup-modal"
        footer={null}
        destroyOnClose
      >
        <ProductForm addProduct={addProduct} onClose={handleModalClose} />
      </Modal>
      <CategoryForm
        isCategoryModalVisible={isCategoryModalVisible}
        setIsCategoryModalVisible={setIsCategoryModalVisible}
      />
    </div>
  );
}

export default MenuPage;
