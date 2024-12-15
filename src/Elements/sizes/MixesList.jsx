import React from "react";
import { Row, Col, Button, Form, Select, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const MixesList = ({
    sizes,
    mixes,
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
            הוסף מיקס
        </Button>
        <div style={{ maxHeight: "12vw", overflowY: "auto", overflowX: "hidden", marginTop: "2vh", padding: "0 1.5vw" }}>
            {fields.map(({ key, name, fieldKey }) => (
                <Row key={key} gutter={16}>
                    <Col span={10}>
                        <Form.Item
                            name={[name, "mixId"]}
                            rules={[{ required: true, message: "בחר מיקס" }]}
                        >
                            <Select
                                placeholder="בחר מיקס"
                                showSearch
                                filterOption={(input, option) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                }
                                options={mixes}
                                onChange={(mixValue, e) => {
                                    // מציאת מיקס שנבחר
                                    const selectedMix = mixes.find((ing) => ing._id === mixValue);

                                    // יצירת עותק מעודכן של ה-sizes
                                    const updatedSizes = [...sizes];

                                    // עדכון הערכים הנוכחיים של הטופס
                                    const currentValues = form.getFieldValue("mixes");

                                    // עדכון השדה של המרכיב עם unit חדש
                                    currentValues[name] = {
                                        ...e,
                                        unit: selectedMix?.unit || "weight",
                                    };

                                    // שמירת ערך `edit` הנוכחי בגודל
                                    updatedSizes[indexSize] = {
                                        ...updatedSizes[indexSize],
                                        mixes: currentValues,
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
                                    const currentValues = form.getFieldValue("mixes");

                                    currentValues[name] = {
                                        ...currentValues[name],
                                        quantity: value,
                                    };

                                    updatedSizes[indexSize] = {
                                        ...updatedSizes[indexSize],
                                        mixes: currentValues,
                                        edit: updatedSizes[indexSize]?.edit || false,
                                    };

                                    onChange(updatedSizes);
                                    form.setFieldsValue({ ...updatedSizes[indexSize] });

                                }}
                                addonAfter={getUnitDisplay(form.getFieldValue(["mixes", name, "unit"]) || "")} />
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
