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
  Tabs,
  Badge,
  Drawer,
  Segmented
} from "antd";
import SizesManager from "./SizesManager.jsx";
import VariationsManager from "./VariationsManager";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useProductContext } from "../context/subcontexts/ProductContext.jsx";
import { useMediaQuery } from "react-responsive";
import SizesDetailsView from "./sizes/SizesDetailsView.jsx";
import { set } from "react-hook-form";

const { Step } = Steps;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductWizard = ({ }) => {
  const {
    isModalVisible,
    setIsModalVisible,
    modalMode,
    setModalMode,
    selectedItem,
    setSelectedItem,
    selectedUpdateSize,
    setSelectedUpdateSize,

    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,

    addSize,
    updateSize,
    deleteSize,
  } = useProductContext();

  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });

  const categories = useSelector((state) => state.categories);
  const ingredientsState = useSelector((state) => state.ingredients)?.filter((e) => e?.is_active);
  const mixesState = useSelector((state) => state.mixes);

  const productsState = useSelector((state) => state.products);

  const [activeTabKey, setActiveTabKey] = useState("0");
  const [saveFlag, setSaveFlag] = useState(false);
  const [activeSizeIndex, setActiveSizeIndex] = useState(0);
  // פונקציה למיזוג בין selectedItem לשינויים מהשרת
  const mergeSelectedItem = useCallback(() => {
    if (!selectedItem || !productsState) return;

    // מציאת המוצר המעודכן ב-productsState
    const updatedProduct = productsState.find(
      (product) => product._id === selectedItem._id
    );

    if (updatedProduct && saveFlag) {
      // מיזוג הגדלים הקיימים ב-state
      // const mergedSizes = (selectedItem?.sizes || [])
      //   .filter((localSize) => {
      //     // שמור רק גדלים שהם:
      //     // 1. במצב edit: true.
      //     // 2. בעלי _id שמופיע ברשימה החדשה מהשרת.
      //     return (
      //       localSize.edit ||
      //       (localSize._id && updatedProduct.sizes?.some((size) => size._id === localSize._id))
      //     );
      //   })
      //   .map((localSize) => {
      //     // חפש גודל מעודכן מהשרת לפי _id
      //     const serverSize = updatedProduct.sizes?.find((size) => size._id === localSize._id);

      //     // אם יש התאמה, החלף בגודל המעודכן מהשרת, אחרת שמור את המקומי
      //     return serverSize ? serverSize : localSize;
      //   });

      // // הוסף גדלים חדשים מהשרת שאין להם התאמה ב-state המקומי
      // const newServerSizes = (updatedProduct.sizes || []).filter(
      //   (serverSize) => !(selectedItem?.sizes || []).some((localSize) => localSize._id === serverSize._id)
      // );

      // עדכון ה-state עם המידע המשולב
      setSelectedItem({
        ...updatedProduct,
        // sizes: [...mergedSizes, ...newServerSizes], // שמור את הגדלים המקומיים, המוחלפים, והחדשים
      });
    }
  }, [selectedItem, productsState]);

  // עדכון selectedItem כאשר המידע ב-productsState משתנה
  useEffect(() => {
    mergeSelectedItem();
  }, [productsState]);

  const [formProduct] = Form.useForm();

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
          return <>
            {`ניהול גדלים - ${selectedItem?.name}`}
            <CategoryDisplay
              categoriesState={categories}
              categoryId={selectedItem?.category}
            />
          </>
        case "variation":
          return <>
            {`ניהול וריאציות - ${selectedItem?.name}`}
            <CategoryDisplay
              categoriesState={categories}
              categoryId={selectedItem?.category}
            />
          </>
      }
    }
  };

  useEffect(() => {

    if (selectedItem) {
      formProduct.setFieldsValue(selectedItem);
    } else {
      formProduct.resetFields();
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

  const onSubmit = (arr, index) => {
    switch (isModalVisible) {
      case "product":
        const productData = formProduct.getFieldsValue();

        if (modalMode === "edit") {
          // עריכת מוצר
          updateProduct({ ...productData, _id: selectedItem?._id })
            .then(() => {
              setIsModalVisible(false);
              setSelectedItem(null);
              setSaveFlag(true);
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
        const sizesData = { ...selectedItem?.sizes[index], ...arr }; // קבלת הנתונים מהטופס
        const formattedSizes = {
          productId: selectedItem?._id, // מזהה המוצר אליו שייך הגודל
          label: sizesData.label,
          price: sizesData.price,
          preparationTime: sizesData.preparationTime,
          ingredients: sizesData.ingredients?.filter(e => e)?.map((ingredient) => ({
            ingredientId: ingredient.ingredientId?._id || ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })) || [],
          mixes: sizesData.mixes?.filter(e => e)?.map((mix) => ({
            mixId: mix.mixId,
            quantity: mix.quantity,
            unit: mix.unit,
          })) || [],
          _id: sizesData._id, // מזהה הגודל (אם קיים)
        } || {};
        // ניהול הוספה/עדכון של כל הגודל
        return new Promise((resolve, reject) => {
          if (formattedSizes._id) {
            updateSize(formattedSizes._id, formattedSizes).then(resolve).catch(reject);
          } else {
            addSize(selectedItem?._id, formattedSizes).then(resolve).catch(reject);
          }
        })
          .then(() => {
            setSaveFlag(true);
          })
          .catch((error) => {
            console.error("Error managing sizes:", error);
          });
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
              rules={[
                { required: true, message: "אנא הזן שם מוצר" },
                { max: 25, message: "שם המוצר לא יכול להיות יותר מ-25 תווים" }
              ]}
            >
              <Input maxLength={25} showCount />
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
              rules={[
                { required: false, message: "אנא הזן הערות" },
                { max: 250, message: "ההערות לא יכולות להיות יותר מ-250 תווים" }
              ]}
            >
              <Input.TextArea rows={4} maxLength={250} showCount />
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
            setValue={setSelectedItem}
            ingredients={ingredientsState}
            setSelectedUpdateSize={setSelectedUpdateSize}
            getProductById={getProductById}
            mixes={mixesState}
            onDelete={deleteSize}
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
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


  const CategoryDisplay = ({ categoryId, categoriesState }) => {
    let category = categoriesState.find((cat) => cat._id === categoryId);
    return (
      <div
        className="flex items-center w-fit gap-1 bg-white py-1 px-2 rounded-lg border border-zinc-200"
      >
        <div
          className="w-2.5 h-2.5 rounded-full shadow-sm border border-zinc-200"
          style={{ backgroundColor: category?.color }}
        />
        {category?.name}
      </div>
    );
  }

  const screensView = () => {
    switch (isModalVisible) {
      case "product":
        return (
          <div styles={{ body: { display: "flex", flexDirection: "column" } }}>
            <Flex
              style={{ gap: "1em", flexDirection: "column", margin: "0em 0em" }}
            >
              <div className="flex flex-row justify-between">
                <Text strong style={{ fontSize: "1.5em" }}>
                  {selectedItem?.name}
                </Text>
                <CategoryDisplay
                  categoriesState={categories}
                  categoryId={selectedItem?.category}
                />
              </div>
              <Flex style={{ gap: "0.5em", flexDirection: "column" }}>
                <Badge
                  status={selectedItem?.isFeatured ? "success" : "default"}
                  text={selectedItem?.isFeatured ? "פעיל" : "לא פעיל"}
                />
                <Badge
                  status={selectedItem?.isOnSale ? "processing" : "default"}
                  text={selectedItem?.isOnSale ? "במבצע" : "לא במבצע"}
                />
              </Flex>
            </Flex>
            {selectedItem?.notes?.length > 0 && <div
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
            </div>}
            <Flex className="mt-4 flex flex-col" flex={1}>
              <div style={{ margin: "1vw 0", width: "100%" }}>
                <Segmented
                  type="card"
                  className="rtl"
                  block
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    textAlign: "center",
                    // direction: "ltr"
                  }}
                  options={selectedItem?.sizes?.map((size, index) => ({
                    label: size.label, // שם הגודל
                    value: index, // אינדקס הגודל
                  }))}
                  value={activeSizeIndex}
                  onChange={(index) => setActiveSizeIndex(index)} // עדכון הגודל הפעיל
                />
              </div>
              <div style={{ marginTop: "16px", width: "100%" }} className="flex flex-col">
                {selectedItem?.sizes[activeSizeIndex] && (
                  <SizesDetailsView
                    handleEditSize={false}
                    handleRemoveSize={false}
                    index={activeSizeIndex}
                    size={selectedItem?.sizes?.[activeSizeIndex]}
                    type={"P"}
                    sizeInfo={(index) => {
                      setIsModalVisible("size");
                      setActiveTabKey(index?.toString() || "0");
                    }}
                    ingredients={ingredientsState}
                    mixes={mixesState}
                    priceExcludingVAT={
                      selectedItem?.priceExcludingVAT &&
                      selectedItem?.priceExcludingVAT[activeSizeIndex]?.priceExcludingVAT
                    }
                    sizeSummary={
                      selectedItem?.sizeSummary &&
                      selectedItem?.sizeSummary[activeSizeIndex]
                    }
                  />
                )}
              </div>
            </Flex>

          </div >
        );
      case "size":
        return (
          <SizesManager
            value={selectedItem?.sizes}
            setValue={setSelectedItem}
            ingredients={ingredientsState}
            setSelectedUpdateSize={setSelectedUpdateSize}
            getProductById={getProductById}
            mixes={mixesState}
            onDelete={deleteSize}
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
            onSubmit={onSubmit}
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
    <Drawer
      style={{ top: isMobile ? "3em" : "3em" }}
      title={title(isModalVisible, modalMode, selectedItem)}
      open={isModalVisible}
      onClose={() => {
        setIsModalVisible(false);
        setSelectedItem();
      }}
      footer={null}
      destroyOnClose
      height={isMobile ? "86vh" : "80vh"}
      width={isMobile ? "100%" : 700}
      styles={{ body: { height: "100%" } }}

    >
      {modalMode === "view" ? screensView() : screensEdit()}
    </Drawer>
  );
};

export default ProductWizard;
