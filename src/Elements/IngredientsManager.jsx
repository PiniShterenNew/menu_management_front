import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Row, Col, Select, InputNumber, Typography, Card, Form, Flex, List } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const { Text } = Typography;

const IngredientsManager = ({
  value = [],
  onChange,
  ingredientsArr = [],
  fields,
  add,
  remove,
  form
}) => {

  const [editingIndex, setEditingIndex] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");

  const cardRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.scroll({
          top: cardRef.current.scrollHeight,
          behavior: 'smooth',
          duration: 2000
        });
      }
    }, 1000)
  }, [cardRef.current?.scrollHeight]);


  const handleIngredientSelect = (value, option) => {
    const currentValues = form.getFieldValue("ingredients") || [];
    const updatedValues = [...currentValues];

    updatedValues[editingIndex] = {
      ...updatedValues[editingIndex],
      ingredientId: value,
      unit: option.unit,
      name: option.label
    };

    // form.setFieldsValue({ ...updatedValues });
    setSelectedUnit(option.unit);
  };

  const handleQuantityChange = (value) => {
    const currentValues = form.getFieldValue("ingredients") || [];
    const updatedValues = [...currentValues];

    updatedValues[editingIndex] = {
      ...updatedValues[editingIndex],
      quantity: value
    };

    // form.setFieldsValue({ ...updatedValues });
  };

  const handleAddIngredient = () => {
    const currentIngredients = getCurrentIngredients(); // מקבל את הערכים הנוכחיים מה-Form
    const newIngredient = currentIngredients[editingIndex]; // לוקח את המרכיב החדש שמתווסף

    // בדיקה אם הערך החדש תקין
    if (!newIngredient || !newIngredient.ingredientId || !newIngredient.quantity) {
      return;
    }

    // הוספת שם הרכיב לפי הבחירה מ-ingredientsArr
    const selectedIngredient = ingredientsArr.find((ing) => ing._id === newIngredient.ingredientId);
    const updatedIngredient = {
      ...newIngredient,
      name: selectedIngredient?.name || "---", // שומר את השם אם נמצא
      unit: selectedIngredient?.unit || newIngredient.unit, // עדכון יחידת מידה
    };

    const updatedValue = [...value, updatedIngredient]; // מעדכן את המערך הקיים עם המרכיב החדש
    onChange(updatedValue); // מעדכן את ה-Prop
    setEditingIndex(null); // מסיים את מצב העריכה
    setIsNew(false); // מסיים את מצב המרכיב החדש
  };

  const handleRemoveIngredient = (index) => {
    const updatedValue = value.filter((_, i) => i !== index);
    onChange(updatedValue);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    if (isNew) handleRemoveIngredient(editingIndex);
    setEditingIndex(null);
    setIsNew(false);
  };

  const handleSave = () => setEditingIndex(null);

  const handleFieldChange = (index, key, fieldValue) => {
    const updatedValue = [...value];
    updatedValue[index][key] = fieldValue;

    if (key === "ingredientId") {
      const selectedIngredient = ingredientsArr.find((ing) => ing._id === fieldValue);
      if (selectedIngredient) {
        updatedValue[index].unit = selectedIngredient.unit; // עדכון יחידת מידה
        updatedValue[index].name = selectedIngredient.name; // עדכון שם
      }
    }

    onChange(updatedValue);
  };

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

  const getCurrentIngredients = () => {
    const formIngredients = form?.getFieldValue("ingredients");
    return Array.isArray(formIngredients) ? formIngredients : [];
  };

  useEffect(() => {
    const ingredients = getCurrentIngredients();
    if (ingredients.length > 0) {
      scrollToBottom();
    }
  }, [form?.getFieldValue("ingredients")?.length]);

  return (
    <>
      {/* כפתור הוספה */}
      {isNew ?
        (<Row gutter={16} style={{ marginBottom: "1vw" }}>
          <Col span={10}>
            <Form.Item
              name={[editingIndex, "ingredientId"]}
              rules={[{ required: true, message: "בחר רכיב" }]}
            >
              <Select
                placeholder="בחר רכיב"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                showSearch
                options={ingredientsArr?.map((ing) => ({
                  value: ing._id,
                  label: ing.name,
                  unit: ing.unit
                }))}
                onChange={handleIngredientSelect}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name={[editingIndex, "quantity"]}
              rules={[{ required: true, message: "הזן כמות" }]}
            >
              <InputNumber
                onChange={handleQuantityChange}
                addonAfter={getUnitDisplay(selectedUnit)}
                placeholder="כמות"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button type="text" icon={<FontAwesomeIcon icon={faCheck} />} onClick={handleAddIngredient} />
            <Button type="text" icon={<FontAwesomeIcon icon={faTimes} />} onClick={handleCancelEdit} />
          </Col>
        </Row>)
        :
        (<Button
          type="dashed"
          onClick={() => {
            setEditingIndex(value.length); // מעבר למצב הוספה
            // onChange([...value, { ingredientId: null, quantity: null, unit: null }]);
            setIsNew(true);
          }}
          disabled={editingIndex !== null}
          style={{ marginBottom: "8px" }}
        >
          הוסף מרכיב
        </Button>)}
      <Card ref={cardRef} style={{ margin: "1vw 0", paddingTop: "1vw", maxHeight: "10vw", overflow: "auto" }}>
        {/* רשימת רכיבים */}
        <List
          dataSource={value}
          renderItem={(ingredient, index) => {
            const isEditing = editingIndex === index;
            const selectedIngredient = ingredientsArr.find((ing) => ing._id === ingredient.ingredientId);
            const unitDisplay = getUnitDisplay(ingredient.unit || selectedIngredient?.unit);
            return (
              <List.Item key={index} >
                {isEditing && !isNew ? (
                  <>
                    <Col span={10}>
                      <Form.Item
                        name={[index, "ingredientId"]}
                      >
                        <Select
                          placeholder="בחר רכיב"
                          value={ingredient.ingredientId || null} // גישה ל-_id מתוך ingredientId
                          onChange={(value) => handleFieldChange(index, "ingredientId", value)}
                          options={ingredientsArr.map((ing) => ({
                            value: ing._id, // ID של הרכיב
                            label: ing.name, // שם של הרכיב
                          }))}
                          showSearch
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        name={[index, "quantity"]}
                      >
                        <InputNumber
                          placeholder={`כמות`}
                          // value={ingredient.quantity || null}
                          onChange={(value) => handleFieldChange(index, "quantity", value)}
                          min={0}
                          addonAfter={unitDisplay}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col >
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faCheck} />}
                        onClick={handleSave}
                      />
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faTimes} />}
                        onClick={handleCancelEdit}
                      />
                    </Col>
                  </>
                ) : (
                  <Row style={{ width: "100%" }} align="middle" justify="space-between">
                    <Flex flex={1}>
                      <Text>{ingredient?.name || ingredient?.ingredientData?.name || "---"}</Text>
                    </Flex>
                    <Flex flex={1}>
                      <Text>
                        {ingredient.quantity} {unitDisplay}
                      </Text>
                    </Flex>
                    <Row>
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => setEditingIndex(index)}
                      />
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => handleRemoveIngredient(index)}
                      />
                    </Row>
                  </Row>
                )}
              </List.Item>)
          }}
        />
      </Card>
    </>
  );
};

export default IngredientsManager;
