import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  Boxes,
  Truck,
  MapPin,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
  Monitor,
  Bell,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils.js";
import Footer from "./Footer.jsx";

const adminNavigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Grocery", path: "/grocery", icon: Package },
  { label: "Vendors", path: "/vendors", icon: Users },
  { label: "Purchase", path: "/purchase", icon: ShoppingCart },
  { label: "Inventory", path: "/inventory", icon: Boxes },
  { label: "Items", path: "/items", icon: UtensilsCrossed },
  { label: "Distribution", path: "/distribution", icon: Truck },
  { label: "Locations", path: "/locations", icon: MapPin },
  { label: "Users", path: "/user", icon: Shield },
  { label: "Counter Monitor", path: "/counter-monitor", icon: Monitor },
  { label: "Reports", path: "/reports", icon: FileText },
];

const staffNavigation = [
  { label: "Counter Dash", path: "/counter/dashboard", icon: LayoutDashboard },
  { label: "Assigned Items", path: "/counter/items", icon: Boxes },
  { label: "Sales Reports", path: "/counter/reports", icon: FileText },
];

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user info from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  const navItems = user?.role === "Admin" ? adminNavigation : staffNavigation;
  // Prefer name, fallback to user_id for initial
  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.user_id
      ? String(user.user_id).charAt(0).toUpperCase()
      : "U";
  const userName = user?.name || user?.user_id || "User";
  const userRole = user?.role || "";

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Fetch notifications based on role
  useEffect(() => {
    if (!user) return;

    const fetchNotifs = async () => {
      try {
        let endpoint = "";
        if (user.role === "Admin") {
          endpoint = "/api/sales/admin-notifications";
        } else if (user.counter) {
          endpoint = `/api/distribution-notifications?counter=${encodeURIComponent(user.counter)}`;
        }

        if (endpoint) {
          const res = await fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifs();
    // Poll every 1 minute
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [user?.role, user?.counter]);

  // Clear notifications handler
  const handleClearNotifs = async () => {
    if (!user) return;
    try {
      let endpoint = "";
      if (user.role === "Admin") {
        endpoint = "/api/sales/clear-notifications";
      } else if (user.counter) {
        endpoint = `/api/distribution-clear-notifications?counter=${encodeURIComponent(user.counter)}`;
      }

      if (endpoint) {
        const res = await fetch(endpoint, { method: "POST" });
        if (res.ok) {
          setNotifications([]);
          setNotifOpen(false);
        }
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white text-blue-900 border-r border-blue-100 flex flex-col shadow-lg",
          sidebarOpen ? "w-64" : "w-20",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50",
          !mobileMenuOpen && "max-md:hidden",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-blue-50">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200 hover:bg-blue-200 transition-all shadow">
                <Boxes className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h1 className="text-md font-bold text-blue-900">
                  Nandha Canteen
                </h1>
                <p className="text-xs text-blue-600">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 hover:bg-blue-100 rounded-lg transition-all"
          >
            <Menu className="w-4 h-4 text-blue-700" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                    isActive
                      ? "bg-blue-100 text-blue-900 font-semibold shadow border border-blue-200"
                      : "text-blue-800 hover:bg-blue-50 border border-transparent",
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-100 bg-blue-50">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-700 hover:text-white hover:bg-blue-600 transition-all duration-300 text-sm font-medium border border-transparent hover:border-blue-300",
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
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm z-40">
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
              <h2 className="text-lg font-bold text-blue-900 text-transparent hidden md:block">
                College Canteen Stock & Distribution
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-600 font-medium">System Online</span>
              </div>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setUserMenuOpen(false); // Close other dropdown
                  }}
                  className="p-2 hover:bg-blue-50 rounded-lg relative transition-all group"
                >
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse font-bold">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl z-[100] border border-blue-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-blue-50 flex justify-between items-center bg-blue-50/50">
                      <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
                        <Bell className="w-4 h-4" />
                        {user.role === "Admin"
                          ? "Counter Sales Alerts"
                          : "Today's Receipts"}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {notifications.length} NEW
                      </span>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearNotifs}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors bg-red-50 px-2 py-1 rounded-lg border border-red-100"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-3 border-b border-blue-50 hover:bg-blue-50/30 transition-colors cursor-default"
                          >
                            {user.role === "Admin" ? (
                              <>
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                    {notif.counter_name}
                                  </span>
                                  <span className="text-[9px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(
                                      notif.sale_date,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <p className="text-gray-700 font-medium">
                                    {notif.item_name}
                                  </p>
                                  <p className="text-blue-700 font-bold">
                                    Qty: {notif.quantity}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                    #{notif.issue_no}
                                  </span>
                                  <span className="text-[9px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(
                                      notif.created_at,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700 font-medium line-clamp-2">
                                  {notif.issued_items}
                                </p>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-gray-300" />
                          </div>
                          <p className="text-xs text-gray-400 font-medium">
                            No alerts for today
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center border-t border-blue-50">
                      <p className="text-[10px] text-gray-400 font-medium">
                        Live monitoring active
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={userRef}>
                <div
                  className="w-10 h-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-110 cursor-pointer"
                  onClick={() => {
                    setUserMenuOpen((v) => !v);
                    setNotifOpen(false); // Close other dropdown
                  }}
                  title="User menu"
                >
                  {userInitial}
                </div>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl z-[100] border border-blue-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-5 py-4 border-b border-blue-50 bg-blue-50/50">
                      <div className="font-bold text-blue-900 text-sm">
                        {userName}
                      </div>
                      <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                        {userRole}
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
          <div className="p-6 flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
