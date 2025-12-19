import { ExternalLink } from "lucide-react";

const orders = [
  {
    id: "#ORD-2847",
    customer: "Sarah Johnson",
    date: "Nov 8, 2025",
    total: "$284.99",
    status: "completed",
    items: 3,
  },
  {
    id: "#ORD-2846",
    customer: "Michael Chen",
    date: "Nov 8, 2025",
    total: "$156.50",
    status: "processing",
    items: 2,
  },
  {
    id: "#ORD-2845",
    customer: "Emma Williams",
    date: "Nov 7, 2025",
    total: "$89.99",
    status: "shipped",
    items: 1,
  },
  {
    id: "#ORD-2844",
    customer: "James Brown",
    date: "Nov 7, 2025",
    total: "$425.00",
    status: "completed",
    items: 5,
  },
  {
    id: "#ORD-2843",
    customer: "Lisa Anderson",
    date: "Nov 7, 2025",
    total: "$199.99",
    status: "pending",
    items: 2,
  },
];

const statusConfig = {
  completed: { label: "Completed", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

export function RecentOrders({orders, users}) {

  const getUserFirstNameById = (userId) => {
    if (!Array.isArray(users) || !userId) return "Unknown";

    const user = users.find(u => u.id === userId);
    return user?.firstName || "Unknown";
  };

  return (
    <div className="border border-[#F0F0F0] rounded-lg bg-white">
      <div className="border-b border-[#F0F0F0] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[#333333] text-lg font-semibold">Recent Orders</h3>
          {/* <button className="flex items-center gap-2 text-[#99582A] hover:text-[#99582A] hover:bg-[#FFE6A7]/30 px-3 py-2 rounded-md transition-colors">
            View All
            <ExternalLink className="w-4 h-4" />
          </button> */}
        </div>
      </div>
      <div className="p-0">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFE6A7]/20 hover:bg-[#FFE6A7]/20">
              <th className="text-left p-4 text-[#333333] font-medium">Order ID</th>
              <th className="text-left p-4 text-[#333333] font-medium">Customer</th>
              <th className="text-left p-4 text-[#333333] font-medium">Date</th>
              <th className="text-left p-4 text-[#333333] font-medium">Items</th>
              <th className="text-left p-4 text-[#333333] font-medium">Total</th>
              <th className="text-left p-4 text-[#333333] font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#FFE6A7]/10 border-t border-[#F0F0F0]">
                <td className="p-4 text-[#99582A]">{order.id}</td>
                <td className="p-4 text-[#333333]">{getUserFirstNameById(order.user_id)}</td>
                <td className="p-4 text-[#717182]">{order.created_at}</td>
                <td className="p-4 text-[#717182]">{order.items.length}</td>
                <td className="p-4 text-[#333333]">{order.total_amount}</td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].className}`}>
                    {statusConfig[order.status].label}                
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}