import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatsCard } from "./components/StatsCard";
import { SalesChart } from "./components/SalesChart";
import { TopProducts } from "./components/TopProducts";
import { useAdminData } from "./hooks/useAdminData";
import { aggregateOrdersByMonth, calculateTotalRevenue} from "./hooks/helpers";

const revenueData = [
  { month: "Jan", revenue: 4500, orders: 32, customers: 24 },
  { month: "Feb", revenue: 5200, orders: 38, customers: 29 },
  { month: "Mar", revenue: 4800, orders: 35, customers: 26 },
  { month: "Apr", revenue: 6100, orders: 42, customers: 33 },
  { month: "May", revenue: 5500, orders: 39, customers: 31 },
  { month: "Jun", revenue: 6700, orders: 46, customers: 37 },
  { month: "Jul", revenue: 7200, orders: 51, customers: 42 },
  { month: "Aug", revenue: 6900, orders: 49, customers: 39 },
  { month: "Sep", revenue: 7800, orders: 55, customers: 45 },
  { month: "Oct", revenue: 8400, orders: 59, customers: 48 },
  { month: "Nov", revenue: 9100, orders: 63, customers: 53 },
];

const categoryData = [
  { name: "Outerwear", value: 32, color: "#99582A" },
  { name: "Footwear", value: 24, color: "#B5764A" },
  { name: "Accessories", value: 18, color: "#D19B6A" },
  { name: "Knitwear", value: 14, color: "#E8C18C" },
  { name: "Bottoms", value: 12, color: "#FFE6A7" },
];

const topProductsData = [
  { name: "Leather Jacket", sales: 247 },
  { name: "Sneakers", sales: 198 },
  { name: "Sweater", sales: 156 },
  { name: "Scarf", sales: 134 },
  { name: "Watch", sales: 121 },
  { name: "Jeans", sales: 203 },
];

const trafficData = [
  { source: "Direct", visitors: 4234, color: "#99582A" },
  { source: "Social Media", visitors: 3421, color: "#B5764A" },
  { source: "Search", visitors: 2890, color: "#D19B6A" },
  { source: "Referral", visitors: 1678, color: "#E8C18C" },
  { source: "Email", visitors: 1234, color: "#FFE6A7" },
];

export function AnalyticsPage() {
  const { products, categories, orders, users, loading, error, topProducts, categorySales } = useAdminData();
  const OrdersByMonth = orders && aggregateOrdersByMonth(orders);
  const revenue = orders && calculateTotalRevenue(orders);
  const totalOrders = orders && orders.length;

  console.log(topProducts)

  const fiveTopProducts = topProducts && topProducts;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[#333333] text-2xl font-semibold">Analytics</h1>
        <p className="text-[#717182] mt-1">
          Comprehensive insights into your store performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Revenue (Nov)"
          value={`ksh ${revenue}`}
          // change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Orders (Nov)"
          value={`${totalOrders}`}
          // change="+8.2%"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Conversion Rate"
          value="0"
          // change="-0.3%"
          changeType="negative"
          icon={Users}
        />
        <StatsCard
          title="Avg. Order Value"
          value={`ksh${Math.round(revenue/users.length)}`}
          // change="+4.1%"
          changeType="positive"
          icon={Package}
        />
      </div>

      {/* Revenue & Orders Chart */}
      <SalesChart data={OrdersByMonth} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
        {/* Sales by Category */}
        <div className="border border-[#F0F0F0] rounded-lg bg-white">
          <div className="border-b border-[#F0F0F0] p-6">
            <h3 className="text-[#333333] text-lg font-semibold">Sales by Category</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #F0F0F0',
                    borderRadius: '8px',
                    color: '#333333',
                  }}
                  formatter={(value) => [`${value}`, 'Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categorySales.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-[#333333]">{category.name}</span>
                  </div>
                  <span className="text-sm text-[#717182]">{Math.round(((category.value)/(categorySales.reduce((sum, cat) => sum + cat.value, 0))) * 100)} %</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        {/* <div className="border border-[#F0F0F0] rounded-lg mt-6 bg-white">
          <div className="border-b border-[#F0F0F0] p-6">
            <h3 className="text-[#333333] text-lg font-semibold">Monthly Growth</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #F0F0F0',
                    borderRadius: '8px',
                    color: '#333333',
                  }}
                  formatter={(value) => [value, 'New Customers']}
                />
                <Area
                  type="monotone"
                  dataKey="customers"
                  stroke="#99582A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCustomers)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-2xl font-semibold text-[#333333]">{revenueData[revenueData.length - 1].customers}</p>
              <p className="text-sm text-[#717182]">New customers this month</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">
                  +{Math.round(((revenueData[revenueData.length - 1].customers - revenueData[revenueData.length - 2].customers) / revenueData[revenueData.length - 2].customers) * 100)}% from last month
                </span>
              </div>
            </div>
          </div>
        </div> */}
        </div>

        {/* Top Products */}
        <TopProducts products={fiveTopProducts}/>


        
      </div>
    </div>
  );
}