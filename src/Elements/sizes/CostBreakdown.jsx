import React from 'react';
import { useMediaQuery } from 'react-responsive';

const formatNumber = (num) => (!num || isNaN(num)) ? '0.00' : Number(num).toFixed(2);

const CostComparison = ({ size }) => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    if (!size) return null;

    const getProfitColor = (currentPrice, recommendedPrice) => {
        if (currentPrice < recommendedPrice * 0.85) return 'text-red-500';
        if (currentPrice < recommendedPrice * 0.95) return 'text-orange-500';
        return 'text-green-500';
    };

    const priceColor = getProfitColor(size?.price, size?.suggested_price?.base_price);

    const PriceCard = ({ title, price, vatPrice, profit, profitTarget, isTarget = false }) => (
        <div className={`${isMobile ? 'w-full mb-4' : 'w-1/2'} text-center`}>
            <p className="text-lg font-semibold mb-2">{title}</p>
            <p className={`text-2xl md:text-3xl font-bold mb-2 ${isTarget ? 'text-green-500' : priceColor}`}>
                ₪{formatNumber(price)}
            </p>
            <p className="text-sm text-gray-600">{"מחיר ללא מע\"מ:"}</p>
            <p className="text-base">₪{formatNumber(vatPrice)}</p>
            <div className="mt-4 p-3 bg-white rounded shadow-sm">
                <p className="font-semibold mb-1">רווח</p>
                <p className="text-xl md:text-2xl font-bold">₪{formatNumber(profit?.amount)}</p>
                <div className="flex justify-center gap-2 text-sm">
                    <span className={isTarget ? 'text-green-500' : priceColor}>
                        {formatNumber(profit?.percentage || profit?.target_percentage)}%
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">
                        {isTarget ? 'יעד מושג' : `יעד: ${formatNumber(profitTarget)}%`}
                    </span>
                </div>
            </div>
        </div>
    );

    const CostBox = ({ label, amount, bgColor }) => (
        <div className={`text-center p-4 ${bgColor} rounded-lg shadow-sm`}>
            <p className="text-base md:text-lg mb-2">{label}</p>
            <p className="text-xl md:text-2xl font-bold">₪{formatNumber(amount)}</p>
        </div>
    );

    const CostAnalysisSection = ({ title, items }) => (
        <div className={`${isMobile ? 'w-full mb-6' : 'w-1/2'}`}>
            <h4 className="text-lg md:text-xl font-bold mb-4 text-center pb-2 border-b">
                {title}
            </h4>
            <div className="space-y-2 md:space-y-3">
                {items.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-2 md:p-3 rounded ${item.bgColor}`}>
                        <span className="font-medium text-sm md:text-base">{item.label}</span>
                        <div className="text-right">
                            <p className="font-bold text-sm md:text-base">₪{formatNumber(item.amount)}</p>
                            {item.hasTarget ? (
                                <p className="text-xs md:text-sm">
                                    <span className="font-medium">{formatNumber(item.percentage)}%</span>
                                    <span className="text-gray-500 mx-1">|</span>
                                    <span className="text-gray-500">יעד: {formatNumber(item.target)}%</span>
                                </p>
                            ) : (
                                <p className="text-xs md:text-sm font-medium">
                                    {formatNumber(item.percentage)}%
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-2 md:p-4">
            {/* Price Comparison Section */}
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-start mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-lg`}>
                <PriceCard
                    title="מחיר נוכחי"
                    price={size?.current_price?.including_vat}
                    vatPrice={size?.current_price?.excluding_vat}
                    profit={size?.current_price?.costs?.profit}
                    profitTarget={size?.original_settings?.profit_rate}
                />
                <PriceCard
                    title="מחיר מומלץ"
                    price={size?.suggested_price?.including_vat}
                    vatPrice={size?.suggested_price?.excluding_vat}
                    profit={size?.suggested_price?.costs?.profit}
                    isTarget={true}
                />
            </div>

            {/* Costs Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                <CostBox 
                    label="עלות חומרים"
                    amount={size?.costs?.total_food}
                    bgColor="bg-blue-50"
                />
                <CostBox 
                    label="עלות עבודה"
                    amount={size?.current_price?.costs?.labor?.amount}
                    bgColor="bg-green-50"
                />
                <CostBox 
                    label="הוצאות קבועות"
                    amount={size?.current_price?.costs?.fixed?.amount}
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Detailed Cost Analysis */}
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 md:gap-8 bg-white p-4 md:p-6 rounded-lg shadow-sm`}>
                <CostAnalysisSection
                    title="אחוזים במחיר נוכחי"
                    items={[
                        {
                            label: 'חומרים',
                            amount: size?.costs?.total_food,
                            percentage: size?.current_price?.costs?.food?.percentage,
                            target: size?.original_settings?.food_cost,
                            bgColor: 'bg-blue-50',
                            hasTarget: true
                        },
                        {
                            label: 'עבודה',
                            amount: size?.current_price?.costs?.labor?.amount,
                            percentage: size?.current_price?.costs?.labor?.percentage,
                            target: size?.original_settings?.labor_cost,
                            bgColor: 'bg-green-50',
                            hasTarget: true
                        },
                        {
                            label: 'הוצאות קבועות',
                            amount: size?.current_price?.costs?.fixed?.amount,
                            percentage: size?.current_price?.costs?.fixed?.percentage,
                            target: size?.original_settings?.fixed_costs,
                            bgColor: 'bg-purple-50',
                            hasTarget: true
                        },
                        {
                            label: 'רווח',
                            amount: size?.current_price?.costs?.profit?.amount,
                            percentage: size?.current_price?.costs?.profit?.percentage,
                            target: size?.original_settings?.profit_rate,
                            bgColor: 'bg-yellow-50',
                            hasTarget: true
                        }
                    ]}
                />

                <CostAnalysisSection
                    title="אחוזים במחיר מומלץ"
                    items={[
                        {
                            label: 'חומרים',
                            amount: size?.costs?.total_food,
                            percentage: size?.suggested_price?.costs?.food?.target_percentage,
                            bgColor: 'bg-blue-50'
                        },
                        {
                            label: 'עבודה',
                            amount: size?.suggested_price?.costs?.labor?.amount,
                            percentage: size?.suggested_price?.costs?.labor?.target_percentage,
                            bgColor: 'bg-green-50'
                        },
                        {
                            label: 'הוצאות קבועות',
                            amount: size?.suggested_price?.costs?.fixed?.amount,
                            percentage: size?.suggested_price?.costs?.fixed?.target_percentage,
                            bgColor: 'bg-purple-50'
                        },
                        {
                            label: 'רווח',
                            amount: size?.suggested_price?.costs?.profit?.amount,
                            percentage: size?.suggested_price?.costs?.profit?.target_percentage,
                            bgColor: 'bg-yellow-50'
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default CostComparison;