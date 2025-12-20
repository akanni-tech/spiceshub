import { Bell, Box, ChartLine, Cog, LayoutDashboard, LogOut, PanelLeft, Search, ShoppingCart, User, Users, DollarSign, Package, Tag, ChefHat, Heart } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

import { useNavigate } from 'react-router';
import { AnalyticsPage } from './AnalyticsPage';
import { OrdersPage } from './OrdersPage';
import { CustomersPage } from './CustomersPage';
import { SettingsPage } from './SettingsPage';
import { ProductsPage } from './Products';
import { StatsCard } from './components/StatsCard';
import { SalesChart } from './components/SalesChart';
import { RecentOrders } from './components/RecentOrders';
import { TopProducts } from './components/TopProducts';
import { useAdminData } from './hooks/useAdminData';
import { aggregateOrdersByMonth, calculateTotalRevenue, getRecentFiveOrdersSummary } from './hooks/helpers';
import { AdminCategories } from './AdminCategories';
import AdminMeals from './AdminMeals';
import AdminHealth from './AdminHealth';
import AdminSales from './AdminSales';




// Utility function to merge classNames
const cn = (...classes) => classes.filter(Boolean).join(' ');


// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Sidebar Context
const SidebarContext = createContext(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
};

// Sidebar Provider Component
const SidebarProvider = ({
  defaultOpen = true,
  children,
  className = '',
  style = {}
}) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [open, setOpen] = useState(defaultOpen);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setOpen(prev => !prev);
    }
  }, [isMobile]);

  // Keyboard shortcut (Cmd/Ctrl + B)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, isMobile, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={{
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '3rem',
          ...style
        }}
        className={cn(
          "flex min-h-screen w-full",
          className
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

// Main Sidebar Component
const Sidebar = ({
  side = "left",
  className = '',
  children
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {openMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpenMobile(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out w-72",
            side === "left" ? "left-0" : "right-0",
            openMobile
              ? "translate-x-0"
              : side === "left"
                ? "-translate-x-full"
                : "translate-x-full"
          )}
        >
          <div className="flex h-full w-full flex-col">
            {children}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      data-state={state}
      className="hidden md:block text-gray-800"
    >
      {/* Sidebar Gap */}
      <div
        className={cn(
          "relative bg-transparent transition-all duration-200 ease-linear",
          state === "collapsed" ? "w-17" : "w-64"
        )}
      />

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-screen transition-all duration-200 ease-linear md:flex",
          side === "left" ? "left-0" : "right-0",
          state === "collapsed" ? "w-17" : "w-64",
          side === "left" ? "border-r" : "border-l",
          "border-gray-200",
          className
        )}
      >
        <div className="bg-[#F0F0F0] overflow-y-auto flex h-full w-full flex-col shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

// Sidebar Trigger Button
const SidebarTrigger = ({ className = '' }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "p-2 hover:bg-gray-100 rounded-md transition-colors",
        className
      )}
    >
      <PanelLeft className='h-6 w-6 text-[#99582A]' />
    </button>
  );
};

// Sidebar Header
const SidebarHeader = ({ className = '', children }) => {
  return (
    <div className={cn("flex flex-col gap-2 p-4", className)}>
      {children}
    </div>
  );
};

// Sidebar Content
const SidebarContent = ({ className = '', children }) => {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 p-2",
        state === "collapsed" && "overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

// Sidebar Footer
const SidebarFooter = ({ className = '', children }) => {
  return (
    <div className={cn("flex flex-col gap-2 p-4 border-t border-gray-200", className)}>
      {children}
    </div>
  );
};

// Sidebar Menu
const SidebarMenu = ({ className = '', children }) => {
  return (
    <ul className={cn("flex flex-col gap-1 w-full", className)}>
      {children}
    </ul>
  );
};

// Sidebar Menu Item
const SidebarMenuItem = ({ className = '', children }) => {
  return (
    <li className={cn("relative", className)}>
      {children}
    </li>
  );
};

// Sidebar Menu Button
const SidebarMenuButton = ({
  isActive = false,
  icon,
  tooltip,
  className = '',
  children,
  onClick
}) => {
  const { state } = useSidebar();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group mb-2">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors",
          "hover:bg-gray-200",
          isActive && "bg-red-300 font-medium text-black",
          state === "collapsed" && "justify-center",
          className
        )}
      >
        {icon && <span className="flex-shrink-0 text-[#99582A]">{icon}</span>}
        {state === "expanded" && (
          <span className="truncate">{children}</span>
        )}
      </button>

      {/* Tooltip for collapsed state - using portal approach */}
      {state === "collapsed" && showTooltip && tooltip && (
        <div
          className="fixed bg-[#99582A] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-[9999] pointer-events-none"
          style={{
            left: `calc(var(--sidebar-width-icon) + 0.5rem)`,
            top: `${document.querySelector('.group:hover')?.getBoundingClientRect().top + window.scrollY + 8}px`
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

// Sidebar Group
const SidebarGroup = ({ className = '', children }) => {
  return (
    <div className={cn("flex flex-col gap-2 p-2", className)}>
      {children}
    </div>
  );
};

// Sidebar Group Label
const SidebarGroupLabel = ({ className = '', children }) => {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "text-xs font-semibold text-gray-500 px-2 py-1 transition-opacity",
        state === "collapsed" && "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};

let Menuitems = [
  {
    Title: "Dashboard",
    itemName: "dashboard",
    icon: <LayoutDashboard className='h-7 w-7' />
  },
  {
    Title: "Orders",
    itemName: "orders",
    icon: <ShoppingCart className='h-7 w-7' />
  },
  {
    Title: "Products",
    itemName: "products",
    icon: <Box className='h-7 w-7' />
  },
  {
    Title: "Meals",
    itemName: "meals",
    icon: <ChefHat className='h-7 w-7' />
  },
  {
    Title: "Health",
    itemName: "health",
    icon: <Heart className='h-7 w-7' />
  },
  {
    Title: "Sales",
    itemName: "sales",
    icon: <Tag className='h-7 w-7' />
  },
  {
    Title: "Customers",
    itemName: "customers",
    icon: <Users className='h-7 w-7' />
  },
  {
    Title: "Categories",
    itemName: "categories",
    icon: <Tag className='h-7 w-7' />
  },
  {
    Title: "Analytics",
    itemName: "analytics",
    icon: <ChartLine className='h-7 w-7' />
  },
  {
    Title: "Settings",
    itemName: "settings",
    icon: <Cog className='h-7 w-7' />
  }
]





const SidebarContentWithFeatures = ({ activePage, setActivePage }) => {
  // ✅ useSidebar is correctly called here!
  const { open } = useSidebar();

  return (
    <>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {Menuitems.map((MenuItem) => (
              <SidebarMenuItem key={MenuItem.itemName}>
                <SidebarMenuButton
                  icon={MenuItem.icon}
                  isActive={activePage === MenuItem.itemName}
                  onClick={() => setActivePage(MenuItem.itemName)}
                  tooltip={MenuItem.Title}
                >
                  {MenuItem.Title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
};

// App
const AdminSidebar = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate()
  const { products, categories, orders, users, loading, error, topProducts } = useAdminData();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  }

  const revenue = orders && calculateTotalRevenue(orders);
  const totalOrders = orders && orders.length;
  const totalUsers = users && users.length;
  const totalProducts = products && products.length;
  const OrdersByMonth = orders && aggregateOrdersByMonth(orders);
  const recentOrders = orders && getRecentFiveOrdersSummary(orders);


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left">
        <SidebarHeader>
          <div className="flex w-full items-center gap-2 p-1">
            <div className="w-8 h-8 min-w-[2rem] bg-[#99582A] rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              B
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-2xl font-medium truncate">Brand</p>
            </div>
          </div>
        </SidebarHeader>

        {/* ✅ The new component takes over the rendering logic */}
        <SidebarContentWithFeatures
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <SidebarFooter>
          <div className="flex w-full items-center gap-2 p-1">
            <div className="w-8 h-8 min-w-[2rem] bg-[#99582A] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              U
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">User</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search orders, products, customers..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-400 rounded-lg focus:ring-[#AD2E24] focus:border-[#AD2E24] outline-none transition-shadow"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center ml-auto self-end gap-4">
              <button title="Notifications" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-[#99582A]" />
              </button>
              <button onClick={signOut} title="Notifications" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <LogOut className="w-6 h-6 text-[#99582A]" />
              </button>
              <button title="Profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-6 h-6 text-[#99582A]" />
              </button>
            </div>
          </div>
        </header>


        <div className="p-8">
          {activePage === "dashboard" && (
            <div className="max-w-[1600px] mx-auto space-y-8">
              {/* Page Title */}
              <div>
                <h1 className="text-[#333333]">Dashboard Overview</h1>
                <p className="text-[#717182] mt-1">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Revenue"
                  value={`ksh ${revenue}`}
                  changeType="positive"
                  icon={DollarSign}
                />
                <StatsCard
                  title="Total Orders"
                  value={`${totalOrders}`}
                  changeType="positive"
                  icon={ShoppingCart}
                />
                <StatsCard
                  title="Total Users"
                  value={`${totalUsers}`}
                  // change="+5.4% from last month"
                  changeType="positive"
                  icon={Users}
                />
                <StatsCard
                  title="Total Products"
                  value={`${totalProducts}`}
                  changeType="neutral"
                  icon={Package}
                />
              </div>

              {/* Sales Chart */}
              <SalesChart data={OrdersByMonth} />

              {/* Recent Orders Table */}
              <div>
                <RecentOrders orders={recentOrders} users={users} />
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <TopProducts products={topProducts} />

              </div>
            </div>
          )}
          {activePage === "orders" && <OrdersPage />}
          {activePage === "products" && <ProductsPage />}
          {activePage === "meals" && <AdminMeals />}
          {activePage === "health" && <AdminHealth />}
          {activePage === "sales" && <AdminSales />}
          {activePage === "customers" && <CustomersPage />}
          {activePage === "categories" && <AdminCategories />}
          {activePage === "analytics" && <AnalyticsPage />}
          {activePage === "settings" && <SettingsPage />}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminSidebar;