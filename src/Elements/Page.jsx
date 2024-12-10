import {
  Button,
  Checkbox,
  Dropdown,
  Flex,
  FloatButton,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import ListPage from "./ListPage";
import "./style.css";
import {
  faSort,
  faTable,
  faPlus,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "react-responsive";
import DynamicFormPage from "./AddOrEditPage";
import ProductWizard from "./ProductWizard";

const { Search } = Input;

export default function Page({
  dataPrint,
  data,
  tableKeys,
  newTitle,
  setDataPrint,
  searchKeys,
  sortKeys,
  mobileKeys,
  Dtitle,
  Dcontent,
  onAdd,
  onEdit,
  onDelete,
  width,
  ingredientsArr,
  iconADD,
  floatAction,
  type,
  openModalProduct
}) {
  const [tableKeysPrint, setTableKeysPrint] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", "view"
  const [selectedItem, setSelectedItem] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width: 1200px)" });

  const sortItems = sortKeys.map((key) => ({
    key: key?.key,
    label: (
      // <Row align="middle" className="width-100" onClick={(e) => e.stopPropagation()}>
      <span
        className="width-100"
        onClick={() => {
          // פעולה למיון על פי המפתח שנבחר
          const sortedData = [...dataPrint].sort((a, b) => {
            const aValue = a[key?.key];
            const bValue = b[key?.key];

            // בדיקה אם מדובר במספרים
            if (typeof aValue === "number" && typeof bValue === "number") {
              return bValue - aValue; // מיון מספרי
            }

            // מיון טקסטואלי עבור ערכים אחרים
            return aValue?.toString().localeCompare(bValue?.toString());
          });
          setDataPrint(sortedData);
        }}
      >
        {key?.title}
      </span>
      // </Row>
    ),
  }));

  const handleSelect = (key) => {
    if (key === "all") {
      // אם הכל נבחר, בוחרים את כל המפתחות
      setTableKeysPrint(tableKeys);
    } else {
      let index = tableKeysPrint.findIndex((e) => e.key === key);
      let keys = [...tableKeysPrint];
      if (index !== -1) {
        keys = keys.filter((e) => e.key !== key);
      } else {
        keys = [...keys, tableKeys.find((e) => e.key === key)];
      }
      setTableKeysPrint(keys);
    }
  };

  const items = [
    {
      key: "all",
      label: (
        <Checkbox
          className="width-100"
          rootClassName="width-100"
          checked={tableKeysPrint.length === tableKeys.length}
          disabled={tableKeysPrint.length === tableKeys.length}
          onChange={() => handleSelect("all")}
          onClick={(e) => e.stopPropagation()}
        >
          {"הכל"}
        </Checkbox>
      ),
    },
    ...tableKeys
      .filter((e) => !e?.required)
      .map(({ title, dataIndex }) => ({
        key: dataIndex,
        label: (
          <Checkbox
            className="width-100"
            rootClassName="width-100"
            checked={tableKeysPrint.some((e) => e.key === dataIndex)}
            disabled={
              tableKeysPrint.length <= 3 &&
              tableKeysPrint.some((e) => e.key === dataIndex)
            }
            onChange={() => handleSelect(dataIndex)}
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </Checkbox>
        ),
      })),
  ];

  const openModal = (mode, item = null) => {
    if (type === "P") {
      return openModalProduct(mode, item)
    }
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: Dtitle,
      content: Dcontent,
      okText: "מחק",
      cancelText: "בטל",
      onOk: () => onDelete(item?._id),
    });
  };

  useEffect(() => {
    setTableKeysPrint(tableKeys);
  }, [tableKeys]);

  return (
    <Flex
      flex={1}
      vertical
      style={{ maxWidth: "100%" }}
      gap={"1em"}
      className="container"
    >
      <Row align={"middle"} style={{ flexFlow: "" }} justify={"space-between"}>
        {/* add new button */}
        {!isMobile && (
          <Row style={{}}>
            <Button onClick={() => openModal("add")} type="primary">
              {newTitle}
            </Button>
          </Row>
        )}
        {/* search */}
        <Row style={{}}>
          <Search
            placeholder="חיפוש ..."
            allowClear
            onChange={({ target }) => {
              setDataPrint(
                data?.filter((e) =>
                  searchKeys.some((key) =>
                    e[key]
                      ?.toString()
                      ?.toLowerCase()
                      ?.includes(target.value.toLowerCase())
                  )
                )
              );
            }}
            style={{ width: 200 }}
          />
        </Row>
        {/* sort and cells manage */}
        <Row style={{ gap: "0.5em" }}>
          {!isMobile && (
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              open={dropdownOpen}
              onOpenChange={(open) => setDropdownOpen(open)} // מנהל מצב פתיחה/סגירה
            >
              <Button>
                <FontAwesomeIcon icon={faTable} style={{ marginLeft: "8px" }} />
                {isMobile ? (
                  <>{`${tableKeysPrint.length} / ${tableKeys.length}`}</>
                ) : (
                  <>
                    {`בחרת ${tableKeysPrint.length} מתוך ${tableKeys.length}`}
                  </>
                )}
              </Button>
            </Dropdown>
          )}
          <Dropdown menu={{ items: sortItems }} trigger={["click"]}>
            <Button type={isMobile ? "link" : "default"}>
              <FontAwesomeIcon icon={faSort} style={{ marginLeft: "8px" }} />
              מיון
            </Button>
          </Dropdown>
        </Row>
      </Row>
      {/* float button for mobile */}
      <FloatButton.Group
        trigger="click"
        type="primary"
        icon={<FontAwesomeIcon icon={faPlus} />}
      >
        <FloatButton
          type={"primary"}
          onClick={() => openModal("add")}
          icon={iconADD}
        />
        {floatAction?.map((e, index) => (
          <React.Fragment key={`float-action-${index}`}>{e}</React.Fragment>
        ))}
      </FloatButton.Group>
      {/* list table */}
      <ListPage
        data={dataPrint}
        tableKeys={[
          {
            title: "פעולות",
            key: "action",
            width: 140,
            render: (_, record) => {
              return (
                <Row
                  className="card-actions"
                  align={"middle"}
                  justify={"center"}
                >
                  <Button type="text" onClick={() => handleDelete(record)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button type="text" onClick={() => openModal("edit", record)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button type="text" onClick={() => openModal("view", record)}>
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </Row>
              );
            },
          },
          ...tableKeysPrint,
        ]}
        openModal={openModal}
        mobileKeys={mobileKeys}
        type={type}
        Dtitle={Dtitle}
        Dcontent={Dcontent}
        onDelete={onDelete}
      />
      <Modal
        style={{ top: isMobile ? "3em" : "" }}
        title={
          modalMode === "add"
            ? "הוסף פריט חדש"
            : modalMode === "edit"
              ? "ערוך פריט"
              : "צפייה בפרטי פריט"
        }
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : width ? width : 600}
      >
        {type !== "P" && (
          <DynamicFormPage
            mode={modalMode}
            tableKeys={tableKeysPrint}
            ingredientsArr={ingredientsArr}
            fields={tableKeys.filter(
              (key) => key.editable || modalMode === "view"
            )}
            onSubmit={(values) => {
              if (modalMode === "add") onAdd(values);
              if (modalMode === "edit") onEdit({ ...selectedItem, ...values });
              closeModal();
            }}
            initialValues={selectedItem || {}}
            onClose={closeModal}
          />
        )}
      </Modal>
    </Flex>
  );
}
