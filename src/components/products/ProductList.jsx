import React, { useContext, useState } from 'react';
import { List, Card, Button, Modal, Typography, Statistic, Row, Col, Popconfirm, Collapse } from 'antd';
import ProductForm from './ProductForm';
import { DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import "./ProductList.css";
import { useSelector } from 'react-redux';
import { useProductContext } from '../../context/subcontexts/ProductContext';
import { } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
const { Text } = Typography;
const Panel = Collapse.Panel;
const VAT_RATE = 1.17;

const ProductList = ({ sortKey, categoryId }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const { updateProduct, deleteProduct } = useProductContext();
    const categoriesState = useSelector((state) => state.categories);
    const ingredientsState = useSelector((state) => state.ingredients);
    const mixesState = useSelector((state) => state.mixes);
    const productsState = useSelector((state) => state.products);
    const overallAverageHourlyRateState = useSelector((state) => state.employeeHours.overallAverageHourlyRate);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isInfoVisible, setInfoVisible] = useState(false);
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
        setInfoVisible(expandedProduct?._id === product._id ? null : product);
    };

    const sortedData = [...filteredProducts].sort((a, b) => {
        if (sortKey === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortKey === 'price') {
            return a.price - b.price;
        }
        return 0;
    });

    const ProdutcsItem = ({ product }) => {
        const price = parseFloat(product.price) || 0;
        const priceWithoutVAT = (price / VAT_RATE).toFixed(2);
        const laborCost = parseFloat(product.laborCost) || overallAverageHourlyRateState / 60 * product?.preparationTime;
        const additionalCost = parseFloat(product.additionalCost) || 0;

        const costWithoutVAT = Number(product?.totalRawCost) || 0;
        const totalCost = (costWithoutVAT + laborCost + additionalCost);
        const profit = (priceWithoutVAT - totalCost).toFixed(2);
        const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';
        return (
            <List.Item key={product._id}
                actions={[
                    <Button type="dashed" onClick={() => handleExpand(product)}>
                        {expandedProduct?._id === product._id ? <UpOutlined /> : <DownOutlined />}
                    </Button>,
                    <Button type="dashed" onClick={() => handleEdit(product)}>ערוך</Button>,
                    <Popconfirm
                        title="האם אתה בטוח שברצונך למחוק את המוצר?"
                        onConfirm={() => handleDelete(product._id)}
                        okText="כן"
                        cancelText="לא"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>,
                ]}
            // style={{display: "flex", flexDirection: "column"}}
            >
                <List.Item.Meta
                    title={
                        <Row gutter={[16, 16]} align="stretch" justify="space-between">
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <p className='product-name'><strong>{product.name}</strong></p>
                                <p>גודל: {product.size}</p>
                                <p style={{ color: 'gray', margin: 0, fontWeight: 500 }}>
                                    קטגוריה: {
                                        categoriesState.find((category) => category._id === product.category)?.name || 'לא ידוע'
                                    }
                                </p>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Statistic  title={`מחיר כולל מע"מ`} value={`₪${price.toFixed(2)}`} />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Statistic title={`מחיר ללא מע"מ`} value={`₪${priceWithoutVAT}`} />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Statistic title={`שיעור רווחיות`} value={`${profitMargin}%`} />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Statistic valueStyle={{ direction: "rtl" }} title={`משך זמן הכנה (בדקות)`} value={`דק' ${product?.preparationTime}`} />
                            </Col>
                        </Row>
                    }
                />
            </List.Item>
        )
    }

    return (
        <Card title="רשימת מוצרים">
            <List>
                <VirtualList
                    data={sortedData}
                >
                    {(item) => <ProdutcsItem product={item} />}
                </VirtualList>
            </List>
            <Modal
                title={'פרטי מוצר'}
                open={isInfoVisible}
                onCancel={() => setInfoVisible(false)}
                className='popup-modal'
                footer={null}
            >
                {isInfoVisible && (() => {
                    const price = parseFloat(isInfoVisible?.price) || 0;
                    const priceWithoutVAT = (price / VAT_RATE).toFixed(2);
                    const laborCost = parseFloat(isInfoVisible?.laborCost) || overallAverageHourlyRateState / 60 * isInfoVisible?.preparationTime;
                    const additionalCost = parseFloat(isInfoVisible?.additionalCost) || 0;

                    const costWithoutVAT = Number(isInfoVisible.totalRawCost) || 0;
                    const totalCost = (costWithoutVAT + laborCost + additionalCost);
                    const profit = (priceWithoutVAT - totalCost).toFixed(2);
                    const profitMargin = priceWithoutVAT > 0 ? ((profit / priceWithoutVAT) * 100).toFixed(2) : '0.00';
                    return <div style={{ marginTop: '10px' }}>
                        <h4>סיכום עלויות:</h4>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>עלות רכיבים ומיקסים (ללא מע"מ): ₪{costWithoutVAT}</Col>
                            <Col span={24}>עלויות עבודה: ₪{laborCost.toFixed(2)}</Col>
                            <Col span={24}>עלויות נוספות: ₪{additionalCost.toFixed(2)}</Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                            <Col span={24}>עלות ייצור כוללת (ללא מע"מ): ₪{totalCost?.toFixed(2)}</Col>
                            <Col span={24}>רווח נטו לאחר עלויות נוספות: ₪{profit}</Col>
                            <Col span={24}>שיעור רווחיות: {profitMargin}%</Col>
                        </Row>

                        <Collapse bordered={false}>
                            <Panel header="פירוט מרכיבים" key="1">
                                <>
                                    <h4>רכיבי המוצר:</h4>
                                    {isInfoVisible?.ingredients?.length > 0 ? (
                                        <List
                                            dataSource={isInfoVisible?.ingredients}
                                            renderItem={(ingredient) => {
                                                const ingredientDetails = ingredientsState.find((item) => item._id === ingredient.ingredientId);
                                                if (!ingredientDetails) return null;

                                                let quantityProcessed = ingredient.quantity;
                                                const totalIngredientCost = Number(ingredient?.processedCost || ingredient?.actualCost).toFixed(2);

                                                return (
                                                    <List.Item key={ingredient._id}>
                                                        <List.Item.Meta
                                                            title={<p>{ingredientDetails?.name || 'חומר גלם לא ידוע'}</p>}
                                                            description={
                                                                <div>
                                                                    <p>{`כמות: ${quantityProcessed.toFixed(2)} ${ingredientDetails.unit}, עלות כוללת: ₪${totalIngredientCost}`}</p>
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
                                    {isInfoVisible?.mixes?.length > 0 && (
                                        <>
                                            <h4>מיקסים במוצר:</h4>
                                            <List
                                                dataSource={isInfoVisible?.mixes}
                                                renderItem={(mix) => {
                                                    const mixDetails = mixesState.find((item) => item._id === mix.mixId);
                                                    if (!mixDetails) return null;

                                                    const totalMixCost = Number(mix.actualCost).toFixed(2);

                                                    return (
                                                        <List.Item key={mix._id}>
                                                            <List.Item.Meta
                                                                title={<p>{mixDetails?.name || 'מיקס לא ידוע'}</p>}
                                                                description={
                                                                    <div>
                                                                        <p>{`כמות: ${mix.quantity.toFixed(2)} ליטר, עלות כוללת: ₪${totalMixCost}`}</p>
                                                                    </div>
                                                                }
                                                            />
                                                        </List.Item>
                                                    );
                                                }}
                                            />
                                        </>
                                    )}
                                </>
                            </Panel>
                        </Collapse>
                    </div>
                })()}
            </Modal>
            <Modal
                title={editingProduct ? "ערוך מוצר" : "הוסף מוצר חדש"}
                open={isModalVisible}
                onCancel={handleModalClose}
                className='popup-modal'
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
