import React, { useState, useEffect } from "react";
import { Button, Col, InputNumber, Modal, Row, Select, Tooltip, message } from "antd";
import { useSelector } from "react-redux";
import { useMixContext } from "../context/subcontexts/MixContext";
import Page from "../Elements/Page";
import { optionsUnits } from "../utils/TypeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask } from "@fortawesome/free-solid-svg-icons";

function MixesPage() {
  const { addMix, updateMix, deleteMix } = useMixContext();

  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);

  const mixesState = useSelector((state) => state.mixes);
  const ingredientsState = useSelector((state) => state.ingredients)?.filter((e) => e.is_active);
  const productsState = useSelector((state) => state.products);
  const overallAverageHourlyRateState = useSelector((state) => state.employeeHours.overallAverageHourlyRate);

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
      editable: false,
      width: 100
    },
    {
      key: "preparationTime",
      dataIndex: "preparationTime",
      title: "זמן הכנה (דקות)",
      editable: true,
      minWidth: 100,
      type: "number",
      rules: [
        { required: true, message: "זמן הכנה נדרש" },
        { type: "number", min: 0, message: "זמן הכנה חייב להיות מספר חיובי" },
      ],
    },
    {
      key: "totalCost",
      dataIndex: "totalCost",
      title: "עלות כוללת (₪)",
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
      key: "unitCost",
      dataIndex: "unitCost",
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
      minWidth: 100,
      render: (_, record) => `₪${record?.laborCost?.toFixed(2)} (₪${overallAverageHourlyRateState})` || "—",
      editable: false,
    },
    {
      key: "totalWeight",
      dataIndex: "totalWeight",
      title: "משקל כולל (ק\"ג)",
      minWidth: 100,
      render: (_, record) => record.totalWeight?.toFixed(2) || "—",
      editable: false,
    },
    {
      key: "ingredients",
      title: "רכיבים",
      type: "ingredientsManager",
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
      ],
      render: (_, record, mode, notTable) => {
        // הצגה ברשימה או בטבלה
        let ingredients = [...(record?.ingredients || [])].sort((a, b) => b.quantity - a.quantity);
        ingredients = ingredients?.map((e) => ({
          name: e?.ingredientId.name,
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {ingredients?.map((e, index) => (
              <div key={index}>
                {`${e?.name} (${e.quantity} ${e.unit}) - ₪${e?.costForQuantity}, `}
              </div>
            ))}
          </div>
        );
      },
      rules: [{ required: true, message: "יש לבחור לפחות רכיב אחד" }],
    },
  ];

  useEffect(() => {
    if (mixesState) {
      setData(mixesState);
      setDataPrint(mixesState);
    }
  }, [mixesState, ingredientsState, overallAverageHourlyRateState]);

  return (
    <Page
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
