import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const salesData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 18000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 20000 },
    { month: 'May', sales: 24000 },
    { month: 'Jun', sales: 21000 },
    { month: 'Jul', sales: 26000 },
    { month: 'Aug', sales: 30000 },
    { month: 'Sep', sales: 28000 },
    { month: 'Oct', sales: 32000 },
    { month: 'Nov', sales: 35000 },
    { month: 'Dec', sales: 40000 },
];

const SalesChart = () => {
    return (
        <div className="w-full h-[400px] bg-white my-10  text-black py-16 px-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">  Monthly Sales Overview</h2>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E60076" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#E60076" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="month" stroke="#000" />
                    <YAxis
                        stroke="#000"
                        tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f1f1f', border: 'none' }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#E60076' }}
                        formatter={(value) => [`$${value}`, 'Sales']}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#E60076"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
