import React, { useCallback, useEffect, useRef, useState } from "react";
import { Row, Col, Button, Form, Select, InputNumber, Typography, Flex, Card, List } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const { Text } = Typography;

const MixesList = ({
    mixes,
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

    const [selectedMix, setSelectedMix] = useState(null);
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

    const handleUpdateMix = (index, field, value) => {
        const currentValues = form.getFieldValue("mixes") || [];
        const updatedValues = [...currentValues];

        // עדכון השדה המתאים בפריט בעריכה
        updatedValues[index] = {
            ...updatedValues[index],
            [field]: value,
        };

        // עדכון הטופס
        form.setFieldsValue({ mixes: updatedValues });

        // עדכון רשימת המידות
        updateSizesWithMixes(updatedValues);
    };

    const updateSizesWithMixes = (updatedMixes) => {
        const updatedSizes = [...sizes];
        updatedSizes[indexSize] = {
            ...updatedSizes[indexSize],
            mixes: updatedMixes
        };
        onChange(updatedSizes);
    };

    const handleMixeSelect = (value, option) => {
        setSelectedMix({
            mixId: value,
            unit: option?.unit || "weight",
            name: option.label,
        })
    };

    const handleQuantityChange = (value) => {
        setSelectedQuantity(value);
    };

    const handleAddMixe = () => {
        if (!selectedMix || !selectedQuantity) {
            return;
        }

        const newMix = {
            ...selectedMix,
            quantity: selectedQuantity
        }

        const currentValues = form.getFieldValue("mixes") || [];
        const updatedValues = [...currentValues, newMix];

        // עדכון הטופס והמידע
        form.setFieldsValue({ mixes: updatedValues });
        updateSizesWithMixes(updatedValues);

        setSelectedMix(null);
        setSelectedQuantity(null);
        setAdding(false);
        setSelectedUnit("");
        setEditingIndex(null);
        setDisabledSave(false);
        setIsNew(false);
    };

    const handleRemoveMixe = (index) => {
        const currentValues = form.getFieldValue("mixes") || [];
        const updatedValues = currentValues.filter((_, i) => i !== index);

        form.setFieldsValue({ ...updatedValues });
        updateSizesWithMixes(updatedValues);
        remove(index);
    };

    const getMixeName = (item) => {
        if (!item) return '';
        if (item.name) return item.name;
        if (item.mixId && mixes) {
            const foundMixe = mixes.find(ing => ing._id === item.mixId);
            return foundMixe?.name || '';
        }
        return '';
    };

    const getCurrentMixes = () => {
        const formMixes = form.getFieldValue("mixes");
        return Array.isArray(formMixes) ? formMixes : [];
    };

    useEffect(() => {
        const mixes = getCurrentMixes();
        if (mixes.length > 0) {
            scrollToBottom();
        }
    }, [form.getFieldValue("mixes")?.length]);

    return (
        <>
            {/* שורת הוספה */}
            {adding ? (
                <Row gutter={16} className="width-100" style={{ marginBottom: "1vw" }} justify={"space-between"}>
                    <Col span={10}>
                        <Select
                            placeholder="בחר רכיב"
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                            style={{ width: "100%" }}
                            options={mixes?.map((ing) => ({
                                value: ing._id,
                                label: ing.name,
                                unit: ing.unit
                            }))}
                            onChange={handleMixeSelect}
                        />
                    </Col>
                    <Col span={10}>
                        <InputNumber
                            onChange={handleQuantityChange}
                            addonAfter={getUnitDisplay(selectedUnit)}
                            placeholder="כמות"
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col >
                        <Button type="text" icon={<FontAwesomeIcon icon={faCheck} />} onClick={handleAddMixe} />
                        <Button type="text" icon={<FontAwesomeIcon icon={faTimes} />} onClick={handleCancelEdit} />
                    </Col>
                </Row>
            ) : (
                <Button
                    type="dashed"
                    onClick={() => {
                        setAdding(true);
                        setIsNew(true);
                        setEditingIndex(getCurrentMixes().length);
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
                    dataSource={sizes[indexSize]?.mixes}
                    renderItem={(item, index) => (
                        <div key={index} className="mx-3 my-0 p-0">
                            {editingIndex !== index ? (
                                <Row style={{ width: "100%" }} align="middle" justify="space-between">
                                    <Flex flex={1}>
                                        <Text>{getMixeName(item)}</Text>
                                    </Flex>
                                    <Flex flex={1}>
                                        <Text>{item?.quantity} {getUnitDisplay(item?.unit)}</Text>
                                    </Flex>
                                    <Row>
                                        <Button type="text" onClick={() => handleEdit(index)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button type="text" onClick={() => handleRemoveMixe(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </Row>
                                </Row>
                            ) : !isNew && (
                                <div className="flex flex-1 flex-row gap-2 justify-between" >
                                    <Col span={10}>
                                        <Form.Item
                                            name={[index, "mixId"]}
                                            rules={[{ required: true, message: "בחר רכיב" }]}
                                            initialValue={item.mixId?._id || item.mixId}
                                        >
                                            <Select
                                                placeholder="בחר רכיב"
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={mixes?.map((ing) => ({
                                                    value: ing._id,
                                                    label: ing.name,
                                                    unit: ing.unit
                                                }))}
                                                onChange={(value, option) => handleUpdateMix(index, "mixId", value)}
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
                                                onChange={(value) => handleUpdateMix(index, "quantity", value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Button type="text" icon={<FontAwesomeIcon icon={faCheck} />} onClick={handleSave} />
                                        <Button type="text" icon={<FontAwesomeIcon icon={faTimes} />} onClick={handleCancelEdit} />
                                    </Col>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>
        </>
    );
};

export default MixesList;