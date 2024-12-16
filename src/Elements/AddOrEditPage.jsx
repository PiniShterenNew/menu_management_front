import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, InputNumber, Typography, Row, Col, Divider, Flex, Steps, Checkbox } from 'antd';
import IngredientsManager from "./IngredientsManager";
import { DollarCircleOutlined, InfoCircleOutlined, } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

export default function DynamicFormPage({
    mode = "view", // view, add, edit
    fields = [], // רשימת מפתחות שמגדירה את כל השדות
    onSubmit,
    initialValues = {},
    onClose,
    groups,
    tableKeys,
    ingredientsArr
}) {
    const [form] = AntdForm.useForm();

    const [current, setCurrent] = useState(0);
    const [valueObject, setValueObjet] = useState({});
    const [selectedUnit, setSelectedUnit] = useState(initialValues.unit || null);
    const [selectedSubUnit, setSelectedSubUnit] = useState(initialValues.subUnit || null);

    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };
    const description = 'This is a description.';

    const handleFinish = (values) => {
        const currentValues = form.getFieldsValue();
        let normalizedQuantity = values.quantity;

        // אם המשתמש בחר גרם או מ"ל, ממירים לק"ג או ליטר
        if (values.subUnit === "g" || values.subUnit === "ml") {
            normalizedQuantity = values.quantity / 1000;
        }

        const normalizedValues = {
            ...initialValues,
            ...valueObject,
            ...values,
            quantity: normalizedQuantity, // שמירה ביחידות סטנדרטיות
        };

        onSubmit && onSubmit(normalizedValues);
        form.resetFields();
        onClose && onClose();
    };

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

    const editComponents = (fields) => {
        return fields.map((field) => {
            const { key, title, type, options, rules, props, hiddenInForm, coin, divider } = field;

            if (hiddenInForm) return null; // הסתרת שדה אם הוא מוגדר כ"לא מוצג"

            switch (type) {
                case "text":
                    return (
                        <>
                            <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                <Input {...props} />
                            </AntdForm.Item>
                            {divider && <Divider style={{ margin: "3vh 0vh" }} />}
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
                            {divider && <Divider style={{ margin: "3vh 0vh" }} />}
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
                            {divider && <Divider style={{ margin: "3vh 0vh" }} />}
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
                                        <Option key={option.value}
                                            value={option.value}>
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

                            {divider && <Divider style={{ margin: "3vh 0vh" }} />}
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
                case "price":
                    return (
                        <>
                            <AntdForm.Item
                                name={"withVATFlag"}
                                key={"withVATFlag"}
                                initialValue={true}
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    עלות כולל מע"מ
                                </Checkbox>
                            </AntdForm.Item>
                            <AntdForm.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.withVATFlag !== currentValues.withVATFlag}>
                                {({ getFieldValue }) => {
                                    return getFieldValue("withVATFlag")
                                        ? <AntdForm.Item
                                            key={'price'}
                                            name={'price'}
                                            label={'עלות (כולל מע"מ)'}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "חייב להזין עלות",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                // min={0.1}
                                                // max={record.selectedUnit !== "kg" && record.selectedUnit !== "liter" ? 999 : 1000000}
                                                // step={record.selectedUnit === "kg" || record.selectedUnit === "liter" ? 0.1 : 1}
                                                addonAfter={"₪"}
                                                style={{ width: "100%" }}
                                            />
                                        </AntdForm.Item> :
                                        <AntdForm.Item
                                            key={'priceExcludingVAT'}
                                            name={'priceExcludingVAT'}
                                            label={'עלות (ללא מע"מ)'}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "חייב להזין עלות",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                // min={0.1}
                                                // max={record.selectedUnit !== "kg" && record.selectedUnit !== "liter" ? 999 : 1000000}
                                                // step={record.selectedUnit === "kg" || record.selectedUnit === "liter" ? 0.1 : 1}
                                                style={{ width: "100%" }}
                                                addonAfter={"₪"}
                                            />
                                        </AntdForm.Item>
                                }}
                            </AntdForm.Item>
                        </ >)
                case "custom":
                    return (
                        <>
                            {/* <AntdForm.Item key={key} name={key} label={title} rules={rules}> */}
                            {field.render && field.render("", initialValues, "edit", form)}
                            {/* </AntdForm.Item> */}
                            {divider && <Divider style={{ margin: "3vh 0vh" }} />}
                        </>
                    );
                case "textArea":
                    return (
                        <>
                            <AntdForm.Item key={key} name={key} label={title} rules={rules}>
                                <TextArea style={{ resize: 'none', }} showCount maxLength={field?.maxLength} />
                            </AntdForm.Item>
                            {divider && <Divider style={{ margin: "3vh 0vh" }} />}
                        </>
                    );
                default:
                    return null;
            }
        })
    }

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
                    <Text strong style={{ fontSize: "1.8em" }}>{initialValues?.name}</Text>
                    {tableKeys?.find((e) => e.key === "type")?.render("", initialValues, "view")}
                </Row>
                {tableKeys?.filter((e) => e.key !== "type" && e?.key !== "name" && !e.column).map((field, i, arr) => (
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
                {tableKeys?.filter((e) => e.column).map((field, i, arr) => (
                    <>
                        {i === 0 && <Divider style={{ margin: "8px 0" }} />}
                        <div key={field.key} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", flexDirection: "column", }}>
                            <Text strong style={{ fontSize: "1.4em" }}>{field.title}:</Text>
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
        < >
            {groups && <Steps
                current={current}
                onChange={onChange}
            >
                <Steps.Step title="מידע" stepIndex={1} icon={<InfoCircleOutlined />} key={1} />
                <Steps.Step title="עלויות" stepIndex={2} icon={<DollarCircleOutlined />} key={2} />
            </Steps>}
            <AntdForm
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={initialValues}
            >
                {!groups && editComponents(fields)}
                {current === 0 && (
                    <div>
                        {/* תוכן לצעד הראשון */}
                        {editComponents(fields?.filter((field) => field.group === 1))}
                    </div>
                )}
                {current === 1 && (
                    <div>
                        {/* תוכן לצעד השני */}
                        {editComponents(fields?.filter((field) => field.group === 2))}
                    </div>
                )}
                {mode !== "view" && !groups && (
                    <AntdForm.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                            {mode === "add" ? "הוסף" : "עדכן"}
                        </Button>
                    </AntdForm.Item>
                )}
                {groups && <>
                    <Divider style={{ margin: "24px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {current > 0 && (
                            <Button onClick={() => setCurrent(current - 1)}>הקודם</Button>
                        )}
                        {current < 1 ? (
                            <Button type="primary" onClick={async () => {
                                try {
                                    // Validate fields for the current step
                                    const currentFields = fields.filter((field) => field.group === 1).map((field) => field.key);
                                    await form.validateFields(currentFields);
                                    const currentValues = form.getFieldsValue();
                                    setValueObjet(currentValues);
                                    setCurrent(current + 1); // Move to the next step
                                } catch (error) {
                                    console.log("Validation failed:", error);
                                }
                            }}>
                                הבא
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit">
                                סיום
                            </Button>
                        )}
                    </div>
                </>}
            </AntdForm>
        </>
    );
}
