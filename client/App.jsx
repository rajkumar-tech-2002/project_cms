import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Vendors from "./pages/Vendors";
import Purchase from "./pages/Purchase";
import Inventory from "./pages/Inventory";
import Distribution from "./pages/Distribution";
import Locations from "./pages/Locations";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/distribution" element={<Distribution />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/reports" element={<Reports />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
