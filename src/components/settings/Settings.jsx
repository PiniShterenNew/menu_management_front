import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Tabs, Alert, Tooltip, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { HexColorPicker } from 'react-colorful';
import { useSettingsContext } from '@/context/subcontexts/SettingsContext';
import ColorPicker from '../ColorPicker';
import SettingsForm from './SettingsForm';

const { TabPane } = Tabs;

const Settings = ({ flag, setFlag }) => {
  const {
    settings,
    loading,
    updateSetting,
    fetchSettings,
    addCategoryContext,
    updateCategoryContext,
    deleteCategoryContext
  } = useSettingsContext();

  const [form] = Form.useForm();


  // מצבים לניהול קטגוריות
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);

  // אפקט לטעינת ההגדרות בפתיחת הדיאלוג
  useEffect(() => {
    if (flag) {
      fetchSettings();
      setError(null);
    }
  }, [flag]);

  // פתיחת חלון עריכה/הוספה
  const openModal = (type, category = null) => {
    setModalType(type);
    setEditingCategory(category);
    setIsModalVisible(true);

    if (type === "edit" && category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        color: category.color,
      });
    } else {
      form.resetFields();
    }
  };

  // שמירת הגדרות כלליות
  const handleSaveGeneralSettings = async (values) => {
    try {
      const settingsToUpdate = {
        foodCost: { value: values.foodCost.toString() },
        laborCost: { value: values.laborCost.toString() },
        fixedCosts: { value: values.fixedCosts.toString() },
        profitRate: { value: values.profitRate.toString() },
        vatRate: { value: values.vatRate.toString() }
      };

      await updateSetting(settingsToUpdate);
      await fetchSettings();
    } catch (error) {
      setError("שגיאה בשמירת ההגדרות");
    }
  };

  // הוספה או עדכון קטגוריה
  const handleAddOrEditCategory = async (values) => {
    try {
      if (modalType === "add") {
        await addCategoryContext(values);
      } else if (modalType === "edit") {
        await updateCategoryContext(editingCategory._id, values);
      }
      setIsModalVisible(false);
      fetchSettings();
    } catch (error) {
      setError("שגיאה בתהליך");
    }
  };

  // מחיקת קטגוריה
  const handleDeleteCategory = async (category) => {
    try {
      await deleteCategoryContext(category);
      fetchSettings();
    } catch (error) {
      setError("שגיאה במחיקת הקטגוריה");
    }
  };

  // בדיקה אם צבע כבר בשימוש
  const isColorUsed = (color) => {
    return settings?.materialCategories?.value.some(category => category.color === color);
  };

  const tooltipInfo = (info) => (
    <Tooltip title={info} className='mr-2'>
      <InfoCircleOutlined style={{ marginLeft: 8, color: 'gray' }} />
    </Tooltip>
  );

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
      title="הגדרות מערכת"
      visible={flag}
      footer={null}
      onCancel={() => setFlag(false)}
      width={800}
      style={{ top: 30 }}
    >
      <Tabs defaultActiveKey="general">
        <TabPane tab="הגדרות כלליות" key="general">
          <SettingsForm
            loading={loading}
            settings={settings}
            handleSaveGeneralSettings={handleSaveGeneralSettings}
          />

        </TabPane>

        <TabPane tab="קטגוריות" key="categories">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal("add")}
            className="mb-4"
          >
            הוסף קטגוריה
          </Button>
          {error && <Alert message={error} type="error" className="mb-4" />}
          <div className="space-y-2 overflow-y-auto px-2"
            style={{ maxHeight: '400px', paddingRight: '8px' }} >
            {settings?.materialCategories?.value.map((category) => (
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
                    onClick={() => openModal("edit", category)}
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
        </TabPane>
      </Tabs>

      <Modal
        title={modalType === "add" ? "הוסף קטגוריה" : "ערוך קטגוריה"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrEditCategory}
        >
          <Form.Item
            label="שם הקטגוריה"
            name="name"
            rules={[{ required: true, message: "שדה חובה" }]}
          >
            <Input placeholder="הכנס שם קטגוריה" />
          </Form.Item>
          <Form.Item label="תיאור" name="description">
            <Input placeholder="הכנס תיאור" />
          </Form.Item>
          <Form.Item label="צבע" name="color">
            <ColorPicker
              value={form.getFieldValue('color')}
              onChange={(color) => {
                if (!isColorUsed(color) || color === editingCategory?.color) {
                  form.setFieldsValue({ color });
                } else {
                  setError("צבע זה כבר בשימוש");
                }
              }}
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalVisible(false)}>
              ביטול
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              שמור
            </Button>
          </div>
        </Form>
      </Modal>
    </Modal >
  );
};

export default Settings;
