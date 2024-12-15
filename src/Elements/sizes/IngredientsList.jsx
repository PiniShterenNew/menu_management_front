import React from "react";
import { Row, Col, Button, Form, Select, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const IngredientsList = ({
    sizes,
    ingredients,
    add,
    remove,
    form,
    fields,
    indexSize,
    onChange,
    getUnitDisplay
}) => (
    <>
        <Button type="dashed" style={{ marginBottom: "0.5vw" }} onClick={() => add()}>
            הוסף מרכיב
        </Button>
        <div style={{ maxHeight: "12vw", overflowY: "auto", overflowX: "hidden", marginTop: "2vh", padding: "0 1.5vw" }}>
            {fields.map(({ key, name, fieldKey }) => (
                <Row key={key} gutter={16}>
                    <Col span={10}>
                        <Form.Item
                            name={[name, "ingredientId"]}
                            rules={[{ required: true, message: "בחר רכיב" }]}
                        >
                            <Select
                                placeholder="בחר רכיב"
                                showSearch
                                filterOption={(input, option) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                }
                                options={ingredients.map((ing) => ({
                                    value: ing._id,
                                    label: ing.name,
                                    unit: ing?.unit
                                }))}
                                onChange={(ingredientValue, e) => {
                                    // מציאת הרכיב שנבחר
                                    const selectedIngredient = ingredients.find((ing) => ing._id === ingredientValue);

                                    // יצירת עותק מעודכן של ה-sizes
                                    const updatedSizes = [...sizes];
                                    // עדכון הערכים הנוכחיים של הטופס
                                    const currentValues = form.getFieldValue("ingredients");

                                    // עדכון השדה של המרכיב עם unit חדש
                                    currentValues[name] = {
                                        ...e,
                                        unit: selectedIngredient?.unit || "",
                                    };

                                    // שמירת ערך `edit` הנוכחי בגודל
                                    updatedSizes[indexSize] = {
                                        ...updatedSizes[indexSize],
                                        edit: updatedSizes[indexSize]?.edit || false, // שמירה על מצב עריכה
                                    };

                                    // עדכון ה-state והטופס
                                    onChange(updatedSizes); // עדכון ב-parent
                                    form.setFieldsValue({ ...updatedSizes[indexSize] }); // עדכון הטופס
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name={[name, "quantity"]}
                            rules={[{ required: true, message: "הזן כמות" }]}
                        >
                            <InputNumber
                                onChange={(value) => {
                                    // עדכון הכמות ב-state
                                    const updatedSizes = [...sizes];
                                    const currentValues = form.getFieldValue("ingredients");

                                    // עדכון הערך של השדה הנוכחי
                                    currentValues[name] = {
                                        ...currentValues[name],
                                        quantity: value,
                                    };

                                    updatedSizes[indexSize] = {
                                        ...currentValues,
                                        edit: updatedSizes[indexSize]?.edit || false,
                                    };

                                    onChange(updatedSizes);
                                    form.setFieldsValue({ ...updatedSizes[indexSize] });
                                }}
                                addonAfter={getUnitDisplay(form.getFieldValue(["ingredients", name, "unit"]) || "")} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button
                            type="text"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => remove(name)}
                        />
                    </Col>
                </Row>
            ))}
        </div>
    </>
);

export default IngredientsList;
