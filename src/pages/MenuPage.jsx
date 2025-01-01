import React, { useState, useEffect, useRef, useMemo } from "react";
import { Badge, Button, Flex, FloatButton, Row, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import { useProductContext } from "../context/subcontexts/ProductContext";
import Page from "../Elements/Page";
import CategoryForm from "../components/category/CategoryForm";
import "./MenuPage.css";
import { useMediaQuery } from "react-responsive";
import { faFolder, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductWizard from "../Elements/ProductWizard";
import CategoryScroll from "../Elements/CategoryScroll";

const { Text } = Typography;

function MenuPage() {
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    isModalVisible,
    setIsModalVisible,
    modalMode,
    setModalMode,
    selectedItem,
    setSelectedItem,
  } = useProductContext();
  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });

  const containerRef = useRef(null);

  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const [filters, setFilters] = useState({});

  const productsState = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const ingredientsState = useSelector((state) => state.ingredients)?.filter((e) => e?.is_active);

  const searchKeys = ["name", "category"];
  const mobileKeys = ["name", "category", "detailes", "sizes", "productSummary", "actions"];
  const sortKeys = [
    { key: "name", dataIndex: "name", title: "שם", required: true },
    { key: "category", dataIndex: "category", title: "קטגוריה" },
    { key: "profitMargin", dataIndex: "profitMargin", title: "אחוז רווח" },
  ];

  const tableKeys = useMemo(
    () => [
      {
        key: "detailes",
        dataIndex: "actions",
        width: 110,
        render: (_, record) => {
          return (
            <Flex style={{ flexDirection: "column" }}>
              <Badge
                className="!text-xs"
                status={record?.isFeatured ? "success" : "default"}
                text={record?.isFeatured ? "פעיל" : "לא פעיל"}
              />
              <Badge
                className="!text-xs"
                status={record?.isOnSale ? "processing" : "default"}
                text={record?.isOnSale ? "במבצע" : "לא במבצע"}
              />
            </Flex>
          )
        }
      },
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
        render: (_, record) => (
          <p className="text-base font-semibold	">{record?.name}</p>
        ),
      },
      {
        key: "category",
        dataIndex: "category",
        title: "קטגוריה",
        editable: true,
        type: "custom",
        render: (_, record) => {
          let category = categoriesState.find((cat) => cat._id === record?.category);
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
        render: (_, record, mode = "view", form) => (
          record?.sizes?.length
        ),
      },
      {
        key: "variations",
        title: "ווריאציות",
        type: "custom",
        editable: true,
        render: (_, record, mode = "view", form) => (
          record?.variations?.length
        ),
      },
      {
        key: "productSummary",
        dataIndex: "productSummary",
        title: "רווח (ממוצע לפי מחיר לצרכן)",
        width: 150,
        render: (_, record) => {
          return `${record?.productSummary?.averageProfitMarginInput || 0}% ₪${record?.productSummary?.totalGrossProfitInput || 0}`;
        },
      },
      {
        key: "productSummary",
        dataIndex: "productSummary",
        title: "רווח (ממוצע לפי מחיר מומלץ)",
        width: 150,
        render: (_, record) => {
          return `${record?.productSummary?.averageProfitMarginSuggested || 0}% ₪${record?.productSummary?.totalGrossProfitSuggested || 0}`;
        },
      },
      {
        key: "actions",
        dataIndex: "actions",
        width: 200,
        render: (_, record) => {
          return (
            <div className="" style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
              <Button
                type="text"
                onClick={() => {
                  setIsModalVisible("size");
                  setSelectedItem(record);
                }}
              >
                <p>גדלים</p>
                <FontAwesomeIcon icon={faFolder} />
              </Button>
              {/* <Button
                type="text"
                onClick={() => {
                  setIsModalVisible("variation");
                  setSelectedItem(record);
                }}
              >
                <p>ווריאציות</p>
                <FontAwesomeIcon icon={faStore} />
              </Button> */}
            </div>
          );
        },
      },
    ], [categoriesState]);

  const filtersArr = [
    {
      name: "קטגוריה",
      value: "category",
      type: "select",
      options: categoriesState?.map((cat) => ({ label: cat.name, value: cat._id })),
      filterFunction: (item, selectedValues) => selectedValues.includes(item.category),
    },
    {
      name: "סטטוס",
      value: "isActive",
      type: "radio",
      options: [
        { label: "פעיל", value: true },
        { label: "לא פעיל", value: false },
      ],
      filterFunction: (item, selectedValues) => selectedValues.includes(item.isActive),
    },
    {
      name: "אחוז רווח",
      value: "profitMargin",
      type: "range",
      options: null,
      filterFunction: (item, range) => item.profitMargin >= range[0] && item.profitMargin <= range[1],
    },
  ];

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersMenu") || "{}");
    setFilters(savedFilters);
  }, []);

  const saveFilters = (newFilters) => {
    setFilters(newFilters);
    localStorage.setItem("filtersMenu", JSON.stringify(newFilters));
  };

  useEffect(() => {
    if (productsState) {
      const filteredProducts =
        selectedCategory && selectedCategory !== "all"
          ? productsState.filter(
            (product) => product.category === selectedCategory
          )
          : productsState;
      setData(filteredProducts);
      setDataPrint(filteredProducts);
    }
  }, [productsState, selectedCategory]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      maxWidth: "100%", height: "100%", width: "100%", overflow: 'hidden',
      ['- webkit - overflow - scrolling']: 'touch',
    }}>
      {/* רכיב גלילה אופקית לקטגוריות */}
      {/* < div className="menu-page-container" >
        <div className="bubble-category-wrapper">
          <button className="scroll-button right" onClick={scrollRight}>
            &lt;
          </button>
          <div className="bubble-category-container" ref={containerRef}>
            <div
              className={`bubble-category-item ${selectedCategory === "all" ? "selected" : ""
                }`}
              onClick={() => setSelectedCategory("all")}
            >
              {"הכל"}
            </div>
            {categoriesState.map((category) => (
              <div
                key={category._id}
                className={`bubble-category-item ${selectedCategory === category._id ? "selected" : ""
                  }`}
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.name}
              </div>
            ))}
          </div>
          <button className="scroll-button left" onClick={scrollLeft}>
            &gt;
          </button>
          {!isMobile && (
            <div
              className="bubble-add-category"
              onClick={() => setIsCategoryModalVisible(true)}
            >
              +
            </div>
          )}
        </div>
      </div > */}
      <CategoryScroll
        categories={categoriesState}
        isMobile={isMobile}
        selectedCategory={selectedCategory}
        setIsCategoryModalVisible={setIsCategoryModalVisible}
        setSelectedCategory={setSelectedCategory}
      />
      {/* טבלת מוצרים */}
      <Flex flex={1}>
        <Page
          title={"תפריט"}
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
          // filters={filters}
          // saveFilters={saveFilters}
          // filtersArr={filtersArr}
          Dcontent={
            <>
              <p>האם אתה בטוח שברצונך למחוק את המוצר?</p>
              <p>שים לב! מחיקת מוצר עשויה להשפיע על מכירות ותערובות קשורות.</p>
            </>
          }
          iconADD={< FontAwesomeIcon icon={faStore} />}
          floatAction={
            [
              <FloatButton
                type="primary"
                onClick={() => setIsCategoryModalVisible(true)}
                icon={<FontAwesomeIcon icon={faFolder} />}
              />,
            ]}
          openModalProduct={(mode, item) => {
            setIsModalVisible("product");
            setModalMode(mode);
            if (item) setSelectedItem(item);
          }}
        />
      </Flex>
      < CategoryForm
        isCategoryModalVisible={isCategoryModalVisible}
        setIsCategoryModalVisible={setIsCategoryModalVisible}
      />
      <ProductWizard
      />
    </div >
  );
}

export default MenuPage;
