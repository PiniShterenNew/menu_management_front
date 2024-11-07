import React, { useContext, useState } from 'react';
import { List, Card, Button, Modal, Statistic, Row, Col } from 'antd';
import { AppContext } from '../../context/AppContext';
import MixForm from './MixForm';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import "./MixList.css";
import { useSelector } from 'react-redux';

const MixList = ({ sortKey }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const { updateMix, deleteMix } = useContext(AppContext);
    const mixesState = useSelector((state) => state.mixes);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMix, setEditingMix] = useState(null);
    const [expandedMix, setExpandedMix] = useState(null);

    const handleEdit = (mix) => {
        setEditingMix(mix);
        setIsModalVisible(true);
    };

    const handleDelete = (mixId) => {
        deleteMix(mixId);
    };

    const handleModalClose = () => {
        setEditingMix(null);
        setIsModalVisible(false);
    };

    const handleExpand = (mix) => {
        setExpandedMix(expandedMix?._id === mix._id ? null : mix);
    };

    const sortedData = [...mixesState].sort((a, b) => {
        if (sortKey === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    return (
        <Card title="רשימת תערובות">
            <List
                itemLayout={"vertical"}
                dataSource={sortedData}
                renderItem={(mix) => {
                    const totalCost = mix.totalCost;
                    const totalWeight = mix.totalWeight; // נוסיף את totalWeight

                    return (
                        <List.Item
                            key={mix._id}
                            actions={[
                                <Button type="dashed" onClick={() => handleEdit(mix)}>ערוך</Button>,
                                <Button type="dashed" danger onClick={() => handleDelete(mix._id)}>מחק</Button>,
                                <Button type="dashed" onClick={() => handleExpand(mix)}>
                                    {expandedMix?._id === mix._id ? <UpOutlined /> : <DownOutlined />}
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <Row gutter={[16, 16]} align="stretch" justify="space-between">
                                        <Col xs={24} sm={12} md={8} lg={6}>
                                            <p className='mix-name'><strong>{mix.name}</strong></p>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <Statistic title={`עלות כוללת`} value={`₪${totalCost.toFixed(2)}`} />
                                            <Statistic title={`נפח כולל (ק"ג/ליטר)`} value={`${totalWeight.toFixed(2)}`} /> {/* הצגת הנפח הכולל */}
                                        </Col>
                                    </Row>
                                }
                            />
                            {expandedMix?._id === mix._id && (
                                <div style={{ marginTop: '10px' }}>
                                    <h4>רכיבי התערובת:</h4>
                                    {mix.ingredients.length > 0 ? (
                                        <List
                                            dataSource={mix.ingredients}
                                            renderItem={(ingredient) => {
                                                const totalIngredientCost = ingredient.cost?.toFixed(2) || "0.00";
                                                const ifWeightOrVolumePerUnit = ingredient?.ingredientId?.weightOrVolumePerUnit;
                                                return (
                                                    <List.Item key={ingredient.ingredientId}>
                                                        <List.Item.Meta
                                                            title={<p>{ingredient?.ingredientId?.name || 'חומר גלם לא ידוע'}</p>}
                                                            description={
                                                                <div>
                                                                    <p>{`כמות: ${ingredient.quantity} ${ingredient.unit}, עלות כוללת: ₪${totalIngredientCost}`}</p>
                                                                    {ifWeightOrVolumePerUnit && <p>{`משקל/נפח: ${ifWeightOrVolumePerUnit * ingredient?.quantity}`}</p>}
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    ) : (
                                        <p>אין רכיבים לתערובת זו.</p>
                                    )}
                                </div>
                            )}
                        </List.Item>
                    );
                }}
            />

            <Modal
                title={editingMix ? "ערוך תערובת" : "הוסף תערובת חדשה"}
                open={isModalVisible}
                onCancel={handleModalClose}
                className='popup-modal'
                footer={null}
            >
                <MixForm
                    addMix={(mix) => {
                        if (editingMix) {
                            updateMix(mix);
                        } else {
                            addMix(mix);
                        }
                        handleModalClose();
                    }}
                    initialValues={editingMix}
                    onClose={handleModalClose}
                />
            </Modal>
        </Card>
    );
};

export default MixList;
