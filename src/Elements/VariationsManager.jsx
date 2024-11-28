import React, { forwardRef, useImperativeHandle } from "react";
import {
  Button,
  Input,
  InputNumber,
  Row,
  Col,
  Form,
  Typography,
  Select,
  Divider,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import IngredientsManager from "./IngredientsManager";

const { Text } = Typography;

const VariationsManager = forwardRef(
  ({ value = [], sizes = [], onChange, ingredientsList, errors = {} }, ref) => {
    const handleAddVariation = () => {
      const newVariation = {
        label: `וריאציה ${value.length + 1}`,
        description: "",
        sizeAdjustments: sizes.reduce((acc, size) => {
          acc[size.label] = {
            ingredients: size?.ingredients,
          };
          return acc;
        }, {}),
      };
      onChange([newVariation, ...value]);
    };

    const getIngredientById = (ingredientId) => {
      return ingredientsList?.find(
        (ingredient) => ingredient._id === ingredientId
      );
    };

    const handleUpdateVariation = (index, field, newValue) => {
      const updatedVariations = [...value];
      updatedVariations[index][field] = newValue;
      onChange(updatedVariations);
    };

    const handleUpdateSizeAdjustment = (
      variationIndex,
      sizeLabel,
      field,
      newValue
    ) => {
      const updatedVariations = JSON.parse(JSON.stringify(value)) || [];
      const currentVariation = updatedVariations[variationIndex];

      // עדכון הרכיבים בכל הגדלים של הוריאציה הנוכחית
      Object.keys(currentVariation.sizeAdjustments).forEach((sizeName) => {
        if (!currentVariation.sizeAdjustments[sizeName]) {
          currentVariation.sizeAdjustments[sizeName] = {};
        }

        if (sizeName === sizeLabel) {
          currentVariation.sizeAdjustments[sizeName][field] = newValue;
        } else {
          const existingIngredients =
            currentVariation.sizeAdjustments[sizeName][field] || [];

          // עדכן את הרכיבים הקיימים ושמור על הכמויות
          const updatedIngredients = newValue.map((newIng) => {
            // נסה למצוא את הרכיב הקיים במיקום המתאים
            const existingIndex = existingIngredients.findIndex(
              (existIng) => existIng.ingredientId === newIng.ingredientId
            );

            if (existingIndex !== -1) {
              // אם הרכיב קיים, שמור על הכמות שלו
              return {
                ...newIng,
                quantity: existingIngredients[existingIndex].quantity,
              };
            }

            // אם זה רכיב חדש, השאר את הכמות null והוסף unit
            return {
              ...newIng,
              quantity: null,
              unit:
                newIng.unit ||
                getIngredientById(newIng.ingredientId)?.unit ||
                "units", // השתמש בערך ה-unit של הרכיב החדש
            };
          });

          currentVariation.sizeAdjustments[sizeName][field] =
            updatedIngredients;
        }
      });

      onChange(updatedVariations);
    };

    const handleRemoveVariation = (index) => {
      const updatedVariations = [...value];
      updatedVariations.splice(index, 1);
      onChange(updatedVariations);
    };

    useImperativeHandle(ref, () => ({
      handleAddVariation,
    }));

    if (!value) return null;

    return (
      <div style={{ maxHeight: "600px", overflowY: "auto", padding: "0 4px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {value.map((variation, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e6e6e6",
                borderRadius: "8px",
                padding: "16px",
                background: "#fafafa",
              }}
            >
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "12px" }}
              >
                <Col>
                  <Form.Item
                    style={{ margin: 0 }}
                    validateStatus={
                      errors[`variation_${index}_label`] ? "error" : ""
                    }
                    help={errors[`variation_${index}_label`]}
                  >
                    <Input
                      value={variation.label}
                      onChange={(e) =>
                        handleUpdateVariation(index, "label", e.target.value)
                      }
                      placeholder="שם הוריאציה"
                      size="middle"
                      style={{ width: "auto", minWidth: "200px" }}
                    />
                  </Form.Item>
                </Col>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveVariation(index)}
                />
              </Row>
              <Form.Item>
                <Input.TextArea
                  value={variation.description}
                  onChange={(e) =>
                    handleUpdateVariation(index, "description", e.target.value)
                  }
                  placeholder="תיאור הוריאציה"
                  rows={2}
                  maxLength={100}
                  showCount
                  style={{ resize: "none" }}
                />
              </Form.Item>
              {sizes.length > 0 && (
                <>
                  <Divider orientation="left">התאמות לפי גודל</Divider>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {sizes.map((size) => {
                      const sizeAdjustment =
                        variation.sizeAdjustments?.[size.label];
                      return (
                        <div
                          key={size.label}
                          style={{
                            border: "1px solid #f0f0f0",
                            borderRadius: "6px",
                            padding: "12px",
                            background: "#fff",
                          }}
                        >
                          <Typography.Title
                            level={5}
                            style={{ margin: "0 0 8px 0" }}
                          >
                            {size.label}
                          </Typography.Title>
                          <IngredientsManager
                            value={sizeAdjustment?.ingredients || []}
                            onChange={(ingredients) =>
                              handleUpdateSizeAdjustment(
                                index,
                                size.label,
                                "ingredients",
                                ingredients
                              )
                            }
                            ingredientsArr={ingredientsList}
                            errors={errors}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default VariationsManager;
