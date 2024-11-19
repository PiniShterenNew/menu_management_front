// src/components/IngredientForm.jsx - טופס להוספה/עריכת חומרי גלם עם שימוש ב-Ant Design מותאם לנייד
import React, { forwardRef, useEffect, useState } from 'react';
import { Card, Form as AntdForm, Input, Button, Select, Checkbox, InputNumber, Typography } from 'antd';
import './IngredientForm.css';
import { useSelector } from 'react-redux';
import { typesOptions } from '../../utils/TypeOptions';

const { Text } = Typography;

const IngredientForm = forwardRef(({ addIngredient, initialValues, onClose }, ref) => {
    const supplierState = useSelector((state) => state.suppliers);
    const ingredientsState = useSelector((state) => state.ingredients);

    const [form] = AntdForm.useForm();

    const [isJuice, setIsJuice] = useState(initialValues?.isJuice || false);
    const [errorMessage, setErrorMessage] = useState('');

    // **New state to track if unit weight/volume is required**
    const [isUnitRequired, setIsUnitRequired] = useState(
        initialValues?.type !== "אריזות וחד פעמי" && initialValues?.unit === "יחידות"
    );

    React.useImperativeHandle(ref, () => ({
        resetFields: () => form.resetFields(),
    }));

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                quantity: Number(initialValues.quantity),
                price: Number(initialValues.price),
            });

            setIsJuice(initialValues.isJuice || false);

            // **Update isUnitRequired when initial values change**
            setIsUnitRequired(initialValues.type !== "אריזות וחד פעמי" && initialValues.unit === "יחידות");
        }
    }, [initialValues, form]);

    // Update isUnitRequired when type or unit changes
    const handleTypeOrUnitChange = (changedField) => {
        if (changedField === 'type' || changedField === 'unit') {
            const type = form.getFieldValue('type');
            const unit = form.getFieldValue('unit');
            setIsUnitRequired(type !== "אריזות וחד פעמי" && unit === "יחידות");
        }
    };

    const onFinish = (values) => {
        // מוודאים שהרשימה מסודרת מהחדש לישן
        const sortedIngredients = [...ingredientsState].sort((a, b) => b.createdAt - a.createdAt);

        const duplicateIngredient = sortedIngredients.find((ingredient) => {
            return (
                ingredient.name === values.name &&
                ingredient.supplierId === values.supplierId &&
                ingredient.type === values.type &&
                ingredient.unit === values.unit &&
                ingredient.quantity === values.quantity &&
                ingredient.price === values.price &&
                ingredient.isJuice === isJuice
            );
        });

        if (
            duplicateIngredient &&
            (!initialValues?._id || initialValues._id !== duplicateIngredient._id)
        ) {
            setErrorMessage('קיים כבר חומר גלם עם פרטים זהים במערכת!');
            return;
        }

        addIngredient({
            ...values,
            ...(initialValues && { _id: initialValues._id }),
            isJuice: isJuice,
        });

        form.resetFields();
        onClose();
    };

    return (
        <Card className="ingredient-form-card">
            <AntdForm form={form} layout="vertical" onFinish={onFinish}>
                <AntdForm.Item
                    label="שם חומר הגלם"
                    name="name"
                    rules={[{ required: true, message: 'אנא הזן שם חומר גלם' }]}
                >
                    <Input />
                </AntdForm.Item>
                <AntdForm.Item
                    label="ספק"
                    name="supplierId"
                    rules={[{ required: true, message: 'אנא בחר ספק' }]}
                >
                    <Select
                        placeholder="בחר ספק"
                        popupMatchSelectWidth={false}
                        dropdownStyle={{ maxHeight: '60vh' }}
                    >
                        {supplierState && supplierState.length > 0 ? (
                            supplierState.map((supplier) => (
                                <Select.Option key={supplier._id} value={supplier._id}>
                                    {supplier.name}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value="" disabled>אין ספקים זמינים</Select.Option>
                        )}
                    </Select>
                </AntdForm.Item>

                <AntdForm.Item
                    label="סוג חומר גלם"
                    name="type"
                    rules={[{ required: true, message: 'אנא בחר סוג חומר גלם' }]}
                >
                    <Select
                        placeholder="בחר סוג חומר גלם"
                        popupMatchSelectWidth={false}
                        dropdownStyle={{ maxHeight: '60vh' }}
                        onChange={() => handleTypeOrUnitChange('type')}
                    >
                        {typesOptions?.map((e) => {
                            return (
                                <Select.Option key={e.value} value={e.value}>{e.value}</Select.Option>
                            )
                        })}
                    </Select>
                </AntdForm.Item>

                <AntdForm.Item
                    label="יחידת מידה"
                    name="unit"
                    rules={[{ required: true, message: 'אנא בחר יחידת מידה' }]}
                >
                    <Select
                        placeholder="בחר יחידת מידה"
                        popupMatchSelectWidth={false}
                        dropdownStyle={{ maxHeight: '60vh' }}
                        onChange={() => handleTypeOrUnitChange('unit')}
                    >
                        <Select.Option value={`ק"ג`}>{`ק"ג`}</Select.Option>
                        <Select.Option value="ליטר">ליטר</Select.Option>
                        <Select.Option value="יחידות">יחידות</Select.Option>
                    </Select>
                </AntdForm.Item>

                {isUnitRequired && (
                    <AntdForm.Item
                        label="משקל/נפח ליחידה"
                        name="weightOrVolumePerUnit"
                        rules={[{ required: true, message: "אנא הזן משקל או נפח עבור יחידה זו" }]}
                    >
                        <InputNumber min={0.01} step="any" style={{ width: '100%' }} />
                    </AntdForm.Item>
                )}

                <AntdForm.Item
                    label={"כמות"}
                    name="quantity"
                    rules={[{ required: true, message: "אנא הזן כמות תקינה" }]}
                >
                    <InputNumber min={1} step="any" style={{ width: '100%' }} />
                </AntdForm.Item>

                <AntdForm.Item
                    label={"מחיר כולל (₪)"}
                    name="price"
                    rules={[{ required: true, message: "אנא הזן מחיר תקין" }]}
                >
                    <InputNumber min={1} step="any" style={{ width: '100%' }} />
                </AntdForm.Item>
                <AntdForm.Item>
                    <Checkbox checked={isJuice} onChange={(e) => setIsJuice(e.target.checked)}>
                        האם רכיב זה משמש להכנת מיץ?
                    </Checkbox>
                </AntdForm.Item>

                {isJuice && (
                    <AntdForm.Item
                        label={"יחס המיץ (כמות מיץ מתקבלת לעומת חומר גלם בשימוש)"}
                        name="juiceRatio"
                        rules={[{ required: true, type: 'number', min: 0.01, message: "אנא הזן יחס מיץ תקין (חייב להיות גדול מ-0)" }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
                    </AntdForm.Item>
                )}
                {errorMessage && <Text type="danger" className="error-message">{errorMessage}</Text>}
                <AntdForm.Item>
                    <Button type="primary" htmlType="submit" className="ingredient-form-button">
                        {initialValues ? "עדכן חומר גלם" : "הוסף חומר גלם"}
                    </Button>
                </AntdForm.Item>
            </AntdForm>
        </Card>
    );
});

export default IngredientForm;
