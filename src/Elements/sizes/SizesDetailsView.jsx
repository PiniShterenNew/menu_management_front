import React, { useState } from 'react'
import { Button, Card, Col, Divider, Flex, List, Progress, Row, Segmented, Typography } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined, DollarOutlined, ClockCircleOutlined, EditOutlined, CopyOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDolly, faFlask } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CostBreakdown from './CostBreakdown';

const { Text } = Typography;

export default function SizesDetailsView({ size, index, sizeInfo, type, handleEditSize, handleDuplicateSize, handleRemoveSize, ingredients, mixes }) {
    const isMobile = useMediaQuery({ query: "(max-width: 500px)" });
    const averageHourlyRate = useSelector((state) => state.settings.settings?.hourlyRate?.value);

    const costDetailes = (size) => {
        if (!size) return null;

        return (
            <Row>
                <Flex flex={1} style={{ flexDirection: "column" }}>
                    <CostBreakdown size={size} />
                </Flex>
            </Row>

        )
    }

    const MySegment = ({ type, size, ingredients, mixes }) => {
        const [currentTab, setCurrentTab] = useState("ingredients");

        const renderIngredients = () => {
            const data = size?.ingredients?.map((ingredient) => {
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

                const ingredientName = ingredients?.find((e) => e?._id === ingredient?.ingredientId)?.name || "לא ידוע";

                return {
                    name: ingredientName,
                    quantity: ingredient?.quantity,
                    unitDisplay,
                    cost: ingredient?.costForQuantity,
                };
            });

            return (
                <List
                    dataSource={data}
                    style={{
                        paddingLeft: "20px",
                        margin: "0",
                        height: isMobile ? "25vh" : "22vh",
                        maxHeight: isMobile ? "25vh" : "22vh",
                        overflow: "auto",
                    }}
                    renderItem={(item, idx) => (
                        <div key={idx} className='flex flex-1 flex-row p-2 bg-gray-200 rounded-lg' style={{ marginBottom: "4px" }}>
                            <p className='flex-[2] text-center'>
                                {item.name}
                            </p>
                            <p className='flex-[1] text-center'>
                                {item.quantity} {item.unitDisplay}
                            </p>
                            <p className='flex-[1] text-center'>
                                ₪{item.cost}
                            </p>
                        </div>
                    )}
                />
            );
        };

        const renderMixes = () => {
            const data = size?.mixes?.map((mix) => {
                const unitDisplay = (() => {
                    switch (mix.unit) {
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

                const mixName = mixes?.find((e) => e?._id === mix?.mixId)?.name || "לא ידוע";

                return {
                    name: mixName,
                    quantity: mix.quantity,
                    unitDisplay,
                    cost: mix?.costForQuantity,
                };
            });

            return (
                <List
                    dataSource={data}
                    style={{
                        paddingLeft: "20px",
                        margin: "0",
                        height: isMobile ? "25vh" : "22vh",
                        maxHeight: isMobile ? "25vh" : "22vh",
                        overflow: "auto",
                    }}
                    renderItem={(item, idx) => (
                        <List.Item key={idx} style={{ marginBottom: "4px" }}>
                            <Text>
                                {item.name} - {item.quantity} {item.unitDisplay} - ₪{item.cost}
                            </Text>
                        </List.Item>
                    )}
                />
            );
        }

        return (
            <>
                {type !== "P" && (
                    <>
                        <Divider className='my-5' />
                        {/* Segmented Tab */}
                        <Row style={{ gap: "1.5vw", }}>
                            <Flex align='center' justify='center'>
                                <Segmented
                                    vertical
                                    options={[
                                        {
                                            label: (
                                                <div
                                                    style={{
                                                        padding: 4,
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faDolly} />
                                                    <div>מרכיבים</div>
                                                </div>
                                            ), value: "ingredients"
                                        },
                                        {
                                            label: (
                                                <div
                                                    style={{
                                                        padding: 4,
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faFlask} />
                                                    <div>מתכונים</div>
                                                </div>
                                            ), value: "mixes"
                                        }
                                    ]}
                                    onChange={(value) => setCurrentTab(value)}
                                    style={{ marginBottom: "12px", direction: "" }}
                                />
                            </Flex>
                            {/* Content based on tab */}
                            <Flex flex={1}>
                                {/* <Card style={{
                                    width: "100%",
                                    backgroundColor: "#f9f9f9", // צבע רקע בהיר להבלטת הכרטיס
                                    border: "1px solid #d9d9d9", // מסגרת דקה
                                    borderRadius: "8px", // פינות מעוגלות
                                    marginTop: "10px",
                                    paddingTop: "10px",
                                }}> */}
                                <div style={{ width: "100%", }}>
                                    {currentTab === "ingredients" ? renderIngredients() : renderMixes()}
                                </div>
                            </Flex>
                        </Row>
                    </>
                )}
            </>
        );
    };

    return (
        <div
            key={size.idNew || index}
        >
            <Flex
                flex={1}
                style={{ padding: "0em 1em" }}
                justify={"space-between"}
                align={"middle"}
            >
                <Col className="width-100" style={{ display: "flex", flexDirection: "column", gap: "0.3em" }}>
                    <Flex flex={1} style={{ marginBottom: "8px" }}>
                        <Row
                            className="width-100"
                            align={"middle"}
                            justify={"space-between"}
                        >
                            <Typography.Text strong style={{ fontSize: "1.6em" }}>
                                {size?.label}
                            </Typography.Text>
                            <Flex>
                                {handleEditSize && <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditSize(index)} // עדכון כפתור לעריכה
                                />}
                                {handleDuplicateSize && (
                                    <Button type="text" icon={<CopyOutlined />} onClick={() => handleDuplicateSize(index)} />
                                )}
                                {handleRemoveSize && <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveSize(index)}
                                />}
                                {type === "P" && <Button
                                    type="text"
                                    size='large'
                                    icon={<InfoCircleOutlined />}
                                    onClick={() => sizeInfo(index)}
                                />}
                            </Flex>
                        </Row>
                    </Flex>
                    {costDetailes(size)}
                </Col>
            </Flex>
            <MySegment
                ingredients={ingredients}
                mixes={mixes}
                size={size}
                type={type}
            />
        </div>
    )
}
