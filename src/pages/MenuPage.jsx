import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Button, Modal, Select, Tabs } from 'antd';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import './MenuPage.css';
import CategoryForm from '../components/CategoryForm';

const { TabPane } = Tabs;

function MenuPage() {
  const { addProduct, categoryData } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [activeTabKey, setActiveTabKey] = useState("all");
  const tabsContainerRef = useRef(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const scrollToActiveTab = () => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector(`.ant-tabs-tab-active`);
      if (activeTab) {
        const tabsContainer = tabsContainerRef.current;
        const containerWidth = tabsContainer.offsetWidth;
        const tabOffsetLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;

        // Scroll to center the active tab in the viewport
        const scrollPosition = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2);
        tabsContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    scrollToActiveTab();
  }, [activeTabKey]);

  return (
    <div style={{ padding: '1em 20px' }} className="scrollable-content menu-page-container">
      <div className="menu-controls">
        <div className='menu-controls-div'>
          <Button type="primary" onClick={showModal} className="add-product-button">
            <strong>הוסף מוצר חדש</strong>
          </Button>
        </div>
        <Select
          value={sortKey}
          className='sort-select'
          onChange={(value) => setSortKey(value)}
          style={{ width: 180 }}
          dropdownStyle={{ maxHeight: '60vh' }}
        >
          <Select.Option value="">מיין</Select.Option>
          <Select.Option value="name">מיין לפי שם</Select.Option>
          <Select.Option value="price">מיין לפי מחיר</Select.Option>
        </Select>
      </div>

      <Tabs
        ref={tabsContainerRef}
        className='menu-tab'
        activeKey={activeTabKey}
        onChange={(key) => setActiveTabKey(key)}
        defaultActiveKey="all"
        style={{ marginTop: '20px' }}
        tabBarExtraContent={
          <Button type="default" onClick={() => setIsCategoryModalVisible(true)}>
            +
          </Button>
        }
      >
        <TabPane tab="הכל" key="all">
          <ProductList sortKey={sortKey} />
        </TabPane>
        {categoryData.map((category) => (
          <TabPane tab={category.name} key={category._id}>
            <ProductList sortKey={sortKey} categoryId={category._id} />
          </TabPane>
        ))}
      </Tabs>

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
