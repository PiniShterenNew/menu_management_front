import React from 'react';

const formatNumber = (num) => (!num || isNaN(num)) ? '0.00' : Number(num).toFixed(2);

const CostComparison = ({ size }) => {
    if (!size) return null;

    const getProfitColor = (currentPrice, recommendedPrice) => {
        if (currentPrice < recommendedPrice * 0.85) return 'text-red-500';
        if (currentPrice < recommendedPrice * 0.95) return 'text-orange-500';
        return 'text-green-500';
    };

    const priceColor = getProfitColor(size?.price, size?.suggested_price?.base_price);

    return (
        <div className="p-4">
            {/* Price Comparison Section */}
            <div className="flex flex-row justify-between items-start mb-8 bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">מחיר נוכחי</p>
                    <p className={`text-3xl font-bold mb-2 ${priceColor}`}>₪{formatNumber(size?.current_price?.including_vat)}</p>
                    <p className="text-sm text-gray-600">{"מחיר ללא מע\"מ:"}</p>
                    <p className="text-base">₪{formatNumber(size?.current_price?.excluding_vat)}</p>
                    <div className="mt-4 p-3 bg-white rounded shadow-sm">
                        <p className="font-semibold mb-1">רווח</p>
                        <p className="text-2xl font-bold">₪{formatNumber(size?.current_price?.costs?.profit?.amount)}</p>
                        <div className="flex justify-center gap-2 text-sm">
                            <span className={priceColor}>{formatNumber(size?.current_price?.costs?.profit?.percentage)}%</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">יעד: {formatNumber(size?.original_settings?.profit_rate)}%</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">מחיר מומלץ</p>
                    <p className="text-3xl font-bold mb-2 text-green-500">₪{formatNumber(size?.suggested_price?.including_vat)}</p>
                    <p className="text-sm text-gray-600">{"מחיר ללא מע\"מ:"}</p>
                    <p className="text-base">₪{formatNumber(size?.suggested_price?.excluding_vat)}</p>
                    <div className="mt-4 p-3 bg-white rounded shadow-sm">
                        <p className="font-semibold mb-1">רווח</p>
                        <p className="text-2xl font-bold">₪{formatNumber(size?.suggested_price?.costs?.profit?.amount)}</p>
                        <div className="flex justify-center gap-2 text-sm">
                            <span className="text-green-500">{formatNumber(size?.suggested_price?.costs?.profit?.target_percentage)}%</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">יעד מושג</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Costs Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg shadow-sm">
                    <p className="text-lg mb-2">עלות חומרים</p>
                    <p className="text-2xl font-bold">₪{formatNumber(size?.costs?.total_food)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg shadow-sm">
                    <p className="text-lg mb-2">עלות עבודה</p>
                    <p className="text-2xl font-bold">₪{formatNumber(size?.current_price?.costs?.labor?.amount)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg shadow-sm">
                    <p className="text-lg mb-2">הוצאות קבועות</p>
                    <p className="text-2xl font-bold">₪{formatNumber(size?.current_price?.costs?.fixed?.amount)}</p>
                </div>
            </div>

            {/* Detailed Cost Analysis */}
            <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h4 className="text-xl font-bold mb-4 text-center pb-2 border-b">
                        אחוזים במחיר נוכחי
                    </h4>
                    <div className="space-y-3">
                        {[
                            { label: 'חומרים', amount: size?.costs?.total_food, percentage: size?.current_price?.costs?.food?.percentage, target: size?.original_settings?.food_cost, bgColor: 'bg-blue-50' },
                            { label: 'עבודה', amount: size?.current_price?.costs?.labor?.amount, percentage: size?.current_price?.costs?.labor?.percentage, target: size?.original_settings?.labor_cost, bgColor: 'bg-green-50' },
                            { label: 'הוצאות קבועות', amount: size?.current_price?.costs?.fixed?.amount, percentage: size?.current_price?.costs?.fixed?.percentage, target: size?.original_settings?.fixed_costs, bgColor: 'bg-purple-50' },
                            { label: 'רווח', amount: size?.current_price?.costs?.profit?.amount, percentage: size?.current_price?.costs?.profit?.percentage, target: size?.original_settings?.profit_rate, bgColor: 'bg-yellow-50' }
                        ].map((item, index) => (
                            <div key={index} className={`flex justify-between items-center p-3 rounded ${item.bgColor}`}>
                                <span className="font-medium">{item.label}</span>
                                <div className="text-right">
                                    <p className="font-bold">₪{formatNumber(item.amount)}</p>
                                    <p className="text-sm">
                                        <span className="font-medium">{formatNumber(item.percentage)}%</span>
                                        <span className="text-gray-500 mx-1">|</span>
                                        <span className="text-gray-500">יעד: {formatNumber(item.target)}%</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-4 text-center pb-2 border-b">
                        אחוזים במחיר מומלץ
                    </h4>
                    <div className="space-y-3">
                        {[
                            { label: 'חומרים', amount: size?.costs?.total_food, percentage: size?.suggested_price?.costs?.food?.target_percentage, bgColor: 'bg-blue-50' },
                            { label: 'עבודה', amount: size?.suggested_price?.costs?.labor?.amount, percentage: size?.suggested_price?.costs?.labor?.target_percentage, bgColor: 'bg-green-50' },
                            { label: 'הוצאות קבועות', amount: size?.suggested_price?.costs?.fixed?.amount, percentage: size?.suggested_price?.costs?.fixed?.target_percentage, bgColor: 'bg-purple-50' },
                            { label: 'רווח', amount: size?.suggested_price?.costs?.profit?.amount, percentage: size?.suggested_price?.costs?.profit?.target_percentage, bgColor: 'bg-yellow-50' }
                        ].map((item, index) => (
                            <div key={index} className={`flex justify-between items-center p-3 rounded ${item.bgColor}`}>
                                <span className="font-medium">{item.label}</span>
                                <div className="text-right">
                                    <p className="font-bold">₪{formatNumber(item.amount)}</p>
                                    <p className="text-sm font-medium">{formatNumber(item.percentage)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostComparison;