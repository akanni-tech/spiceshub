import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 45000, orders: 320 },
  { month: "Feb", revenue: 52000, orders: 380 },
  { month: "Mar", revenue: 48000, orders: 350 },
  { month: "Apr", revenue: 61000, orders: 420 },
  { month: "May", revenue: 55000, orders: 390 },
  { month: "Jun", revenue: 67000, orders: 460 },
  { month: "Jul", revenue: 72000, orders: 510 },
  { month: "Aug", revenue: 69000, orders: 490 },
  { month: "Sep", revenue: 78000, orders: 550 },
  { month: "Oct", revenue: 84000, orders: 590 },
  { month: "Nov", revenue: 91000, orders: 630 },
];

export function SalesChart({data}) {
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <div className="border border-[#F0F0F0] rounded-lg bg-white">
      <div className="border-b border-[#F0F0F0] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[#333333] text-lg font-semibold">Revenue Overview</h3>
          <div className="flex bg-[#F0F0F0] rounded-md p-1">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === "revenue"
                  ? "bg-[#99582A] text-white"
                  : "text-[#717182] hover:text-[#333333]"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-[#99582A] text-white"
                  : "text-[#717182] hover:text-[#333333]"
              }`}
            >
              Orders
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#99582A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#99582A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#99582A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#99582A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              stroke="#717182"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#717182"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) =>
                activeTab === "revenue" ? `ksh ${(value /1000).toFixed(0)}k` : value
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #F0F0F0',
                borderRadius: '8px',
                color: '#333333',
              }}
              formatter={(value) => [
                activeTab === "revenue" ? `${value.toLocaleString()}` : value,
                activeTab === "revenue" ? 'Revenue' : 'Orders'
              ]}
            />
            <Area
              type="monotone"
              dataKey={activeTab}
              stroke="#99582A"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${activeTab === "revenue" ? "Revenue" : "Orders"})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}