import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Input, InputNumber, Row, Col, Form, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import IngredientsManager from "./IngredientsManager";

const { Text } = Typography;

const SizesManager = forwardRef(
  ({ value = [], onChange, ingredientsArr, errors = {} }, ref) => {
    const [newSizeId, setNewSizeId] = useState(null);

    const handleAddSize = () => {
      const newSize = {
        idNew: Date.now(),
        label: `גודל ${value.length + 1}`,
        price: null,
        preparationTime: null,
        ingredients:
          value?.length > 0
            ? value[0]?.ingredients?.map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                quantity: 0,
                unit: ingredient?.unit
              }))
            : [],
      };
      onChange([newSize, ...value]);
      setNewSizeId(newSize.idNew);
      setTimeout(() => setNewSizeId(null), 100);
    };

    const getIngredientById = (ingredientId) => {
      return ingredientsArr?.find(
        (ingredient) => ingredient._id === ingredientId
      );
    };

    const handleUpdateSize = (index, field, newValue) => {
      const updatedSizes = JSON.parse(JSON.stringify(value)) || [];

      if (field === "ingredients") {
        // מצא את הרכיבים הקיימים לפני השינוי
        const currentIngredients = updatedSizes[index].ingredients || [];
        const currentIds = currentIngredients.map((ing) => ing.ingredientId);
        const newIds = newValue.map((ing) => ing.ingredientId);

        // בדוק אם יש שינוי ברכיבים (הוספה, הסרה או שינוי סוג)
        const hasIngredientChanges =
          currentIds.length !== newIds.length ||
          currentIds.some((id) => !newIds.includes(id)) ||
          newIds.some((id) => !currentIds.includes(id));

        if (hasIngredientChanges) {
          // עדכן את כל הגדלים
          updatedSizes.forEach((size, sizeIndex) => {
            const sizeIngredients = size.ingredients || [];

            // עדכן את הרכיבים בגודל הנוכחי
            if (sizeIndex === index) {
              size.ingredients = newValue?.map((e) => ({
                ingredientId: e.ingredientId,
                quantity: e.quantity,
                unit: getIngredientById(e.ingredientId)?.unit || "units",
              }));
            } else {
              // בשאר הגדלים - שמור על הכמויות הקיימות ועדכן רק רכיבים חדשים
              const updatedIngredients = newValue.map((newIng) => {
                // חפש את הרכיב הקיים בגודל הנוכחי
                const existingIng = sizeIngredients.find(
                  (ing) => ing.ingredientId === newIng.ingredientId
                );

                return {
                  ingredientId: newIng.ingredientId,
                  quantity: existingIng ? existingIng.quantity : null,
                  unit:
                    newIng.unit ||
                    getIngredientById(newIng.ingredientId)?.unit ||
                    "units", // הוסף את ה-unit של הרכיב החדש
                };
              });

              size.ingredients = updatedIngredients;
            }
          });
        } else {
          // אם זה רק שינוי בכמות, עדכן רק את הגודל הספציפי
          updatedSizes[index].ingredients = newValue;
        }
      } else {
        // עבור שדות אחרים (מחיר, זמן הכנה וכו'), עדכן רק את הגודל הספציפי
        updatedSizes[index][field] = newValue;
      }

      onChange(updatedSizes);
    };

    const handleRemoveSize = (index) => {
      if (!value || value.length === 0) {
        onChange([]);
        return;
      }

      if (value.length === 1) {
        onChange([]);
      } else {
        const updatedSizes = [...value];
        updatedSizes.splice(index, 1);
        onChange(updatedSizes);
      }
    };

    useImperativeHandle(ref, () => ({
      handleAddSize,
    }));

    if (!value || !Array.isArray(value)) {
      return null;
    }

    return (
      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0 4px" }}>
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          }}
        >
          {value.map((size, index) => (
            <div
              className={size.idNew === newSizeId ? "highlight-new" : ""}
              key={index}
              style={{
                border: "1px solid #e6e6e6",
                borderRadius: "8px",
                padding: "16px",
                background: "#fafafa",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "12px" }}
              >
                <Input
                  value={size.label}
                  onChange={(e) =>
                    handleUpdateSize(index, "label", e.target.value)
                  }
                  placeholder="שם הגודל"
                  size="middle"
                  style={{ width: "auto", minWidth: "200px" }}
                  status={errors[`size_${index}_label`] ? "error" : ""}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveSize(index)}
                />
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="מחיר" style={{ marginBottom: 8 }}>
                    <InputNumber
                      value={size.price}
                      onChange={(value) =>
                        handleUpdateSize(index, "price", value)
                      }
                      placeholder="מחיר"
                      style={{ width: "100%" }}
                      status={errors[`size_${index}_price`] ? "error" : ""}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="זמן הכנה (דקות)"
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      value={size.preparationTime}
                      onChange={(value) =>
                        handleUpdateSize(index, "preparationTime", value)
                      }
                      placeholder="זמן הכנה"
                      style={{ width: "100%" }}
                      status={errors[`size_${index}_time`] ? "error" : ""}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ marginTop: 8 }}>
                <IngredientsManager
                  value={size.ingredients}
                  onChange={(ingredients) =>
                    handleUpdateSize(index, "ingredients", ingredients)
                  }
                  ingredientsArr={ingredientsArr}
                  errors={errors}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default SizesManager;
