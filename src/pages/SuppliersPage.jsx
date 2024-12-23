// src/pages/SuppliersPage.jsx - דף הספקים עם שימוש ב-Ant Design מותאם לנייד
import React, { useContext, useEffect, useState } from 'react';
import { Button, message, Modal, Select, Tooltip } from 'antd';
import SupplierForm from '../components/suppliers/SupplierForm';
import SupplierList from '../components/suppliers/SupplierList';
import './SuppliersPage.css';
import { useSupplierContext } from '../context/subcontexts/SupplierContext';
import { useSelector } from 'react-redux';
import Page from '../Elements/Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

function SuppliersPage() {
  const { addSupplier,
    updateSupplier,
    deleteSupplier, } = useSupplierContext();

  const supplierState = useSelector((state) => state.suppliers);
  const ingredientsState = useSelector((state) => state.ingredients);

  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);

  const [filters, setFilters] = useState({});

  const searchKeys = ["name"];
  const mobileKeys = ["name", "phone", "email", "contact_name", "address", , "second_phone", "notes"]
  const sortKeys = [
    {
      key: "name",
      dataIndex: "name",
      title: "שם",
      required: true
    },
    {
      key: "usedCount",
      dataIndex: "usedCount",
      title: "כמות רכיבים",
    }
  ];

  const tableKeys = [
    {
      key: "name",
      dataIndex: "name",
      title: "שם הספק",
      editable: true,
      type: "text",
      width: 100,
      rules: [
        { required: true, message: "חייב להיות שם ספק" },
        { min: 3, message: "שם ספק חייב להיות לפחות 3 תווים" },
      ],
    },
    {
      key: "usedCount",
      dataIndex: "usedCount",
      title: "כמות רכיבים",
      editable: false,
    },
    {
      key: "phone",
      dataIndex: "phone",
      title: "טלפון",
      editable: true,
      type: "text",
      width: 100,
      rules: [
        { required: true, message: "חייב להיות מספר טלפון" },
        {
          pattern: /^[0-9]{9,10}$/,
          message: "טלפון חייב להיות מספר תקין באורך 9-10 ספרות",
        },
      ],
    },
    {
      key: "email",
      dataIndex: "email",
      title: "אימייל",
      editable: true,
      type: "text",
      width: 100,
      rules: [
        { required: true, message: "חייב להיות אימייל" },
        {
          type: "email",
          message: "אימייל לא תקין",
        },
      ],
    },
    {
      key: "contact_name",
      dataIndex: "contact_name",
      title: "איש קשר",
      editable: true,
      type: "text",
      width: 100,
      rules: [
        { required: true, message: "חייב להיות איש קשר" },
        { min: 3, message: "איש קשר חייב להיות לפחות 3 תווים" },
      ],
    },
    {
      key: "address",
      dataIndex: "address",
      title: "כתובת",
      editable: true,
      type: "text",
      width: 150,
      rules: [
        { required: true, message: "חייבת להיות כתובת" },
        { min: 5, message: "כתובת חייבת להיות לפחות 5 תווים" },
      ],
    },
    {
      key: "second_phone",
      dataIndex: "second_phone",
      title: "טלפון נוסף",
      editable: true,
      type: "text",
      width: 100,
      rules: [
        {
          pattern: /^[0-9]{9,10}$/,
          message: "טלפון חייב להיות מספר תקין באורך 9-10 ספרות",
        },
      ],
    },
    {
      key: "notes",
      dataIndex: "notes",
      title: "הערות",
      editable: true,
      type: "textArea",
      maxLength: 120,
      width: 150,
      rules: [
        { required: false },
        { max: 120, message: "מקסימום 120 תווים" },
      ],
      render: (_, record) => {
        const text = record?.notes || "—";
        return (
          <Tooltip title={text}>
            <span
              style={{
                display: "inline-block",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                maxWidth: "150px",
              }}
            >
              {text}
            </span>
          </Tooltip>
        );
      },
    },
  ];

  const filtersArr = [
    {
      name: "רשימת ספקים",
      value: "name",
      type: "select",
      options: supplierState.map((supplier) => ({
        label: supplier.name,
        value: supplier.name,
      })),
    },
    {
      name: "סטטוס רכיבים",
      value: "usedCount",
      type: "slider",
      min: 0,
      max: Math.max(...data.map((d) => d.usedCount || 0)),
    },
  ];


  useEffect(() => {
    if (supplierState) {
      const newData = supplierState.map((supplier) => {
        // ספירת מספר הרכיבים המשויכים לספק
        const usedCount = ingredientsState?.filter(
          (ingredient) => ingredient.supplierId === supplier._id
        ).length;

        return {
          ...supplier,
          usedCount,
        };
      });

      setData(newData);
      setDataPrint(newData);
    }
  }, [supplierState, ingredientsState]);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersSuppliers") || "{}");
    setFilters(savedFilters);
  }, []);

  const saveFilters = (filters) => {
    setFilters(filters);
    localStorage.setItem("filtersSuppliers", JSON.stringify(filters));
  };

  return (
    // <div style={{ padding: '20px' }} className="scrollable-content suppliers-page-container">
    //   <div className="suppliers-controls">
    //     <Button type="primary" onClick={showModal} className="add-supplier-button">
    //       הוסף ספק חדש
    //     </Button>
    //     <Select
    //       popupMatchSelectWidth={false} // מונע התאמה אוטומטית של הרוחב
    //       dropdownStyle={{ maxHeight: '60vh' }} // מגביל את הגובה כך שלא יחרוג מגובה המסך
    //       value={sortKey}
    //       onChange={(value) => setSortKey(value)}
    //       className="sort-select"
    //     >
    //       <Select.Option value="">מיין</Select.Option>
    //       <Select.Option value="name">מיין לפי שם</Select.Option>
    //     </Select>
    //   </div>

    //   <SupplierList sortKey={sortKey} />

    //   <Modal
    //     title="הוסף ספק חדש"
    //     open={isModalVisible}
    //     onCancel={handleModalClose}
    //     className='popup-modal'
    //     footer={null}
    //     destroyOnClose
    //   >
    //     <SupplierForm
    //       addSupplier={addSupplier}
    //       onClose={handleModalClose}
    //     />
    //   </Modal>
    // </div>
    <Page
      title={"ספקים"}
      titleView={"ספק"}
      data={data}
      mobileKeys={mobileKeys}
      dataPrint={dataPrint}
      sortKeys={sortKeys}
      tableKeys={tableKeys}
      newTitle={"הוסף ספק חדש"}
      searchKeys={searchKeys}
      setDataPrint={setDataPrint}
      onAdd={addSupplier}
      onEdit={updateSupplier}
      onDelete={deleteSupplier}
      Dtitle={"אישור מחיקה"}
      filters={filters}
      saveFilters={saveFilters}
      filtersArr={filtersArr} // העברת הסינונים
      iconADD={<FontAwesomeIcon icon={faTruck} />}
      Dcontent={(
        <>
          <p>האם אתה בטוח שברצונך למחוק את הספק?</p>
          <p>שים לב! במחיקת ספק אתה תמחוק את כל הרכיבים שלו וכן הם כמובן ימחקו מכל התערובות והמוצרים.</p>
        </>
      )}
    />
  );
}

export default SuppliersPage;
