import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List, Typography, Divider, Form, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSettingsContext } from '../context/subcontexts/SettingsContext'; // שימוש בקונטקסט
import './Settings.css';

const { Text } = Typography;

export default function Settings({ flag, setFlag }) {
  const { settings, fetchSettings, addCategory, updateCategory, deleteCategory } = useSettingsContext();

  const [categories, setCategories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [categoryForm] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (flag) {
      fetchSettings();
    }
  }, [flag]);

  useEffect(() => {
    if (settings) {
      setCategories(settings?.materialCategories?.value || []);
    }
  }, [settings]);

  const handleSaveCategory = async () => {
    try {
      const values = await categoryForm.validateFields(); // אימות הטופס
      console.log('Saving Category:', values);

      if (editingIndex === null) {
        await addCategory(values); // יצירת קטגוריה חדשה
        message.success('קטגוריה נוספה בהצלחה');
      } else {
        const updatedCategory = { ...categories[editingIndex], ...values };
        console.log('Updating Category:', updatedCategory);
        await updateCategory(categories[editingIndex]._id, updatedCategory); // עדכון קטגוריה קיימת
        message.success('קטגוריה עודכנה בהצלחה');
      }

      categoryForm.resetFields();
      setEditingIndex(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      message.error('שגיאה בשמירת הקטגוריה. נסה שוב.');
    }
  };

  const handleCancelEdit = () => {
    categoryForm.resetFields();
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId);
    message.success('קטגוריה נמחקה בהצלחה');
  };

  return (
    <Modal
      open={flag}
      title="ניהול קטגוריות"
      centered
      width={800}
      footer={null}
      onCancel={() => setFlag(false)}
    >
      <div>
        {isAdding || editingIndex !== null ? (
          <Form form={categoryForm} layout="vertical" style={{ marginBottom: '1em' }}>
            <Form.Item
              name="name"
              label="שם קטגוריה"
              rules={[{ required: true, message: 'יש להזין שם קטגוריה' }]}
              initialValue={editingIndex !== null ? categories[editingIndex]?.name : ''}
            >
              <Input placeholder="הזן שם קטגוריה" />
            </Form.Item>
            <Form.Item
              name="description"
              label="תיאור קטגוריה"
              initialValue={editingIndex !== null ? categories[editingIndex]?.description : ''}
            >
              <Input.TextArea placeholder="הזן תיאור קטגוריה" rows={3} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" onClick={handleSaveCategory}>
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                שמור
              </Button>
              <Button type="default" onClick={handleCancelEdit}>
                <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />
                בטל
              </Button>
            </div>
          </Form>
        ) : (
          <Button
            type="dashed"
            onClick={() => {
              setIsAdding(true);
              categoryForm.resetFields();
            }}
            block
          >
            הוסף קטגוריה חדשה
          </Button>
        )}
        <Divider />
        <List
          dataSource={categories}
          renderItem={(category, index) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<FontAwesomeIcon icon={faEdit} />}
                  onClick={() => {
                    setEditingIndex(index);
                    categoryForm.setFieldsValue({
                      name: category.name,
                      description: category.description,
                    });
                  }}
                />,
                <Button
                  type="text"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  onClick={() => handleDeleteCategory(category._id)}
                />,
              ]}
            >
              {editingIndex !== index ? (
                <List.Item.Meta
                  title={category.name}
                  description={category.description}
                />
              ) : null}
            </List.Item>
          )}
          style={{
            maxHeight: '300px', // גובה מקסימלי
            overflowY: 'auto', // גלילה אנכית
          }}
        />
      </div>
    </Modal>
  );
}
