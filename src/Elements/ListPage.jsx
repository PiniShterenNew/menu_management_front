import { Button, Card, Col, Divider, Flex, List, Modal, Row, Table } from 'antd'
import React from 'react'
import { useMediaQuery } from 'react-responsive';
import VirtualList from 'rc-virtual-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ListPage({ data, tableKeys, mobileKeys, openModal, Dtitle, Dcontent, onDelete }) {
    const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });

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
                    style={{ maxHeight: "90%" }}
                >
                    <div
                        style={{
                            maxHeight: "calc(100vh - 245px)", // התאמה לפי גובה המסך
                            overflowY: "auto", // גלילה אנכית
                        }}
                    >
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
                                            <Flex flex={1} align='center' justify='center'>{tableKeys?.find((e) => (e.key === "type" || e.key === "category"))?.render("", item, "view")}</Flex>
                                        </Row>
                                        {tableKeys
                                            .filter((key) => (key.key !== "name" && key.key !== "type" && key?.key !== "category") && mobileKeys?.includes(key?.key))
                                            .map((key, i, arr) => (
                                                <React.Fragment key={`${item?._id}-${key.key}`}>
                                                    <div style={{ fontSize: "0.9em", display: "flex", justifyContent: "space-between" }}>
                                                        <strong>{key.title}:</strong>
                                                        <span>{key.render ? key.render(null, item, "view") : item[key.dataIndex] || "—"}</span>
                                                    </div>
                                                    {i < 2 && <Divider style={{ margin: "0.2em" }} />}
                                                </React.Fragment>
                                            ))}
                                        <Row className='card-actions' align={"middle"} justify={"center"}>
                                            <Button type='text' onClick={() => handleDelete(item)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                            <Button type='text' onClick={() => openModal("edit", item)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button type='text' onClick={() => openModal("view", item)}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </Button>
                                        </Row>
                                    </Card>
                                </List.Item>
                            )}
                        </VirtualList>
                    </div>
                </List>
            </>
        )
        : (
            <Flex style={{ maxWidth: "100%", overflowY: "auto", overflowX: "auto" }}>
                {/* <div style={{height: "150vh", width: "70vw", background: "green"}} />
            <div style={{height: "150vh", width: "70vw", background: "orange"}} /> */}
                <Table
                    columns={tableKeys}
                    dataSource={data}
                    scroll={{ x: "max-content" }} // גלילה אופקית אוטומטית
                    sticky // מאפשר דביקות כותרת הטבלה והעמודות שהוגדרו
                    style={{ maxWidth: "100%" }}
                    direction="rtl" // הגדרת כיווניות לטבלה
                />
            </Flex>
        )
}
