import React, { useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, InputNumber, Typography, Row, Col, Divider, Flex, Steps, Checkbox, Segmented, Tabs } from 'antd';
import IngredientsManager from "./IngredientsManager";
import { ClockCircleOutlined, DollarCircleOutlined, DollarOutlined, InfoCircleOutlined, } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWeightHanging, faWeight, faScaleBalanced, faTruck } from "@fortawesome/free-solid-svg-icons";
import { optionsUnits } from '../utils/TypeOptions';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

export default function DynamicFormPage({
    mode = "view", // view, add, edit
    type,
    fields = [], // רשימת מפתחות שמגדירה את כל השדות
    onSubmit,
    initialValues = {},
    onClose,
    groups,
    tableKeys,
    ingredientsArr,
}) {
    const [form] = AntdForm.useForm();
    const [form1] = AntdForm.useForm();
    const [form2] = AntdForm.useForm();

    const averageHourlyRate = useSelector((state) => state.settings.settings?.hourlyRate?.value);

    const [current, setCurrent] = useState(0);
    const [stepsStatus, setStepsStatus] = useState(["process", "wait"]); // סטטוס התחלתי
    const [valueObject, setValueObjet] = useState({});
    const [stepData, setStepData] = useState(initialValues); // שמירת נתונים של כל שלב
    const [selectedUnit, setSelectedUnit] = useState(initialValues.unit || null);
    const [selectedSubUnit, setSelectedSubUnit] = useState(initialValues.subUnit || null);

    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };
    const description = 'This is a description.';

    const handleFinish = async (values) => {
        let normalizedQuantity = values.quantity;
        onClose && onClose();

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

        onSubmit && await onSubmit(normalizedValues);

        await form1.resetFields();
        await form2.resetFields();
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

    const editComponents = (fields, form) => {
        return fields.map((field) => {
            const { key, title, type, options, rules, props, hiddenInForm, coin, divider } = field;

            if (hiddenInForm) return null; // הסתרת שדה אם הוא מוגדר כ"לא מוצג"

            switch (type) {
                case "text":
                    return (
                        <>
                            <AntdForm.Item key={key} name={key} label={title} rules={rules} validateTrigger="onSubmit">
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
                                validateTrigger="onSubmit"
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
                            <AntdForm.Item key={key} name={key} label={title} rules={rules} validateTrigger="onSubmit">
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
                            <AntdForm.Item key={key} name={key} label={title} rules={rules} validateTrigger="onSubmit">
                                <Select {...props}
                                    showSearch
                                    onChange={(value) => {
                                        if (key === "unit") {
                                            setSelectedUnit(value); // עדכון ה-state של unit
                                            setStepData((prev) => ({
                                                ...prev,
                                                unit: value, // עדכון יחידת המשקל ב-state
                                                subUnit: undefined, // איפוס subUnit
                                            }));
                                            form.setFieldsValue({ subUnit: undefined }); // איפוס השדה בטופס
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
                            <AntdForm.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.unit !== currentValues.unit}
                            >
                                {() => {
                                    const unit = stepData?.unit;
                                    const subUnit = stepData?.subUnit;

                                    // תנאי להצגת השדה
                                    if (key === "unit" && (unit === "weight" || unit === "volume")) {
                                        return (
                                            <AntdForm.Item
                                                name="subUnit"
                                                initialValue={
                                                    subUnit ||
                                                    (unit === "weight"
                                                        ? (stepData?.quantity >= 1 ? "kg" : "g")
                                                        : (stepData?.quantity >= 1 ? "liter" : "ml"))
                                                }
                                                validateTrigger="onSubmit"
                                                label={
                                                    unit === "weight"
                                                        ? "בחר יחידת משקל (ק\"ג / גרם)"
                                                        : "בחר יחידת נפח (ליטר / מ\"ל)"
                                                }
                                                rules={[
                                                    { required: true, message: "אנא בחר יחידת משנה" },
                                                ]}
                                            >
                                                <Select
                                                    onChange={(value) => setStepData((prev) => ({
                                                        ...prev,
                                                        subUnit: value, // איפוס subUnit
                                                    }))}
                                                >
                                                    {unit === "weight" ? (
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
                                        );
                                    }
                                    return null;
                                }}
                            </AntdForm.Item >
                            {divider && <Divider style={{ margin: "3vh 0vh" }} />
                            }
                        </>
                    );
                case "ingredientsManager":
                    return (
                        <>
                            <Divider style={{ margin: "0.5em" }} />
                            <AntdForm.List key={key} name={key} label={title} rules={rules} validateTrigger="onSubmit">
                                {(fields, { add, remove }) => (
                                    <IngredientsManager
                                        fields={fields}
                                        add={add}
                                        form={form}
                                        remove={remove}
                                        value={form.getFieldValue(key)}
                                        onChange={(newValue) => form.setFieldsValue({ [key]: newValue })}
                                        ingredientsArr={ingredientsArr}
                                    />
                                )}
                            </AntdForm.List>
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
                                validateTrigger="onSubmit"
                            >
                                <Checkbox onChange={() => {
                                    // איפוס שני ערכי המחיר
                                    setStepData((prev) => ({
                                        ...prev,
                                        price: undefined,
                                        priceExcludingVAT: undefined,
                                    }));
                                }}>
                                    עלות כולל מע"מ
                                </Checkbox>
                            </AntdForm.Item>
                            <AntdForm.Item noStyle validateTrigger="onSubmit" shouldUpdate={(prevValues, currentValues) => prevValues.withVATFlag !== currentValues.withVATFlag}>
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
                                            validateTrigger="onSubmit"
                                        >
                                            <InputNumber
                                                // min={0.1}
                                                // max={record.selectedUnit !== "kg" && record.selectedUnit !== "liter" ? 999 : 1000000}
                                                // step={record.selectedUnit === "kg" || record.selectedUnit === "liter" ? 0.1 : 1}
                                                addonAfter={"₪"}
                                                onChange={(value) => {
                                                    setStepData((prev) => ({
                                                        ...prev,
                                                        priceExcludingVAT: undefined,
                                                        price: value,
                                                    }));
                                                }}
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
                                            validateTrigger="onSubmit"
                                        >
                                            <InputNumber
                                                // min={0.1}
                                                // max={record.selectedUnit !== "kg" && record.selectedUnit !== "liter" ? 999 : 1000000}
                                                // step={record.selectedUnit === "kg" || record.selectedUnit === "liter" ? 0.1 : 1}
                                                style={{ width: "100%" }}
                                                addonAfter={"₪"}
                                                onChange={(value) => {
                                                    setStepData((prev) => ({
                                                        ...prev,
                                                        price: undefined,
                                                        priceExcludingVAT: value,
                                                    }));
                                                }}
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
                            <AntdForm.Item key={key} name={key} label={title} rules={rules} validateTrigger="onSubmit">
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
        switch (type) {
            case "mix":
                return (
                    <div>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            <Text strong style={{ fontSize: "1.8em" }}>{initialValues?.name}</Text>
                        </Row>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            {tableKeys?.find((e) => e.key === "type")?.render("", initialValues, "view")}
                        </Row>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            {tableKeys?.find((e) => e.key === "is_active")?.render("", initialValues, "view")}
                        </Row>
                        <Row align="middle" justify={"space-between"} style={{ width: "100%", gap: "8px" }}>
                            <Row align="middle" style={{ gap: "8px" }}>
                                <DollarOutlined style={{ fontSize: "1.5em", color: '#7f8c8d' }} />
                                <Typography.Text
                                    style={{
                                        fontSize: "1.4em",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    ₪{initialValues?.totalCost}
                                </Typography.Text>
                            </Row>
                            <Row align="middle" style={{ gap: "8px" }}>
                                <ClockCircleOutlined style={{ fontSize: "1.5em", color: '#7f8c8d' }} />
                                <Typography.Text
                                    style={{
                                        fontSize: "1.4em",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    {initialValues?.preparationTime} דקות
                                </Typography.Text>
                            </Row>
                        </Row>
                        <Card type='inner' title="עלויות" styles={{ header: { minHeight: "0", padding: "5px 20px" }, }} style={{ margin: "15px 0", }}>
                            <div style={{ margin: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Flex flex={1}>
                                    <Text strong>{"עלות עבודה (₪)"}:</Text>
                                </Flex>
                                <Flex>
                                    <p style={{}}>
                                        ₪{initialValues?.laborCost} (₪{averageHourlyRate})
                                    </p>
                                </Flex>
                            </div>
                            <Divider style={{ margin: "8px 0" }} />
                            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Flex flex={1}>
                                    <Text strong>{"עלות ל-100 גרם (₪)"}:</Text>
                                </Flex>
                                <Flex>
                                    <p style={{}}>
                                        {tableKeys?.find((e) => e.key === "unitCost")?.render("", initialValues, "view")}
                                    </p>
                                </Flex>
                            </div>
                        </Card>
                        <Card style={{
                            width: "100%",
                            backgroundColor: "#f9f9f9", // צבע רקע בהיר להבלטת הכרטיס
                            border: "1px solid #d9d9d9", // מסגרת דקה
                            borderRadius: "8px", // פינות מעוגלות
                            marginTop: "10px",
                            paddingTop: "10px",
                        }}>
                            <Text strong style={{ display: "block", marginBottom: "8px" }}>
                                מרכיבים:
                            </Text>
                            <ul style={{ paddingLeft: "20px", margin: "0", maxHeight: "5vw", overflow: "auto" }}>
                                {initialValues?.ingredients?.map((ingredient, idx) => {
                                    const unitDisplay = (() => {
                                        switch (ingredient?.unit) {
                                            case "weight":
                                                return 'ק"ג';
                                            case "volume":
                                                return "ליטר";
                                            case "units":
                                                return "יחידות";
                                            default:
                                                return "";
                                        }
                                    })();
                                    return (
                                        <li key={idx} style={{ marginBottom: "4px" }}>
                                            <Text>
                                                {ingredientsArr?.find((e) => e?._id === ingredient?.ingredientId)?.name} -{" "}
                                                {ingredient.quantity} {unitDisplay} - ₪{ingredient?.costForQuantity}
                                            </Text>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Card>
                    </div>
                );
            case "ingredient":
                return (
                    <div>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            <Text strong style={{ fontSize: "1.8em" }}>{initialValues?.name}</Text>
                        </Row>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            {tableKeys?.find((e) => e.key === "type")?.render("", initialValues, "view")}
                        </Row>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            <Typography.Text strong>{initialValues?.SKU}</Typography.Text>
                        </Row>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            {tableKeys?.find((e) => e.key === "is_active")?.render("", initialValues, "view")}
                        </Row>
                        <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                            {tableKeys?.find((e) => e.key === "supplierId")?.render("", initialValues, "view")}
                        </Row>
                        <Row align="middle" justify={"space-between"} style={{ width: "100%", gap: "8px" }}>
                            <Row align="middle" style={{ gap: "8px" }}>
                                <DollarOutlined style={{ fontSize: "1.5em", color: '#7f8c8d' }} />
                                <Col>
                                    <Typography.Text
                                        style={{
                                            fontSize: "1.4em",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        ₪{initialValues?.priceExcludingVAT} (ללא מע"מ)
                                    </Typography.Text>
                                    <Typography.Text
                                        style={{
                                            fontSize: "1em",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        ₪{initialValues?.price} (כולל מע"מ)
                                    </Typography.Text>
                                </Col>
                            </Row>
                            <Row align="middle" style={{ gap: "8px" }}>
                                {/* <Scale  style={{ fontSize: "1.5em", color: "#7f8c8d" }} /> */}
                                <FontAwesomeIcon icon={faScaleBalanced} />
                                <Typography.Text
                                    style={{
                                        fontSize: "1.4em",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    {initialValues?.quantity} {optionsUnits.find((e) => e.value === initialValues?.unit).display(initialValues?.quantity)}
                                </Typography.Text>
                            </Row>
                        </Row>
                        <Divider style={{ margin: "8px 0" }} />
                        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Flex flex={1}>
                                <Text strong>{"כמות מינימלית"}:</Text>
                            </Flex>
                            <Flex>
                                <p style={{}}>
                                    {initialValues?.unitQuantity} {optionsUnits.find((e) => e.value === initialValues?.unit).display(initialValues?.quantity)} - ₪{initialValues?.unitPrice}
                                </p>
                            </Flex>
                        </div>
                        {initialValues?.juiceRatio && <>
                            <Divider style={{ margin: "8px 0" }} />
                            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Flex flex={1}>
                                    <Text strong>{"יחס עיבוד"}:</Text>
                                </Flex>
                                <Flex>
                                    <p style={{}}>
                                        {tableKeys?.find((e) => e.key === "juiceRatio")?.render("", initialValues, "view")}
                                    </p>
                                </Flex>
                            </div>
                            <Divider style={{ margin: "8px 0" }} />
                            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Flex flex={1}>
                                    <Text strong>{"מחיר ליחידה מעובדת"}:</Text>
                                </Flex>
                                <Flex>
                                    <p style={{}}>
                                        ₪{initialValues?.processedPrice}
                                    </p>
                                </Flex>
                            </div>
                        </>}
                        {initialValues?.notes &&
                            <Card
                                type="inner"
                                style={{
                                    backgroundColor: "#f9f9f9", // צבע רקע בהיר להבלטת הכרטיס
                                    border: "1px solid #d9d9d9", // מסגרת דקה
                                    borderRadius: "8px", // פינות מעוגלות
                                    marginTop: "10px",
                                    paddingTop: "10px",
                                }}
                            >
                                <Col>
                                    <Row style={{ marginBottom: "4px" }}>
                                        <Text strong style={{ fontSize: "1.2em", color: "#333" }}>
                                            {"הערות"}:
                                        </Text>
                                    </Row>
                                    <Typography.Text style={{ fontSize: "1em", color: "#555" }}>
                                        {initialValues?.notes}
                                    </Typography.Text>
                                </Col>
                            </Card>
                        }
                    </div>
                );
            default:
                return (
                    <div
                        style={{
                            // borderRadius: "10px",
                            // boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            // padding: "16px",
                        }}
                    >
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
                    </div>
                );
        }
    }

    const steps = [
        {
            title: "מידע",
            icon: <InfoCircleOutlined />,
            content: (
                <AntdForm
                    form={form1}
                    layout="vertical"
                    onValuesChange={(a, b) => {
                        setStepData((prev) => ({ ...prev, ...a }))
                    }}
                    onFinish={async (values) => {
                        await form1.validateFields();
                        setStepData({ ...stepData, ...values }); // שמירה של הנתונים מהשלב
                        setCurrent(current + 1); // מעבר לשלב הבא
                    }}
                    initialValues={initialValues}
                >
                    {editComponents(fields?.filter((field) => field.group === 1), form1)}
                    {groups && !initialValues?._id && <Button
                        type="primary"
                        htmlType='submit'
                    >
                        הבא
                    </Button>}
                    {mode !== "add" && <Button type="primary" onClick={() => handleFinish(stepData)}>
                        עדכן
                    </Button>}
                </AntdForm>
            )
        },
        {
            title: "עלויות",
            icon: <DollarCircleOutlined />,
            content: (
                <AntdForm
                    layout="vertical"
                    form={form2}
                    onValuesChange={(a, b) => {
                        setStepData((prev) => ({ ...prev, ...a }))
                    }}
                    onFinish={(values) => {
                        const combinedData = { ...stepData, ...values }; // איחוד כל הנתונים
                        setStepData(combinedData);
                        onSubmit && onSubmit(combinedData); // שליחת כל הנתונים
                    }}
                    initialValues={initialValues}
                >
                    {editComponents(fields?.filter((field) => field.group === 2), form2)}
                    {groups && !initialValues?._id && <>
                        <Divider style={{ margin: "24px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {current > 0 && (
                                <Button onClick={() => setCurrent(current - 1)}>הקודם</Button>
                            )}
                            <Button type="primary" htmlType="submit">
                                {mode !== "add" ? "עדכן" : "סיום"}
                            </Button>
                        </div>
                    </>}
                    {mode !== "add" && <Button type="primary" onClick={() => {
                        console.log(form2?.getFieldsValue());

                        handleFinish(stepData)
                    }}>
                        עדכן
                    </Button>}
                </AntdForm>
            )
        }
    ]

    return (
        < >
            {groups && !initialValues?._id && <Flex wrap="wrap" justify="space-between" align="center" style={{ gap: '8px' }}>
                <Steps
                    current={current}
                    onChange={onChange}
                    status={stepsStatus[current]}
                    style={{ width: '100%' }}
                >
                    {steps?.map((step, index) => {
                        return <Steps.Step key={index} title={step.title} icon={step.icon} />
                    })}
                </Steps>
            </Flex>}
            {groups && initialValues?._id && <Flex flex={1} wrap="wrap" justify="center" align="center" style={{ gap: '8px' }}>
                <Tabs
                    current={current}
                    onChange={onChange}
                    status={stepsStatus[current]}
                    style={{ width: '100%' }}
                >
                    {steps?.map((step, index) => {
                        return <Tabs.TabPane key={index} tab={step.title} icon={step.icon} />
                    })}
                </Tabs>
            </Flex>}
            {groups && steps[current].content}
            {!groups && <AntdForm
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                onValuesChange={(e) => {
                    console.log(e);

                }}
                initialValues={initialValues}
            >
                {!groups && editComponents(fields, form)}
                {mode !== "view" && (!groups || (groups && initialValues?._id)) && (
                    <AntdForm.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%", marginTop: "1vw" }}>
                            {mode === "add" ? "הוסף" : "עדכן"}
                        </Button>
                    </AntdForm.Item>
                )}
            </AntdForm>}
        </>
    );
}
