import React from 'react'
import { Button, Card, Col, Divider, Flex, Progress, Row, Typography } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined, DollarOutlined, ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';

export default function SizesDetailsView({ size, index, sizeInfo, type, handleEditSize, handleRemoveSize, ingredients, mixes, sizeSummary, priceExcludingVAT }) {

    const averageHourlyRate = useSelector((state) => state.employeeHours.overallAverageHourlyRate);

    const costDetailes = (sizeSummary, priceExcludingVAT) => {
        const sizeSummaryData = sizeSummary;
        if (!sizeSummaryData) return null;
        const priceExcludingVATData = priceExcludingVAT;
        // _id: size?._id,
        // label: size.label,
        // mixCost: mixCost?.toFixed(2),
        // ingredientCost: ingredientCost?.toFixed(2),
        // totalCost: totalCost.toFixed(2),
        // laborCost: laborCost.toFixed(2),
        // profitMargin: profitMargin.toFixed(2),
        return (
            <Row>
                <Flex flex={1} style={{ flexDirection: "column" }}>
                    <Row justify={"space-between"}>
                        <Typography.Text strong>מחיר ללא מע"מ:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{priceExcludingVATData} (₪{(size?.price - priceExcludingVATData).toFixed(2)})</Typography.Text>
                    </Row>
                    <Divider style={{ margin: "5px 0" }} />
                    <Row justify={"space-between"}>
                        <Typography.Text strong>סך הכל עלות:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{sizeSummaryData?.totalCost}</Typography.Text>
                    </Row>
                    <Divider style={{ margin: "5px 0" }} />
                    <Row justify={"space-between"}>
                        <Typography.Text strong>אחוז רווח:</Typography.Text>
                        {/* <Typography.Text style={{ marginRight: 8 }}>{sizeSummaryData?.profitMargin}%</Typography.Text> */}
                        <Progress percent={sizeSummaryData?.profitMargin} />
                    </Row>
                    {type !== "P" && <Card type='inner' title="עלויות" styles={{ header: { minHeight: "0", padding: "5px 20px" }, }} style={{ margin: "15px 0", }}>
                        <Row justify={"space-between"} style={{ marginTop: "1vh" }}>
                            <Typography.Text strong>עלות עבודה:</Typography.Text>
                            <Typography.Text>₪{sizeSummaryData?.laborCost} (₪{averageHourlyRate})</Typography.Text>
                        </Row>
                        <Divider style={{ margin: "5px 0" }} />
                        <Row justify={"space-between"}>
                            <Typography.Text strong>עלות מרכיבים:</Typography.Text>
                            <Typography.Text>₪{sizeSummaryData?.ingredientCost}</Typography.Text>
                        </Row>
                        <Divider style={{ margin: "5px 0" }} />
                        <Row justify={"space-between"}>
                            <Typography.Text strong>עלות מיקסים:</Typography.Text>
                            <Typography.Text>₪{sizeSummaryData?.mixCost}</Typography.Text>
                        </Row>
                        <Divider style={{ margin: "5px 0" }} />
                        <Row justify={"space-between"}>
                            <Typography.Text strong>עלות הוצאות קבועות:</Typography.Text>
                            <Typography.Text>₪{ }</Typography.Text>
                        </Row>
                    </Card>}
                </Flex>
            </Row>

        )
    }

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
                    <Flex
                        flex={1}
                        align="start" // יישור להתחלה (לא חובה)
                        style={{ gap: "12px", marginBottom: "8px", flexDirection: "column" }}
                    >
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
                                    ₪{size?.price}
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
                                    {size?.preparationTime} דקות
                                </Typography.Text>
                            </Row>
                        </Row>
                    </Flex>
                    {costDetailes(sizeSummary, priceExcludingVAT)}
                </Col>
            </Flex>
            {type !== "P" && <>
                <Divider style={{ margin: "12px 0" }} />
                <Typography.Text
                    strong
                    style={{ display: "block", marginBottom: "8px" }}
                >
                    מרכיבים:
                </Typography.Text>
                <ul style={{ paddingLeft: "20px", margin: "0" }}>
                    {size?.ingredients?.map((ingredient, idx) => {
                        const unitDisplay = (() => {
                            switch (ingredient.unit) {
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
                                <Typography.Text>
                                    {ingredients?.find((e) => e?._id === ingredient?.ingredientId)?.name} -{" "}
                                    {ingredient.quantity} {unitDisplay} - ₪{ingredient?.costForQuantity}
                                </Typography.Text>
                            </li>
                        );
                    })}
                </ul>
                <Divider style={{ margin: "12px 0" }} />
                <Typography.Text
                    strong
                    style={{ display: "block", marginBottom: "8px" }}
                >
                    מיקסים:
                </Typography.Text>
                <ul style={{ paddingLeft: "20px", margin: "0" }}>
                    {size?.mixes?.map((mix, idx) => {
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
                        return (
                            <li key={idx} style={{ marginBottom: "4px" }}>
                                <Typography.Text>
                                    {mixes?.find((e) => e?._id === mix?.mixId)?.name} -{" "}
                                    {mix.quantity} {unitDisplay} - ₪{mix?.costForQuantity}
                                </Typography.Text>
                            </li>
                        );
                    })}
                </ul>
            </>}
        </div>
    )
}
