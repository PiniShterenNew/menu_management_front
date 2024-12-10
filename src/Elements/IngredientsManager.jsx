import React from "react";
import { Button, Row, Col, Select, InputNumber, Form } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const IngredientsManager = ({
  title,
  value = [],
  onChange,
  ingredientsArr = [],
  indexSize,
  nameArr,
  nameArrType,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1200px)" });

  // הוספת מרכיב חדש
  const handleAddIngredient = () => {
    const newIngredient = {
      ingredientId: null,
      quantity: null,
      unit: null, // שדה unit ריק כברירת מחדל
    };
    onChange([...value, newIngredient]);
  };

  // הסרת מרכיב
  const handleRemoveIngredient = (index) => {
    const updatedValue = [...value];
    updatedValue.splice(index, 1);
    onChange(updatedValue);
  };

  // שינוי ערך בשדה
  const handleFieldChange = (index, key, fieldValue) => {
    const updatedValue = [...value];

    // עדכון השדה
    updatedValue[index][key] = fieldValue;

    // אם בוחרים רכיב חדש, נוסיף את ה-unit המתאים
    if (key === "ingredientId") {
      const selectedIngredient = ingredientsArr.find(
        (ing) => ing._id === fieldValue
      );
      if (selectedIngredient) {
        updatedValue[index].unit = selectedIngredient.unit;
      }
    }

    onChange(updatedValue); // עדכון ה-state החיצוני
  };

  // קבלת שם היחידה לתצוגה
  const getUnitDisplay = (unit) => {
    switch (unit) {
      case "weight":
        return "ק\"ג";
      case "volume":
        return "ליטר";
      case "units":
        return "יחידות";
      default:
        return "";
    }
  };

  // בניית שדה של מרכיב בודד
  const renderIngredient = (ingredient, index) => {
    const selectedIngredient = ingredientsArr.find(
      (ing) => ing._id === ingredient.ingredientId
    );
    const unitDisplay =
      ingredient.unit || selectedIngredient?.unit
        ? getUnitDisplay(ingredient.unit || selectedIngredient?.unit)
        : "";

    return (

      <Row gutter={[20, 20]} align="middle" justify={"center"}>
        {/* בחירת מרכיב */}
        <Col span={isMobile ? 24 : 10}>
          <Form.Item
            name={[nameArr, indexSize, nameArrType, index, "ingredientId"]}
            rules={[{ required: true, message: "יש לבחור רכיב" }]}
          >
            <Select
              placeholder="בחר רכיב"
              style={{ width: "100%" }}
              value={ingredient.ingredientId || null}
              onChange={(value) => handleFieldChange(index, "ingredientId", value)} // עדכון ID ו-unit
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={ingredientsArr.map((ing) => ({
                value: ing._id,
                label: ing.name,
              }))}
              size="small"
            />
          </Form.Item>
        </Col>

        {/* מילוי כמות */}
        <Col span={isMobile ? 20 : 10}>
          <Form.Item
            name={[nameArr, indexSize, nameArrType, index, "quantity"]}
            rules={[
              { required: true, message: "יש למלא כמות" },
              { type: "number", min: 0, message: "כמות חייבת להיות חיובית" },
            ]}
          >
            <InputNumber
              placeholder={`כמות ${unitDisplay ? `(${unitDisplay})` : ""}`}
              style={{ width: "100%" }}
              value={ingredient.quantity || null}
              onChange={(value) => handleFieldChange(index, "quantity", value)} // עדכון כמות
              min={0}
              step={ingredient.unit === "units" ? 1 : 0.001}
              precision={ingredient.unit === "units" ? 0 : 3}
              size="small"
              addonAfter={unitDisplay}
            />
          </Form.Item>
        </Col>

        {/* כפתור מחיקה */}
        <Col span={isMobile ? 4 : 4} style={{ alignSelf: "flex-start", textAlign: "right" }}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveIngredient(index)}
            size="small"
          />
        </Col>
      </Row>
    );
  };

  return (
    <div >
      <Button
        type="dashed"
        onClick={handleAddIngredient}
        style={{ width: "100%", marginBottom: "8px" }}
        icon={<PlusOutlined />}
        size="small"
      >
        {title}
      </Button>
      <div>
        {value.map((ingredient, index) => renderIngredient(ingredient, index))}
      </div>
    </div>
  );
};

export default IngredientsManager;
