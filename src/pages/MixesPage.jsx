import React, { useState, useEffect } from "react";
import { Button, Col, InputNumber, Modal, Row, Select, Tooltip, message } from "antd";
import { useSelector } from "react-redux";
import { useMixContext } from "../context/subcontexts/MixContext";
import Page from "../Elements/Page";
import { optionsUnits } from "../utils/TypeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { EyeOutlined } from "@ant-design/icons";

function MixesPage() {
  const { addMix, updateMix, deleteMix } = useMixContext();

  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);

  const [filters, setFilters] = useState({});

  const mixesState = useSelector((state) => state.mixes);
  const ingredientsState = useSelector((state) => state.ingredients)?.filter((e) => e.is_active);
  const productsState = useSelector((state) => state.products);
  const overallAverageHourlyRateState = useSelector((state) => state.settings.settings?.hourlyRate?.value);

  const IngredientsList = ({ ingredients }) => {
    const MAX_VISIBLE_ITEMS = 2; // מספר המרכיבים שמוצגים לפני "ראה עוד"
    const [isModalVisible, setIsModalVisible] = useState(false);

    const visibleIngredients = ingredients.slice(0, MAX_VISIBLE_ITEMS);
    const hiddenIngredients = ingredients.slice(MAX_VISIBLE_ITEMS);

    const hiddenTooltipContent = (
      <div style={{ maxWidth: "300px", whiteSpace: "normal" }}>
        {hiddenIngredients.map((e, index) => (
          <div key={index} style={{ marginBottom: "5px" }}>
            {`${e?.name} (${e.quantity} ${e.unit}) - ₪${e?.costForQuantity}`}
          </div>
        ))}
      </div>
    );

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
        {/* רכיבים מוצגים */}
        <span
          className="row-actions"
          style={{
            color: "blue",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "5px",
          }}
          onClick={() => setIsModalVisible(true)} // עבור מובייל
        >
          <EyeOutlined style={{ fontSize: "16px", color: "#000" }} />
        </span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            maxWidth: "400px",
          }}
        >
          {visibleIngredients.map((e, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                padding: "5px 10px",
                fontSize: "0.7vw",
              }}
            >
              {`${e?.name} (${e.quantity} ${e.unit}) - ₪${e?.costForQuantity}`}
            </span>
          ))}
          {/* הצגת כפתור "ראה עוד" */}
        </div>

        {/* Modal למובייל */}
        <Modal
          title="רשימת מרכיבים"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              סגור
            </Button>,
          ]}
        >
          {ingredients.map((e, index) => (
            <div key={index} style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              padding: "5px 10px",
              width: "fit-content",
              fontSize: "0.7vw",
              marginBottom: ".5vw"
            }}>
              {`${e?.name} (${e.quantity} ${e.unit}) - ₪${e?.costForQuantity}`}
            </div>
          ))}
        </Modal>
      </div>
    );
  };

  const searchKeys = ["name", "ingredients"];
  const mobileKeys = ["name", "preparationTime", "totalCost", "totalWeight", "usedCount"];
  const sortKeys = [
    { key: "name", dataIndex: "name", title: "שם", required: true },
    { key: "preparationTime", dataIndex: "preparationTime", title: "זמן הכנה" },
    { key: "totalCost", dataIndex: "totalCost", title: "עלות כוללת" },
    { key: "totalWeight", dataIndex: "totalWeight", title: "משקל כולל" },
    {
      key: "usedCount",
      dataIndex: "usedCount",
      title: "בשימוש",
    },
  ];

  const tableKeys = [
    {
      key: "name",
      dataIndex: "name",
      title: "שם התערובת",
      editable: true,
      type: "text",
      minWidth: 100,
      rules: [
        { required: true, message: "חייב להיות שם תערובת" },
        { min: 3, message: "שם חייב להיות לפחות 3 תווים" },
      ],
    },
    {
      key: "usedCount",
      dataIndex: "usedCount",
      title: "בשימוש",
      align: 'center',
      editable: false,
      width: 100
    },
    {
      key: "preparationTime",
      dataIndex: "preparationTime",
      title: "זמן הכנה (דקות)",
      align: 'center',
      editable: true,
      minWidth: 100,
      type: "number",
      rules: [
        { required: true, message: "זמן הכנה נדרש" },
        { type: "number", min: 0, message: "זמן הכנה חייב להיות מספר חיובי" },
      ],
    },
    {
      key: "unitCost",
      dataIndex: "unitCost",
      align: 'center',
      title: "עלות ל-100 גרם (₪)",
      minWidth: 100,
      render: (_, record) => {
        if (record?.totalWeight != null && record?.totalCost != null) {
          // חישוב עלות ל-100 גרם
          const unitCost = (Number(record.totalCost) + Number(record.laborCost || 0)) / (Number(record.totalWeight) * 10); // לחישוב לפי 100 גרם
          return `₪${unitCost.toFixed(2)} / 100 גרם`;
        }
        return "—";
      },
      editable: false,
    },
    {
      key: "laborCost",
      dataIndex: "laborCost",
      title: "עלות עבודה (₪)",
      align: 'center',
      minWidth: 100,
      render: (_, record) => `₪${record?.laborCost?.toFixed(2)}` || "—",
      editable: false,
    },
    {
      key: "totalCost",
      dataIndex: "totalCost",
      title: "עלות כוללת (₪)",
      align: 'center',
      minWidth: 100,
      render: (_, record) => {
        if (record?.totalCost != null && record?.laborCost != null) {
          return `₪${(Number(record.totalCost) + Number(record.laborCost)).toFixed(2)}`;
        }
        return "—";
      },
      editable: false,
    },
    {
      key: "totalWeight",
      dataIndex: "totalWeight",
      title: "משקל כולל (ק\"ג)",
      align: 'center',
      minWidth: 100,
      render: (_, record) => record.totalWeight?.toFixed(2) || "—",
      editable: false,
    },
    {
      key: "ingredients",
      title: "רכיבים",
      type: "ingredientsManager",
      align: 'center',
      editable: true,
      width: 500,
      minWidth: 500,
      column: true,
      fields: [
        {
          key: "ingredientId",
          type: "select",
          title: "רכיב",
          placeholder: "בחר רכיב",
          options: ingredientsState.map((ing) => ({ value: ing._id, label: ing.name })),
          required: true,
          rules: [{ required: true, message: "יש לבחור רכיב" }],
        },
        {
          key: "quantity",
          type: "number",
          title: "כמות",
          placeholder: "הזן כמות",
          required: true,
          rules: [
            { required: true, message: "יש להזין כמות" },
            { type: "number", min: 0, message: "כמות חייבת להיות חיובית" },
          ],
        },
        {
          key: "unit",
          type: "text",
          title: "יחידה",
          readonly: true, // שדה לקריאה בלבד

        },
        {
          key: "weightOrVolumePerUnit",
          type: "number",
          title: "נפח/משקל ליחידה (אם רלוונטי)",
          placeholder: "הזן נפח ליחידה",
          required: false,
          visible: (values) => values.unit === "units", // הצגת השדה רק אם היחידה היא 'units'
          rules: [
            { type: "number", min: 0, message: "ערך חייב להיות חיובי" },
          ],
        },
      ],
      render: (_, record, mode, notTable) => {
        // הצגה ברשימה או בטבלה
        let ingredients = [...(record?.ingredients || [])].sort((a, b) => b.quantity - a.quantity);
        ingredients = ingredients?.map((e) => ({
          name: e?.ingredientData.name,
          quantity: (e?.rawQuantityForJuice || e.quantity) < 1 && e.unit !== "units" ? (e?.rawQuantityForJuice || e.quantity) * 100 : (e?.rawQuantityForJuice || e.quantity),
          unit: optionsUnits?.find((op) => op.value === e.unit)?.display(e?.rawQuantityForJuice || e.quantity),
          costForQuantity: e?.costForQuantity
        }));

        return notTable ? (
          <ul style={{ display: "flex", flexDirection: "column", gap: "5px", padding: 0, margin: 0, listStyleType: "none" }}>
            {ingredients?.map((e, index) => (
              <li key={index} style={{ whiteSpace: "normal", display: "flex" }}>
                <Tooltip title={e?.name}>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "inline-block",
                      maxWidth: "150px",
                    }}
                  >
                    {e?.name}
                  </span>
                </Tooltip>
                {` (${e.quantity} ${e.unit}) - ₪${e?.costForQuantity}`}
              </li>
            ))}
          </ul>
        ) : (
          <IngredientsList ingredients={ingredients} />
          // <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          //   {ingredients?.map((e, index) => (
          //     <div key={index}>
          //       {`${e?.name} (${e.quantity} ${e.unit}) - ₪${e?.costForQuantity}, `}
          //     </div>
          //   ))}
          // </div>
        );
      },
      rules: [{ required: true, message: "יש לבחור לפחות רכיב אחד" }],
    },
  ];

  const filtersArr = [
    {
      name: "מרכיבים",
      value: "ingredientId",
      options: ingredientsState?.map((ingredient) => ({
        label: ingredient.name,
        value: ingredient._id,
      })),
    },
    {
      name: "סטטוס",
      value: "isActive",
      options: [
        { label: "פעיל", value: true },
        { label: "לא פעיל", value: false },
      ],
    },
    {
      name: "עלות",
      value: "cost",
      options: [
        { label: "עד 50 ₪", value: "low" },
        { label: "50-100 ₪", value: "medium" },
        { label: "מעל 100 ₪", value: "high" },
      ],
    },
    {
      name: "זמן הכנה",
      value: "preparationTime",
      options: [
        { label: "עד 5 דקות", value: "short" },
        { label: "5-15 דקות", value: "medium" },
        { label: "מעל 15 דקות", value: "long" },
      ],
    },
  ];

  useEffect(() => {
    if (mixesState) {
      setData(mixesState);
      setDataPrint(mixesState);
    }
  }, [mixesState, ingredientsState, overallAverageHourlyRateState]);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersMenu") || "{}");
    setFilters(savedFilters);
  }, []);

  const saveFilters = (newFilters) => {
    setFilters(newFilters);
    localStorage.setItem("filtersMenu", JSON.stringify(newFilters));
  };

  return (
    <Page
      title={"מתכונים"}
      titleView={"מיקס"}
      type={"mix"}
      data={data}
      mobileKeys={mobileKeys}
      dataPrint={dataPrint}
      sortKeys={sortKeys}
      tableKeys={tableKeys}
      newTitle={"הוסף תערובת חדשה"}
      searchKeys={searchKeys}
      setDataPrint={setDataPrint}
      onAdd={addMix}
      onEdit={updateMix}
      onDelete={deleteMix}
      Dtitle={"אישור מחיקה"}
      // filters={filters}
      // saveFilters={saveFilters}
      // filtersArr={filtersArr}
      ingredientsArr={ingredientsState}
      iconADD={<FontAwesomeIcon icon={faFlask} />}
      Dcontent={
        <>
          <p>האם אתה בטוח שברצונך למחוק את התערובת?</p>
          <p>שים לב! מחיקת תערובת עשויה להשפיע על מוצרים המשתמשים בה.</p>
        </>
      }
    />
  );
}

export default MixesPage;
