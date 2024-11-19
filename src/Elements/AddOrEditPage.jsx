import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, InputNumber, Typography, Row, Col, Divider } from 'antd';

const { Option } = Select;
const { Text } = Typography;

export default function DynamicFormPage({
    mode = "view", // view, add, edit
    fields = [], // רשימת מפתחות שמגדירה את כל השדות
    onSubmit,
    initialValues = {},
    onClose,
    tableKeys
}) {
    const [form] = AntdForm.useForm();

    const [selectedUnit, setSelectedUnit] = useState(initialValues.unit || null);
    const [selectedSubUnit, setSelectedSubUnit] = useState(initialValues.subUnit || null);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setSelectedUnit(initialValues.unit);
            setSelectedSubUnit(initialValues.subUnit || "kg");
        }
    }, [initialValues, form]);


    const handleFinish = (values) => {
        let normalizedQuantity = values.quantity;

        // אם המשתמש בחר גרם או מ"ל, ממירים לק"ג או ליטר
        if (values.subUnit === "g" || values.subUnit === "ml") {
            normalizedQuantity = values.quantity / 1000;
        }

        const normalizedValues = {
            ...values,
            quantity: normalizedQuantity, // שמירה ביחידות סטנדרטיות
        };

        onSubmit && onSubmit(normalizedValues);
        form.resetFields();
        onClose && onClose();
    };

    if (mode === "view") {
        return (
            <Card
                style={{
                    // borderRadius: "10px",
                    // boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    // padding: "16px",
                }}
            >
                <Typography.Title level={4} style={{ marginBottom: "16px" }}>
                    פרטי הרכיב
                </Typography.Title>
                <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                    <Text strong style={{ fontSize: "1.5em" }}>{initialValues?.name}</Text>
                    {tableKeys?.find((e) => e.key === "type")?.render("", initialValues)}
                </Row>
                {tableKeys?.filter((e) => e.key !== "type" && e?.key !== "name").map((field, i, arr) => (
                    <>
                        <div key={field.key} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                            <Text strong>{field.title}:</Text>
                            <Text style={{ marginLeft: "8px" }}>
                                {initialValues[field.key] || "—"}
                            </Text>
                        </div>
                        {i < arr?.length - 1 && <Divider style={{ margin: "8px 0" }} />}
                    </>
                ))}
            </Card>
        );
    }

    return (
        <Card >
            <AntdForm
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={initialValues}
            >
                {fields.map((field) => {
                    const { key, title, type, options, rules, props, hiddenInForm, coin, divider } = field;

                    if (hiddenInForm) return null; // הסתרת שדה אם הוא מוגדר כ"לא מוצג"

                    switch (type) {
                        case "text":
                            return (
                                <>
                                    <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                        <Input {...props} />
                                    </AntdForm.Item>
                                    {divider && <Divider style={{ margin: "0.2em" }} />}
                                </>
                            );
                        case "number":
                            return (
                                <>
                                    <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                        <InputNumber
                                            suffix={coin && "₪"}
                                            min={0}
                                            step={0.01}
                                            style={{ width: "100%" }}
                                            {...props}
                                        />
                                    </AntdForm.Item>
                                    {divider && <Divider style={{ margin: "0.2em" }} />}
                                </>
                            );
                        case "select":
                            return (
                                <>
                                    <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                        <Select {...props}
                                            onChange={(value) => {
                                                if (key === "unit") {
                                                    setSelectedUnit(value); // עדכון state של unit
                                                    form.setFieldsValue({ subUnit: undefined }); // איפוס שדה יחידת המשנה
                                                }
                                            }}
                                        >
                                            {options.map((option) => (
                                                <Option key={option.value} value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </AntdForm.Item>
                                    {/* תפריט לבחירת יחידת משנה אם unit הוא weight או volume */}
                                    {key === "unit" && (selectedUnit === "weight" || selectedUnit === "volume") && (
                                        <AntdForm.Item
                                            name="subUnit"
                                            label={
                                                selectedUnit === "weight"
                                                    ? "בחר יחידת משקל (ק\"ג / גרם)"
                                                    : "בחר יחידת נפח (ליטר / מ\"ל)"
                                            }
                                            rules={[{ required: true, message: "אנא בחר יחידת משנה" }]}
                                        >
                                            <Select>
                                                {selectedUnit === "weight" ? (
                                                    <>
                                                        <Option value="kg">ק"ג</Option>
                                                        <Option value="g">גרם</Option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Option value="liter">ליטר</Option>
                                                        <Option value="ml">מ"ל</Option>
                                                    </>
                                                )}
                                            </Select>
                                        </AntdForm.Item>
                                    )}
                                    {divider && <Divider style={{ margin: "0.2em" }} />}
                                </>
                            );
                        case "custom":
                            return (
                                <>
                                    {/* <AntdForm.Item key={key} name={key} label={title} rules={rules}> */}
                                        {field.render && field.render(form)}
                                    {/* </AntdForm.Item> */}
                                    {divider && <Divider style={{ margin: "0.2em" }} />}
                                </>
                            );
                        default:
                            return null;
                    }
                })}

                {mode !== "view" && (
                    <AntdForm.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                            {mode === "add" ? "הוסף" : "עדכן"}
                        </Button>
                    </AntdForm.Item>
                )}
            </AntdForm>
        </Card>
    );
}
