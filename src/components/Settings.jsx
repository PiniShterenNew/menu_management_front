import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Tabs, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { HexColorPicker } from 'react-colorful';
import { useSettingsContext } from '@/context/subcontexts/SettingsContext';
import ColorPicker from './ColorPicker';

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

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        hourlyRate: parseFloat(settings?.hourlyRate?.value) || 0,
        markupMultiplier: parseFloat(settings?.markupMultiplier?.value) || 0,
        fixedExpensesRate: parseFloat(settings?.fixedExpensesRate?.value) || 0,
        profitRate: parseFloat(settings?.profitRate?.value) || 0,
        vatRate: parseFloat(settings?.vatRate?.value) || 0,
      });
    }
  }, [settings, form]);

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
        hourlyRate: { value: parseFloat(values.hourlyRate) },
        markupMultiplier: { value: parseFloat(values.markupMultiplier) },
        fixedExpensesRate: { value: parseFloat(values.fixedExpensesRate) },
        profitRate: { value: parseFloat(values.profitRate) },
        vatRate: { value: parseFloat(values.vatRate) },
      };

      await updateSetting(settingsToUpdate);
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
    >
      <Tabs defaultActiveKey="general">
        <TabPane tab="הגדרות כלליות" key="general">
          <Form
            layout="vertical"
            initialValues={{
              hourlyRate: settings?.hourlyRate?.value || 0,
              markupMultiplier: settings?.markupMultiplier?.value || 0,
              fixedExpensesRate: settings?.fixedExpensesRate?.value || 0,
              profitRate: settings?.profitRate?.value || 0,
              vatRate: settings?.vatRate?.value || 0,
            }}
            onFinish={handleSaveGeneralSettings}
          >
            <Form.Item
              label="עלות שעת עבודה (₪)"
              name="hourlyRate"
              rules={[{ required: true, message: "שדה חובה" }]}
            >
              <Input type="number" step="0.1" min="0" placeholder="הכנס עלות שעת עבודה" />
            </Form.Item>

            <Form.Item
              label="אחוז המכפיל עבור מחיר מומלץ לצרכן (%)"
              name="markupMultiplier"
              rules={[
                { required: true, message: "שדה חובה" },
                { type: "number", min: 0, max: 100, message: "האחוז חייב להיות בין 0 ל-100" },
              ]}
            >
              <Input type="number" step="0.01" min="0" max="100" placeholder="הכנס אחוז מכפיל" />
            </Form.Item>

            <Form.Item
              label="אחוז השתתפות בהוצאות קבועות (%)"
              name="fixedExpensesRate"
              rules={[
                { required: true, message: "שדה חובה" },
                { type: "number", min: 0, max: 100, message: "האחוז חייב להיות בין 0 ל-100" },
              ]}
            >
              <Input type="number" step="0.1" min="0" max="100" placeholder="הכנס אחוז הוצאות" />
            </Form.Item>

            <Form.Item
              label="אחוז רווח רצוי (%)"
              name="profitRate"
              rules={[
                { required: true, message: "שדה חובה" },
                { type: "number", min: 0, max: 100, message: "האחוז חייב להיות בין 0 ל-100" },
              ]}
            >
              <Input type="number" step="0.1" min="0" max="100" placeholder="הכנס אחוז רווח" />
            </Form.Item>

            <Form.Item
              label={"מע\"מ (%)"}
              name="vatRate"
              rules={[
                { required: true, message: "שדה חובה" },
                { type: "number", min: 0, max: 100, message: "האחוז חייב להיות בין 0 ל-100" },
              ]}
            >
              <Input type="number" step="0.01" min="0" max="100" placeholder={"הכנס מע\" מ"} />
            </Form.Item>

            <div className="flex justify-center mt-4">
              <Button type="primary" htmlType="submit" loading={loading}>
                שמור הגדרות
              </Button>
            </div>
          </Form>
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
