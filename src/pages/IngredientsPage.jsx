// src/pages/IngredientsPage.jsx - דף חומרי הגלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, InputNumber, Modal, Form as AntdForm, Space, Tag, Col, Row, Tooltip, Typography, Badge, Switch, Flex, Form } from 'antd';
import './IngredientsPage.css';
import { useIngredientContext } from '../context/subcontexts/IngredientContext';
import Page from '../Elements/Page';
import { useSelector } from 'react-redux';
import { optionsUnits } from '../utils/TypeOptions';
import { faDolly, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useSettingsContext } from '@/context/subcontexts/SettingsContext';
const { Text } = Typography;

function IngredientsPage() {

  const {
    settings
  } = useSettingsContext();

  const typesOptions = useMemo(() => settings?.materialCategories?.value?.map((e) => ({ value: e?._id, label: e?.name, color: e?.color || "blue" })) || [], [settings?.materialCategories?.value]);

  const supplierState = useSelector((state) => state.suppliers);
  const ingredientsState = useSelector((state) => state.ingredients);
  const productsState = useSelector((state) => state.products);
  const mixesState = useSelector((state) => state.mixes);

  const { addIngredient, updateIngredient, deleteIngredient } = useIngredientContext();
  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);

  const [filters, setFilters] = useState({});

  const [withVAT, setWithVAT] = useState(false);

  const searchKeys = ["name", "type", "supplierId"];
  const mobileKeys = ["unit", "unitPrice", "supplierId", "usedInMixes", "usedInProducts"]
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
      key: "usedCount",
      dataIndex: "usedCount",
      title: "בשימוש",
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
      key: "SKU",
      dataIndex: "SKU",
      title: "מק\"ט",
      editable: true,
      type: "number",
      width: 100,
      group: 1,
      rules: [
        {
          validator: async (_, value, initialValues) => {
            if (!value) {
              return Promise.resolve();
            }
            if (typeof value !== "number") {
              return Promise.reject("מק\"ט חייב להיות מספר תקין");
            }

            if (value.toString().length === 0) {
              return Promise.reject("מק\"ט חייב להיות מינימום תו אחד ");
            }

            const isDuplicate = data.some(
              (item) => item.SKU === value && item._id !== initialValues?._id
            );

            if (isDuplicate) {
              return Promise.reject("מק\"ט זה כבר קיים במערכת");
            }

            return Promise.resolve();
          },
        },
      ]
    },
    {
      key: "name",
      dataIndex: "name",
      title: "שם",
      required: true,
      editable: true,
      group: 1,
      type: "text",
      width: 200,
      minWidth: 200,
      rules: [
        { required: true, message: "השדה חובה" },
        { min: 3, message: "השם חייב להיות לפחות 3 תווים" },
        {
          pattern: /^[א-תa-zA-Z\s0-9%-]+$/,
          message: "השם יכול להכיל אותיות בעברית או אנגלית, מספרים והתווים הבאים: ' % ', ' - '"
        }
      ]
    },
    {
      key: "supplierId",
      dataIndex: "supplierId",
      title: "שם ספק",
      editable: true,
      group: 1,
      type: "select",
      required: true,
      width: 100,
      render: (_, record, mode) => {
        return <Row align={"middle"} style={{ gap: 5 }}>{mode === "view" && <FontAwesomeIcon icon={faTruck} />} {supplierState?.find((e) => e?._id === record?.supplierId)?.name}</Row>
      },
      options: supplierState?.map((e) => ({ value: e._id, label: e?.name })),
      rules: [
        {
          required: true,
          message: "יש לבחור ספק",
        },
        {
          validator: (_, value) => {
            const isValid = supplierState?.some((e) => e._id === value);
            return isValid ? Promise.resolve() : Promise.reject("ספק לא חוקי נבחר");
          },
        },
      ],
    },
    {
      key: "usedCount",
      dataIndex: "usedCount",
      title: "בשימוש",
      editable: false,
      width: 100,
    },
    {
      key: "is_active",
      dataIndex: "is_active",
      title: "פעיל",
      editable: true,
      group: 1,
      type: "custom",
      render: (_, initialValues, mode, form) => {
        return mode === "edit" ? (
          <>
            <AntdForm.Item
              key={"is_active"}
              name={"is_active"}
              label={"פעיל"}
            >
              <Switch
                checkedChildren="פעיל"
                unCheckedChildren="לא פעיל"
              />
            </AntdForm.Item>
          </>
        ) : (
          <Badge status={!initialValues?.is_active ? "error" : "success"} text={!initialValues?.is_active ? "לא פעיל" : "פעיל"} />
        )
      },
      minWidth: 120,
      width: 120,
    },
    {
      key: "type",
      dataIndex: "type",
      title: "סוג",
      render: (_, record) => {
        const type = typesOptions.find((e) => e.value === record?.type);
        return <Tag color={type?.color}>{type?.label}</Tag>
      },
      type: "select",
      required: true,
      editable: true,
      group: 2,
      options: typesOptions,
      divider: true,
      width: 100,
      rules: [
        {
          required: true,
          message: "יש לבחור סוג",
        },
        {
          validator: (_, value) => {
            const isValid = typesOptions?.some((e) => e.value === value);
            return isValid ? Promise.resolve() : Promise.reject("סוג לא חוקי נבחר");
          },
        },
      ],
    },
    {
      key: "unit",
      dataIndex: "unit",
      title: "יחידת מידה",
      editable: true,
      group: 2,
      type: "select",
      options: optionsUnits,
      width: 100,
      render: (_, record) => {
        return <p>{optionsUnits.find((e) => e.value === record?.unit)?.label || record?.unit}</p>
      },
      rules: [
        {
          required: true,
          message: "יש לבחור יחידת מידה",
        },
        {
          validator: (_, value) => {
            const isValid = optionsUnits?.some((e) => e.value === value);
            return isValid ? Promise.resolve() : Promise.reject("יחידת מידה לא חוקית");
          },
        },
      ],
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "כמות",
      editable: true,
      group: 2,
      type: "custom",
      width: 100,
      render: (_, record, mode, form) => {
        if (mode == 'edit') {
          return (
            <AntdForm.Item
              shouldUpdate={(prevValues, currentValues) => prevValues.subUnit !== currentValues.subUnit}
            >
              {({ getFieldValue }) => (
                <AntdForm.Item
                  key={'quantity'}
                  name={'quantity'}
                  label={'כמות'}
                  rules={[
                    {
                      required: true,
                      message: "אנא הזן כמות",
                    },
                    {
                      validator: (_, value) => {
                        if (value === null || value === undefined) {
                          return Promise.reject("כמות נדרשת");
                        }
                        if (value < 0) {
                          return Promise.reject("הכמות לא יכולה להיות שלילית");
                        }
                        if (getFieldValue('subUnit') === "g" || getFieldValue('subUnit') === "ml") {
                          if (value < 0.001 || value > 999) {
                            return Promise.reject("עבור גרם או מ\"ל הכמות חייבת להיות בין 0.001 ל-999");
                          }
                        }
                        if (getFieldValue('subUnit') === "kg" || getFieldValue('subUnit') === "liter") {
                          if (value < 1 || value > 1000000) {
                            return Promise.reject("עבור ק\"ג או ליטר הכמות חייבת להיות מ-1 ומעלה, ובתוך הטווח המותר");
                          }
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    // min={0.1}
                    // max={record.selectedUnit !== "kg" && record.selectedUnit !== "liter" ? 999 : 1000000}
                    // step={record.selectedUnit === "kg" || record.selectedUnit === "liter" ? 0.1 : 1}
                    style={{ width: "100%" }}
                  />
                </AntdForm.Item>
              )}
            </AntdForm.Item>
          );
        }

        // עיבוד יחידות מידה להצגה במצב קריאה בלבד
        let typeUnits = record.unit;
        let exactUnits = "";

        if (typeUnits === "weight") {
          exactUnits = record.quantity >= 1 ? "ק\"ג" : "גרם";
        } else if (typeUnits === "volume") {
          exactUnits = record.quantity >= 1 ? "ליטר" : "מ\"ל";
        } else if (typeUnits === "units") {
          exactUnits = "יחידות";
        }

        return (
          <p>
            {record.quantity < 1
              ? (record.quantity * 1000) // המרה למ"ל או גרם
              : record.quantity}{" "}
            {exactUnits}
          </p>
        );
      },
    },
    {
      key: "price",
      dataIndex: "price",
      title: "מחיר כולל מעמ",
      editable: true,
      group: 2,
      type: "price",
      width: 100,
      show: false,
      divider: true,
      render: (_, record, mode, form) => {
        if (mode !== 'edit') {
          return <p>₪{record?.price?.toFixed(2)}</p>
        }
      }
    },
    {
      key: "priceExcludingVAT",
      dataIndex: "priceExcludingVAT",
      width: 100,
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
      width: 100,
      render: (_, record) => (
        <Col>
          <Row>
            <p>{record.unitQuantity < 1 ? record.unitQuantity * 1000 : record.unitQuantity} {record?.unitDescription}</p>
            <br />
          </Row>
          <p>₪{record?.unitPrice}</p>
        </Col>
      ),
    },
    {
      key: "juiceRatio",
      dataIndex: "juiceRatio",
      title: "יחס עיבוד (תפוקת חומר מעובד)",
      editable: true,
      group: 2,
      width: 100,
      type: "custom",
      render: (_, record, mode, form) => {
        // קבלת הערך של isJuice מתוך הטופס
        if (mode == "view" || mode !== "edit") return <p>{record?.juiceRatio ? `${(record?.juiceRatio * 100)?.toFixed(0)}%` : ''}</p>;

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
            <AntdForm.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.isJuice !== currentValues.isJuice}>
              {({ getFieldValue }) =>
                getFieldValue("isJuice") && (
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
                )
              }
            </AntdForm.Item>
          </>
        );
      },
    },
    {
      key: "processedPrice",
      dataIndex: "processedPrice",
      title: "מחיר לכמות מינימלית מעובדת",
      width: 100,
      render: (_, record) => {
        return <p>{record?.processedPrice ? `₪${record?.processedPrice}` : ''}</p>
      },
      editable: false, // לא ניתן לערוך
      hiddenInForm: true, // לא מוצג בטופס,
    },
    {
      key: "notes",
      dataIndex: "notes",
      title: "הערות",
      width: 100,
      editable: true,
      group: 1,
      render: (_, record) => {
        const text = record?.notes || "—"; // ברירת מחדל אם אין תוכן

        return (
          <Tooltip title={text}>
            <Text
              style={{
                display: "inline-block",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                maxWidth: "150px", // התאמה לרוחב התא או התוכן
                direction: "rtl", // כיוון RTL לתמיכה בעברית
              }}
            >
              {text}
            </Text>
          </Tooltip>
        );
      },
      type: "textArea",
      maxLength: 120,
      rules: [
        { required: false },
        { max: 120, message: "מקסימום 120 תווים" },
      ],
    }
  ];

  const filtersArr = [
    {
      name: "סוג",
      value: "type",
      options: typesOptions,
    },
    {
      name: "ספק",
      value: "supplierId",
      options: supplierState.map((e) => ({ label: e.name, value: e._id })),
    },
    {
      name: "סטטוס",
      value: "is_active",
      options: [
        { label: "פעיל", value: true },
        { label: "לא פעיל", value: false },
      ],
    },
  ];

  useEffect(() => {
    if (ingredientsState) {
      if (supplierState) {
        let newArr = [...ingredientsState?.map((e) => {
          let supplier = supplierState?.find((sup) => sup?._id === e?.supplierId);
          // ספירת השימוש ברכיבים
          const inProductsCount = productsState?.reduce((count, product) => {
            return count + product.ingredients?.filter((ing) => ing.ingredientId === e._id).length;
          }, 0) || 0;

          const inMixesCount = mixesState?.reduce((count, mix) => {
            return count + mix.ingredients?.filter((ing) => ing.ingredientId === e._id).length;
          }, 0) || 0;
          return ({
            ...e,
            supplierName: supplier?.name,
            usedCount: inProductsCount + inMixesCount
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

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersIngredients") || "{}");
    setFilters(savedFilters);
  }, []);

  const saveFilters = (filters) => {
    setFilters(filters);
    localStorage.setItem("filtersIngredients", JSON.stringify(filters));
  };

  return (
    <>
      <Page
        title={"חומרי גלם"}
        titleView={"חומר גלם"}
        type={"ingredient"}
        data={data}
        groups={true}
        mobileKeys={mobileKeys}
        dataPrint={dataPrint}
        sortKeys={sortKeys}
        tableKeys={tableKeys}
        newTitle={"הוסף חומר גלם חדש"}
        searchKeys={searchKeys}
        setDataPrint={setDataPrint}
        onAdd={addIngredient}
        onEdit={updateIngredient}
        onDelete={deleteIngredient}
        Dtitle={"אישור מחיקה"}
        filters={filters}
        saveFilters={saveFilters}
        filtersArr={filtersArr} // העברת הסינונים
        iconADD={<FontAwesomeIcon icon={faDolly} />}
        Dcontent={(
          <>
            <p>האם אתה בטוח שברצונך למחוק את הרכיב?</p>
            <p>שים לב! הרכיב יימחק מכל המוצרים והתערובות בהם הוא נמצא.</p>
          </>
        )}
      />
    </>
  );
}

export default IngredientsPage;
