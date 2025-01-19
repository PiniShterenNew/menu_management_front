import { Button, Card, Col, Divider, Flex, List, Modal, Pagination, Row, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import VirtualList from 'rc-virtual-list';
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, FilterOutlined } from "@ant-design/icons";
import heIL from 'antd/lib/locale/he_IL';

export default function ListPage({ data, type, tableKeys, mobileKeys, openModal, Dtitle, Dcontent, onDelete }) {
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
    const isExtraSmallTablet = useMediaQuery({ query: "(max-width: 600px)" }); // טאבלט קטן מאוד
    const isSmallTablet = useMediaQuery({ query: "(min-width: 601px) and (max-width: 768px)" }); // טאבלט קטן
    const isMediumTablet = useMediaQuery({ query: "(min-width: 769px) and (max-width: 900px)" }); // טאבלט בינוני
    const isLargeTablet = useMediaQuery({ query: "(min-width: 901px) and (max-width: 1024px)" }); // טאבלט רחב
    const isSmallDesktop = useMediaQuery({ query: "(min-width: 1025px) and (max-width: 1280px)" }); // מחשב קטן
    const isMediumDesktop = useMediaQuery({ query: "(min-width: 1281px) and (max-width: 1440px)" }); // מחשב בינוני
    const isSmallLargeDesktop = useMediaQuery({ query: "(min-width: 1441px) and (max-width: 1600px)" }); // מחשב רחב קטן
    const isMediumLargeDesktop = useMediaQuery({ query: "(min-width: 1601px) and (max-width: 1760px)" }); // מחשב רחב בינוני
    const isLargeLargeDesktop = useMediaQuery({ query: "(min-width: 1761px) and (max-width: 1920px)" }); // מחשב רחב גדול
    const isUltraWideDesktop = useMediaQuery({ query: "(min-width: 1921px)" }); // מסך אולטרה-רחב

    // פונקציה שמחזירה גובה לפי סוג המסך
    const getDynamicHeight = () => {
        if (isExtraSmallTablet) return "35vh"; // טאבלט קטן מאוד
        if (isSmallTablet) return "40vh"; // טאבלט קטן
        if (isMediumTablet) return "45vh"; // טאבלט בינוני
        if (isLargeTablet) return "50vh"; // טאבלט רחב
        if (isSmallDesktop) return "52vh"; // מחשב קטן
        if (isMediumDesktop) return "53vh"; // מחשב בינוני
        if (isSmallLargeDesktop) return "54vh"; // מחשב רחב קטן
        if (isMediumLargeDesktop) return "55vh"; // מחשב רחב בינוני
        if (isLargeLargeDesktop) return "64vh"; // מחשב רחב גדול
        if (isUltraWideDesktop) return "70vh"; // מסך אולטרה-רחב
        return "100vh"; // ברירת מחדל
    };


    // State לפגינציה
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // הדף הנוכחי
    const [pageSize, setPageSize] = useState(10); // מספר הפריטים בעמוד
    const [paginatedData, setPaginatedData] = useState([]); // הנתונים המפוצלים לדפים

    // פונקציה לפיצול הנתונים בהתאם לפגינציה
    const paginateData = (page, size) => {
        const start = (page - 1) * size;
        const end = start + size;
        return data.slice(start, end);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page); // עדכון הדף הנוכחי
        setPageSize(pageSize); // עדכון גודל העמוד
    };
    // עדכון הנתונים המפוצלים כשיש שינוי ב-pagination או בנתונים המקוריים
    useEffect(() => {
        setTotalItems(data.length); // עדכון סך כל הפריטים
        setPaginatedData(paginateData(currentPage, pageSize));
    }, [currentPage, pageSize, data]);

    const handleDelete = (item) => {
        Modal.confirm({
            title: Dtitle,
            content: Dcontent,
            okText: "מחק",
            cancelText: "בטל",
            onOk: () => onDelete(item?._id),
        });
    };

    return isMobile ?
        (
            <>
                <List
                    style={{
                        maxHeight: "55vh",
                        overflowY: "auto", // גלילה אנכית
                        minHeight: "80%",
                        height: "80%"
                    }}
                >
                    {/* <div
                        style={{
                            maxHeight: "100%", // התאמה לפי גובה המסך
                            overflowY: "auto", // גלילה אנכית
                        }}
                    > */}
                    <VirtualList
                        data={data}
                        // height={ContainerHeight}
                        itemHeight={47}
                        itemKey="_id"
                    >
                        {(item) => (
                            <List.Item className='width-100' key={item?._id} style={{ padding: "0" }}
                                onClick={(e) => {
                                    // בודק אם הלחיצה הייתה על או בתוך אזור הכפתורים
                                    if (!e.target.closest('.row-actions')) {
                                        openModal("view", item);  // או כל פעולה אחרת שתרצה
                                    }
                                }}
                            >
                                <Card className='width-100 padding-card' style={{ margin: "8px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                                    <Row align={"top"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                                        <div className='flex flex-col'>
                                            <Flex flex={1}><strong style={{ fontSize: "1.3em" }}>{item?.name}</strong ></Flex>
                                            <p className='leading-3'>{tableKeys?.find((e) => e.key === "usedCount")?.title}: {item?.usedCount}</p>
                                            {tableKeys?.find((e) => e.key === "is_active")?.render("", item, "view")}
                                        </div>
                                        <div>
                                            {/* <Flex flex={1} align='center' justify='center'>{tableKeys?.find((e) => (e.key === "type" || e.key === "category"))?.render("", item, "view")}</Flex> */}
                                            {tableKeys?.find((e) => (e.key === "type" || e.key === "category" || e.key === "is_active"))?.render("", item, "view")}
                                        </div>
                                    </Row>
                                    {tableKeys
                                        .filter((key) => (key.key !== "name" && key.key !== "type" && key?.key !== "category" && key?.key !== "actions" && key?.key !== "is_active") && mobileKeys?.includes(key?.key))
                                        .map((key, i, arr) => (
                                            <React.Fragment key={`${item?._id}-${key.key}`}>
                                                <div style={{ fontSize: "0.9em", display: "flex", justifyContent: "space-between" }}>
                                                    {key.title && <strong>{key.title}:</strong>}
                                                    <span>{key.render ? key.render(null, item, "view") : item[key.dataIndex] || "—"}</span>
                                                </div>
                                                {i < 2 && <Divider style={{ margin: "0.2em" }} />}
                                            </React.Fragment>
                                        ))}
                                    <Row className='card-actions mt-5' align={"middle"} justify={"center"}>
                                        {tableKeys?.find((e) => e.key === "actions")?.render(null, item)}
                                        {type === "P" && <Divider type='vertical' />}
                                        <div className="flex row-actions gap-5">
                                            <Button type="text" className="" onClick={() => openModal("edit", item)} icon={<EditOutlined />} />
                                            <Button type="text" className="" onClick={() => openModal("view", item)} icon={<EyeOutlined />} />
                                            <Button type="text" className=" text-red-600" onClick={() => handleDelete(item)} icon={<DeleteOutlined />} />
                                        </div>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    </VirtualList>
                    {/* </div> */}
                </List>
            </>
        )
        : (
            <>
                <div
                    style={{
                        flex: "1 1 auto", overflowY: "auto",
                        maxHeight: getDynamicHeight(), // הגדרת גובה דינמי
                    }}
                >
                    <Table
                        style={{ minWidth: "100%" }}
                        onRow={(record) => ({
                            onClick: (event) => {
                                // בודק אם הלחיצה לא הייתה על אזור הכפתורים
                                if (!event.target.closest('.row-actions')) {
                                    openModal("view", record)
                                }
                            },
                            style: { cursor: 'pointer' } // מוסיף סמן יד כשעוברים על השורה
                        })}
                        columns={tableKeys.map((column) => ({
                            ...column,
                            title: (
                                <Tooltip title={column.title}>
                                    <span
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "inline-block",
                                            maxWidth: "150px", // רוחב מקסימלי מותאם
                                        }}
                                    >
                                        {column.title}
                                    </span>
                                </Tooltip>
                            ),
                        }))}
                        // sticky
                        dataSource={paginatedData}
                        pagination={false} // ביטול פגינציה מובנית של הטבלה
                        // scroll={{ x: "100%" }} // גלילה אופקית אוטומטית
                        direction="rtl" // הגדרת כיווניות לטבלה
                    />
                </div>
                {/* פגינציה מחוץ לטבלה */}
                <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", alignItems: "center", padding: "1em" }}>
                    <Pagination
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        style={{ direction: "ltr" }}
                        showSizeChanger
                        pageSizeOptions={["6", "10", "20", "50"]}
                        locale={heIL}
                    />
                </div>
            </>
        )
}
