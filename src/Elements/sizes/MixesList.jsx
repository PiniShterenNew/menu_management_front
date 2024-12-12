import React from "react";
import { Row, Col, Button, Form, Select, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const MixesList = ({ sizes, mixes, add, remove, form, fields, index, onChange, getUnitDisplay }) => (
    <>
        <Button type="dashed" style={{ marginBottom: "0.5vw" }} onClick={() => add()}>
            הוסף מיקס
        </Button>
        <div style={{ maxHeight: "12vw", overflowY: "auto", overflowX: "hidden" }}>
            {fields.map(({ key, name, fieldKey }) => (
                <Row key={key} gutter={16}>
                    <Col span={10}>
                        <Form.Item
                            name={[name, "mixId"]}
                            fieldKey={[fieldKey, "mixId"]}
                            rules={[{ required: true, message: "בחר מיקס" }]}
                        >
                            <Select
                                placeholder="בחר מיקס"
                                showSearch
                                filterOption={(input, option) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                }
                                options={mixes.map((mix) => ({
                                    value: mix._id,
                                    label: mix.name,
                                    unit: mix?.unit
                                }))}
                                onChange={(mixValue) => {
                                    // מציאת מיקס שנבחר
                                    const selectedIngredient = mixes.find((ing) => ing._id === mixValue);

                                    // יצירת עותק מעודכן של ה-sizes
                                    const updatedSizes = [...sizes];

                                    // עדכון הערכים הנוכחיים של הטופס
                                    const currentValues = form.getFieldValue(["sizes", index, "mixes"]);

                                    // עדכון השדה של המרכיב עם unit חדש
                                    currentValues[name] = {
                                        ...currentValues[name],
                                        unit: selectedIngredient?.unit || "weight",
                                    };

                                    // שמירת ערך `edit` הנוכחי בגודל
                                    updatedSizes[index] = {
                                        ...updatedSizes[index],
                                        mixes: currentValues,
                                        edit: updatedSizes[index]?.edit || false, // שמירה על מצב עריכה
                                    };

                                    // עדכון הערך ב-sizes
                                    updatedSizes[index]["mixes"] = currentValues;
                                    // עדכון ה-state והטופס
                                    onChange(updatedSizes); // עדכון ב-parent
                                    form.setFieldsValue({ sizes: updatedSizes }); // עדכון הטופס
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name={[name, "quantity"]}
                            fieldKey={[fieldKey, "quantity"]}
                            rules={[{ required: true, message: "הזן כמות" }]}
                        >
                            <InputNumber
                                onChange={(value) => {
                                    // עדכון הכמות ב-state
                                    const updatedSizes = [...sizes];
                                    const currentValues = form.getFieldValue(["sizes", index, "mixes"]);

                                    currentValues[name] = {
                                        ...currentValues[name],
                                        quantity: value,
                                    };

                                    updatedSizes[index] = {
                                        ...updatedSizes[index],
                                        mixes: currentValues,
                                        edit: updatedSizes[index]?.edit || false,
                                    };

                                    onChange(updatedSizes);
                                    form.setFieldsValue({ sizes: updatedSizes });
                                }}
                                addonAfter={getUnitDisplay(form.getFieldValue(["sizes", index, "mixes", name, "unit"]) || "")} />
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

export default MixesList;
