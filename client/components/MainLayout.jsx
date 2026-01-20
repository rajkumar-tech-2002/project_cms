import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Boxes,
  Truck,
  MapPin,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Item Master",
    path: "/items",
    icon: Package,
  },
  {
    label: "Vendors",
    path: "/vendors",
    icon: Users,
  },
  {
    label: "Purchase",
    path: "/purchase",
    icon: ShoppingCart,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },
  {
    label: "Distribution",
    path: "/distribution",
    icon: Truck,
  },
  {
    label: "Locations",
    path: "/locations",
    icon: MapPin,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

export default function MainLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 text-white transition-all duration-300 flex flex-col shadow-2xl",
          sidebarOpen ? "w-64" : "w-20",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50",
          !mobileMenuOpen && "max-md:hidden"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
          {sidebarOpen && (
            <div className="flex items-center gap-3 animate-fadeInLeft">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all shadow-lg">
                <Boxes className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">NEC Canteen</h1>
                <p className="text-xs text-white/70">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {navigationItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 animate-fadeInLeft",
                    isActive
                      ? "bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent"
                  )}
                  style={{animationDelay: `${idx * 50}ms`}}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 backdrop-blur-sm">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium border border-transparent hover:border-white/30"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-blue-50 rounded-lg transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
                College Canteen Stock & Distribution
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-600 font-medium">System Online</span>
              </div>
              <button className="p-2 hover:bg-blue-50 rounded-lg relative transition-all group">
                <div className="relative">
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-110">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
