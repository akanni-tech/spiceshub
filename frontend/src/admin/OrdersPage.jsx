import { useState, useEffect } from "react";
import { Search, Download, Filter, Eye, MoreHorizontal, EyeIcon, ListOrdered, Fullscreen } from "lucide-react";
import { RecentOrders } from "./components/RecentOrders";
import { OrderDetailDialog } from "./components/OrderDetailDialog";
import { getOrders } from "../hooks/services";
import { useAdminData } from "./hooks/useAdminData";
import { AdminOrderView } from "./AdminOrderView";


const statusConfig = {
  completed: { label: "Completed", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showDetailedOrder, setShowDetailedOrder] = useState(false);

  const [sortByStatus, setSortByStatus] = useState(false);


  // Load orders from mock data since API endpoint doesn't exist
  useEffect(() => {
    async function getAllOrders() {
      const data = await getOrders();
      setOrders(data);
      setDisplayedOrders(data);
    }
    getAllOrders()
  }, []);


  useEffect(() => {
    if (!orders || !Array.isArray(orders)) return;

    if (statusFilter === "all") {
      setDisplayedOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
      setDisplayedOrders(filtered);
    }
  }, [orders, statusFilter]);


  const getUserFirstNameById = (userId) => {
    if (!Array.isArray(users) || !userId) return "Unknown";

    const user = users.find(u => u.id === userId);
    return user?.firstName || "Unknown";
  };

  const getUserEmailById = (userId) => {
    if (!Array.isArray(users) || !userId) return "Unknown";

    const user = users.find(u => u.id === userId);
    return user?.email || "Unknown";
  };


  const handleExport = (format) => {
    setShowExportMenu(false);
    try {
      const filename = `orders-export-${new Date().toISOString().split("T")[0]}`;

      if (format === 'csv') {
        // CSV Export
        const headers = ["Order ID", "Customer", "Email", "Date", "Items", "Payment", "Total", "Status"];
        const csvRows = [headers.join(",")];

        orders.forEach((order) => {
          const row = [
            order.id,
            `"${getUserFirstNameById(order.user_id)}"`,
            getUserEmailById(order.user_id),
            `"${order.created_at}"`,
            order.items.length,
            `"${order.payment}"`,
            order.total_amount,
            order.status,
          ];
          csvRows.push(row.join(","));
        });

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } else if (format === 'excel') {
        // Excel Export (CSV with Excel-friendly formatting)
        const headers = ["Order ID", "Customer", "Email", "Date", "Items", "Payment", "Total", "Status"];
        const csvRows = [headers.join("\t")]; // Tab-separated for Excel

        orders.forEach((order) => {
          const row = [
            order.id,
            getUserFirstNameById(order.user_id),
            getUserEmailById(order.user_id),
            order.created_at,
            order.items.length,
            order.payment,
            order.total_amount.replace('$', ''), // Remove $ for Excel number formatting
            order.status,
          ];
          csvRows.push(row.join("\t"));
        });

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/tab-separated-values" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } else if (format === 'pdf') {
        // PDF Export (Simple HTML to PDF approach)
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Orders Export</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .status-completed { color: #22c55e; }
                .status-processing { color: #3b82f6; }
                .status-shipped { color: #8b5cf6; }
                .status-pending { color: #eab308; }
                .status-cancelled { color: #ef4444; }
              </style>
            </head>
            <body>
              <h1>Orders Export - ${new Date().toLocaleDateString()}</h1>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(order => `
                    <tr>
                      <td>${order.id}</td>
                      <td>${getUserFirstNameById(order.user_id)}</td>
                      <td>${getUserEmailById(order.user_id)}</td>
                      <td>${order.created_at}</td>
                      <td>${order.items.length}</td>
                      <td>${order.payment}</td>
                      <td>${order.total_amount}</td>
                      <td class="status-${order.status.toLowerCase()}">${order.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
            </html>
          `;

          printWindow.document.write(htmlContent);
          printWindow.document.close();

          // Wait for content to load then print (which will show save as PDF option)
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      }

      alert(`Orders exported successfully as ${format.toUpperCase()}! Downloaded ${orders.length} orders.`);
    } catch (error) {
      alert(`Export failed. There was an error exporting the orders as ${format.toUpperCase()}.`);
    }
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showExportMenu && !e.target.closest('.relative')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showExportMenu]);

  const { users } = useAdminData();

  const allUsers = users && users
  const allOrders = orders && orders


  if (showDetailedOrder) {
    return (
      <AdminOrderView
        onBack={() => setShowDetailedOrder(false)}
        orderSelect={selectedOrder}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[#333333] text-2xl font-semibold">Orders</h1>
        <p className="text-[#717182] mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Total Orders</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{orders.length}</h3>
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Pending</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{orders.filter(o => o.status === 'pending').length}</h3>
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Processing</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{orders.filter(o => o.status === 'processing').length}</h3>
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Completed</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{orders.filter(o => o.status === 'completed').length}</h3>
        </div>
      </div>

      {/* Recent Orders */}
      {/* <RecentOrders orders={allOrders} users={allUsers} /> */}

      {/* Orders Table */}
      <div className="border border-[#F0F0F0] rounded-lg bg-white">
        <div className="border-b border-[#F0F0F0] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#333333] text-lg font-semibold">All Orders</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32 px-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExportMenu(!showExportMenu);
                  }}
                  className="bg-[#99582A] hover:bg-[#7d4622] text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport('csv');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export as CSV
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport('excel');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export as Excel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport('pdf');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FFE6A7]/20 hover:bg-[#FFE6A7]/20">
                <th className="text-left p-4 text-[#333333] font-semibold">Order ID</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Customer</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Date</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Items</th>
                {/* <th className="text-left p-4 text-[#333333] font-semibold">Payment</th> */}
                <th className="text-left p-4 text-[#333333] font-semibold">Total</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Status</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FFE6A7]/10 border-t border-[#F0F0F0]">
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetail(true);
                      }}
                      className="text-[#99582A] font-medium hover:underline"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-[#333333]">{getUserFirstNameById(order.user_id)}</p>
                      <p className="text-sm text-[#717182]">{getUserEmailById(order.user_id)}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[#717182]">{order.created_at}</td>
                  <td className="p-4 text-[#717182]">{order.items.length}</td>
                  {/* <td className="p-4 text-[#717182]">{order.payment}</td> */}
                  <td className="p-4 text-[#333333] font-medium">{Math.round(order.total_amount)}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.className || 'bg-gray-100 text-gray-700'}`}>
                      {statusConfig[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2 text-sm">
                      <button
                        className="relative group p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetail(true);
                        }}
                      >
                        <EyeIcon size={18} />
                        <span className="
                          absolute left-1/2 -translate-x-1/2 mt-2 
                          bg-[#FFE6A7] text-[#2C2C2C] text-xs 
                          whitespace-nowrap px-2 py-1 rounded-lg shadow 
                          opacity-0 z-10 group-hover:opacity-100 
                          group-hover:translate-y-1 
                          transition-all duration-200
                        ">
                          Quick View
                        </span>
                      </button>
                      <button
                        className="relative group p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailedOrder(true);
                        }}
                      >
                        <Fullscreen size={18} />
                        <span className="
                          absolute left-1/2 -translate-x-1/2 mt-2 
                          bg-[#FFE6A7] text-[#2C2C2C] text-xs 
                          whitespace-nowrap px-2 py-1 rounded-lg shadow 
                          opacity-0 z-10 group-hover:opacity-100 
                          group-hover:translate-y-1 
                          transition-all duration-200
                        ">
                          Detailed View
                        </span>
                      </button>

                      {/* Dropdown menu would need JavaScript for full functionality */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          open={showOrderDetail}
          onOpenChange={setShowOrderDetail}
          order={selectedOrder}
          onOrderUpdate={(orderId, updates) => {
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === orderId ? { ...order, ...updates } : order
              )
            );
          }}
        />
      )}
    </div>
  );
}