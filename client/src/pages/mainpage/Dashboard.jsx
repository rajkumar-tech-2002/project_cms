import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import StatsCard from "@/components/StatsCard.jsx";
import ChartComponent from "@/components/ChartComponent.jsx";
import DataTable from "@/components/DataTable.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { toast } from "sonner";


export default function Dashboard() {
  const [data, setData] = useState({
    stats: {
      totalStock: 0,
      todayPurchase: 0,
      todayDistribution: 0,
      lowStockAlerts: 0
    },
    chartData: [],
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl font-semibold text-blue-900 animate-pulse">Loading Analytics...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-blue-900" />
              Dashboard
            </h1>
            <p className="text-blue-700 mt-2 text-md">
              Welcome back! Here's your inventory overview.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/purchase">
              <Button variant="outline" className="gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold rounded-lg">
                <Plus className="w-4 h-4" />
                Add Purchase
              </Button>
            </Link>
            <Link to="/distribution">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                <TrendingDown className="w-4 h-4" />
                Issue Stock
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <StatsCard
              title="Total Items in Stock"
              value={data.stats.totalStock}
              icon={Package}
              color="blue"
              suffix="units"
            />
          </div>
          <div>
            <StatsCard
              title="Today's Purchase"
              value={data.stats.todayPurchase}
              icon={TrendingUp}
              color="green"
              suffix="orders"
            />
          </div>
          <div>
            <StatsCard
              title="Today's Distribution"
              value={data.stats.todayDistribution}
              icon={TrendingDown}
              color="orange"
              suffix="issues"
            />
          </div>
          <div>
            <StatsCard
              title="Low Stock Alerts"
              value={data.stats.lowStockAlerts}
              icon={AlertTriangle}
              color="red"
              suffix="items"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-2xl border border-blue-100 shadow p-6">
              <ChartComponent
                title="Monthly Purchase vs Distribution"
                data={data.chartData}
                type="line"
                dataKeys={[
                  { key: "purchase", color: "#3b82f6", label: "Purchase Orders" },
                  { key: "distribution", color: "#10b981", label: "Distribution Issues" },
                ]}
              />
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl border border-blue-100 shadow p-6">
              <ChartComponent
                title="Counter Distribution Performance"
                data={data.counterPerformance || []}
                type="pie" // Changed from bar to pie as per user request
                dataKeys={[
                  { key: "totalQuantity", color: "#8b5cf6", label: "Total Items Issued" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Low Stock Alert Table */}
        <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Low Stock Items
              </h3>
              <p className="text-sm text-blue-700 mt-2">
                Items that need immediate attention
              </p>
            </div>
            <Link to="/inventory">
              <Button variant="outline" size="sm" className="gap-2 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 font-semibold rounded-lg">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <DataTable
            columns={[
              { key: "name", label: "Item Name" },
              {
                key: "current",
                label: "Current Stock",
                render: (value, row) => `${value} ${row.unit}`,
              },
              {
                key: "minimum",
                label: "Minimum Level",
                render: (value, row) => `${value} ${row.unit}`,
              },
              {
                key: "status",
                label: "Status",
                render: (value) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === "Critical"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                      }`}
                  >
                    {value}
                  </span>
                ),
              },
            ]}
            data={data.lowStockItems}
            pageSize={5}
            searchableFields={["name"]}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/items">
            <div className="bg-white rounded-2xl border border-blue-100 p-6 hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-900 mb-2">
                Manage Items
              </h3>
              <p className="text-sm text-blue-700">
                Add, edit, or delete stock items
              </p>
            </div>
          </Link>

          <Link to="/purchase">
            <div className="bg-white rounded-2xl border border-green-100 p-6 hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-green-900 mb-2">
                Create Purchase
              </h3>
              <p className="text-sm text-green-700">
                Add new purchase orders
              </p>
            </div>
          </Link>

          <Link to="/reports">
            <div className="bg-white rounded-2xl border border-orange-100 p-6 hover:shadow-xl transition-all cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-orange-900 mb-2">
                View Reports
              </h3>
              <p className="text-sm text-orange-700">
                Analytics and detailed reports
              </p>
            </div>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
