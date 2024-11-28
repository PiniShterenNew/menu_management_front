import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, FloatButton, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import { useProductContext } from "../context/subcontexts/ProductContext";
import Page from "../Elements/Page";
import CategoryForm from "../components/category/CategoryForm";
import "./MenuPage.css";
import { useMediaQuery } from "react-responsive";
import { faFolder, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Text } = Typography;

function MenuPage() {
  const { addProduct, updateProduct, deleteProduct } = useProductContext();
  const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });

  const containerRef = useRef(null);

  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const productsState = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const ingredientsState = useSelector((state) => state.ingredients);

  const searchKeys = ["name", "category"];
  const mobileKeys = ["name", "category", "sizes", "profitMargin"];
  const sortKeys = [
    { key: "name", dataIndex: "name", title: "שם", required: true },
    { key: "category", dataIndex: "category", title: "קטגוריה" },
    { key: "profitMargin", dataIndex: "profitMargin", title: "אחוז רווח" },
  ];

  const tableKeys = useMemo(() => [
    {
      key: "name",
      dataIndex: "name",
      title: "שם המוצר",
      editable: true,
      type: "text",
      rules: [
        { required: true, message: "חייב להיות שם מוצר" },
        { min: 2, message: "שם חייב להיות לפחות 2 תווים" },
      ],
    },
    {
      key: "category",
      dataIndex: "category",
      title: "קטגוריה",
      editable: true,
      type: "select",
      render: (_, record) => {
        return <Tag>{categoriesState?.find((e) => e._id === record?.category)?.name}</Tag>
      },
      options: categoriesState.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
      rules: [{ required: true, message: "יש לבחור קטגוריה" }],
    },
    {
      key: "sizes",
      title: "גדלים",
      type: "custom",
      editable: true,
      // render: (_, record, mode = "view", form) => (
      //   <SizesManager
      //     value={record.sizes}
      //     onChange={(val) => form.setFieldsValue({ sizes: val })}
      //     mode={mode === "add" || mode === "edit" || "view"} // ברירת מחדל למצב תצוגה
      //   />
      // ),
    },
    {
      key: "variations",
      title: "ווריאציות",
      type: "custom",
      editable: true,
      // render: (_, record, mode = "view", form) => (
      //   <VariationsManager
      //     value={record.variations}
      //     onChange={(val) => form.setFieldsValue({ variations: val })}
      //     sizes={record.sizes || []}
      //     mode={mode === "add" || mode === "edit" || "view"} // ברירת מחדל למצב תצוגה
      //   />
      // ),
    },
    {
      key: "profitMargin",
      dataIndex: "profitMargin",
      title: "אחוז רווח",
      render: (_, record) => {
        return `${record?.profitMargin}%`
      },
    },
  ], [categoriesState]);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  useEffect(() => {
    if (productsState) {
      const filteredProducts = selectedCategory
        && selectedCategory !== "all" ? productsState.filter((product) => product.category === selectedCategory)
        : productsState;
      setData(filteredProducts);
      setDataPrint(filteredProducts);
    }
  }, [productsState, selectedCategory]);

  return (
    <div style={{ maxWidth: "100%", height: "100%" }}>
      {/* רכיב גלילה אופקית לקטגוריות */}
      <div className="menu-page-container">
        <div className="bubble-category-wrapper">
          <button className="scroll-button right" onClick={scrollRight}>
            &lt;
          </button>
          <div className="bubble-category-container" ref={containerRef}>
            <div
              className={`bubble-category-item ${selectedCategory === "all" ? "selected" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              {"הכל"}
            </div>
            {categoriesState.map((category) => (
              <div
                key={category._id}
                className={`bubble-category-item ${selectedCategory === category._id ? "selected" : ""}`}
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.name}
              </div>
            ))}
          </div>
          <button className="scroll-button left" onClick={scrollLeft}>
            &gt;
          </button>
          {!isMobile && <div
            className="bubble-add-category"
            onClick={() => setIsCategoryModalVisible(true)}
          >
            +
          </div>}
        </div>
      </div>
      {/* טבלת מוצרים */}
      <Page
        type={"P"}
        data={data}
        mobileKeys={mobileKeys}
        dataPrint={dataPrint}
        sortKeys={sortKeys}
        tableKeys={tableKeys}
        newTitle={"הוסף מוצר חדש"}
        searchKeys={searchKeys}
        setDataPrint={setDataPrint}
        onAdd={addProduct}
        onEdit={updateProduct}
        onDelete={deleteProduct}
        ingredientsArr={ingredientsState}
        Dtitle={"אישור מחיקה"}
        Dcontent={
          <>
            <p>האם אתה בטוח שברצונך למחוק את המוצר?</p>
            <p>שים לב! מחיקת מוצר עשויה להשפיע על מכירות ותערובות קשורות.</p>
          </>
        }
        iconADD={<FontAwesomeIcon icon={faStore} />}
        floatAction={[<FloatButton type="primary" onClick={() => setIsCategoryModalVisible(true)} icon={<FontAwesomeIcon icon={faFolder} />} />]}
      />
      <CategoryForm
        isCategoryModalVisible={isCategoryModalVisible}
        setIsCategoryModalVisible={setIsCategoryModalVisible}
      />
    </div>
  );
}

export default MenuPage;
