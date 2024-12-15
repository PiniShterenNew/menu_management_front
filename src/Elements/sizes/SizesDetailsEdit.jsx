import { Button, Col, Flex, Form, Input, InputNumber, Row, Tabs, Typography } from 'antd'
import TabPane from 'antd/es/tabs/TabPane';
import { DeleteOutlined, CloseOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTag } from "@fortawesome/free-solid-svg-icons";

import React from 'react'
import IngredientsList from './IngredientsList'
import MixesList from './MixesList'

export default function SizesDetailsEdit({
    size,
    sizes,
    indexSize,
    handleCancelEdit,
    handleRemoveSize,
    newSizeId,
    form,
    ingredients,
    mixes,
    onChange,
    getUnitDisplay,
    activeSubTab,
    setActiveSubTab,
    setNewSizeId
}) {

    const handleSave = async () => {
        try {
            // וידוא כל השדות בטופס
            await form.validateFields();

            // אם הכל תקין, אפשר לשמור את הגודל
            setNewSizeId(null);
            onChange(sizes?.map((e, i) => i === indexSize ? { ...e, edit: false } : e));
        } catch (error) {
            // במידה ויש שגיאות
            const errorFields = error.errorFields;

            // בדיקה לאיזה טאב שייך השדה הראשון עם השגיאה
            const firstError = errorFields[0]?.name;
            if (firstError?.includes("ingredients")) {
                setActiveSubTab("1"); // מעבר לטאב מרכיבים
            } else if (firstError?.includes("mixes")) {
                setActiveSubTab("2"); // מעבר לטאב מיקסים
            }
        }
    };
    return (
        <div
            className={size.idNew === newSizeId ? "highlight-new" : ""}
            key={size.idNew || indexSize}
            style={{
                border: `1px ${size?.idNew ? "dashed" : "solid #e6e6e6"}`,
                borderRadius: "8px",
                padding: "16px",
                background: "#fafafa",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
        >
            {/* top detailes */}
            <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "12px" }}
            >
                <Flex flex={2}>
                    <Form.Item name={["_id"]} hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={["label"]}
                        label="שם הגודל"
                        rules={[
                            { required: true, message: "חייב למלא שם גודל" },
                            { min: 1, message: "שם גודל חייב להיות לפחות 1 תווים" },
                            { max: 25, message: "שם גודל לא יכול לחרוג מ-25 תווים" }
                        ]}
                    >
                        <Input
                            placeholder="שם הגודל"
                            size="middle"
                            showCount
                            style={{ width: "auto", minWidth: "200px" }}
                            maxLength={25}
                        />
                    </Form.Item>
                </Flex>
                <Flex flex={1} style={{ alignSelf: "flex-start" }} justify='end'>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => handleCancelEdit(indexSize)} // עדכון כפתור לעריכה
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        title="מחק גודל"
                        onClick={() => handleRemoveSize(indexSize)}
                    />
                </Flex>
            </Row>
            {/* price and preparationTime */}
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item
                        name={["price"]}
                        label="מחיר"
                        rules={[
                            { required: true, message: "יש למלא מחיר" },
                            {
                                type: "number",
                                min: 0,
                                message: "המחיר חייב להיות חיובי",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="מחיר"
                            style={{ width: "100%" }}
                            addonAfter={"₪"}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="זמן הכנה (דקות)"
                        name={["preparationTime"]}
                        rules={[
                            { required: true, message: "חייב לציין זמן הכנה" },
                        ]}
                    >
                        <InputNumber
                            placeholder="זמן הכנה"
                            style={{ width: "100%" }}
                            addonAfter={<FontAwesomeIcon
                                style={{ fontSize: "0.9em" }}
                                icon={faClock}
                            />}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Tabs
                activeKey={activeSubTab} // טאב פנימי פעיל
                onChange={(key) => setActiveSubTab(key)} // שינוי טאב פנימי
                tabBarStyle={{
                    direction: "rtl",
                }}
                style={{ margin: "1vw 0" }}
                type="card" // סוג הטאבים
                tabPosition="top" // מציב את הטאבים למעלה
            >

                <TabPane tab={`מרכיבים (${size?.ingredients?.length || 0})`} key={1}>
                    <Typography.Text
                        strong
                        style={{ display: "block", marginBottom: "8px" }}
                    >
                        מרכיבים:
                    </Typography.Text>
                    <Form.List name={["ingredients"]}>
                        {(fields, { add, remove }) => (
                            <IngredientsList
                                add={add}
                                remove={remove}
                                fields={fields}
                                form={form}
                                indexSize={indexSize}
                                ingredients={ingredients}
                                onChange={onChange}
                                getUnitDisplay={getUnitDisplay}
                                sizes={sizes}
                            />
                        )}
                    </Form.List>
                </TabPane>
                <TabPane tab={`מיקסים (${size?.mixes?.length || 0})`} key={2}>
                    <Typography.Text
                        strong
                        style={{ display: "block", marginBottom: "8px" }}
                    >
                        מיקסים:
                    </Typography.Text>
                    <Form.List name={["mixes"]}>
                        {(fields, { add, remove }) => (
                            <MixesList
                                add={add}
                                remove={remove}
                                fields={fields}
                                form={form}
                                indexSize={indexSize}
                                mixes={mixes}
                                onChange={onChange}
                                getUnitDisplay={getUnitDisplay}
                                sizes={sizes}
                            />
                        )}
                    </Form.List>
                </TabPane>
            </Tabs>
            <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSave()}
            >
                שמור
            </Button>
        </div>
    )
}
