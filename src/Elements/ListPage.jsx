import { Button, Card, Divider, Flex, List, Row, Table } from 'antd'
import React from 'react'
import { useMediaQuery } from 'react-responsive';
import VirtualList from 'rc-virtual-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faE } from '@fortawesome/free-solid-svg-icons';

export default function ListPage({ data, tableKeys, mobileKeys, openModal }) {
    const isMobile = useMediaQuery({ query: '(max-width: 1200px)' });

    return isMobile ?
        (
            <>
                <List
                    style={{ maxHeight: "100%" }}
                >
                    <div
                        style={{
                            maxHeight: "calc(100vh - 200px)", // התאמה לפי גובה המסך
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
                                            <strong style={{ fontSize: "1.3em" }}>{item?.name}</strong >
                                            {tableKeys?.find((e) => e.key === "type")?.render("", item)}
                                        </Row>
                                        {tableKeys
                                            .filter((key) => (key.key !== "name" && key.key !== "type") && mobileKeys?.includes(key?.key)) // סינון שדות שהוצגו למעלה
                                            .map((key, i, arr) => (
                                                <>
                                                    <div key={key.key} style={{ fontSize: "0.9em", display: "flex", justifyContent: "space-between" }}>
                                                        <strong>{key.title}:</strong>
                                                        <span>{key.render ? key.render(null, item) : item[key.dataIndex] || "—"}</span>
                                                    </div>
                                                    {i < 2 && <Divider style={{ margin: "0.2em" }} />}
                                                </>
                                            ))}
                                        <Row className='card-actions' align={"middle"} justify={"center"}>
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
            <Table columns={tableKeys} dataSource={data} rowHoverable />
        )
}
