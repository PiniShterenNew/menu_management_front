import React from "react";
import {
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  List,
  Flex,
  Divider,
  Typography,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import { optionsUnits } from "../utils/TypeOptions"; // ייבוא יחידות מידה אוניברסליות

const { Text } = Typography;

const IngredientsManager = ({
  value = [],
  onChange,
  ingredientsArr = [],
  errors = {},
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1200px)" });
  const handleAddIngredient = () => {
    const newIngredient = {
      ingredientId: null,
      quantity: null,
    };
    onChange && onChange([newIngredient, ...value]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedValue = [...value];
    updatedValue.splice(index, 1);
    onChange && onChange(updatedValue);
  };

  const handleFieldChange = (index, key, fieldValue) => {
    const updatedValue = JSON.parse(JSON.stringify(value)) || [];

    if (key === "quantity") {
      // If the value is empty, null, or NaN, set it to null
      if (fieldValue === "" || fieldValue === null || isNaN(fieldValue)) {
        updatedValue[index][key] = null;
      } else {
        // Convert to integer for units, keep decimals for weight/volume
        const selectedIngredient = getIngredientById(
          updatedValue[index].ingredientId
        );
        if (selectedIngredient?.unit === "units") {
          updatedValue[index][key] = Math.round(fieldValue);
        } else {
          updatedValue[index][key] = parseFloat(fieldValue);
        }
      }
    } else if (key === "ingredientId") {
      updatedValue[index].ingredientId = fieldValue;
      updatedValue[index].quantity = null;
    }

    onChange && onChange(updatedValue);
  };

  const formatQuantity = (quantity, unit) => {
    if (!quantity || isNaN(quantity)) return "";

    switch (unit) {
      case "weight":
        return quantity < 1 ? `${quantity * 1000} גרם` : `${quantity} ק"ג`;
      case "volume":
        return quantity < 1 ? `${quantity * 1000} מ"ל` : `${quantity} ליטר`;
      case "units":
        return `${quantity} יחידות`;
      default:
        return quantity.toString();
    }
  };

  const getIngredientById = (id) => {
    return ingredientsArr?.find((ing) => ing._id === id);
  };

  const getUnitDisplay = (unit) => {
    switch (unit) {
      case "weight":
        return 'ק"ג';
      case "volume":
        return "ליטר";
      case "units":
        return "יחידות";
      default:
        return "";
    }
  };

  const body = (ingredient, index) => {
    const selectedIngredient = getIngredientById(ingredient.ingredientId);
    const unitDisplay = selectedIngredient
      ? getUnitDisplay(selectedIngredient.unit)
      : "";

    // בניית מפתחות השגיאה לפי המיקום בעץ
    const idErrorKey =
      errors[`size_${index}_ingredient_${index}_id`] ||
      errors[`variation_${index}_ingredient_${index}_id`] ||
      errors[`variation_${index}_size_${index}_ingredient_${index}_id`];

    const amountErrorKey =
      errors[`size_${index}_ingredient_${index}_amount`] ||
      errors[`variation_${index}_ingredient_${index}_amount`] ||
      errors[`variation_${index}_size_${index}_ingredient_${index}_amount`];

    return (
      <div
        style={{
          padding: "8px",
          marginBottom: "8px",
          border: "1px solid #e8e8e8",
          borderRadius: "6px",
          backgroundColor: "#fff",
        }}
      >
        <Row gutter={[8, 8]} align="middle">
          <Col span={isMobile ? 24 : 10}>
            <Select
              placeholder="בחר רכיב"
              style={{ width: "100%" }}
              value={
                selectedIngredient
                  ? {
                      value: selectedIngredient._id,
                      label: selectedIngredient.name,
                    }
                  : null
              }
              onChange={(value) =>
                handleFieldChange(index, "ingredientId", value)
              }
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={
                ingredientsArr?.map((ing) => ({
                  value: ing._id,
                  label: ing.name,
                })) || []
              }
              size="small"
              status={idErrorKey ? "error" : ""}
            />
          </Col>
          <Col span={isMobile ? 20 : 10}>
            <InputNumber
              placeholder={`כמות ${unitDisplay ? `(${unitDisplay})` : ""}`}
              style={{ width: "100%" }}
              value={ingredient.quantity}
              onChange={(value) => handleFieldChange(index, "quantity", value)}
              min={0}
              step={selectedIngredient?.unit === "units" ? 1 : 0.001}
              precision={selectedIngredient?.unit === "units" ? 0 : 3}
              size="small"
              addonAfter={unitDisplay}
              status={amountErrorKey ? "error" : ""}
            />
          </Col>
          <Col span={isMobile ? 4 : 4} style={{ textAlign: "right" }}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveIngredient(index)}
              size="small"
            />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div>
      <Button
        type="dashed"
        onClick={handleAddIngredient}
        style={{ width: "100%", marginBottom: "8px" }}
        icon={<PlusOutlined />}
        size="small"
      >
        הוסף רכיב
      </Button>
      <div>{value.map((ingredient, index) => body(ingredient, index))}</div>
    </div>
  );
};

export default IngredientsManager;
