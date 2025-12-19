import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getOrdersByUser } from "../../hooks/services";

const statusConfig = {
  vip: { label: "VIP", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  regular: { label: "Regular", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  new: { label: "New", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

const recentOrders = [
  { id: "#ORD-2847", date: "Nov 8, 2025", total: "$284.99", status: "completed" },
  { id: "#ORD-2832", date: "Oct 24, 2025", total: "$156.50", status: "completed" },
  { id: "#ORD-2801", date: "Oct 12, 2025", total: "$429.00", status: "completed" },
  { id: "#ORD-2784", date: "Sep 28, 2025", total: "$198.99", status: "completed" },
];

export function CustomerDetailDialog({ open, onOpenChange, customer }) {
  if (!open) return null;

  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerData() {
      if (!customer?.id) return;

      try {
        const orders = await getOrdersByUser(customer.id);
        setCustomerOrders(orders);
      } catch (error) {
        console.error("Failed to fetch customer orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, [customer?.id]);

  // Calculate statistics
  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrderDate = customerOrders.length > 0 ? new Date(customerOrders[0].created_at).toLocaleDateString() : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#333333] text-xl font-semibold">Customer Details</h2>
              <p className="text-sm text-[#717182] mt-1">
                Complete information and order history
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-[#F0F0F0] rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-[#717182]" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Customer Profile */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-[#99582A] flex items-center justify-center text-white text-xl font-semibold">
                {(customer.firstName + " " + customer.lastName).split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-[#333333]">{customer.firstName + " " + customer.lastName}</h3>
                  {/* <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[customer.status].className}`}>
                    {statusConfig[customer.status].label}
                  </span> */}
                </div>
                <p className="text-[#717182] mt-1">{customer.email}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-[#717182]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(customer.created_at || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4" />
                    Last order: {lastOrderDate}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#F0F0F0]" />

            {/* Contact Information */}
            <div>
              <h4 className="text-[#333333] mb-4">Contact Information</h4>
              <div className="border border-[#F0F0F0] bg-[#FAFAFA] rounded-lg">
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#717182]" />
                    <span className="text-[#717182]">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#717182]" />
                    <span className="text-[#717182]">{customer.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#717182] mt-1" />
                    <div>
                      <p className="text-[#717182]">Address information not available</p>
                      <p className="text-[#717182]">Shipping addresses are stored per order</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="text-[#333333] mb-4">Customer Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-[#F0F0F0] rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="w-4 h-4 text-[#99582A]" />
                      <p className="text-sm text-[#717182]">Total Orders</p>
                    </div>
                    <p className="text-[#333333]">{totalOrders}</p>
                  </div>
                </div>

                <div className="border border-[#F0F0F0] rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-[#99582A]" />
                      <p className="text-sm text-[#717182]">Total Spent</p>
                    </div>
                    <p className="text-[#333333]">ksh {totalSpent.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border border-[#F0F0F0] rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#99582A]" />
                      <p className="text-sm text-[#717182]">Avg Order Value</p>
                    </div>
                    <p className="text-[#333333]">ksh {avgOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h4 className="text-[#333333] mb-4">Recent Orders</h4>
              <div className="border border-[#F0F0F0] rounded-lg">
                <div className="divide-y divide-[#F0F0F0]">
                  {loading ? (
                    <div className="p-4 text-center text-[#717182]">Loading orders...</div>
                  ) : customerOrders.length === 0 ? (
                    <div className="p-4 text-center text-[#717182]">No orders found</div>
                  ) : (
                    customerOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#FFE6A7]/10">
                        <div>
                          <p className="text-[#99582A]">{order.id}</p>
                          <p className="text-sm text-[#717182] mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#333333]">ksh {order.total_amount.toFixed(2)}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-[#333333] mb-4">Customer Notes</h4>
              <div className="border border-[#F0F0F0] bg-[#FAFAFA] rounded-lg">
                <div className="p-4">
                  <p className="text-[#717182] text-sm">
                    {totalOrders > 5 ? 'High-value customer with consistent purchasing behavior.' :
                      totalOrders > 0 ? 'Regular customer with growing order history.' :
                        'New customer - first order pending.'}
                    {totalSpent > 10000 ? ' Prefers premium products.' : ''}
                    {customerOrders.filter(o => o.status === 'completed').length === totalOrders ? ' No returns recorded.' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}