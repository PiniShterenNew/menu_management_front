import React, { useContext, useState } from 'react';
import { List, Card, Button, Modal, Typography, Statistic, Row, Col } from 'antd';
import { AppContext } from '../context/AppContext';
import ProductForm from './ProductForm';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import "./ProductList.css";
import { useSelector } from 'react-redux';

const { Text } = Typography;
const VAT_RATE = 1.17;

const ProductList = ({ sortKey, categoryId }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const { updateProduct, deleteProduct, categoryData } = useContext(AppContext);
    const ingredientsState = useSelector((state) => state.ingredients);
    const productsState = useSelector((state) => state.products);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [expandedProduct, setExpandedProduct] = useState(null);

    const filteredProducts = categoryId
        ? productsState.filter((product) => product.categoryId === categoryId)
        : productsState;


    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalVisible(true);
    };

    const handleDelete = (productId) => {
        deleteProduct(productId);
    };

    const handleModalClose = () => {
        setEditingProduct(null);
        setIsModalVisible(false);
    };

    const handleExpand = (product) => {
        setExpandedProduct(expandedProduct?._id === product._id ? null : product);
    };

    const calculateTotalCost = (ingredients) => {
        return ingredients.reduce((total, ingredient) => {
            const ingredientDetails = ingredientsState.find((item) => item._id === ingredient.ingredientId);
            if (!ingredientDetails) return total;

            // Adjust quantity based on juice ratio if applicable
            let quantity = ingredient.quantity;
            if (ingredientDetails.isJuice && ingredientDetails.juiceRatio) {
                quantity = ingredient.quantity / ingredientDetails.juiceRatio;
            }

            // Calculate the correct cost per unit based on adjusted quantity
            const costPerUnit = ingredientDetails.pricePerUnit
                ? ingredientDetails.pricePerUnit
                : (ingredientDetails.price / ingredientDetails.quantity);

            return total + costPerUnit * quantity;
        }, 0).toFixed(2);
    };

    const calculateTotalQuantity = (ingredients) => {
        return ingredients.reduce((total, ingredient) => {
            const ingredientDetails = ingredientsState.find((item) => item._id === ingredient.ingredientId);
            if (!ingredientDetails) return total;
            if (ingredientDetails?.unit === "יחידות") return total;
            // Adjust quantity based on juice ratio if applicable
            let quantity = ingredient.quantity;

            return total + quantity;
        }, 0).toFixed(2);
    };

    const sortedData = [...filteredProducts].sort((a, b) => {
        if (sortKey === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortKey === 'price') {
            return a.price - b.price;
        }
        return 0;
    });

    return (
        <Card title="רשימת מוצרים">
            <List
                itemLayout="vertical"
                dataSource={sortedData}
                renderItem={(product) => {
                    const price = parseFloat(product.price) || 0;
                    const priceWithoutVAT = (price / VAT_RATE).toFixed(2);
                    const laborCost = parseFloat(product.laborCost) || 0;
                    const additionalCost = parseFloat(product.additionalCost) || 0;

                    // Updated cost calculation
                    const costWithoutVAT = Number(product?.totalRawCost) || 0;
                    const totalCost = (costWithoutVAT + laborCost + additionalCost);
                    const profit = (priceWithoutVAT - totalCost);
                    const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';

                    const totalQuantity = calculateTotalQuantity(product.ingredients);

                    return (
                        <List.Item
                            key={product._id}
                            actions={[
                                <Button type="dashed" onClick={() => handleEdit(product)}>ערוך</Button>,
                                <Button type="dashed" danger onClick={() => handleDelete(product._id)}>מחק</Button>,
                                <Button type="dashed" onClick={() => handleExpand(product)}>
                                    {expandedProduct?._id === product._id ? <UpOutlined /> : <DownOutlined />}
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <Row gutter={[16, 16]} align="stretch" justify="space-between">
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <p className='product-name'><strong>{product.name}</strong></p>
                                            <p>גודל: {product.size}</p>
                                            <p style={{ color: 'gray', margin: 0, fontWeight: 500 }}>
                                                קטגוריה: {
                                                    categoryData.find((category) => category._id === product.category)?.name || 'לא ידוע'
                                                }
                                            </p>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <Statistic title={`מחיר כולל מע"מ`} value={`₪${price.toFixed(2)}`} />
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <Statistic title={`מחיר ללא מע"מ`} value={`₪${priceWithoutVAT}`} />
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <Statistic title={`שיעור רווחיות`} value={`${profitMargin}%`} />
                                        </Col>
                                    </Row>
                                }
                            />
                            {expandedProduct?._id === product._id && (
                                <div style={{ marginTop: '10px' }}>
                                    <h4>רכיבי המוצר:</h4>
                                    {product.ingredients.length > 0 ? (
                                        <List
                                            dataSource={product.ingredients}
                                            renderItem={(ingredient) => {
                                                const ingredientDetails = ingredientsState.find((item) => item._id === ingredient.ingredientId);
                                                if (!ingredientDetails) return null;

                                                // Adjust quantity based on juice ratio if applicable
                                                let quantityProcessed = ingredient.quantity;
                                                let quantity = ingredient.quantity;
                                                if (ingredientDetails.isJuice && ingredientDetails.juiceRatio) {
                                                    quantity = ingredient.quantity / ingredientDetails.juiceRatio;
                                                }
                                                quantity = quantity.toFixed(2);
                                                const totalIngredientCost = Number(ingredient?.processedCost || ingredient?.actualCost).toFixed(2);

                                                return (
                                                    <List.Item key={ingredient._id}>
                                                        <List.Item.Meta
                                                            title={<p>{ingredientDetails?.name || 'חומר גלם לא ידוע'}</p>}
                                                            description={
                                                                <div>
                                                                    <p>{`כמות: ${quantityProcessed.toFixed(2)} ${ingredientDetails?.isJuice ? "ליטר" : ingredient.unit}, עלות כוללת: ₪${totalIngredientCost}`}</p>
                                                                    {ingredientDetails?.isJuice && <p>{`כמות גולמית: ${quantity} ${ingredientDetails?.unit}`}</p>}
                                                                    <Text type="secondary">{`מחיר ליחידה: ₪${ingredientDetails?.unitPrice} (${ingredientDetails?.unitDescription})`}</Text>
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    ) : (
                                        <p>אין רכיבים למוצר זה.</p>
                                    )}
                                    <h4>סיכום עלויות:</h4>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>עלות הרכיבים (ללא מע"מ): ₪{costWithoutVAT}</Col>
                                        <Col span={24}>עלויות עבודה: ₪{laborCost.toFixed(2)}</Col>
                                        <Col span={24}>עלויות נוספות: ₪{additionalCost.toFixed(2)}</Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                                        <Col span={24}>עלות ייצור כוללת (ללא מע"מ): ₪{totalCost}</Col>
                                        <Col span={24}>רווח נטו לאחר עלויות נוספות: ₪{profit}</Col>
                                        <Col span={24}>שיעור רווחיות: {profitMargin}%</Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                                        <Col span={24}>
                                            סה"כ משקל/נפח של רכיבים: {totalQuantity} {totalQuantity < 1 ? `(${(totalQuantity * 1000).toFixed(0)} גרם)` : ''}
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </List.Item>
                    );
                }}
            />

            <Modal
                title={editingProduct ? "ערוך מוצר" : "הוסף מוצר חדש"}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <ProductForm
                    addProduct={(product) => {
                        if (editingProduct) {
                            updateProduct(product);
                        } else {
                            addProduct(product);
                        }
                        handleModalClose();
                    }}
                    initialValues={editingProduct}
                    onClose={handleModalClose}
                />
            </Modal>
        </Card>
    );
};

export default ProductList;
