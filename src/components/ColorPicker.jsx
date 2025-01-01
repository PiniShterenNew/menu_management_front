import React, { useState } from 'react';
import { Button, Tabs, Input } from 'antd';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { HexColorPicker } from 'react-colorful';
import classNames from 'classnames';

const { TabPane } = Tabs;

const ColorPicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    // קבוצות צבעים מוגדרות מראש
    const colorGroups = {
        gray: [
            '#F8F9FA', '#F1F3F5', '#E9ECEF', '#DEE2E6',
            '#CED4DA', '#ADB5BD', '#868E96', '#495057',
            '#343A40', '#212529'
        ],
        red: [
            '#FFF5F5', '#FFE3E3', '#FFC9C9', '#FFA8A8',
            '#FF8787', '#FF6B6B', '#FA5252', '#F03E3E',
            '#E03131', '#C92A2A'
        ],
        pink: [
            '#FFF0F6', '#FFDEEB', '#FCC2D7', '#FAA2C1',
            '#F783AC', '#F06595', '#E64980', '#D6336C',
            '#C2255C', '#A61E4D'
        ],
        purple: [
            '#F8F0FC', '#F3D9FA', '#EEBEFA', '#E599F7',
            '#DA77F2', '#CC5DE8', '#BE4BDB', '#AE3EC9',
            '#9C36B5', '#862E9C'
        ],
        blue: [
            '#E7F5FF', '#D0EBFF', '#A5D8FF', '#74C0FC',
            '#4DABF7', '#339AF0', '#228BE6', '#1C7ED6',
            '#1971C2', '#1864AB'
        ],
        cyan: [
            '#E3FAFC', '#C5F6FA', '#99E9F2', '#66D9E8',
            '#3BC9DB', '#22B8CF', '#15AABF', '#1098AD',
            '#0C8599', '#0B7285'
        ],
        teal: [
            '#E6FCF5', '#C3FAE8', '#96F2D7', '#63E6BE',
            '#38D9A9', '#20C997', '#12B886', '#0CA678',
            '#099268', '#087F5B'
        ],
        green: [
            '#EBFBEE', '#D3F9D8', '#B2F2BB', '#8CE99A',
            '#69DB7C', '#51CF66', '#40C057', '#37B24D',
            '#2F9E44', '#2B8A3E'
        ],
        yellow: [
            '#FFF9DB', '#FFF3BF', '#FFEC99', '#FFE066',
            '#FFD43B', '#FCC419', '#FAB005', '#F59F00',
            '#F08C00', '#E67700'
        ],
        orange: [
            '#FFF4E6', '#FFE8CC', '#FFD8A8', '#FFC078',
            '#FFA94D', '#FF922B', '#FD7E14', '#F76707',
            '#E8590C', '#D9480F'
        ]
    };

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 w-[180px]"
            >
                <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: value || '#ffffff' }}
                />
                <span className="flex-1 text-right">{value || 'בחר צבע'}</span>
                <DownOutlined />
            </Button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-[320px] bg-white border border-gray-300 rounded shadow-lg p-4">
                    <Tabs defaultActiveKey="presets">
                        <TabPane tab="צבעים מוכנים" key="presets">
                            <div className="max-h-[400px] overflow-y-auto">
                                {Object.entries(colorGroups).map(([groupName, colors]) => (
                                    <div key={groupName} className="mb-4">
                                        <div className="text-xs text-gray-500 capitalize">
                                            {groupName}
                                        </div>
                                        <div className="grid grid-cols-10 gap-1">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    className={classNames(
                                                        "h-6 w-6 rounded-md transition-transform duration-150",
                                                        {
                                                            'ring-2 ring-black scale-110': value === color,
                                                            'border border-gray-300': value !== color,
                                                        }
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => {
                                                        onChange(color);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {value === color && <CheckOutlined className="text-white text-sm" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabPane>
                        <TabPane tab="צבע מותאם אישי" key="custom">
                            <div className="mb-4">
                                <div className="mb-2">קוד צבע (Hex)</div>
                                <Input
                                    value={value || ''}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
                                            onChange(newValue);
                                        }
                                    }}
                                    placeholder="#000000"
                                    className="font-mono"
                                />
                            </div>
                            <div>
                                <div className="mb-2">בחר צבע</div>
                                <HexColorPicker
                                    color={value || '#000000'}
                                    onChange={(color) => {
                                        onChange(color);
                                    }}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;