import { Button, Card, Col, Divider, Flex, List, Modal, Pagination, Row, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import VirtualList from 'rc-virtual-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import heIL from 'antd/lib/locale/he_IL';

export default function ListPage({ data, type, tableKeys, mobileKeys, openModal, Dtitle, Dcontent, onDelete }) {
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' });

    // State לפגינציה
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // הדף הנוכחי
    const [pageSize, setPageSize] = useState(6); // מספר הפריטים בעמוד
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
                            <List.Item className='width-100' key={item?._id} style={{ padding: "0" }}>
                                <Card className='width-100 padding-card' style={{ margin: "8px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                                    <Row align={"middle"} justify={"space-between"} style={{ margin: "1em 0em" }}>
                                        <Flex flex={1}><strong style={{ fontSize: "1.3em" }}>{item?.name}</strong ></Flex>
                                        <Flex flex={1} style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <strong>{tableKeys?.find((e) => e.key === "usedCount")?.title}</strong>
                                            <p>{item?.usedCount}</p>
                                        </Flex>
                                        {/* <Flex flex={1} align='center' justify='center'>{tableKeys?.find((e) => (e.key === "type" || e.key === "category"))?.render("", item, "view")}</Flex> */}
                                        {tableKeys?.find((e) => (e.key === "type" || e.key === "category"))?.render("", item, "view")}
                                    </Row>
                                    {tableKeys
                                        .filter((key) => (key.key !== "name" && key.key !== "type" && key?.key !== "category" && key?.key !== "actions") && mobileKeys?.includes(key?.key))
                                        .map((key, i, arr) => (
                                            <React.Fragment key={`${item?._id}-${key.key}`}>
                                                <div style={{ fontSize: "0.9em", display: "flex", justifyContent: "space-between" }}>
                                                    {key.title && <strong>{key.title}:</strong>}
                                                    <span>{key.render ? key.render(null, item, "view") : item[key.dataIndex] || "—"}</span>
                                                </div>
                                                {i < 2 && <Divider style={{ margin: "0.2em" }} />}
                                            </React.Fragment>
                                        ))}
                                    <Row className='card-actions' align={"middle"} justify={"center"}>
                                        {tableKeys?.find((e) => e.key === "actions")?.render(null, item)}
                                        {type === "P" && <Divider type='vertical' />}
                                        <Flex align='center' justify='center'>
                                            <Button type='text' onClick={() => handleDelete(item)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                            <Button type='text' onClick={() => openModal("edit", item)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button type='text' onClick={() => openModal("view", item)}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </Button>
                                        </Flex>
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
            <Flex flex={1} style={{ display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
                {/* <div style={{height: "150vh", width: "70vw", background: "green"}} />
            <div style={{height: "150vh", width: "70vw", background: "orange"}} /> */}
                <Flex flex={1} style={{ maxWidth: "100%", maxHeight: "90%", overflowY: "auto", overflowX: "auto", }}>
                    <Table
                        style={{minWidth: "100%"}}
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
                </Flex>
                {/* פגינציה מחוץ לטבלה */}
                <Flex align='center' justify='center' style={{ marginTop: "2vh" }}>
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
                </Flex>
            </Flex>
        )
}
