import React, { useState } from 'react';
import { Drawer, Button, Select, Checkbox, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function FiltersDrawer({ open, onClose, filters, setFilters, filtersArr }) {
    const [localFilters, setLocalFilters] = useState({
        type: filters.type || [],          // מערך של קטגוריות
        supplierId: filters.supplierId || [], // מערך של ספקים
        is_active: filters.is_active       // ערך בוליאני
    });

    const resetFilter = (filterKey) => {
        setLocalFilters(prev => ({
            ...prev,
            [filterKey]: filterKey === 'is_active' ? null : []
        }));
    };

    const applyFilters = () => {
        const cleanFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                acc[key] = value;
            } else if (typeof value === 'boolean') {
                acc[key] = value;
            }
            return acc;
        }, {});

        setFilters(cleanFilters);
        onClose();
    };

    const handleMultiSelect = (filterKey, values) => {
        setLocalFilters(prev => ({
            ...prev,
            [filterKey]: values
        }));
    };

    const handleStatusChange = (value) => {
        const statusValue = value === "all" ? null : value === "true";
        setLocalFilters(prev => ({
            ...prev,
            is_active: statusValue
        }));
    };

    const FilterOptionsList = ({ options, filterKey }) => {
        const handleCheckboxChange = (value) => {
            setLocalFilters((prev) => {
                const currentValues = prev[filterKey] || [];
                const updatedValues = currentValues.includes(value)
                    ? currentValues.filter((v) => v !== value)
                    : [...currentValues, value];
                return {
                    ...prev,
                    [filterKey]: updatedValues,
                };
            });
        };
    
        return (
            <div>
                <div className="sticky top-0 bg-white p-2 border-b">
                    <Button
                        type="link"
                        className="w-full text-left"
                        onClick={() => resetFilter(filterKey)}
                    >
                        איפוס בחירה
                    </Button>
                </div>
                <div
                    style={{
                        maxHeight: "250px",
                        overflowY: "auto",
                        padding: "8px",
                    }}
                    onScroll={(e) => e.stopPropagation()} // מניעת bubbling של אירוע הגלילה
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                            }}
                        >
                            <Checkbox
                                checked={(localFilters[filterKey] || []).includes(option.value)}
                                onChange={() => handleCheckboxChange(option.value)}
                            >
                                {option.label}
                            </Checkbox>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    

    return (
        <Drawer
            title="סינון רכיבים"
            placement="right"
            onClose={onClose}
            open={open}
            width={360}
        >
            <div style={{ marginBottom: "24px" }}>
                {/* סינון לפי קטגוריה */}
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>קטגוריה</label>
                    <Popover
                        content={
                            <FilterOptionsList
                                options={filtersArr.find(f => f.value === 'type')?.options || []}
                                filterKey="type"
                            />
                        }
                        trigger="click"
                        getPopupContainer={(triggerNode) => triggerNode.parentElement} // הגדרת אלמנט הקופסה בתוך ה-Drawer
                    >
                        <Button style={{ width: "100%" }} type="dashed">
                            {(localFilters.type?.length || 0) > 0
                                ? `${localFilters.type?.length} נבחרו`
                                : 'בחר קטגוריות'}
                            <DownOutlined style={{ marginLeft: "8px" }} />
                        </Button>
                    </Popover>
                </div>

                {/* סינון לפי ספק */}
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>ספק</label>
                    <Popover
                        content={
                            <FilterOptionsList
                                options={filtersArr.find(f => f.value === 'supplierId')?.options || []}
                                filterKey="supplierId"
                            />
                        }
                        trigger="click"
                        getPopupContainer={(triggerNode) => triggerNode.parentElement} // הגדרת אלמנט הקופסה בתוך ה-Drawer
                    >
                        <Button style={{ width: "100%" }} type="dashed">
                            {(localFilters.supplierId?.length || 0) > 0
                                ? `${localFilters.supplierId?.length} נבחרו`
                                : 'בחר ספקים'}
                            <DownOutlined style={{ marginLeft: "8px" }} />
                        </Button>
                    </Popover>
                </div>

                {/* סינון לפי סטטוס */}
                <div>
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>סטטוס</label>
                    <Select
                        style={{ width: "100%" }}
                        value={localFilters.is_active?.toString() || "all"}
                        onChange={handleStatusChange}
                        options={[
                            { label: "הכל", value: "all" },
                            { label: "פעיל", value: "true" },
                            { label: "לא פעיל", value: "false" }
                        ]}
                    />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <Button onClick={() => setLocalFilters({
                    type: [],
                    supplierId: [],
                    is_active: null
                })}>
                    איפוס הכל
                </Button>
                <Button type="primary" onClick={applyFilters}>
                    החל סינון
                </Button>
            </div>
        </Drawer>
    );
}
