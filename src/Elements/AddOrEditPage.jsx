import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, InputNumber, Typography, Row, Col, Divider, Flex } from 'antd';
import IngredientsManager from "./IngredientsManager";

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

export default function DynamicFormPage({
    mode = "view", // view, add, edit
    fields = [], // רשימת מפתחות שמגדירה את כל השדות
    onSubmit,
    initialValues = {},
    onClose,
    tableKeys,
    ingredientsArr
}) {
    const [form] = AntdForm.useForm();

    const [selectedUnit, setSelectedUnit] = useState(initialValues.unit || null);
    const [selectedSubUnit, setSelectedSubUnit] = useState(initialValues.subUnit || null);

    useEffect(() => {
        if (initialValues) {
            const normalizedQuantity = initialValues.quantity < 1
                ? initialValues.quantity * 1000
                : initialValues.quantity;

            form.setFieldsValue({
                ...initialValues,
                quantity: normalizedQuantity,
            });
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
                    {tableKeys?.find((e) => e.key === "type")?.render("", initialValues, "view")}
                </Row>
                {tableKeys?.filter((e) => e.key !== "type" && e?.key !== "name").map((field, i, arr) => (
                    <>
                        <div key={field.key} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Flex flex={1}>
                                <Text strong>{field.title}:</Text>
                            </Flex>
                            <Flex flex={1}>
                                <p style={{}}>
                                    {(field?.render && field?.render("", initialValues, mode, "view")) || initialValues[field.key] || "—"}
                                </p>
                            </Flex>
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
                                    <AntdForm.Item key={key} name={key} label={title}
                                        rules={rules?.map((rule) =>
                                            rule.validator
                                                ? {
                                                    ...rule,
                                                    validator: (ruleContext, value) =>
                                                        rule.validator(ruleContext, value, initialValues),
                                                }
                                                : rule
                                        )}
                                    >
                                        <InputNumber
                                            suffix={coin && "₪"}
                                            min={0}
                                            style={{ width: "100%" }}
                                            {...props}
                                        />
                                    </AntdForm.Item>
                                    {divider && <Divider style={{ margin: "0.2em" }} />}
                                </>
                            );
                        case "float":
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
                                            showSearch
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
                                    {key === "unit" && (form.getFieldValue("unit") === "weight" || form.getFieldValue("unit") === "volume") && (
                                        <AntdForm.Item
                                            name="subUnit"

                                            initialValue={
                                                form.getFieldValue("subUnit") || // ערך שהוזן בטופס
                                                (form.getFieldValue("unit") === "weight" ? // חישוב יחידת משנה למשקל
                                                    (initialValues?.quantity >= 1 ? "kg" : "g") :
                                                    (form.getFieldValue("unit") === "volume" ? // חישוב יחידת משנה לנפח
                                                        (initialValues?.quantity >= 1 ? "liter" : "ml") :
                                                        undefined)
                                                )
                                            }
                                            label={
                                                form.getFieldValue("unit") === "weight"
                                                    ? "בחר יחידת משקל (ק\"ג / גרם)"
                                                    : "בחר יחידת נפח (ליטר / מ\"ל)"
                                            }
                                            rules={[{ required: true, message: "אנא בחר יחידת משנה" },]}
                                        >
                                            <Select
                                                onChange={(value) => form.setFieldsValue({ subUnit: value })}
                                            >
                                                {form.getFieldValue("unit") === "weight" ? (
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
                        case "ingredientsManager":
                            return (
                                <>
                                    <Divider style={{ margin: "0.5em" }} />
                                    <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                        <IngredientsManager
                                            value={form.getFieldValue(key)}
                                            onChange={(newValue) => form.setFieldsValue({ [key]: newValue })}
                                            fields={field?.fields} // העברת האופציות של רכיבים
                                            ingredientsArr={ingredientsArr}
                                        />
                                    </AntdForm.Item>
                                </>
                            );
                        case "custom":
                            return (
                                <>
                                    {/* <AntdForm.Item key={key} name={key} label={title} rules={rules}> */}
                                    {field.render && field.render("", initialValues, "edit", form)}
                                    {/* </AntdForm.Item> */}
                                    {divider && <Divider style={{ margin: "0.2em" }} />}
                                </>
                            );
                        case "textArea":
                            return (
                                <>
                                    <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                        <TextArea style={{ resize: 'none', }} showCount maxLength={field?.maxLength} />
                                    </AntdForm.Item>
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
