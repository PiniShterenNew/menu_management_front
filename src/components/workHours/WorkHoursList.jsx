import React, { useState } from 'react';
import { Table, Button, Tag } from 'antd';
import WorkHoursModal from './WorkHoursModal';
import "./WorkHoursModal.css"

const WorkHoursList = ({ monthData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDayClick = (i) => {
    setSelectedDay(i);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'תאריך',
      dataIndex: 'date',
      key: 'date'
    },
    { title: 'יום בשבוע', dataIndex: 'dayOfWeek', key: 'dayOfWeek' },
    { title: 'סטטוס', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'חצי יום' ? 'orange' : 'green'}>{status}</Tag> },
    { title: 'מספר עובדים', dataIndex: 'employeesCount', key: 'employeesCount', render: (count) => count ?? 'לא ידוע' },
    { title: 'סך הכל שעות', dataIndex: 'totalHours', key: 'totalHours', render: (hours) => hours?.toFixed(2) ?? 'לא ידוע' },
  ];

  const rowClassName = (record) => {
    let className = "";
    if (record?.hasError) className += 'workhours-error ';
    if (record.isToday) {
      className += 'today-row';
    } else if (record.isPast) {
      className += 'past-row';
    }
    return className;
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={monthData}
        rowKey="date"
        pagination={false}
        rowClassName={rowClassName}
        onRow={(record, i) => ({
          onClick: () => (record.isToday || record.isPast) && handleDayClick(i), // טיפול בלחיצה על השורה
        })}
      />
      <WorkHoursModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        dayData={monthData[selectedDay]}
      />
    </>
  );
};

export default WorkHoursList;