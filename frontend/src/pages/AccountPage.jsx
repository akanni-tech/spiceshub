import React from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router';

function AccountPage({ onNavigate }) {
  const [activeTab, setActiveTab] = React.useState('orders');

  const orders = [
    {
      id: 'ORD-12345',
      date: 'November 1, 2025',
      status: 'Delivered',
      total: 234.97,
      items: 3,
    },
    {
      id: 'ORD-12344',
      date: 'October 25, 2025',
      status: 'In Transit',
      total: 129.99,
      items: 1,
    },
    {
      id: 'ORD-12343',
      date: 'October 18, 2025',
      status: 'Delivered',
      total: 449.98,
      items: 2,
    },
  ];

  const addresses = [
    {
      id: '1',
      type: 'Home',
      name: 'John Doe',
      address: '123 Main St, Apt 4B',
      city: 'New York, NY 10001',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      name: 'John Doe',
      address: '456 Office Ave, Suite 200',
      city: 'New York, NY 10002',
      isDefault: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-[#2C2C2C]">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <NavLink to={"/profile"}>
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 w-full hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFE6A7] flex items-center justify-center">
                  <User className="w-6 h-6 text-[#99582A]" />
                </div>
                <div className="text-left">
                  <p className="text-[#2C2C2C]">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
              </button>
            </NavLink>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-[#2C2C2C] ${activeTab === 'orders' ? 'bg-[#FFE6A7]' : 'hover:bg-[#F0F0F0]'}`}
              >
                <Package className="w-4 h-4" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-[#2C2C2C] ${activeTab === 'addresses' ? 'bg-[#FFE6A7]' : 'hover:bg-[#F0F0F0]'}`}
              >
                <MapPin className="w-4 h-4" />
                Addresses
              </button>
              <NavLink to={'/profile'}>
                <button
                  onClick={() => onNavigate('profile')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded text-[#2C2C2C] hover:bg-[#F0F0F0]"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </NavLink>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-pink-600 hover:bg-[#F0F0F0]">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="w-full">
            <div className="inline-flex bg-[#F0F0F0] rounded-lg p-1 mb-6">
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-[#99582A] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('orders')}
              >
                My Orders
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'addresses' ? 'bg-white text-[#99582A] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('addresses')}
              >
                Addresses
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'profile' ? 'bg-white text-[#99582A] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </div>

            {activeTab === 'orders' && (
              <div>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[#2C2C2C]">Order {order.id}</h3>
                            <span
                              className={
                                order.status === 'Delivered'
                                  ? 'px-2 py-1 text-xs bg-green-100 text-green-700 rounded'
                                  : 'px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded'
                              }
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on {order.date}
                          </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-[#99582A] mb-2">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{order.items} items</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="px-3 py-1 text-sm border border-[#99582A] text-[#99582A] rounded hover:bg-[#FFE6A7]"
                        >
                          View Details
                        </button>
                        {order.status === 'In Transit' && (
                          <button
                            className="px-3 py-1 text-sm bg-[#99582A] text-white rounded hover:bg-[#99582A]/90"
                          >
                            Track Package
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="space-y-4 mb-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-[#2C2C2C]">{addr.type}</h4>
                            {addr.isDefault && (
                              <span className="px-2 py-1 text-xs bg-[#99582A] text-white rounded">Default</span>
                            )}
                          </div>
                          <p className="text-[#2C2C2C] mb-1">{addr.name}</p>
                          <p className="text-sm text-muted-foreground">{addr.address}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm hover:bg-gray-50 rounded">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm text-red-600 hover:bg-gray-50 rounded">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90">
                  Add New Address
                </button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h3 className="mb-6 text-[#2C2C2C]">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-[#2C2C2C]">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-3 py-2 border border-gray-200 rounded bg-[#F0F0F0]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-[#2C2C2C]">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-3 py-2 border border-gray-200 rounded bg-[#F0F0F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-[#2C2C2C]">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-[#F0F0F0]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-[#2C2C2C]">Phone</label>
                      <input
                        type="tel"
                        defaultValue="(555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-[#F0F0F0]"
                      />
                    </div>

                    <div className="flex gap-3 pt-6">
                      <button className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90">
                        Save Changes
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;