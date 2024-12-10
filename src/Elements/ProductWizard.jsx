import {
  Steps,
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Typography,
  Alert,
  Modal,
  Switch,
  Flex,
  Card,
  Tag,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SizesManager from "./SizesManager.jsx";
import VariationsManager from "./VariationsManager";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faRuler, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { useProductContext } from "../context/subcontexts/ProductContext.jsx";
import { useMediaQuery } from "react-responsive";
import isEqual from "lodash/isEqual";

const { Step } = Steps;
const { Title, Text } = Typography;

const ProductWizard = ({ }) => {
  const {
    isModalVisible,
    setIsModalVisible,
    modalMode,
    setModalMode,
    selectedItem,
    setSelectedItem,
    addProduct,
    updateProduct,
    deleteProduct,

    addSize,
    updateSize,
    deleteSize,
  } = useProductContext();

  const isMobile = useMediaQuery({ query: "(max-width: 1200px)" });

  const categories = useSelector((state) => state.categories);
  const ingredientsState = useSelector((state) => state.ingredients);
  const mixesState = useSelector((state) => state.mixes);

  const productsState = useSelector((state) => state.products);

  // פונקציה למיזוג בין selectedItem לשינויים מהשרת
  const mergeSelectedItem = useCallback(() => {
    if (!selectedItem || !productsState) return;

    // מציאת המוצר המעודכן ב-productsState
    const updatedProduct = productsState.find(
      (product) => product._id === selectedItem._id
    );

    if (updatedProduct) {
      // שמירה על נתונים מקומיים עבור כל השדות פרט ל-sizes ו-variations

      // עדכון selectedItem אם הנתונים השתנו
      if (!isEqual(selectedItem, updatedProduct)) {
        setSelectedItem(updatedProduct);
      }
    }
  }, [selectedItem, productsState]);

  // עדכון selectedItem כאשר המידע ב-productsState משתנה
  useEffect(() => {
    mergeSelectedItem();
  }, [productsState]);

  const [formProduct] = Form.useForm();
  const [formSize] = Form.useForm();
  const [formVariation] = Form.useForm();

  const title = (isModalVisible, modalMode, selectedItem) => {
    if (isModalVisible === "product") {
      switch (modalMode) {
        case "add":
          return "הוספת מוצר";
        case "edit":
          return "עדכון מוצר";
        case "view":
          return "צפייה במוצר";
        default:
          return "הוספת מוצר";
      }
    } else {
      switch (isModalVisible) {
        case "size":
          return `ניהול גדלים - ${selectedItem?.name}`
        case "variation":
          return `ניהול וריאציות - ${selectedItem?.name}`
      }
    }
  };

  useEffect(() => {

    if (selectedItem) {
      formProduct.setFieldsValue(selectedItem);
      formSize.setFieldsValue(selectedItem?.sizes || {});
      formVariation.setFieldsValue(selectedItem?.variations || {});
    } else {
      formProduct.resetFields();
      formSize.resetFields();
      formVariation.resetFields();
    }
  }, [selectedItem]);

  // {
  //   "type": "product",
  //   "data": {
  //     "name": "Espresso",
  //     "description": "Rich and bold espresso shot",
  //     "category": "64a123...",
  //     "image": "espresso.jpg",
  //     "isFeatured": true,
  //     "notes": "Best served hot"
  //   }
  // }

  //   const productSchema = new mongoose.Schema({
  //     name: { type: String, required: true },
  //     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  //     isFeatured: { type: Boolean, default: false },
  //     isOnSale: { type: Boolean, default: false },
  //     notes: { type: String, required: false }
  // }, { timestamps: true });

  const onSubmit = (arr) => {
    switch (isModalVisible) {
      case "product":
        const productData = formProduct.getFieldsValue();

        if (modalMode === "edit") {
          // עריכת מוצר
          updateProduct({ ...productData, _id: selectedItem?._id })
            .then(() => {
              setIsModalVisible(false);
              setSelectedItem(null);
            })
            .catch((error) => {
              console.error("שגיאה בעריכת מוצר:", error);
            });
        } else {
          // הוספת מוצר חדש
          addProduct(productData)
            .then(() => {
              setIsModalVisible(false);
              setSelectedItem(null);
            })
            .catch((error) => {
              console.error("שגיאה בהוספת מוצר:", error);
            });
        }
        break;

      case "size":
        const sizesData = arr; // קבלת הנתונים מהטופס
        const formattedSizes = sizesData?.sizes?.map((size) => ({
          productId: selectedItem?._id, // מזהה המוצר אליו שייך הגודל
          label: size.label,
          price: size.price,
          preparationTime: size.preparationTime,
          ingredients: size.ingredients?.map((ingredient) => ({
            ingredientId: ingredient.ingredientId?._id || ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })) || [],
          mixes: size.mixes?.map((mix) => ({
            mixId: mix.mixId,
            quantity: mix.quantity,
            unit: mix.unit,
          })) || [],
          _id: size._id, // מזהה הגודל (אם קיים)
        })) || [];

        // ניהול הוספה/עדכון של כל הגודל
        Promise.all(
          formattedSizes.map((size) => {
            if (size._id) {
              // אם יש מזהה, זהו עדכון
              return updateSize(size._id, size);
            } else {
              // אם אין מזהה, זהו גודל חדש
              return addSize(selectedItem?._id, size);
            }
          })
        )
          .then(() => {
            // setIsModalVisible(false);
            // setSelectedItem(null);
          })
          .catch((error) => {
            console.error("Error managing sizes:", error);
          });
        break;
      case "variation":
        // ניתן להוסיף כאן טיפול בוריאציות אם רלוונטי
        break;
    }
  };

  const screensEdit = () => {
    switch (isModalVisible) {
      case "product":
        return (
          <Form
            form={formProduct}
            layout="vertical"
            onFinish={onSubmit}
          >
            <Form.Item
              name="name"
              label="שם מוצר"
              rules={[{ required: true, message: "אנא הזן שם מוצר" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="קטגוריה"
              rules={[{ required: true, message: "אנא בחר קטגוריה" }]}
            >
              <Select
                showSearch
                placeholder="בחר קטגוריה"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="isFeatured" label="פעיל">
              <Switch
                checkedChildren="פעיל"
                unCheckedChildren="לא פעיל"
              />
            </Form.Item>
            <Form.Item name="isOnSale" label="מוצר מכירה">
              <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
            </Form.Item>
            <Form.Item
              name="notes"
              label="הערות"
              rules={[{ required: false, message: "אנא הזן הערות" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                שמור מוצר
              </Button>
            </Form.Item>
          </Form>
        );
      case "size":
        return (
          <SizesManager
            value={selectedItem?.sizes}
            form={formSize}
            setValue={setSelectedItem}
            ingredients={ingredientsState}
            sizeSummary={selectedItem?.sizeSummary}
            priceExcludingVAT={selectedItem?.priceExcludingVAT}
            mixes={mixesState}
            onDelete={deleteSize}
            onSubmit={onSubmit}
            onChange={(sizes) => setSelectedItem({ ...selectedItem, sizes })}
          />
        );
      case "variation":
        return (
          <VariationsManager
            value={selectedItem?.variations}
            form={formVariation}
            setValue={setSelectedItem}
            sizes={selectedItem?.sizes}
            ingredients={ingredientsState}
            onChange={(variations) =>
              setSelectedItem({ ...selectedItem, variations })
            }
          />
        );
      default:
        return null;
    }
  };

  const screensView = () => {
    switch (isModalVisible) {
      case "product":
        return (
          <Card>
            <Row
              align={"middle"}
              justify={"space-between"}
              style={{ margin: "1em 0em" }}
            >
              <Text strong style={{ fontSize: "1.5em" }}>
                {selectedItem?.name}
              </Text>
              <Row style={{ gap: "0.5em" }}>
                <Tag className={selectedItem?.isFeatured ? "green" : "red"}>
                  {selectedItem?.isFeatured ? "פעיל" : "לא פעיל"}
                </Tag>
                <Tag className={selectedItem?.isOnSale ? "blue" : "yellow"}>
                  {selectedItem?.isOnSale ? "במבצע" : "לא במבצע"}
                </Tag>
              </Row>
              <Tag>
                {
                  categories?.find((e) => e._id === selectedItem?.category)
                    ?.name
                }
              </Tag>
            </Row>
            <div
              style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Flex flex={1}>
                <Text strong>{"הערות"}:</Text>
              </Flex>
              <Flex flex={1}>
                <p style={{}}>{selectedItem?.notes}</p>
              </Flex>
            </div>
            <Divider style={{ margin: "8px 0" }} />
          </Card>
        );
      case "size":
        return (
          <SizesManager
            value={selectedItem?.sizes}
            sizeSummary={selectedItem?.sizeSummary}
            priceExcludingVAT={selectedItem?.priceExcludingVAT}
            mode={"view"}
            ingredients={ingredientsState}
            mixes={mixesState}
            onChange={(sizes) => setSelectedItem({ ...selectedItem, sizes })}
          />
        );
      case "variation":
        return (
          <VariationsManager
            value={selectedItem?.variations}
            mode={"view"}
            ingredients={ingredientsState}
            onChange={(variations) =>
              setSelectedItem({ ...selectedItem, variations })
            }
          />
        );
      default:
        return null;
    }
  };


  return (
    <Modal
      style={{ top: isMobile ? "3em" : "" }}
      title={title(isModalVisible, modalMode, selectedItem)}
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setSelectedItem();
      }}
      footer={null}
      destroyOnClose
      width={isMobile ? "100%" : 600}
      styles={{ gap: "0.5em" }}
    >
      {modalMode === "view" ? screensView() : screensEdit()}
    </Modal>
  );
};

export default ProductWizard;
