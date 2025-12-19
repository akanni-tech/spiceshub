import { TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


export function TopProducts({products}) {
  return (
    <div className="border border-[#F0F0F0] rounded-lg bg-white">
      <div className="border-b border-[#F0F0F0] p-6">
        <h3 className="text-[#333333] text-lg font-semibold">Top Selling Products</h3>
      </div>
      <div className="p-6">
        {/* Bar Chart */}
        <div className="mb-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={products}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis type="number" stroke="#717182" style={{ fontSize: "12px" }} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#717182"
                style={{ fontSize: "12px" }}
                width={120}
              />
              <Tooltip
                cursor={{ fill: "#FFE6A7", opacity: 0.2 }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #F0F0F0",
                  borderRadius: "8px",
                  color: "#333333",
                }}
                formatter={(value, key) => {
                  if (key === "sales") return [`${value} units`, "Sales"];
                  if (key === "revenue") return [`Ksh ${(value).toLocaleString()}`, "Revenue"];
                  return [value, key];
                }}
                labelFormatter={(label) => `Product: ${label}`}
              />
              <Bar dataKey="sales" fill="#99582A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-[#FFE6A7]/20 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#FFE6A7] flex items-center justify-center">
                  <span className="text-[#99582A]">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[#333333]">{product.name}</h4>
                  <p className="text-sm text-[#717182]">{product.sales} sales</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[#333333]">ksh {Math.round(product.revenue / 100)}</p>
                  {/* <div className="flex items-center gap-1 text-sm">
                    {product.trend === "up" ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">{product.trendValue}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-red-600" />
                        <span className="text-red-600">{product.trendValue}</span>
                      </>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}