import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Row, Col, Button, Divider, Form, Input, InputNumber, Typography, Select, Flex, Modal } from "antd";
import IngredientsList from "./IngredientsList";
import MixesList from "./MixesList";
import { DeleteOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTag } from "@fortawesome/free-solid-svg-icons";
import SizesDetailsEdit from "./SizesDetailsEdit";
import SizesDetailsView from "./SizesDetailsView";
import { addOrUpdateProductState } from "../../store/products";
import { useDispatch } from "react-redux";

const SizeDetails = forwardRef(({
    size,
    indexSize,
    getProductById,
    sizes,
    onChange,
    onDelete,
    newSizeId,
    setSelectedUpdateSize,
    setNewSizeId,
    transformValueToForm,
    setActiveTabKey,
    ingredients,
    mixes,
    activeSubTab,
    setActiveSubTab,
    onSubmit
}, ref) => {

    const [form] = Form.useForm();

    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        setFieldsValue: (values) => form.setFieldsValue(values), // מאפשר לאב לעדכן ערכים בטופס
        getFieldsValue: () => form.getFieldsValue(), // מאפשר לאב לקרוא ערכים מהטופס
        resetFields: () => form.resetFields(), // מאפשר לאב לאפס את הטופס
    }));

    const handleDuplicateSize = (index) => {
        const sizeToDuplicate = sizes[index];
        const newSize = {
            ...sizeToDuplicate,
            idNew: Date.now(),
            _id: undefined,
            ingredients: sizeToDuplicate.ingredients.map(ingredient => ({
                ...ingredient,
                _id: undefined
            })),
            mixes: sizeToDuplicate.mixes.map(mix => ({
                ...mix,
                _id: undefined
            }))
        };
        
        const updatedSizes = [...sizes];
        updatedSizes.splice(index + 1, 0, newSize);
        onChange(updatedSizes);
        setActiveTabKey((index + 1).toString());
        setNewSizeId(newSize.idNew);
    };

    const handleCancelEdit = () => {
        const updatedSizes = [...sizes];
        updatedSizes[indexSize] = {
            ...updatedSizes[indexSize],
            edit: false,
            ingredients: size.ingredients.filter((ingredient) => ingredient?._id), // שמור רק מרכיבים שמורים
            mixes: size.mixes.filter((mix) => mix?._id), // שמור רק מתכונים שמורים
        };
        onChange(updatedSizes);
    };

    const handleEditSize = (index) => {
        const updatedSizes = [...sizes];
        updatedSizes[index] = {
            ...updatedSizes[index],
            edit: true, // הוספת מאפיין העריכה
        };
        onChange(updatedSizes); // עדכון ה-state החיצוני
        setSelectedUpdateSize(index);
    };

    const handleRemoveSize = (index) => {
        const sizeToRemove = sizes[index]; // הגודל למחיקה

        if (sizeToRemove?._id) {
            // אם הגודל נשמר בשרת, נקרא לפונקציה למחיקתו
            Modal.confirm({
                title: "האם אתה בטוח שברצונך למחוק את הגודל הזה?",
                content: `המחיקה תסיר לצמיתות את ${sizeToRemove.label}.`,
                okText: "מחק",
                okType: "danger",
                cancelText: "ביטול",
                onOk: () => {
                    onDelete(sizeToRemove?.productId, sizeToRemove._id)
                        .then(() => {
                            const updatedSizes = [...sizes];
                            updatedSizes.splice(index, 1);
                            onChange(updatedSizes); // עדכון ה-state החיצוני
                            form.setFieldsValue({ ...updatedSizes[index] }); // עדכון הערכים בטופס

                            // עדכון הטאב הפעיל
                            setActiveTabKey(
                                Math.max(0, index - 1).toString() || '0'// טאב קודם
                            );
                            getProductById(sizeToRemove?.productId).then((res) => { dispatch(addOrUpdateProductState({ newProduct: res })); })
                        })
                        .catch((error) => {
                            console.error("Error deleting size:", error);
                        });
                },
            });
        } else {
            // אם זה גודל חדש שטרם נשמר, נסיר אותו ישירות מה-state
            const updatedSizes = [...sizes];
            updatedSizes.splice(index, 1);
            onChange(updatedSizes); // עדכון ה-state החיצוני
            form.setFieldsValue({
                ...size,
            }); // עדכון הערכים בטופס
            setActiveTabKey(
                Math.max(0, index - 1).toString() || '0' // טאב קודם
            );
            setNewSizeId(null);
        }
    };

    const getUnitDisplay = (unit) => {
        switch (unit) {
            case "weight":
                return 'ק"ג';
            case "volume":
                return "ליטר";
            case "units":
                return "יחידות";
            default:
                return "";
        }
    };

    useEffect(() => {
        console.log(form.getFieldsValue());
        console.log(size);


    }, [form, size]);

    return (
        !size?._id || size?.edit ?
            <Form
                form={form}
                initialValues={{
                    ...size,
                }}
            // onFinish={async (a, b) => {
            //     onSubmit(a);
            // }}
            // onValuesChange={handleValuesChange}
            >
                <SizesDetailsEdit
                    handleCancelEdit={handleCancelEdit}
                    handleRemoveSize={handleRemoveSize}
                    newSizeId={newSizeId}
                    size={size}
                    indexSize={indexSize}
                    onChange={onChange}
                    form={form}
                    ingredients={ingredients}
                    mixes={mixes}
                    setNewSizeId={setNewSizeId}
                    setActiveSubTab={setActiveSubTab} // מעבר בין טאבים פנימיים
                    activeSubTab={activeSubTab} // טאב פנימי פעיל
                    sizes={sizes}
                    getUnitDisplay={getUnitDisplay}
                    onSubmit={onSubmit}
                />
            </Form>
            :
            <SizesDetailsView
                handleEditSize={handleEditSize}
                handleRemoveSize={handleRemoveSize}
                index={indexSize}
                size={size}
                ingredients={ingredients}
                handleDuplicateSize={handleDuplicateSize}
                mixes={mixes}
            />

    );
});

export default SizeDetails;
