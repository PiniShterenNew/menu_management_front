import React from 'react';
import { Card, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0.00';
    return Number(num).toFixed(2);
};

const calculatePercentage = (part, total) => {
    if (!part || !total || isNaN(part) || isNaN(total) || total === 0) return '0.0';
    return ((Number(part) / Number(total)) * 100).toFixed(1);
};


const CostComparison = ({ size }) => {
    if (!size) return null;

    const getProfitColor = (currentPrice, recommendedPrice) => {
        if (currentPrice < recommendedPrice * 0.85) return 'text-red-500';
        if (currentPrice < recommendedPrice * 0.95) return 'text-orange-500';
        return 'text-green-500';
    };
    const priceColor = getProfitColor(size?.priceIncludingVAT, size?.suggestedPriceIncludingVAT);

    const productCost = Number(size.totalCostWithoutLabor || 0);
    const currentPrice = Number(size.priceIncludingVAT || 0);
    const recommendedPrice = Number(size.suggestedPriceIncludingVAT || 0);

    const basePrice = productCost / 0.30;
    const laborValue = basePrice * 0.30;
    const fixedCostsValue = basePrice * 0.25;
    const realProfitCurrent = currentPrice - (productCost + laborValue + fixedCostsValue);
    const realProfitRecommended = recommendedPrice - (productCost + laborValue + fixedCostsValue);

    return (
        <div className="p-4">
            <div className="mb-8">
                <div className="flex flex-row justify-evenly items-center mb-4">
                    <div className="flex flex-col items-center">
                        <p className="text-base font-semibold">מחיר נוכחי</p>
                        <p className={`text-xl font-semibold ${priceColor}`}>₪{formatNumber(size?.priceIncludingVAT)}</p>
                        <p className="text-sm">{"מחיר ללא מע\"מ:"}</p>
                        <p className="text-base font-medium">
                            ₪{formatNumber(size?.priceExcludingVAT)}
                            (₪{formatNumber(size?.priceIncludingVAT - size?.priceExcludingVAT)})
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-base font-semibold">מחיר מומלץ לצרכן</p>
                        <p className="text-xl font-semibold text-green-400">₪{formatNumber(size?.suggestedPriceIncludingVAT)}</p>
                        <p className="text-sm">{"מחיר ללא מע\"מ:"}</p>
                        <p className="text-base font-medium">
                            ₪{formatNumber(size?.suggestedPriceExcludingVAT)}
                            (₪{formatNumber(size?.suggestedPriceIncludingVAT - size?.suggestedPriceExcludingVAT)})
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Text className="text-lg block mb-2">פודקוסט</Text>
                        <Text strong className="text-xl">₪{formatNumber(productCost)}</Text>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Text className="text-lg block mb-2">עובדים</Text>
                        <Text strong className="text-xl">₪{formatNumber(laborValue)}</Text>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Text className="text-lg block mb-2">הוצאות קבועות</Text>
                        <Text strong className="text-xl">₪{formatNumber(fixedCostsValue)}</Text>
                    </div>
                </div>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <Title level={4} className="text-center mb-4">מחיר נוכחי - ₪{formatNumber(currentPrice)}</Title>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <Text>פודקוסט</Text>
                            <Text strong>{calculatePercentage(productCost, currentPrice)}%</Text>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <Text>עובדים</Text>
                            <Text strong>{calculatePercentage(laborValue, currentPrice)}%</Text>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                            <Text>הוצאות קבועות</Text>
                            <Text strong>{calculatePercentage(fixedCostsValue, currentPrice)}%</Text>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                            <Text>רווח</Text>
                            <Text strong>₪{formatNumber(realProfitCurrent)} ({calculatePercentage(realProfitCurrent, currentPrice)}%)</Text>
                        </div>
                    </div>
                </div>

                <div>
                    <Title level={4} className="text-center mb-4">מחיר מומלץ - ₪{formatNumber(recommendedPrice)}</Title>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <Text>פודקוסט</Text>
                            <Text strong>{calculatePercentage(productCost, recommendedPrice)}%</Text>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <Text>עובדים</Text>
                            <Text strong>{calculatePercentage(laborValue, recommendedPrice)}%</Text>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                            <Text>הוצאות קבועות</Text>
                            <Text strong>{calculatePercentage(fixedCostsValue, recommendedPrice)}%</Text>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                            <Text>רווח</Text>
                            <Text strong>₪{formatNumber(realProfitRecommended)} ({calculatePercentage(realProfitRecommended, recommendedPrice)}%)</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostComparison;