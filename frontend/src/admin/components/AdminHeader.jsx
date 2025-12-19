import { Bell, Search, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-[#F0F0F0] px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-[#F0F0F0] border border-transparent rounded-md focus:border-[#99582A] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#F0F0F0] rounded-md transition-colors">
            <Bell className="w-5 h-5 text-[#717182]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#99582A] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#333333] font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}