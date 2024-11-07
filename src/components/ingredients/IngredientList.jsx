// src/components/IngredientList.jsx - רשימת חומרי גלם עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useState } from 'react';
import { List, Card, Button, Modal } from 'antd';
import { AppContext } from '../../context/AppContext';
import IngredientForm from './IngredientForm';
import './IngredientList.css';
import { useSelector } from 'react-redux';

const IngredientList = ({ sortKey }) => {
    const { updateIngredient, deleteIngredient } = useContext(AppContext);
    const supplierState = useSelector((state) => state.suppliers);
    const ingredientsState = useSelector((state) => state.ingredients);
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
                                    <Button type="link" danger onClick={() => handleDelete(ingredient._id)}>מחק</Button>
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
                visible={isModalVisible}
                onCancel={handleModalClose}
                className='popup-modal'
                footer={null}
            >
                <IngredientForm
                    addIngredient={updateIngredient}
                    initialValues={editingIngredient}
                    onClose={handleModalClose}
                />
            </Modal>
        </Card >
    );
};

export default IngredientList;
