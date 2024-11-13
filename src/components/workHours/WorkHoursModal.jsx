import React, { useState } from 'react';
import { Modal, Button, Form, Select, Input, List, Divider, Statistic, message, Popconfirm, Tag, Row } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useEmployeeHoursContext } from '../../context/subcontexts/EmployeeHoursContext';
import moment from 'moment';

const { Option } = Select;

const WorkHoursModal = ({ visible, onClose, dayData }) => {
    const { addEmployeeHours, updateEmployeeHours, deleteEmployeeHours } = useEmployeeHoursContext();
    const employeeState = useSelector((state) => state.employees);

    const [employee, setEmployee] = useState();
    const [employeeEdit, setEmployeeEdit] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    if (!dayData) return null;

    const handleSaveHours = () => {
        const action = isEditing ? updateEmployeeHours : addEmployeeHours;
        const current = isEditing ? employeeEdit : employee;
        action(isEditing ? current?.hoursId : current.employeeId, current)
            .then(() => {
                setEmployee();
                setIsEditing(false);
                form.resetFields();
                // message.success('השעות נשמרו בהצלחה');
            })
            .catch(() => {
                // message.error('הפעולה נכשלה');
            });
    };

    const handleEditEmployee = (employeeData) => {
        setEmployeeEdit({
            ...employeeData,
            employeeId: employeeData.employeeId,
            startTime: employeeData.hours.start,
            endTime: employeeData.hours.end,
            date: dayData.date,
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setEmployee(null);
        setIsEditing(false);
    };

    const handleDeleteEmployee = (employeeId) => {
        deleteEmployeeHours(employeeId);
    };

    const filteredEmployees = employeeState?.filter(
        (employee) => !dayData.employees.some((e) => e.employeeId === employee._id)
    );

    return (
        <Modal
            title={`ניהול שעות עבודה ליום ${dayData.date}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            style={{ top: "1em" }}
            destroyOnClose
        >
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '600', color: '#333' }}>סיכום יום</h3>
                <p>תאריך: {dayData.date}</p>
                <p>יום בשבוע: {dayData.dayOfWeek}</p>
                <Tag color={dayData?.status === 'חצי יום' ? 'orange' : 'green'}>{dayData?.status}</Tag>
            </div>

            <Divider />

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '600', color: '#333' }}>{isEditing ? 'עריכת עובד' : 'הוספת עובד חדש'}</h3>
                <Form form={form} layout="vertical" onFinish={handleSaveHours}>
                    <Form.Item label="בחר עובד" style={{ maxWidth: '400px' }}>
                        <Select
                            showSearch
                            placeholder="חיפוש והוספת עובד"
                            optionFilterProp="children"
                            value={employee?.employeeId || null}
                            onChange={(value) => {
                                const employeeSelect = filteredEmployees.find((e) => e._id === value);
                                setEmployee({
                                    name: employeeSelect?.name,
                                    startTime: '',
                                    endTime: '',
                                    date: dayData?.date,
                                    employeeId: employeeSelect._id,
                                });
                            }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {filteredEmployees?.map((employee) => (
                                <Option key={employee._id} value={employee._id}>
                                    {employee.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <Divider />

            {employee && <Form
                layout="inline"
                onFinish={handleSaveHours}
                initialValues={{ startTime: employee?.startTime, endTime: employee?.endTime }}
            >
                <Form.Item label="שעת כניסה">
                    <Input
                        placeholder="HH:mm"
                        value={employee?.startTime}
                        onChange={(e) =>
                            setEmployee((prev) => ({ ...prev, startTime: e.target.value }))
                        }
                    />
                </Form.Item>
                <Form.Item label="שעת יציאה">
                    <Input
                        placeholder="HH:mm"
                        value={employee?.endTime}
                        onChange={(e) =>
                            setEmployee((prev) => ({ ...prev, endTime: e.target.value }))
                        }
                    />
                </Form.Item>
                {!employee?._id && <Button type="primary" onClick={handleSaveHours}>
                    שמור שעות עבודה
                </Button>}
            </Form>}
            <Divider />

            <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontWeight: '600', color: '#333' }}>עובדים שנוספו</h3>
                <List
                    bordered
                    className='scroll-content'
                    style={{maxHeight: "25em", overflow: "auto"}}
                    dataSource={dayData?.employees}
                    renderItem={(employeeItem) => (
                        <List.Item>
                            <div style={{ width: '100%', display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <h2 style={{ fontWeight: '500', width: "6em" }}>{employeeItem.name}</h2>

                                {isEditing && employeeItem.employeeId === employeeEdit?.employeeId ? (
                                    <>
                                        <Input
                                            placeholder="שעת כניסה"
                                            value={employeeEdit?.startTime}
                                            onChange={(e) => setEmployeeEdit((prev) => ({ ...prev, startTime: e.target.value }))}
                                            style={{ width: '100px', marginRight: '10px' }}
                                        />
                                        <Input
                                            placeholder="שעת יציאה"
                                            value={employeeEdit?.endTime}
                                            onChange={(e) => setEmployeeEdit((prev) => ({ ...prev, endTime: e.target.value }))}
                                            style={{ width: '100px', marginRight: '10px' }}
                                        />
                                        <Row style={{ gap: "0.5em" }}>
                                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveHours} />
                                            <Button icon={<CloseOutlined />} onClick={handleCancelEdit} style={{ marginLeft: '5px' }} />
                                        </Row>
                                    </>
                                ) : (
                                    <>
                                        <Statistic title={'כניסה'} value={employeeItem?.hours?.start} />
                                        <Statistic title={'יציאה'} value={employeeItem?.hours?.end} />
                                        <Statistic title={'סך שעות'} value={employeeItem?.hoursWorked?.toFixed(2)} />
                                        <Row style={{ gap: "0.5em" }}>
                                            <Button icon={<EditOutlined />} onClick={() => handleEditEmployee(employeeItem)} />
                                            <Popconfirm
                                                title="האם אתה בטוח שברצונך למחוק את העובד?"
                                                onConfirm={() => handleDeleteEmployee(employeeItem.hoursId)}
                                                okText="כן"
                                                cancelText="לא"
                                            >
                                                <Button icon={<DeleteOutlined />} danger />
                                            </Popconfirm>
                                        </Row>
                                    </>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
};

export default WorkHoursModal;
