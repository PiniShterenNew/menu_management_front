import React, { useRef } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";

const CategoryScroll = ({
  categories,
  isMobile,
  selectedCategory,
  setSelectedCategory,
  setIsCategoryModalVisible,
}) => {
  const containerRef = useRef(null);
  const buttonRefs = useRef({}); // לשמירת הפניות לכפתורי הקטגוריות

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (buttonRefs.current[categoryId]) {
      buttonRefs.current[categoryId].scrollIntoView({
        behavior: "smooth",
        inline: "center", // מיקום ב-scroll
        block: "nearest",
      });
    }
  };

  return (
    <div style={{ padding: "16px", backgroundColor: "#f0f2f5" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* כפתור גלילה שמאלה */}
        <Button icon={<RightOutlined />} onClick={scrollLeft} />

        {/* קטגוריות */}
        <div
          ref={containerRef}
          style={{
            display: "flex",
            overflowX: "auto",
            flexGrow: 1,
            gap: "8px",
            padding: "8px 0",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE and Edge
          }}
        >
          <Button
            type={selectedCategory === "all" ? "primary" : "default"}
            onClick={() => handleCategorySelect("all")}
          >
            הכל
          </Button>
          {categories.map((category) => (
            <Button
              key={category._id}
              ref={(el) => (buttonRefs.current[category._id] = el)} // שמירת הפניה לכפתור
              type={selectedCategory === category._id ? "primary" : "default"}
              onClick={() => handleCategorySelect(category._id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* כפתור גלילה ימינה */}
        <Button icon={<LeftOutlined />} onClick={scrollRight} />

        {/* כפתור הוספה */}
        {!isMobile && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCategoryModalVisible(true)}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryScroll;
