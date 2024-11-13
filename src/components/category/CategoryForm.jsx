import React, { useState, useContext } from 'react';
import { Modal, Input, List, Button, Typography, Popconfirm } from 'antd';
import './CategoryForm.css';
import { useSelector } from 'react-redux';
import { useCategoryContext } from '../../context/subcontexts/CategoryContext';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CategoryForm = ({ isCategoryModalVisible, setIsCategoryModalVisible }) => {
    const { addCategory, updateCategory, deleteCategory } = useCategoryContext();
    const categoriesState = useSelector((state) => state.categories);
    const [categoryName, setCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddOrUpdateCategory = () => {
        if (categoryName.trim() === '') {
            setErrorMessage('אנא הזן שם קטגוריה תקין');
            return;
        }
        if (categoriesState.some((category) => category.name === categoryName.trim() && category !== editingCategory)) {
            setErrorMessage('קטגוריה זו כבר קיימת');
            return;
        }
        if (editingCategory) {
            updateCategory({ ...editingCategory, name: categoryName.trim() });
        } else {
            addCategory({ name: categoryName.trim() });
        }
        setCategoryName('');
        setEditingCategory(null);
        setErrorMessage('');
        setIsCategoryModalVisible(false);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
    };

    const handleSave = () => {
        if (categoryName.trim() === '') {
            setErrorMessage('אנא הזן שם קטגוריה תקין');
            return;
        }
        updateCategory({ ...editingCategory, name: categoryName.trim() });
        setCategoryName('');
        setEditingCategory(null);
        setErrorMessage('');
    };

    const handleDelete = (categoryId) => {
        deleteCategory(categoryId);
    };

    const handleCancel = () => {
        setCategoryName('');
        setEditingCategory(null);
        setErrorMessage('');
        setIsCategoryModalVisible(false);
    };

    return (
        <Modal
            title={editingCategory ? "ערוך קטגוריה" : "הוסף קטגוריה חדשה"}
            open={isCategoryModalVisible}
            onCancel={handleCancel}
            footer={null}
            className="category-modal popup-modal"
        >
            <div className="category-form-section">
                <Title level={4}>{editingCategory ? "ערוך קטגוריה" : "הוסף קטגוריה חדשה"}</Title>
                <Input
                    placeholder="הזן שם קטגוריה"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    onPressEnter={handleAddOrUpdateCategory}
                />
                {errorMessage && <Text type="danger" className="error-message">{errorMessage}</Text>}
                <Button type="primary" onClick={handleAddOrUpdateCategory} style={{ marginTop: '10px' }}>
                    {editingCategory ? "עדכן קטגוריה" : "הוסף קטגוריה"}
                </Button>
            </div>

            <div className="category-list-section">
                <Title level={4} style={{ marginTop: '20px' }}>קטגוריות קיימות:</Title>
                <List
                    bordered
                    dataSource={categoriesState}
                    renderItem={(item) => (
                        <List.Item
                            className={editingCategory && editingCategory._id === item._id ? 'editing-item' : ''}
                            actions={[
                                editingCategory && editingCategory._id === item._id ? (
                                    <Button type="link" onClick={handleSave}>שמור</Button>
                                ) : (
                                    <Button type="link" onClick={() => handleEdit(item)}>ערוך</Button>
                                ),
                                <Popconfirm
                                    title="האם אתה בטוח שברצונך למחוק את הקטגוריה?"
                                    onConfirm={() => handleDelete(item._id)}
                                    okText="כן"
                                    cancelText="לא"
                                >
                                    <Button icon={<DeleteOutlined />} danger />
                                </Popconfirm>,
                            ]}
                        >
                            {editingCategory && editingCategory._id === item._id ? (
                                <Input
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    onPressEnter={handleSave}
                                    autoFocus
                                />
                            ) : (
                                item.name
                            )}
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
};

export default CategoryForm;
