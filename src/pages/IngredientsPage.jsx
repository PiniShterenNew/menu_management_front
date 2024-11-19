// src/pages/IngredientsPage.jsx - דף חומרי הגלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, InputNumber, Modal, Form as AntdForm, Space, Tag } from 'antd';
import IngredientForm from '../components/ingredients/IngredientForm';
import IngredientList from '../components/ingredients/IngredientList';
import './IngredientsPage.css';
import { useIngredientContext } from '../context/subcontexts/IngredientContext';
import Page from '../Elements/Page';
import { useSelector } from 'react-redux';
import { typesOptions } from '../utils/TypeOptions';

function IngredientsPage() {

  const supplierState = useSelector((state) => state.suppliers);
  const ingredientsState = useSelector((state) => state.ingredients);

  const { addIngredient } = useIngredientContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [sortKey, setSortKey] = useState('');

  const searchKeys = ["name", "type", "supplierName"];
  const mobileKeys = ["unit", "unitPrice", "supplierName"]
  const sortKeys = [
    {
      key: "name",
      dataIndex: "name",
      title: "שם",
      required: true
    },
    {
      key: "type",
      dataIndex: "type",
      title: "סוג",
    },
    {
      key: "unit",
      dataIndex: "unit",
      title: "יחידת מידה",
    },
    {
      key: "supplierName",
      dataIndex: "supplierName",
      title: "שם ספק",
    }
  ];
  const tableKeys = [
    {
      key: "name",
      dataIndex: "name",
      title: "שם",
      required: true,
      editable: true,
      type: "text",
      rules: [
        { required: true, message: "השדה חובה" },
        { min: 3, message: "השם חייב להיות לפחות 3 תווים" },
        {
          pattern: /^[א-תa-zA-Z\s]+$/,
          message: "השם יכול להכיל רק אותיות בעברית או אנגלית"
        }
      ]
    },
    {
      key: "supplierName",
      dataIndex: "supplierName",
      title: "שם ספק",
      editable: true,
      type: "select",
      options: [
        { value: "supplier1", label: "ספק 1" },
        { value: "supplier2", label: "ספק 2" },
      ],
    },
    {
      key: "type",
      dataIndex: "type",
      title: "סוג",
      render: (_, record) => {
        return <Tag color={typesOptions?.find((e) => e.value === record?.type)?.color}>{record?.type}</Tag>
      },
      type: "select",
      required: true,
      editable: true,
      options: typesOptions.map((e) => ({ value: e.value, label: e.value })),
      divider: true
    },
    {
      key: "unit",
      dataIndex: "unit",
      title: "יחידת מידה",
      editable: true,
      type: "select",
      options: [
        { value: "weight", label: "משקל" },
        { value: "volume", label: "נפח" },
        { value: "units", label: "יחידות" },
      ],
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "כמות",
      editable: true,
      type: "number",
    },
    {
      key: "price",
      dataIndex: "price",
      title: "מחיר כולל מעמ",
      render: (_, record) => (
        <p>₪{record?.price}</p>
      ),
      editable: true,
      type: "number",
      coin: true
    },
    {
      key: "priceExcludingVAT",
      dataIndex: "priceExcludingVAT",
      title: "מחיר ללא מעמ",
      render: (_, record) => (
        <p>₪{record?.priceExcludingVAT}</p>
      ),
      editable: false, // לא ניתן לערוך
      hiddenInForm: true, // לא מוצג בטופס
    },
    {
      key: "unitPrice",
      dataIndex: "unitPrice",
      title: "כמות מינימלית",
      render: (_, record) => (
        <Space>
          <p>{record.unitQuantity < 1 ? record.unitQuantity * 1000 : record.unitQuantity}</p>
          <p>{record?.unitDescription}</p>
          <p>₪{record?.unitPrice}</p>
        </Space>
      ),
    },
    {
      key: "juiceRatio",
      dataIndex: "juiceRatio",
      title: "יחס המיץ (כמות מיץ מתקבלת לעומת חומר גלם בשימוש)",
      editable: true,
      type: "custom",
      render: (form) => {
        // קבלת הערך של isJuice מתוך הטופס
        const isJuice = form.getFieldValue("isJuice") || false;

        return (
          <>
            {/* תיבת סימון עבור רכיב מעובד */}
            <AntdForm.Item name="isJuice" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox onChange={(e) => {
                // עדכון הערך של isJuice בטופס
                form.setFieldsValue({ isJuice: e.target.checked });
                if (!e.target.checked) {
                  // איפוס שדה יחס אם הרכיב אינו מעובד
                  form.setFieldsValue({ juiceRatio: undefined });
                }
              }}>
                האם הרכיב דורש עיבוד?
              </Checkbox>
            </AntdForm.Item>

            {/* שדה להזנת יחס המיץ (מופיע רק אם isJuice=true) */}
            {isJuice && (
              <AntdForm.Item
                name="juiceRatio"
                label="יחס המיץ (0.1 עד 0.99)"
                rules={[
                  { required: true, message: "אנא הזן יחס מיץ" },
                  {
                    type: "number",
                    min: 0.1,
                    max: 0.99,
                    message: "היחס חייב להיות בין 0.1 ל-0.99",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </AntdForm.Item>
            )}
          </>
        );
      },
    },
    {
      key: "processedPrice",
      dataIndex: "processedPrice",
      title: "מחיר לכמות מינימלית מעובדת",
      editable: false, // לא ניתן לערוך
      hiddenInForm: true, // לא מוצג בטופס
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (ingredientsState) {
      if (supplierState) {
        let newArr = [...ingredientsState?.map((e) => {
          let supplier = supplierState?.find((sup) => sup?._id === e?.supplierId);
          return ({
            ...e,
            supplierName: supplier?.name
          })
        })];
        setData(newArr);
        setDataPrint(newArr);
      }
      else {
        setData([...ingredientsState]);
        setDataPrint([...ingredientsState]);
      }
    }
  }, [supplierState, ingredientsState]);

  return (
    <>
      {/* <div style={{ padding: '20px' }} className="container scrollable-content">
       <div className="ingredients-controls">
         <Button type="primary" onClick={showModal}>
    
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

       <IngredientList sortKey={sortKey} /> */}

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
      {/* </div > */}
      <Page
        data={data}
        mobileKeys={mobileKeys}
        dataPrint={dataPrint}
        sortKeys={sortKeys}
        tableKeys={tableKeys}
        newTitle={"הוסף חומר גלם חדש"}
        searchKeys={searchKeys}
        setDataPrint={setDataPrint}
      />
    </>
  );
}

export default IngredientsPage;
