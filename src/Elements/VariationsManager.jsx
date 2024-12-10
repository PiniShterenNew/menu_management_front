import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Row,
  Col,
  Form,
  Typography,
  Flex,
  Divider,
  Select,
  Modal,
  Alert,
} from "antd";
import { DeleteOutlined, CloseOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTag } from "@fortawesome/free-solid-svg-icons";

import { Tabs } from "antd";
const { TabPane } = Tabs;

const VariationsManager = forwardRef(
  ({ value = [], sizes, onChange, ingredients, onSubmit, onDelete }, ref) => {

    const [newVariationId, setNewVariationId] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState("0"); // טאב פעיל
    const [form] = Form.useForm();

    // התאמה ל-Form עם מבנה מתאים
    const transformValueToForm = () => ({ value: value });

    // הוספת גודל חדש
    const handleAddVriaction = () => {
      const newVariations = {
        idNew: Date.now(),
        label: `וריאציה - ${value.length + 1}`,
        sizeAdjustments: [...sizes?.map((e) => ({
          sizeId: e?._id,
          label: e?.label,
          priceAdjustment: null,
          preparationTimeAdjustment: null,
          ingredients: e?.ingredients,
          mixes: e?.mixes,
          add: [],
          remove: [],
          update: []
        }))]
      };
      const updatedVariations = [...value, newVariations,];
      onChange(updatedVariations); // עדכון ה-state החיצוני
      form.setFieldsValue({
        variations: updatedVariations,
      });

      setNewVariationId(newVariations.idNew);
      setActiveTabKey((value.length).toString());
    };

    const handleRemoveVariation = (index) => {
      const variationToRemove = value[index]; // הגודל למחיקה

      if (variationToRemove?._id) {
        // אם הגודל נשמר בשרת, נקרא לפונקציה למחיקתו
        Modal.confirm({
          title: "האם אתה בטוח שברצונך למחוק את הוריאציה הזו?",
          content: `המחיקה תסיר לצמיתות את ${variationToRemove.label}.`,
          okText: "מחק",
          okType: "danger",
          cancelText: "ביטול",
          onOk: () => {
            onDelete(variationToRemove?.productId, variationToRemove._id)
              .then(() => {
                const updatedVariations = [...value];
                updatedVariations.splice(index, 1);
                onChange(updatedVariations); // עדכון ה-state החיצוני
                form.setFieldsValue({ sizes: updatedVariations }); // עדכון הערכים בטופס

                // עדכון הטאב הפעיל
                setActiveTabKey(
                  Math.max(0, index - 1).toString() // טאב קודם
                );
              })
              .catch((error) => {
                console.error("Error deleting vatiation:", error);
              });
          },
        });
      } else {
        // אם זה גודל חדש שטרם נשמר, נסיר אותו ישירות מה-state
        const updatedVariations = [...value];
        updatedVariations.splice(index, 1);
        onChange(updatedVariations); // עדכון ה-state החיצוני
        form.setFieldsValue(transformValueToForm()); // עדכון הערכים בטופס
        setActiveTabKey(
          Math.max(0, index - 1).toString() // טאב קודם
        );
        setNewVariationId(null);
      }
    };

    const handleEditSize = (index) => {
      const updatedVariations = [...value];
      updatedVariations[index] = {
        ...updatedVariations[index],
        edit: true, // הוספת מאפיין העריכה
      };
      onChange(updatedVariations); // עדכון ה-state החיצוני
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

    return (
      <Form
        form={form}
        initialValues={{
          variations: value,
        }}
        onFinish={(a, b) => {
          onSubmit({ variations: a?.variations?.filter((e) => e) });
        }}
      // onValuesChange={handleValuesChange}
      >
        {/* /////// top \\\\\\ */}
        {!sizes.length && (
          <Alert
            message="לא ניתן להוסיף וריאציות"
            description="יש להוסיף לפחות גודל אחד לפני שניתן להוסיף וריאציות."
            type="warning"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}
        <Button type="default" icon={<PlusOutlined />} disabled={sizes?.length === 0 || !sizes} onClick={handleAddVriaction}>
          הוסף וריאציה
        </Button>
        {/* \\\\\\\\///////// */}
        <Form.List name={["variations", "sizeAdjustments"]}>
          {(fields, { add, remove }) => {
            <Tabs
              activeKey={activeTabKey} // טאב פעיל
              onChange={(key) => setActiveTabKey(key)} // שינוי טאב
              tabBarStyle={{
                direction: "rtl",
              }}
              style={{ margin: "1vw 0" }}
              type="card" // סוג הטאבים
              tabPosition="top" // מציב את הטאבים למעלה
            >
              {fields.map(({ key, name, fieldKey }) => {
                // value?.map((variation, index) =>
                const variation = form.getFieldValue(["variations", "sizeAdjustments", key])
                return <TabPane tab={variation?.label || `גודל ${key + 1}`} key={key}>
                  {!variation?._id || variation?.edit ? (
                    <div
                      className={variation.idNew === newVariationId ? "highlight-new" : ""}
                      key={variation.idNew || key}
                      style={{
                        border: `1px ${variation?.idNew ? "dashed" : "solid #e6e6e6"}`,
                        borderRadius: "8px",
                        padding: "16px",
                        background: "#fafafa",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* top detailes */}
                      <Row
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: "12px" }}
                      >
                        <Form.Item name={["variations", "sizeAdjustments", key, "_id"]} hidden={true}>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={["variations", "sizeAdjustments", key, "label"]}
                          label="שם הוריאציה"
                          rules={[{ required: true, message: "חייב למלא שם גודל" }]}
                        >
                          <Input
                            placeholder="שם הוריאציה"
                            size="middle"
                            style={{ width: "auto", minWidth: "200px" }}
                          />
                        </Form.Item>
                        <Button
                          type="text"
                          style={{ alignSelf: "flex-start" }}
                          danger
                          icon={<DeleteOutlined />}
                          title="מחק וריאציה"
                          onClick={() => handleRemoveVariation(key)}
                        >מחק וריאציה</Button>
                      </Row>
                      {/* גדלים!!!! */}
                      <Form.List name={["variations", "sizeAdjustments", key]}>
                        {(fields, { add, remove }) => {
                          return <Tabs
                            tabBarStyle={{
                              direction: "rtl",
                            }}
                            style={{ margin: "1vw 0" }}
                            type="card" // סוג הטאבים
                            tabPosition="top" // מציב את הטאבים למעלה
                          >
                            {/* {sizes?.map((size, index) => ( */}
                            {fields.map(({ key, name, fieldKey }) => {
                              const sizeData = form.getFieldValue(["variations", index, "sizeAdjustments", name]);
                              return <TabPane tab={sizeData?.label || `Size ${name}`}
                                key={key}>
                                {/* price and preparationTime */}
                                <Row gutter={[16, 16]}>
                                  <Col span={12}>
                                    <Form.Item
                                      name={["variations", index, "price"]}
                                      label="תוספת מחיר"
                                      rules={[
                                        { required: false, message: "יש למלא מחיר" },
                                        {
                                          type: "number",
                                          min: 0,
                                          message: "המחיר חייב להיות חיובי",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        placeholder="מחיר"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      label="תוספת זמן הכנה (דקות)"
                                      name={["sizes", index, "preparationTime"]}
                                      rules={[
                                        { required: false, message: "חייב לציין זמן הכנה" },
                                      ]}
                                    >
                                      <InputNumber
                                        placeholder="זמן הכנה"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>

                                <Typography.Text
                                  strong
                                  style={{ display: "block", marginBottom: "8px" }}
                                >
                                  מרכיבים:
                                </Typography.Text>
                                <Form.List name={["sizes", index, "ingredients"]}>
                                  {(fields, { add, remove }) => (
                                    <>
                                      <Button
                                        type="dashed"
                                        style={{ marginBottom: "0.5vw" }}
                                        onClick={() => add({ ingredientId: null, quantity: null, unit: null })}
                                      >
                                        הוסף מרכיב
                                      </Button>
                                      <div style={{ maxHeight: "12vw", overflowY: "auto", overflowX: "hidden" }}>
                                        {fields.map(({ key, name, fieldKey }) => (
                                          <Row key={key} gutter={16}>
                                            {/* שדה לבחירת מרכיב */}
                                            <Col span={10}>
                                              <Form.Item
                                                name={[name, "ingredientId"]}
                                                fieldKey={[fieldKey, "ingredientId"]}
                                                rules={[{ required: true, message: "בחר רכיב" }]}
                                              >
                                                <Select
                                                  placeholder="בחר מרכיב"
                                                  showSearch
                                                  filterOption={(input, option) =>
                                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                                  }
                                                  options={ingredients.map((ing) => ({
                                                    value: ing._id,
                                                    label: ing.name,
                                                    unit: ing?.unit,
                                                  }))}
                                                />
                                              </Form.Item>
                                            </Col>

                                            {/* שדה להזנת כמות */}
                                            <Col span={10}>
                                              <Form.Item
                                                name={[name, "quantity"]}
                                                fieldKey={[fieldKey, "quantity"]}
                                                rules={[{ required: true, message: "הזן כמות" }]}
                                              >
                                                <InputNumber
                                                  placeholder="כמות"
                                                  addonAfter={getUnitDisplay(
                                                    form.getFieldValue([
                                                      "sizes",
                                                      index,
                                                      "ingredients",
                                                      name,
                                                      "unit",
                                                    ]) || ""
                                                  )}
                                                />
                                              </Form.Item>
                                            </Col>

                                            {/* כפתור מחיקה */}
                                            <Col span={4}>
                                              <Button
                                                type="text"
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => remove(name)}
                                              />
                                            </Col>
                                          </Row>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </Form.List>

                              </TabPane>
                            })}
                          </Tabs>
                        }}
                      </Form.List>
                      <Divider style={{ margin: "12px 0" }} />

                    </div>
                  ) : (
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
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditSize(index)} // עדכון כפתור לעריכה
                                />
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemoveVariation(index)}
                                />
                              </Flex>
                            </Row>
                          </Flex>
                          <Flex
                            flex={1}
                            align="middle"
                            style={{ gap: "12px", marginBottom: "8px" }}
                          >
                            <Row align="middle" style={{ gap: "8px" }}>
                              <Typography.Text
                                style={{
                                  color: "#007acc",
                                  fontSize: "1.1em",
                                  fontWeight: "bold",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                ₪{size?.price}
                              </Typography.Text>
                              <FontAwesomeIcon
                                style={{ fontSize: "0.9em", color: "#007acc" }}
                                icon={faTag}
                              />
                            </Row>
                            <Row align="middle" style={{ gap: "8px" }}>
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
                              <FontAwesomeIcon
                                style={{ fontSize: "0.9em" }}
                                icon={faClock}
                              />
                            </Row>
                          </Flex>
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
                                {ingredient.quantity} {unitDisplay}
                              </Typography.Text>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </TabPane>
              })}
            </Tabs>
          }}
        </Form.List>
        <Button
          type="primary"
          htmlType="submit"
          disabled={value.length === 0}
          onClick={() => setNewVariationId(null)}
        >
          שמור
        </Button>
      </Form >
    );
  }
);

export default VariationsManager;
