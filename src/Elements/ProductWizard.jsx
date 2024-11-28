import {
  Steps,
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Typography,
  Alert,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SizesManager from "./SizesManager.jsx";
import VariationsManager from "./VariationsManager";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faRuler, faShuffle } from "@fortawesome/free-solid-svg-icons";

const { Step } = Steps;
const { Title, Text } = Typography;

const ProductWizard = ({
  mode = "add", // "add" or "edit"
  tableKeys,
  ingredientsArr,
  fields,
  initialValues = {},
  onSubmit,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [productData, setProductData] = useState({
    name: initialValues.name || "",
    category: initialValues.category || "",
    sizes: initialValues.sizes || [],
    variations: initialValues.variations || [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const sizesManagerRef = useRef();
  const variationsManagerRef = useRef();

  const ingredientsState = useSelector((state) => state.ingredients);
  const ingredientsList = ingredientsArr || ingredientsState;

  const validateStep = () => {
    const errors = {};

    // בדיקת שלב פרטי מוצר
    if (currentStep === 0) {
      if (!productData.name || productData.name.trim() === "") {
        errors.name = "חובה להזין שם מוצר";
      }
      if (!productData.category) {
        errors.category = "חובה לבחור קטגוריה";
      }
    }

    // בדיקת שלב גדלים
    if (currentStep === 1) {
      if (!productData.sizes || productData.sizes.length === 0) {
        errors.sizes = "חובה להוסיף לפחות גודל אחד";
      } else {
        productData.sizes.forEach((size, index) => {
          if (!size.label || size.label.trim() === "") {
            errors[`size_${index}_label`] = "חובה להזין שם לגודל";
          }
          if (size.price === undefined || size.price <= 0) {
            errors[`size_${index}_price`] = "חובה להזין מחיר חיובי";
          }
          if (size.preparationTime === undefined || size.preparationTime <= 0) {
            errors[`size_${index}_time`] = "חובה להזין זמן הכנה חיובי";
          }

          // בדיקת רכיבים
          if (!size.ingredients || size.ingredients.length === 0) {
            errors[`size_${index}_ingredients`] = "חובה להוסיף לפחות רכיב אחד";
          } else {
            size.ingredients.forEach((ingredient, ingredientIndex) => {
              const errorPrefix = `size_${index}_ingredient_${ingredientIndex}`;
              if (!ingredient.ingredientId) {
                errors[`${errorPrefix}_id`] = "חובה לבחור רכיב";
              }
              if (
                ingredient.quantity === undefined ||
                ingredient.quantity <= 0
              ) {
                errors[`${errorPrefix}_amount`] = "חובה להזין כמות חיובית";
              }
            });
          }
        });
      }
    }

    // בדיקת שלב וריאציות
    if (
      currentStep === 2 &&
      productData.variations &&
      productData.variations.length > 0
    ) {
      productData.variations.forEach((variation, index) => {
        if (!variation.label || variation.label.trim() === "") {
          errors[`variation_${index}_label`] = "חובה להזין שם לוריאציה";
        }

        // בדיקת רכיבים בוריאציות
        if (variation.ingredients && variation.ingredients.length > 0) {
          variation.ingredients.forEach((ingredient, ingredientIndex) => {
            const errorPrefix = `variation_${index}_ingredient_${ingredientIndex}`;
            if (!ingredient.ingredientId) {
              errors[`${errorPrefix}_id`] = "חובה לבחור רכיב";
            }
            if (ingredient.quantity === undefined || ingredient.quantity <= 0) {
              errors[`${errorPrefix}_amount`] = "חובה להזין כמות חיובית";
            }
          });
        }

        // בדיקת התאמות גדלים
        if (variation.sizeAdjustments) {
          Object.entries(variation.sizeAdjustments).forEach(
            ([sizeLabel, adjustment], adjustmentIndex) => {
              if (adjustment.ingredients && adjustment.ingredients.length > 0) {
                adjustment.ingredients.forEach(
                  (ingredient, ingredientIndex) => {
                    const errorPrefix = `variation_${index}_size_${adjustmentIndex}_ingredient_${ingredientIndex}`;
                    if (!ingredient.ingredientId) {
                      errors[`${errorPrefix}_id`] = "חובה לבחור רכיב";
                    }
                    if (
                      ingredient.quantity === undefined ||
                      ingredient.quantity <= 0
                    ) {
                      errors[`${errorPrefix}_amount`] =
                        "חובה להזין כמות חיובית";
                    }
                  }
                );
              }
            }
          );
        }
      });
    }

    console.log("Validation Errors:", errors); // לדיבוג
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setShowErrors(true);
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      setShowErrors(false);
    }
  };

  const transformProductObject = (productData) => {
    const sizes = productData?.sizes;

    const transformedVariations = productData.variations.map((variation) => {
      const sizeAdjustments = Object.entries(variation.sizeAdjustments).map(
        ([sizeLabel, adjustment]) => {
          const existingSize = sizes.find((size) => size.label === sizeLabel);
          const existingIngredients = existingSize
            ? existingSize.ingredients
            : [];

          const addIngredients = adjustment.ingredients.filter(
            (ingredient) =>
              !existingIngredients.some(
                (existing) => existing.ingredientId === ingredient.ingredientId
              )
          );

          const removeIngredients = existingIngredients.filter(
            (existing) =>
              !adjustment.ingredients.some(
                (ingredient) =>
                  ingredient.ingredientId === existing.ingredientId
              )
          );

          const updateIngredients = adjustment.ingredients.filter(
            (ingredient) =>
              existingIngredients.some(
                (existing) =>
                  existing.ingredientId === ingredient.ingredientId &&
                  existing.quantity !== ingredient.quantity
              )
          );

          const mixAdjustments = {
            add: [], // יש למלא לפי דרישה
            remove: [], // יש למלא לפי דרישה
            update: [], // יש למלא לפי דרישה
          };

          return {
            size: sizeLabel,
            priceAdjustment: adjustment.priceAdjustment || 0,
            ingredientAdjustments: {
              add: addIngredients.map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
              })),
              remove: removeIngredients.map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
              })),
              update: updateIngredients.map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                quantity: ingredient.quantity,
              })),
            },
            mixAdjustments,
          };
        }
      );

      return {
        label: variation.label,
        sizeAdjustments,
      };
    });

    return { ...productData, variations: transformedVariations };
  };

  const handleFinish = () => {
    setShowErrors(true);
    if (validateStep()) {
      onSubmit(transformProductObject(productData));
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setShowErrors(false);
    setFormErrors({});
  };

  const getStepStatus = () => {
    if (showErrors && Object.keys(formErrors).length > 0) {
      return "error";
    }
    return "process";
  };

  const handleFieldChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: JSON.parse(JSON.stringify(value)), // יצירת העתק עמוק של המערך
    }));
    if (!showErrors) {
      setFormErrors({});
    }
  };

  const renderProductDetails = () => (
    <Form layout="vertical" initialValues={productData}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="שם המוצר"
            required
            validateStatus={showErrors && formErrors.name ? "error" : ""}
            help={showErrors && formErrors.name}
          >
            <Input
              value={productData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="הכנס שם מוצר"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="קטגוריה"
            required
            validateStatus={showErrors && formErrors.category ? "error" : ""}
            help={showErrors && formErrors.category}
          >
            <Select
              value={productData.category}
              onChange={(category) => handleFieldChange("category", category)}
              placeholder="בחר קטגוריה"
            >
              {tableKeys
                ?.find((e) => e.key === "category")
                ?.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="תיאור">
            <Input.TextArea
              value={productData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="הכנס תיאור מוצר"
              rows={4}
              maxLength={100}
              showCount
              style={{ resize: "none" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const renderSizesAndIngredients = () => (
    <SizesManager
      ref={sizesManagerRef}
      value={productData.sizes}
      onChange={(sizes) => handleFieldChange("sizes", sizes)}
      ingredientsArr={ingredientsList}
      errors={showErrors ? formErrors : {}}
    />
  );

  const renderVariations = () => (
    <VariationsManager
      ref={variationsManagerRef}
      value={productData.variations}
      onChange={(variations) => handleFieldChange("variations", variations)}
      sizes={productData.sizes}
      ingredientsList={ingredientsList}
      errors={showErrors ? formErrors : {}}
    />
  );

  const steps = [
    {
      title: "פרטי מוצר",
      content: renderProductDetails(),
    },
    {
      title: "גדלים ורכיבים",
      content: renderSizesAndIngredients(),
    },
    {
      title: "וריאציות",
      content: renderVariations(),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Steps
        current={currentStep}
        items={steps}
        style={{ marginBottom: "24px" }}
        status={getStepStatus()}
      />
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "24px",
          background: "#fff",
          minHeight: "400px",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "24px" }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {steps[currentStep].title}
          </Typography.Title>
          {currentStep === 1 && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => sizesManagerRef.current?.handleAddSize()}
              size="middle"
            />
          )}
          {currentStep === 2 && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => variationsManagerRef.current?.handleAddVariation()}
              size="middle"
            />
          )}
        </Row>

        <div>
          {showErrors && Object.keys(formErrors).length > 0 && (
            <Alert
              message="שגיאות נמצאו"
              description={
                <ul style={{ margin: 0, paddingInlineStart: "20px" }}>
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              }
              type="error"
              showIcon
              style={{ marginBottom: "16px" }}
            />
          )}

          {currentStep === 0 && renderProductDetails()}
          {currentStep === 1 && (
            <>
              {showErrors && formErrors.sizes && (
                <Alert
                  message={formErrors.sizes}
                  type="error"
                  showIcon
                  style={{ marginBottom: "16px" }}
                />
              )}
              {renderSizesAndIngredients()}
            </>
          )}
          {currentStep === 2 && renderVariations()}
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {currentStep > 0 && <Button onClick={handlePrev}>הקודם</Button>}
        <div style={{ marginLeft: "auto" }}>
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              הבא
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={handleFinish}>
              סיום
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductWizard;
