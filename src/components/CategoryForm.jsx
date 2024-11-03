import React, { useState, useContext } from 'react';
import { Modal, Input, List, Button } from 'antd';
import { AppContext } from '../context/AppContext';

const CategoryForm = ({ isCategoryModalVisible, setIsCategoryModalVisible }) => {
    const { categoryData, addCategory, updateCategory, deleteCategory } = useContext(AppContext);
    const [categoryName, setCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddOrUpdateCategory = () => {
        if (categoryName.trim() === '') {
            setErrorMessage('אנא הזן שם קטגוריה תקין');
            return;
        }
        if (categoryData.some((category) => category.name === categoryName.trim() && category !== editingCategory)) {
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
        if (editingCategory && editingCategory._id !== category._id) {
            setCategoryName(''); // מבטל את העריכה הקודמת אם עריכה נפתחת לקטגוריה אחרת
        }
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
            visible={isCategoryModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Input
                placeholder="הזן שם קטגוריה"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onPressEnter={handleAddOrUpdateCategory}
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <Button type="primary" onClick={handleAddOrUpdateCategory} style={{ marginTop: '10px' }}>
                {editingCategory ? "עדכן קטגוריה" : "הוסף קטגוריה"}
            </Button>

            <h4 style={{ marginTop: '20px' }}>קטגוריות קיימות:</h4>
            <List
                bordered
                dataSource={categoryData}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            editingCategory && editingCategory._id === item._id ? (
                                <Button type="link" onClick={handleSave}>שמור</Button>
                            ) : (
                                <Button type="link" onClick={() => handleEdit(item)}>ערוך</Button>
                            ),
                            <Button type="link" danger onClick={() => handleDelete(item._id)}>מחק</Button>,
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
        </Modal>
    );
};

export default CategoryForm;
