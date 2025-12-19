import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  FileText,
  Printer,
  Download,
  ClipboardClock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getUserById, updateOrder } from '../hooks/services';

export function AdminOrderView({ orderId, orderSelect, onNavigate, onBack }) {
  const [customer, setCustomer] = useState([])
  const [currentOrder, setCurrentOrder] = useState(orderSelect)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    async function getCustomer() {
      const data = await getUserById(orderSelect.user_id);
      setCustomer(data);
    }
    getCustomer()
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClipboardClock className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  console.log(customer)

  return (
    <div className="p-6 space-y-6">

      {/* TOP HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-[#2C2C2C]">Order {orderSelect.id}</h1>
            <p className="text-sm text-gray-500">{orderSelect.created_at}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => toast.success("Printing...")}
            className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <Printer className="w-4 h-4" /> Print
          </button>

          <button
            onClick={() => toast.success("Downloading invoice...")}
            className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <Download className="w-4 h-4" /> Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#2C2C2C]">Order Items</h2>

            <div className="space-y-4">

              {orderSelect.items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[#F0F0F0] rounded-lg"
                >
                  <div className="w-20 h-20 rounded overflow-hidden bg-white">
                    <img
                      src={item.product?.main_image || item.image}
                      alt={item.product?.name || item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[#2C2C2C]">{item.product?.name || item.name}</h3>
                    {/* <p className="text-sm text-gray-500">SKU: {item.sku}</p> */}

                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <p><span className="text-gray-500">Size: </span>{item.size || 'N/A'}</p>
                      <p><span className="text-gray-500">Color: </span>{item.color || 'N/A'}</p>
                      <p><span className="text-gray-500">Qty: </span>{item.quantity}</p>
                      <p>
                        <span className="text-gray-500">Price: </span>
                        <span className="text-[#99582A]">ksh {item.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-semibold text-[#99582A]">
                    ksh {(item.price * (item.quantity / 100)).toFixed(2)}
                  </div>
                </div>
              ))}

            </div>

            <div className="my-4 w-full h-px bg-gray-200" />

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>ksh {orderSelect.total_amount.toFixed(2) - ((orderSelect.shipping_method == "standard") ? 0 : 500)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>ksh {(orderSelect.shipping_method == "standard") ? 0 : 500}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>ksh {0}</span>
              </div>

              <div className="w-full h-px bg-gray-200 my-2" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#99582A]">ksh {orderSelect.total_amount.toFixed(2)}</span>
              </div>

            </div>
          </div>

          {/* CUSTOMER NOTES */}
          {orderSelect.additionalNote && (
            <div className="bg-white p-5 shadow rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#99582A]" />
                <h2 className="text-lg font-semibold text-[#2C2C2C]">Customer Note</h2>
              </div>

              <p className="p-4 bg-[#FFE6A7] rounded-lg text-sm text-[#2C2C2C]">
                {orderSelect.additionalNote}
              </p>
            </div>
          )}

          {/* INTERNAL NOTES */}
          <div className="bg-white p-5 shadow rounded-xl">
            <h2 className="text-lg font-semibold text-[#2C2C2C] mb-3">Internal Notes</h2>

            {currentOrder.internal_notes && currentOrder.internal_notes.length > 0 && (
              <div className="space-y-2 mb-3">
                {currentOrder.internal_notes.map((note, index) => (
                  <div key={index} className="p-3 bg-[#F0F0F0] rounded-lg text-sm">
                    {note}
                  </div>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 bg-white focus:ring-[#99582A] focus:ring-2"
              placeholder="Add internal note..."
            />
            <button
              onClick={async () => {
                if (!noteText.trim()) return;
                try {
                  const newNotes = [...(currentOrder.internal_notes || []), noteText.trim()];
                  const updatedOrder = await updateOrder(currentOrder.id, { internal_notes: newNotes });
                  setCurrentOrder(updatedOrder);
                  setNoteText('');
                  toast.success("Internal note saved");
                } catch (error) {
                  toast.error("Failed to save note");
                  console.error(error);
                }
              }}
              className="mt-3 px-4 py-2 rounded-lg bg-[#99582A] text-white hover:bg-[#7A461F]"
            >
              Save Note
            </button>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* STATUS */}
          <div className="bg-white p-5 shadow rounded-xl">
            <h2 className="text-lg mb-3 text-[#2C2C2C] font-semibold">Order Status</h2>

            <span className={`w-full block text-center py-2 rounded-lg ${getStatusColor(currentOrder.status)}`}>
              <span className="flex justify-center items-center gap-2">
                {getStatusIcon(currentOrder.status)}
                {currentOrder.status}
              </span>
            </span>

            <label className="block mt-4 font-medium">Update Status</label>
            <select
              value={currentOrder.status}
              onChange={async (e) => {
                try {
                  const updatedOrder = await updateOrder(currentOrder.id, { status: e.target.value });
                  setCurrentOrder(updatedOrder);
                  toast.success(`Status updated to ${e.target.value}`);
                } catch (error) {
                  toast.error("Failed to update status");
                  console.error(error);
                }
              }}
              className="mt-2 w-full border border-gray-200 p-2 rounded-lg bg-white"
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* CUSTOMER */}
          <div className="bg-white p-5 shadow rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#99582A]" />
              <h2 className="text-lg font-semibold">Customer</h2>
            </div>

            <p className="text-[#2C2C2C]">{customer.firstName + " " + customer.lastName}</p>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              {customer.email}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              {customer.phoneNumber}
            </div>

            <button
              onClick={() => onNavigate('admin-customers')}
              className="w-full mt-3 border border-gray-200 rounded-lg p-2 hover:bg-gray-100"
            >
              View Customer Profile
            </button>
          </div>

          {/* SHIPPING */}
          <div className="bg-white p-5 shadow rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[#99582A]" />
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>

            <div className="text-sm space-y-1">
              <p>{orderSelect.city}</p>
              <p>{orderSelect.area}, {orderSelect.address} {orderSelect.apartment}</p>
              <p>Kenya</p>
            </div>

            <div className="w-full h-px bg-gray-200 my-3" />

            <p className="text-xs text-gray-600">{orderSelect.shipping_method}</p>
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-5 shadow rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#99582A]" />
              <h2 className="text-lg font-semibold">Payment</h2>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Method</span>
              <span>{orderSelect.payOnDelivery ? "Pay on delivery" : "mpesa"}</span>
            </div>

            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Status</span>
              <span className={`px-2 py-1 rounded-lg ${currentOrder.paid ? 'bg-green-100 text-green-700' : "bg-red-100 text-red-700"} `}>
                {currentOrder.paid ? "paid" : "not paid"}
              </span>
            </div>

            <label className="block mt-4 text-sm font-semibold">Update Status</label>
            <select
              value={currentOrder.paid ? "Paid" : "Not Paid"}
              onChange={async (e) => {
                try {
                  const paid = e.target.value === "Paid";
                  const updatedOrder = await updateOrder(currentOrder.id, { paid });
                  setCurrentOrder(updatedOrder);
                  toast.success(`Payment status updated to ${e.target.value}`);
                } catch (error) {
                  toast.error("Failed to update payment status");
                  console.error(error);
                }
              }}
              className="w-full text-sm border border-gray-200 p-2 rounded-lg bg-white"
            >
              <option>Not Paid</option>
              <option>Paid</option>
            </select>

            <div className="w-full h-px bg-gray-200" />

            <p className="text-xs text-gray-600">
              Transaction ID: {orderSelect.mpesaCode}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
