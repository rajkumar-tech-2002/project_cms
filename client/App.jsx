import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/homepage/landingpage.jsx";
import Login from "./pages/homepage/login.jsx";
import ForgotPassword from "./pages/homepage/forgotpassword.jsx";
import Dashboard from "./pages/mainpage/Dashboard.jsx";
import Items from "./pages/mainpage/Items.jsx";
import Vendors from "./pages/mainpage/Vendors.jsx";
import Purchase from "./pages/mainpage/Purchase.jsx";
import Inventory from "./pages/mainpage/Inventory.jsx";
import Distribution from "./pages/mainpage/Distribution.jsx";
import Locations from "./pages/mainpage/Locations.jsx";
import Reports from "./pages/mainpage/Reports.jsx";
import NotFound from "./pages/mainpage/NotFound.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/distribution" element={<Distribution />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
