import React from 'react'
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';
import { DeleteOutlined, CloseOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTag } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from 'react-redux';

export default function SizesDetailsView({ size, index, handleEditSize, handleRemoveSize, ingredients, mixes, sizeSummary, priceExcludingVAT }) {

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
                <Col>
                    <Row>
                        <Typography.Text strong>מחיר ללא מע"מ:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{priceExcludingVATData} (₪{(size?.price - priceExcludingVATData).toFixed(2)})</Typography.Text>
                    </Row>
                    <Row>
                        <Typography.Text strong>עלות עבודה:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{sizeSummaryData?.laborCost} (₪{averageHourlyRate})</Typography.Text>
                    </Row>
                    <Row>
                        <Typography.Text strong>עלות מרכיבים:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{sizeSummaryData?.ingredientCost}</Typography.Text>
                    </Row>
                    <Row>
                        <Typography.Text strong>עלות מיקסים:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{sizeSummaryData?.mixCost}</Typography.Text>
                    </Row>
                    <Row>
                        <Typography.Text strong>עלות הוצאות קבועות:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{ }</Typography.Text>
                    </Row>
                    <Row>
                        <Typography.Text strong>אחוז רווח:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>{sizeSummaryData?.profitMargin}%</Typography.Text>
                    </Row>
                    <Row>
                        <Typography.Text strong>סך הכל עלות:</Typography.Text>
                        <Typography.Text style={{ marginRight: 8 }}>₪{sizeSummaryData?.totalCost}</Typography.Text>
                    </Row>
                </Col>
            </Row>

        )
    }

    return (
        <div
            key={size.idNew || index}
            style={{
                border: `1px solid #e6e6e6`,
                borderRadius: "8px",
                padding: "16px",
                background: "#fafafa",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                marginBottom: "16px",
            }}
        >
            <Flex
                flex={1}
                style={{ padding: "0em 1em" }}
                justify={"space-between"}
                align={"middle"}
            >
                <Col className="width-100">
                    <Flex flex={1} style={{ marginBottom: "8px" }}>
                        <Row
                            className="width-100"
                            align={"middle"}
                            justify={"space-between"}
                        >
                            <Typography.Text strong style={{ fontSize: "1.2em" }}>
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
                            </Flex>
                        </Row>
                    </Flex>
                    <Flex
                        flex={1}
                        align="start" // יישור להתחלה (לא חובה)
                        style={{ gap: "12px", marginBottom: "8px", flexDirection: "column" }}
                    >
                        <Row align="middle" style={{ gap: "8px" }}>
                            <FontAwesomeIcon
                                style={{ fontSize: "0.9em", }}
                                icon={faTag}
                            />
                            <Typography.Text
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                ₪{size?.price}
                            </Typography.Text>
                        </Row>
                        <Row align="middle" style={{ gap: "8px" }}>
                            <FontAwesomeIcon
                                style={{ fontSize: "0.9em" }}
                                icon={faClock}
                            />
                            <Typography.Text
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                {size?.preparationTime} דקות
                            </Typography.Text>
                        </Row>
                    </Flex>
                    {costDetailes(sizeSummary, priceExcludingVAT)}
                </Col>
            </Flex>
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
        </div>
    )
}
