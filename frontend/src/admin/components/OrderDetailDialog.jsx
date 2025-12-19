import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserById, updateOrder } from "../../hooks/services";
import { toast } from "sonner";

const statusConfig = {
  Delivered: { label: "Delivered", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  Processing: { label: "Processing", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  Shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  Pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  Cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

const orderItems = [
  { id: 1, name: "Premium Leather Jacket", quantity: 1, price: 299.99, sku: "PLJ-BLK-L" },
  { id: 2, name: "Designer Sneakers", quantity: 2, price: 159.99, sku: "DS-WHT-42" },
  { id: 3, name: "Silk Scarf Collection", quantity: 1, price: 79.99, sku: "SSC-RED-OS" },
];

export function OrderDetailDialog({ open, onOpenChange, order, onOrderUpdate }) {
  if (!open) return null;
  const [customer, setCustomer] = useState([])
  const [currentStatus, setCurrentStatus] = useState(order.status.toLowerCase())

  useEffect(() => {
    async function getCustomer() {
      const data = await getUserById(order.user_id);
      setCustomer(data);
    }
    getCustomer()
  }, []);

  console.log(order)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#333333] text-xl font-semibold">Order Details #{order.id}</h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-[#F0F0F0] rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-[#717182]" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Status and Info */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#717182] mt-1">Placed on {order.created_at}</p>
              </div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)].className}`}>
                {statusConfig[currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)].label}
              </span>
            </div>

            <hr className="border-[#F0F0F0]" />

            {/* Customer Information */}
            <div>
              <h4 className="text-[#333333] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#99582A]" />
                Customer Information
              </h4>
              <div className="border border-[#F0F0F0] bg-[#FAFAFA] rounded-lg">
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#717182]" />
                    <span className="text-[#333333]">{customer.firstName + " " + customer.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#717182]" />
                    <span className="text-[#717182]">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#717182]" />
                    <span className="text-[#717182]">{customer.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h4 className="text-[#333333] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#99582A]" />
                Shipping Address
              </h4>
              <div className="border border-[#F0F0F0] bg-[#FAFAFA] rounded-lg">
                <div className="p-3">
                  <p className="text-[#717182]">Kenya</p>
                  <p className="text-[#717182]">{order.city}</p>
                  <p className="text-[#717182]">{order.area}</p>
                  <p className="text-[#717182]">{order.apartment}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-[#333333] mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#99582A]" />
                Order Items
              </h4>
              <div className="border border-[#F0F0F0] rounded-lg">
                <div className="divide-y divide-[#F0F0F0]">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[#333333]">{item.name}</p>
                        <p className="text-sm text-[#717182]">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-[#333333]">ksh {(item.price * (item.quantity / 100)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="text-[#333333] mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#99582A]" />
                Payment Information
              </h4>
              <div className="border border-[#F0F0F0] bg-[#FAFAFA] rounded-lg">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#717182]">Subtotal</span>
                    <span className="text-[#333333]">ksh {order.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#717182]">Shipping</span>
                    <span className="text-[#333333]">ksh 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#717182]">Tax</span>
                    <span className="text-[#333333]">ksh 0</span>
                  </div>
                  {/* <hr className="border-[#F0F0F0]" />
                  <div className="flex justify-between">
                    <span className="text-[#333333]">Total</span>
                    <span className="text-[#333333]">{order.total}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-[#717182]">Payment Method: {order.payment}</p>
                    <p className="text-sm text-[#717182]">Card ending in •••• 4242</p>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {(order.status === "shipped" || order.status === "completed") && (
              <div>
                <h4 className="text-[#333333] mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#99582A]" />
                  Tracking Information
                </h4>
                <div className="border border-[#F0F0F0] bg-[#FAFAFA] rounded-lg">
                  <div className="p-4">
                    <p className="text-sm text-[#717182]">Tracking Number</p>
                    <p className="text-[#333333] mt-1">1Z999AA10123456784</p>
                    <p className="text-sm text-[#717182] mt-3">Carrier</p>
                    <p className="text-[#333333] mt-1">UPS Ground</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-3 items-center pt-4">
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="px-3 py-2 w-2/3 bg-[#F0F0F0] border border-gray-300 rounded-md text-sm"
              >
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={async () => {
                  try {
                    await updateOrder(order.id, { status: currentStatus });
                    if (onOrderUpdate) onOrderUpdate(order.id, { status: currentStatus });
                    toast.success(`Status updated to ${currentStatus}`);
                  } catch (error) {
                    toast.error("Failed to update status");
                    console.error(error);
                  }
                }}
                className="px-4 py-2 bg-[#99582A] hover:bg-[#7d4622] text-white rounded-md text-sm"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}