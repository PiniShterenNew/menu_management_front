import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Alert, Card, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useCategoryContext } from '../../context/subcontexts/CategoryContext';
import ColorPicker from '../ColorPicker';

const { Title } = Typography;

const AddEditCategoryModal = ({ isOpen, onClose, onSubmit, initialValues = null, isColorUsed }) => {
    const [form] = Form.useForm();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && initialValues) {
            form.setFieldsValue(initialValues);
        } else if (isOpen) {
            form.resetFields();
        }
    }, [isOpen, initialValues, form]);

    const handleSubmit = async (values) => {
        if (!values.name?.trim()) {
            setError("שם הקטגוריה הוא שדה חובה");
            return;
        }

        try {
            await onSubmit(values);
            form.resetFields();
            onClose();
            setError(null);
        } catch (error) {
            setError("שגיאה בשמירת הקטגוריה");
        }
    };

    return (
        <Modal
            title={initialValues ? "עריכת קטגוריה" : "הוספת קטגוריה"}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            {error && <Alert message={error} type="error" className="mb-4" />}
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="שם הקטגוריה"
                    name="name"
                    rules={[{ required: true, message: 'שם הקטגוריה הוא שדה חובה' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="תיאור" name="description">
                    <Input />
                </Form.Item>
                <Form.Item label="צבע" name="color">
                    <ColorPicker
                        value={form.getFieldValue('color')}
                        onChange={(color) => {
                            if (!isColorUsed(color) || color === initialValues?.color) {
                                form.setFieldsValue({ color });
                            } else {
                                setError("צבע זה כבר בשימוש");
                            }
                        }}
                    />
                </Form.Item>
                <div className="flex justify-end gap-2">
                    <Button type="primary" htmlType="submit">
                        שמור
                    </Button>
                    <Button onClick={onClose}>
                        ביטול
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

const CategoryForm = ({ isCategoryModalVisible, setIsCategoryModalVisible }) => {
    const { addCategory, updateCategory, deleteCategory } = useCategoryContext();
    const categoriesState = useSelector((state) => state.categories);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState(null);

    const handleAddCategory = async (values) => {
        try {
            await addCategory(values);
            setError(null);
        } catch (error) {
            setError("שגיאה בהוספת הקטגוריה");
        }
    };

    const handleUpdateCategory = async (values) => {
        try {
            await updateCategory({ ...editingCategory, ...values });
            setError(null);
        } catch (error) {
            setError("שגיאה בעדכון הקטגוריה");
        }
    };

    const handleDeleteCategory = async (categoryToDelete) => {
        try {
            await deleteCategory(categoryToDelete._id);
            setError(null);
        } catch (error) {
            setError("שגיאה במחיקת הקטגוריה");
        }
    };

    const isColorUsed = (color) => {
        return categoriesState.some(category =>
            category.color === color && category._id !== editingCategory?._id
        );
    };

    const openDeleteDialog = (category) => {
        Modal.confirm({
            title: "מחיקת קטגוריה",
            content: `האם אתה בטוח שברצונך למחוק את הקטגוריה "${category.name}"?`,
            okText: "מחק",
            cancelText: "ביטול",
            onOk: () => handleDeleteCategory(category),
        });
    };

    return (
        <Modal
            title="ניהול קטגוריות"
            open={isCategoryModalVisible}
            onCancel={() => setIsCategoryModalVisible(false)}
            footer={null}
            width={800}
        >
            {error && <Alert message={error} type="error" className="mb-4" />}
            <div className="mb-4 flex justify-between items-center">
                <Title level={4}>קטגוריות</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    הוסף קטגוריה
                </Button>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto px-2">
                {categoriesState.map((category) => (
                    <div key={category._id} className="flex justify-between items-center border p-2 rounded">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <div>
                                <div>{category.name}</div>
                                <div className="text-sm text-gray-500">{category.description}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setEditingCategory(category)}
                            />
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => openDeleteDialog(category)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <AddEditCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddCategory}
                isColorUsed={isColorUsed}
            />
            <AddEditCategoryModal
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
                onSubmit={handleUpdateCategory}
                initialValues={editingCategory}
                isColorUsed={isColorUsed}
            />
        </Modal>
    );
};

export default CategoryForm;
