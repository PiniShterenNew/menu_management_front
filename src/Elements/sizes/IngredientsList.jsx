import React, { useCallback, useEffect, useRef, useState } from "react";
import { Row, Col, Button, Form, Select, InputNumber, Typography, Flex, Card, List } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const { Text } = Typography;

const IngredientsList = ({
    ingredients,
    sizes,
    add,
    remove,
    indexSize,
    form,
    onChange,
    getUnitDisplay,
    setDisabledSave
}) => {

    const cardRef = useRef(null);

    const [editingIndex, setEditingIndex] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [adding, setAdding] = useState(false);

    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState("");

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

    const handleEdit = (index) => { setEditingIndex(index); setDisabledSave(true); };
    const handleCancelEdit = () => {
        setEditingIndex(null);
        setDisabledSave(false);
        setAdding(false);
        setIsNew(false);
        setSelectedUnit("");
    };

    const handleSave = () => {
        form.validateFields().then(() => {
            setEditingIndex(null);
            setDisabledSave(false);
            setAdding(false);
            setIsNew(false);
            setSelectedUnit("");
        });
    };

    const handleUpdateIngredient = (index, field, value) => {
        const currentValues = form.getFieldValue("ingredients") || [];
        const updatedValues = [...currentValues];
    
        // עדכון השדה המתאים בפריט בעריכה
        updatedValues[index] = {
            ...updatedValues[index],
            [field]: value,
        };
    
        // עדכון הטופס
        form.setFieldsValue({ ingredients: updatedValues });
    
        // עדכון רשימת המידות
        updateSizesWithIngredients(updatedValues);
    };

    const updateSizesWithIngredients = (updatedIngredients) => {
        const updatedSizes = [...sizes];
        updatedSizes[indexSize] = {
            ...updatedSizes[indexSize],
            ingredients: updatedIngredients
        };
        onChange(updatedSizes);
    };

    const handleIngredientSelect = (value, option) => {
        setSelectedIngredient({
            ingredientId: value,
            unit: option.unit,
            name: option.label,
        });
    };

    const handleQuantityChange = (value) => {
        setSelectedQuantity(value);
    };

    const handleAddIngredient = () => {
        if (!selectedIngredient || !selectedQuantity) {
            return; // וודא שכל הנתונים קיימים
        }

        const newIngredient = {
            ...selectedIngredient,
            quantity: selectedQuantity,
        };

        const currentValues = form.getFieldValue("ingredients") || [];
        const updatedValues = [...currentValues, newIngredient];

        // עדכון הטופס והמידע
        form.setFieldsValue({ ingredients: updatedValues });
        updateSizesWithIngredients(updatedValues);

        // איפוס הערכים הזמניים
        setSelectedIngredient(null);
        setSelectedQuantity(null);
        setAdding(false);
        setEditingIndex(null);
        setDisabledSave(false);
        setIsNew(false);
    };

    const handleRemoveIngredient = (index) => {
        const currentValues = form.getFieldValue("ingredients") || [];
        const updatedValues = currentValues.filter((_, i) => i !== index);

        form.setFieldsValue({ ...updatedValues });
        updateSizesWithIngredients(updatedValues);
        remove(index);
    };

    const getIngredientName = (item) => {
        if (!item) return '';
        if (item.name) return item.name;
        if (item.ingredientId && ingredients) {
            const foundIngredient = ingredients.find(ing => ing._id === item.ingredientId);
            return foundIngredient?.name || '';
        }
        return '';
    };

    const getCurrentIngredients = () => {
        const formIngredients = form.getFieldValue("ingredients");
        return Array.isArray(formIngredients) ? formIngredients : [];
    };

    useEffect(() => {
        const ingredients = getCurrentIngredients();
        if (ingredients.length > 0) {
            scrollToBottom();
        }
    }, [form.getFieldValue("ingredients")?.length]);

    return (
        <>
            {/* שורת הוספה */}
            {adding ? (
                <Row gutter={16} className="width-100" style={{ marginBottom: "1vw" }} justify={"space-between"}>
                    <Col span={10}> {/* Select */}
                        <Select
                            placeholder="בחר רכיב"
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                            options={ingredients?.map((ing) => ({
                                value: ing._id,
                                label: ing.name,
                                unit: ing.unit,
                            }))}
                            onChange={handleIngredientSelect}
                        />
                    </Col>
                    <Col span={10}> {/* InputNumber */}
                        <InputNumber
                            onChange={handleQuantityChange}
                            addonAfter={getUnitDisplay(selectedIngredient?.unit || "")}
                            placeholder="כמות"
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col > {/* Buttons */}
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faCheck} />}
                            onClick={handleAddIngredient}
                        />
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faTimes} />}
                            onClick={handleCancelEdit}
                        />
                    </Col>
                </Row>
            ) : (
                <Button
                    type="dashed"
                    onClick={() => {
                        setAdding(true);
                        setIsNew(true);
                        setEditingIndex(getCurrentIngredients().length);
                        setDisabledSave(true);
                    }}
                    disabled={editingIndex !== null}
                >
                    הוסף מרכיב
                </Button>
            )}

            {/* רשימה קיימת */}
            <div
                ref={cardRef}
                style={{ margin: "1vw 0", height: "12vw", maxHeight: "12vw", overflowY: "auto", overflowX: "hidden" }}
            >
                <List
                    dataSource={sizes[indexSize]?.ingredients}
                    renderItem={(item, index) => (
                        <div key={index} className="mx-3 my-0 p-0">
                            {editingIndex !== index ? (
                                <Row style={{ width: "100%" }} align="middle" justify="space-between">
                                    <Flex flex={2}>
                                        <Text>{getIngredientName(item)}</Text>
                                    </Flex>
                                    <Flex flex={1}>
                                        <Text>
                                            {item?.quantity} {getUnitDisplay(item?.unit)}
                                        </Text>
                                    </Flex>
                                    <Col>
                                        <Button
                                            type="text"
                                            icon={<FontAwesomeIcon icon={faEdit} />}
                                            onClick={() => handleEdit(index)}
                                        />
                                        <Button
                                            type="text"
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                            onClick={() => handleRemoveIngredient(index)}
                                        />
                                    </Col>
                                </Row>
                            ) : (
                                !isNew && (
                                    <div className="flex flex-1 flex-row gap-2 justify-between" >
                                        <Col span={10}>
                                            <Form.Item
                                                name={[index, "ingredientId"]}
                                                rules={[{ required: true, message: "בחר רכיב" }]}
                                                initialValue={item.ingredientId?._id || item.ingredientId}
                                            >
                                                <Select
                                                    placeholder="בחר רכיב"
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option?.label?.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={ingredients?.map((ing) => ({
                                                        value: ing._id,
                                                        label: ing.name,
                                                        unit: ing.unit,
                                                    }))}
                                                    onChange={(value, option) => handleUpdateIngredient(index, "ingredientId", value)}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                name={[index, "quantity"]}
                                                rules={[{ required: true, message: "הזן כמות" }]}
                                                initialValue={item.quantity}
                                            >
                                                <InputNumber
                                                    addonAfter={getUnitDisplay(item?.unit)}
                                                    onChange={(value) => handleUpdateIngredient(index, "quantity", value)}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
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
                                    </div>
                                )
                            )}
                        </div>
                    )}
                />
            </div>
        </>
    );
};

export default IngredientsList;