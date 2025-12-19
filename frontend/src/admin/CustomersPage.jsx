import { useState, useEffect } from "react";
import { Search, Download, UserPlus, Mail, MoreHorizontal, User, User2 } from "lucide-react";
import { CustomerDetailDialog } from "./components/CustomerDetailDialog";
import { useAdminData } from "./hooks/useAdminData";


const statusConfig = {
  vip: { label: "VIP", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  regular: { label: "Regular", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  new: { label: "New", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

export function CustomersPage() {

  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  const { products, categories, orders, users: customers, loading, error } = useAdminData();

  const getOrderCountByUser = (userId) => {
    if (!Array.isArray(orders) || !userId) return 0;

    return orders.filter(order => order.user_id === userId).length;
  };

  const getTotalSpentByUser = (userId) => {
    if (!Array.isArray(orders) || !userId) return 0;

    return orders
      .filter(order => order.user_id === userId)
      .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  };



  const handleExport = (format) => {
    setShowExportMenu(false);
    try {
      const filename = `customers-export-${new Date().toISOString().split("T")[0]}`;

      if (format === 'csv') {
        // CSV Export
        const headers = ["Name", "Email", "Orders", "Total Spent", "Status", "Join Date", "Last Order"];
        const csvRows = [headers.join(",")];

        customers.forEach((customer) => {
          const row = [
            `"${customer.name}"`,
            customer.email,
            getOrderCountByUser(customer.id),
            getTotalSpentByUser(customer.id),
            `"${customer.created_at}"`,
            `"${customer.lastOrder}"`,
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
        const headers = ["Name", "Email", "Orders", "Total Spent", "Status", "Join Date", "Last Order"];
        const csvRows = [headers.join("\t")]; // Tab-separated for Excel

        customers.forEach((customer) => {
          const row = [
            customer.name,
            customer.email,
            getOrderCountByUser(customer.id),
            getTotalSpentByUser(customer.id), // Remove $ for Excel number formatting
            customer.created_at,
            customer.lastOrder,
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
              <title>Customers Export</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .status-vip { color: #8b5cf6; }
                .status-regular { color: #3b82f6; }
                .status-new { color: #22c55e; }
              </style>
            </head>
            <body>
              <h1>Customers Export - ${new Date().toLocaleDateString()}</h1>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${customers.map(customer => `
                    <tr>
                      <td>${customer.firstName}</td>
                      <td>${customer.email}</td>
                      <td>${getOrderCountByUser(customer.id)}</td>
                      <td>${getTotalSpentByUser(customer.id)}</td>
                      <td>${customer.created_at}</td>
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

      alert(`Customers exported successfully as ${format.toUpperCase()}! Downloaded ${customers.length} customers.`);
    } catch (error) {
      alert(`Export failed. There was an error exporting the customers as ${format.toUpperCase()}.`);
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

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.firstName?.toLowerCase().includes(query) ||
      customer.lastName?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  const getTotalSpentAll = () => {
    if (!Array.isArray(orders)) return 0;
    return orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[#333333] text-2xl font-semibold">Customers</h1>
          <p className="text-[#717182] mt-1">
            Manage your customer relationships
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Total Customers</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{customers.length}</h3>
          {/* <p className="text-xs text-green-600 mt-1">+{Math.floor(customers.length * 0.05)} this month</p> */}
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">VIP Customers</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{customers.filter(c => c.status === 'vip').length}</h3>
          {/* <p className="text-xs text-[#717182] mt-1">{Math.round((customers.filter(c => c.status === 'vip').length / customers.length) * 100)}% of total</p> */}
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">Avg. Order Value</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">ksh {Math.round(getTotalSpentAll()/customers.length)}</h3>
          {/* <p className="text-xs text-green-600 mt-1">+8.2% increase</p> */}
        </div>
        <div className="border border-[#F0F0F0] rounded-lg bg-white p-4">
          <p className="text-sm text-[#717182]">New This Month</p>
          <h3 className="mt-1 text-[#333333] text-xl font-semibold">{customers.filter(c => c.status === 'new').length}</h3>
          {/* <p className="text-xs text-green-600 mt-1">+23% growth</p> */}
        </div>
      </div>

      {/* Customers Table */}
      <div className="border border-[#F0F0F0] rounded-lg bg-white">
        <div className="border-b border-[#F0F0F0] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#333333] text-lg font-semibold">All Customers</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white"
                />
              </div>

              {/* Filter */}

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
                <th className="text-left p-4 text-[#333333] font-semibold">Customer</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Email</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Orders</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Total Spent</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Join Date</th>
                <th className="text-left p-4 text-[#333333] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#FFE6A7]/10 border-t border-[#F0F0F0]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#FFE6A7] p-3">
                        <User2 className="" />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerDetail(true);
                        }}
                        className="text-[#333333] hover:text-[#99582A] hover:underline"
                      >
                        {customer.firstName}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-[#717182]">{customer.email}</td>
                  <td className="p-4 text-[#333333]">{getOrderCountByUser(customer.id)}</td>
                  <td className="p-4 text-[#333333]">Ksh {getTotalSpentByUser(customer.id).toFixed(2)}</td>
                  <td className="p-4 text-[#717182]">{customer.created_at}</td>
                  <td className="p-4">
                    <div className="relative">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4" />
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

      {/* Customer Detail Dialog */}
      {selectedCustomer && (
        <CustomerDetailDialog
          open={showCustomerDetail}
          onOpenChange={setShowCustomerDetail}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}