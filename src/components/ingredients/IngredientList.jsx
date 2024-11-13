// src/components/IngredientList.jsx - רשימת חומרי גלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useRef, useState } from 'react';
import { List, Card, Button, Modal, Popconfirm } from 'antd';
import IngredientForm from './IngredientForm';
import './IngredientList.css';
import { useSelector } from 'react-redux';
import { useIngredientContext } from '../../context/subcontexts/IngredientContext';
import { DeleteOutlined } from '@ant-design/icons';

const IngredientList = ({ sortKey }) => {
    const { updateIngredient, deleteIngredient } = useIngredientContext();
    const supplierState = useSelector((state) => state.suppliers);
    const ingredientsState = useSelector((state) => state.ingredients);

    const ingredientFormRef = useRef();


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);

    const handleEdit = (ingredient) => {
        setEditingIngredient(ingredient);
        setIsModalVisible(true);
    };

    const handleDelete = (ingredientId) => {
        deleteIngredient(ingredientId);
    };

    const handleModalClose = () => {
        setEditingIngredient(null);
        setIsModalVisible(false);
        // ingredientFormRef.current?.resetFields();
    };

    const sortedData = [...ingredientsState].sort((a, b) => {
        if (sortKey === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortKey === 'price') {
            return a.price - b.price;
        } else if (sortKey === 'type') {
            return a.type.localeCompare(b.type);
        } else if (sortKey === 'pricePerUnit') {
            return parseFloat(a?.processedPrice || a.unitPrice) - parseFloat(b?.processedPrice || b.unitPrice);
        }
        return 0;
    });

    return (
        <Card title="רשימת חומרי גלם" className="ingredient-list-card">
            <List
                itemLayout="vertical"
                dataSource={sortedData}
                renderItem={(ingredient) => {
                    const supplierName = supplierState ? supplierState.find((supplier) => supplier._id === ingredient.supplierId)?.name || 'לא ידוע' : 'לא ידוע';

                    return (
                        <List.Item key={ingredient._id}
                            // className='ingredient-item'
                            actions={
                                [
                                    <Button type="link" onClick={() => handleEdit(ingredient)}>ערוך</Button>,
                                    <Popconfirm
                                        title="האם אתה בטוח שברצונך למחוק את חומר גלם זה?"
                                        onConfirm={() => handleDelete(ingredient._id)}
                                        okText="כן"
                                        cancelText="לא"
                                    >
                                        <Button icon={<DeleteOutlined />} danger />
                                    </Popconfirm>
                                ]}
                        >
                            <List.Item.Meta
                                title={<strong>{ingredient.name}</strong>}
                                description={
                                    <div>
                                        {/* <p>סוג: {ingredient.type}</p> */}
                                        {/* <p>ספק: {supplierName}</p> */}
                                        {/* <p>כמות: {ingredient.quantity} {ingredient.unit}</p> */}
                                        {/* <p>מחיר כולל מע"מ: ₪{ingredient.price}</p> */}

                                        {ingredient?.juiceRatio ? (
                                            <>
                                                <p>יחס מיץ: {ingredient?.juiceRatio * 100}%</p>
                                                <p>מחיר ליחידה מעובדת: ₪{ingredient?.processedPrice} ({ingredient?.unitDescription})</p>
                                            </>
                                        ) : (
                                            <p>מחיר ליחידה ללא מע"מ: ₪{ingredient?.unitPrice} ({ingredient?.unitDescription})</p>
                                        )}
                                        {ingredient.weightOrVolumePerUnit && (
                                            <p>משקל/נפח ליחידה: {ingredient.weightOrVolumePerUnit} {ingredient.unit === "יחידות" ? "גרם" : ingredient.unit}</p>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    );
                }}
            />

            <Modal
                title={editingIngredient ? "ערוך חומר גלם" : "הוסף חומר גלם חדש"}
                open={isModalVisible}
                onCancel={handleModalClose}
                className='popup-modal'
                afterClose={handleModalClose} // הוספת afterClose
                footer={null}
                destroyOnClose
            >
                <IngredientForm
                    addIngredient={updateIngredient}
                    initialValues={editingIngredient}
                    onClose={handleModalClose}
                    ref={ingredientFormRef}
                />
            </Modal>
        </Card >
    );
};

export default IngredientList;
