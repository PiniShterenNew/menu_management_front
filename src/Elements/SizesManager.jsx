import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Typography,
  Flex,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { Tabs } from "antd";
import SizeDetails from "./sizes/SizeDetails";
const { TabPane } = Tabs;

const SizesManager = forwardRef(
  ({
    value = [],
    onChange,
    getProductById,
    setSelectedUpdateSize,
    ingredients,
    activeTabKey,
    setActiveTabKey,
    mixes,
    onSubmit,
    onDelete,
  }, ref) => {

    const [newSizeId, setNewSizeId] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState("1");

    const refs = useRef([]); // אחסון ה-refs של כל רכיב בן

    /**
     * התאמה ל-Form עם מבנה מתאים
     * הפונקציה מקבלת את הערך החיצוני (value) ומחזירה אובייקט עם שדה value
     * כך שה-Form יכול לקבל אותו ולהעביר אותו לטופס
     * @param {Array} value הערך החיצוני שיש להתאים ל-Form
     * @returns {Object} אובייקט עם שדה value
     */
    const transformValueToForm = (value) => ({ value: value });

    /**
     * הוספת גודל חדש
     * מוסיף גודל חדש לטופס ומעדכן את ה-state החיצוני
     * ומעביר את הערכים לטופס
     */
    const handleAddSize = () => {
      const newSize = {
        idNew: Date.now(),
        label: `גודל ${value.length + 1}`,
        price: null,
        preparationTime: null,
        ingredients: [],
        mixes: [],
        edit: true
      };
      if (value?.length > 0) {
        newSize.mixes = value[value.length - 1].mixes;
        newSize.ingredients = value[value.length - 1].ingredients;
      }
      const updatedSizes = [...value, newSize,];
      onChange(updatedSizes); // עדכון ה-state החיצוני
      refs.current[+activeTabKey]?.setFieldsValue({ ...newSize });
      setNewSizeId(newSize.idNew);
      setActiveTabKey((value.length).toString() || '0');
      setActiveSubTab("1"); // מעבר לטאב "מרכיבים"
    };

    useEffect(() => {
      return () => {
        setActiveSubTab("1");
      }
    }, []);

    return (
      <Flex style={{ flexDirection: "column" }}>
        <Button type="default" icon={<PlusOutlined />} onClick={handleAddSize}>
          הוסף גודל
        </Button>
        <Tabs
          activeKey={activeTabKey} // טאב פעיל
          onChange={(key) => setActiveTabKey(key || '0')} // שינוי טאב
          tabBarStyle={{
            direction: "rtl",
          }}
          style={{ margin: "1vw 0" }}
          type="card" // סוג הטאבים
          tabPosition="top" // מציב את הטאבים למעלה
        >
          {value?.map((size, index) => (
            <TabPane tab={size?.label || `גודל ${index + 1}`} key={index.toString()}>
              <SizeDetails
                ref={(el) => (refs.current[index] = el)} // שמירת ה-ref
                size={size}
                indexSize={index}
                setSelectedUpdateSize={setSelectedUpdateSize}
                sizes={value}
                onChange={onChange}
                onDelete={onDelete}
                getProductById={getProductById}
                ingredients={ingredients}
                transformValueToForm={transformValueToForm}
                setActiveTabKey={setActiveTabKey}
                setActiveSubTab={setActiveSubTab} // מעבר בין טאבים פנימיים
                activeSubTab={activeSubTab} // טאב פנימי פעיל
                mixes={mixes}
                onSubmit={onSubmit}
                newSizeId={newSizeId}
                setNewSizeId={setNewSizeId}
              />
            </TabPane>
          ))}
        </Tabs>
      </Flex >
    );
  }
);

export default SizesManager;
