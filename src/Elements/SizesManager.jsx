import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Button, Segmented, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SizeDetails from "./sizes/SizeDetails";

const SizesManager = forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const [newSizeId, setNewSizeId] = useState(null);
    const [activeSizeIndex, setActiveSizeIndex] = useState(0); // ניהול אינדקס הגודל הפעיל
    const refs = useRef([]); // אחסון ה-refs של כל רכיב בן

    const handleAddSize = () => {
      const newSize = {
        idNew: Date.now(),
        label: `גודל ${value.length + 1}`,
        price: null,
        preparationTime: null,
        ingredients: [],
        mixes: [],
        edit: true,
      };
      const updatedSizes = [...value, newSize];
      onChange(updatedSizes); // עדכון ה-state החיצוני
      setNewSizeId(newSize.idNew);
      setActiveSizeIndex(value.length); // הגדרת הגודל החדש כפעיל
    };

    return (
      <Flex style={{ flexDirection: "column" }}>
        <Button type="default" icon={<PlusOutlined />} onClick={handleAddSize}>
          הוסף גודל
        </Button>
        <div style={{ margin: "1vw 0", width: "100%" }}>
          <Segmented
            options={value?.map((size, index) => ({
              label: size.label || `גודל ${index + 1}`, // הצגת שם הגודל
              value: index, // שמירת האינדקס המקורי
            }))}
            value={activeSizeIndex} // שימוש באינדקס המקורי כערך
            onChange={(index) => setActiveSizeIndex(index)} // עדכון האינדקס הפעיל
            block
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
            }}
          />
        </div>
        {value.length > 0 && (
          <SizeDetails
            ref={(el) => (refs.current[activeSizeIndex] = el)} // שמירת ה-ref
            size={value[activeSizeIndex]} // שליחת הגודל הפעיל
            indexSize={activeSizeIndex}
            setSelectedUpdateSize={setSelectedUpdateSize}
            sizes={value}
            onChange={onChange}
            onDelete={onDelete}
            getProductById={getProductById}
            ingredients={ingredients}
            mixes={mixes}
            onSubmit={onSubmit}
            newSizeId={newSizeId}
            setNewSizeId={setNewSizeId}
          />
        )}
      </Flex>
    );
  }
);

export default SizesManager;
