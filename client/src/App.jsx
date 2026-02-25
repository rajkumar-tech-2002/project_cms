import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import LandingPage from "./pages/homepage/landingpage.jsx";
import Login from "./pages/homepage/login.jsx";
import ForgotPassword from "./pages/homepage/forgotpassword.jsx";
import Dashboard from "./pages/mainpage/Dashboard.jsx";
import Grocery from "./pages/mainpage/Grocery.jsx";
import Vendors from "./pages/mainpage/Vendors.jsx";
import Purchase from "./pages/mainpage/Purchase.jsx";
import Inventory from "./pages/mainpage/Inventory.jsx";
import Items from "./pages/mainpage/Items.jsx";
import Distribution from "./pages/mainpage/Distribution.jsx";
import Locations from "./pages/mainpage/Locations.jsx";
import Reports from "./pages/mainpage/Reports.jsx";
import NotFound from "./pages/mainpage/NotFound.jsx";
import User from "./pages/mainpage/User.jsx";
import CounterMonitor from "./pages/mainpage/CounterMonitor.jsx";
import CounterDashboard from "./pages/counterpage/CounterDashboard.jsx";
import CounterItems from "./pages/counterpage/CounterItems.jsx";
import CounterReports from "./pages/counterpage/CounterReports.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/grocery" element={<ProtectedRoute allowedRoles={["Admin"]}><Grocery /></ProtectedRoute>} />
            <Route path="/vendors" element={<ProtectedRoute allowedRoles={["Admin"]}><Vendors /></ProtectedRoute>} />
            <Route path="/purchase" element={<ProtectedRoute allowedRoles={["Admin"]}><Purchase /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute allowedRoles={["Admin"]}><Inventory /></ProtectedRoute>} />
            <Route path="/items" element={<ProtectedRoute allowedRoles={["Admin"]}><Items /></ProtectedRoute>} />
            <Route path="/distribution" element={<ProtectedRoute allowedRoles={["Admin"]}><Distribution /></ProtectedRoute>} />
            <Route path="/locations" element={<ProtectedRoute allowedRoles={["Admin"]}><Locations /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={["Admin"]}><Reports /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute allowedRoles={["Admin"]}><User /></ProtectedRoute>} />
            <Route path="/counter-monitor" element={<ProtectedRoute allowedRoles={["Admin"]}><CounterMonitor /></ProtectedRoute>} />

            {/* Counter (Staff) Routes */}
            <Route path="/counter/dashboard" element={<ProtectedRoute allowedRoles={["CounterOperator"]}><CounterDashboard /></ProtectedRoute>} />
            <Route path="/counter/items" element={<ProtectedRoute allowedRoles={["CounterOperator"]}><CounterItems /></ProtectedRoute>} />
            <Route path="/counter/reports" element={<ProtectedRoute allowedRoles={["CounterOperator"]}><CounterReports /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
