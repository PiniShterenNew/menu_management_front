import React, { forwardRef, useRef, useState } from "react";
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
  ({ value = [], onChange, ingredients, mixes, onSubmit, onDelete, sizeSummary, priceExcludingVAT }, ref) => {

    const [newSizeId, setNewSizeId] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState("0"); // טאב פעיל
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
      const updatedSizes = [...value, newSize,];
      onChange(updatedSizes); // עדכון ה-state החיצוני
      refs.current[+activeTabKey]?.setFieldsValue({ ...newSize });
      setNewSizeId(newSize.idNew);
      setActiveTabKey((value.length).toString());
      setActiveSubTab("1"); // מעבר לטאב "מרכיבים"
    };


    return (
      <Flex style={{ flexDirection: "column" }}>
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
            <TabPane tab={size?.label || `גודל ${index + 1}`} key={index.toString()}>
              <SizeDetails
                ref={(el) => (refs.current[index] = el)} // שמירת ה-ref
                size={size}
                index={index}
                sizes={value}
                onChange={onChange}
                onDelete={onDelete}
                ingredients={ingredients}
                transformValueToForm={transformValueToForm}
                setActiveTabKey={setActiveTabKey}
                setActiveSubTab={setActiveSubTab} // מעבר בין טאבים פנימיים
                activeSubTab={activeSubTab} // טאב פנימי פעיל
                mixes={mixes}
                onSubmit={onSubmit}
                newSizeId={newSizeId}
                setNewSizeId={setNewSizeId}
                sizeSummary={sizeSummary && sizeSummary[index]}
                priceExcludingVAT={priceExcludingVAT && priceExcludingVAT[index]?.priceExcludingVAT}
              />
            </TabPane>
          ))}
        </Tabs>
      </Flex >
    );
  }
);

export default SizesManager;
