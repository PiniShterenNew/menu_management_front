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
} from "antd";
import { DeleteOutlined, CloseOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTag } from "@fortawesome/free-solid-svg-icons";

import { Tabs } from "antd";
import IngredientsManager from "./IngredientsManager";
const { TabPane } = Tabs;

const SizesManager = forwardRef(
  ({ value = [], onChange, ingredients, mixes, onSubmit, onDelete, sizeSummary, priceExcludingVAT }, ref) => {

    const [newSizeId, setNewSizeId] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState("0"); // טאב פעיל
    const [form] = Form.useForm();

    // התאמה ל-Form עם מבנה מתאים
    const transformValueToForm = () => ({ value: value });

    // הוספת גודל חדש
    const handleAddSize = () => {
      const newSize = {
        idNew: Date.now(),
        label: `גודל ${value.length + 1}`,
        price: null,
        preparationTime: null,
        ingredients: [],
        mixes: []
      };
      const updatedSizes = [...value, newSize,];
      onChange(updatedSizes); // עדכון ה-state החיצוני
      form.setFieldsValue(transformValueToForm()); // עדכון הערכים בטופס
      setNewSizeId(newSize.idNew);
      setActiveTabKey((value.length).toString());
    };

    const handleRemoveSize = (index) => {
      const sizeToRemove = value[index]; // הגודל למחיקה

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
                const updatedSizes = [...value];
                updatedSizes.splice(index, 1);
                onChange(updatedSizes); // עדכון ה-state החיצוני
                form.setFieldsValue({ sizes: updatedSizes }); // עדכון הערכים בטופס

                // עדכון הטאב הפעיל
                setActiveTabKey(
                  Math.max(0, index - 1).toString() // טאב קודם
                );
              })
              .catch((error) => {
                console.error("Error deleting size:", error);
              });
          },
        });
      } else {
        // אם זה גודל חדש שטרם נשמר, נסיר אותו ישירות מה-state
        const updatedSizes = [...value];
        updatedSizes.splice(index, 1);
        onChange(updatedSizes); // עדכון ה-state החיצוני
        form.setFieldsValue(transformValueToForm()); // עדכון הערכים בטופס
        setActiveTabKey(
          Math.max(0, index - 1).toString() // טאב קודם
        );
        setNewSizeId(null);
      }
    };


    const handleEditSize = (index) => {
      const updatedSizes = [...value];
      updatedSizes[index] = {
        ...updatedSizes[index],
        edit: true, // הוספת מאפיין העריכה
      };
      onChange(updatedSizes); // עדכון ה-state החיצוני
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

    const costDetailes = (index, sizeSummary, priceExcludingVAT) => {
      const sizeSummaryData = sizeSummary[index];
      if (!sizeSummaryData) return null;
      const priceExcludingVATData = priceExcludingVAT[index]?.priceExcludingVAT;
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
              <Typography.Text style={{ marginRight: 8 }}>₪{priceExcludingVATData}</Typography.Text>
            </Row>
            <Row>
              <Typography.Text strong>עלות עבודה:</Typography.Text>
              <Typography.Text style={{ marginRight: 8 }}>₪{sizeSummaryData?.laborCost}</Typography.Text>
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
      <Form
        form={form}
        initialValues={{
          sizes: value,
        }}
        onFinish={(a, b) => {
          onSubmit({ sizes: a?.sizes?.filter((e) => e) });
        }}
      // onValuesChange={handleValuesChange}
      >
        <Button type="default" icon={<PlusOutlined />} onClick={handleAddSize}>
          הוסף גודל
        </Button>
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
          {value?.map((size, index) => (
            <TabPane tab={size?.label || `גודל ${index + 1}`} key={index}>
              {!size?._id || size?.edit ? (
                <div
                  className={size.idNew === newSizeId ? "highlight-new" : ""}
                  key={size.idNew || index}
                  style={{
                    border: `1px ${size?.idNew ? "dashed" : "solid #e6e6e6"}`,
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
                    <Form.Item name={["sizes", index, "_id"]} hidden={true}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={["sizes", index, "label"]}
                      label="שם הגודל"
                      rules={[{ required: true, message: "חייב למלא שם גודל" }]}
                    >
                      <Input
                        placeholder="שם הגודל"
                        size="middle"
                        style={{ width: "auto", minWidth: "200px" }}
                      />
                    </Form.Item>
                    <Button
                      type="text"
                      style={{ alignSelf: "flex-start" }}
                      danger
                      icon={<DeleteOutlined />}
                      title="מחק גודל"
                      onClick={() => handleRemoveSize(index)}
                    >מחק גודל</Button>
                  </Row>
                  {/* price and preparationTime */}
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name={["sizes", index, "price"]}
                        label="מחיר"
                        rules={[
                          { required: true, message: "יש למלא מחיר" },
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
                        label="זמן הכנה (דקות)"
                        name={["sizes", index, "preparationTime"]}
                        rules={[
                          { required: true, message: "חייב לציין זמן הכנה" },
                        ]}
                      >
                        <InputNumber
                          placeholder="זמן הכנה"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider style={{ margin: "12px 0" }} />
                  <Typography.Text
                    strong
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    מרכיבים:
                  </Typography.Text>
                  <Form.List name={["sizes", index, "ingredients"]}>
                    {(fields, { add, remove }) => (
                      <>
                        <Button type="dashed" style={{ marginBottom: "0.5vw" }} onClick={() => add()}>
                          הוסף מרכיב
                        </Button>
                        <div style={{ maxHeight: "12vw", overflowY: "auto", overflowX: "hidden" }}>
                          {fields.map(({ key, name, fieldKey }) => (
                            <Row key={key} gutter={16}>
                              <Col span={10}>
                                <Form.Item
                                  name={[name, "ingredientId"]}
                                  fieldKey={[fieldKey, "ingredientId"]}
                                  rules={[{ required: true, message: "בחר רכיב" }]}
                                >
                                  <Select
                                    placeholder="בחר רכיב"
                                    showSearch
                                    filterOption={(input, option) =>
                                      option?.label?.toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={ingredients.map((ing) => ({
                                      value: ing._id,
                                      label: ing.name,
                                      unit: ing?.unit
                                    }))}
                                    onChange={(ingredientValue) => {
                                      // מציאת הרכיב שנבחר
                                      const selectedIngredient = ingredients.find((ing) => ing._id === ingredientValue);

                                      // יצירת עותק מעודכן של ה-sizes
                                      const updatedSizes = [...value];

                                      // עדכון הערכים הנוכחיים של הטופס
                                      const currentValues = form.getFieldValue(["sizes", index]);

                                      // עדכון השדה של המרכיב עם unit חדש
                                      currentValues.ingredients[name] = {
                                        ...currentValues.ingredients[name],
                                        ingredientId: ingredientValue,
                                        unit: selectedIngredient?.unit || "",
                                      };

                                      // עדכון הערך ב-sizes
                                      updatedSizes[index] = currentValues;

                                      // עדכון ה-state והטופס
                                      onChange(updatedSizes); // עדכון ב-parent
                                      form.setFieldsValue({ sizes: updatedSizes }); // עדכון הטופס
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item
                                  name={[name, "quantity"]}
                                  fieldKey={[fieldKey, "quantity"]}
                                  rules={[{ required: true, message: "הזן כמות" }]}
                                >
                                  <InputNumber addonAfter={getUnitDisplay(form.getFieldValue(["sizes", index, "ingredients", name, "unit"]) || "")} />
                                </Form.Item>
                              </Col>
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
                  <Divider style={{ margin: "12px 0" }} />
                  <Typography.Text
                    strong
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    מיקסים:
                  </Typography.Text>
                  <Form.List name={["sizes", index, "mixes"]}>
                    {(fields, { add, remove }) => (
                      <>
                        <Button type="dashed" style={{ marginBottom: "0.5vw" }} onClick={() => add()}>
                          הוסף מיקס
                        </Button>
                        <div style={{ maxHeight: "12vw", overflowY: "auto", overflowX: "hidden" }}>
                          {fields.map(({ key, name, fieldKey }) => (
                            <Row key={key} gutter={16}>
                              <Col span={10}>
                                <Form.Item
                                  name={[name, "mixId"]}
                                  fieldKey={[fieldKey, "mixId"]}
                                  rules={[{ required: true, message: "בחר מיקס" }]}
                                >
                                  <Select
                                    placeholder="בחר מיקס"
                                    showSearch
                                    filterOption={(input, option) =>
                                      option?.label?.toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={mixes.map((mix) => ({
                                      value: mix._id,
                                      label: mix.name,
                                      unit: mix?.unit
                                    }))}
                                    onChange={(mixValue) => {
                                      // מציאת מיקס שנבחר
                                      const selectedIngredient = mixes.find((ing) => ing._id === mixValue);

                                      // יצירת עותק מעודכן של ה-sizes
                                      const updatedSizes = [...value];

                                      // עדכון הערכים הנוכחיים של הטופס
                                      const currentValues = form.getFieldValue(["sizes", index, "mixes"]);

                                      // עדכון השדה של המרכיב עם unit חדש
                                      currentValues[name] = {
                                        ...currentValues[name],
                                        unit: selectedIngredient?.unit || "weight",
                                      };

                                      // עדכון הערך ב-sizes
                                      updatedSizes[index]["mixes"] = currentValues;
                                      // עדכון ה-state והטופס
                                      onChange(updatedSizes); // עדכון ב-parent
                                      form.setFieldsValue({ sizes: updatedSizes }); // עדכון הטופס
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item
                                  name={[name, "quantity"]}
                                  fieldKey={[fieldKey, "quantity"]}
                                  rules={[{ required: true, message: "הזן כמות" }]}
                                >
                                  <InputNumber addonAfter={getUnitDisplay(form.getFieldValue(["sizes", index, "mixes", name, "unit"]) || "")} />
                                </Form.Item>
                              </Col>
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
                              onClick={() => handleRemoveSize(index)}
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
                      {costDetailes(index, sizeSummary, priceExcludingVAT)}
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
                            {mix.quantity} {unitDisplay}
                          </Typography.Text>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </TabPane>
          ))}
        </Tabs>
        <Button
          type="primary"
          htmlType="submit"
          disabled={value.length === 0}
          onClick={() => setNewSizeId(null)}
        >
          שמור
        </Button>
      </Form >
    );
  }
);

export default SizesManager;
