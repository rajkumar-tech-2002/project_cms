import { useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  ArrowRight,
} from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import StatsCard from "@/components/StatsCard.jsx";
import ChartComponent from "@/components/ChartComponent.jsx";
import DataTable from "@/components/DataTable.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

// Mock data for charts
const monthlyData = [
  { name: "Jan", purchase: 4000, distribution: 2400 },
  { name: "Feb", purchase: 3000, distribution: 1398 },
  { name: "Mar", purchase: 2000, distribution: 9800 },
  { name: "Apr", purchase: 2780, distribution: 3908 },
  { name: "May", purchase: 1890, distribution: 4800 },
  { name: "Jun", purchase: 2390, distribution: 3800 },
  { name: "Jul", purchase: 3490, distribution: 4300 },
];

// Mock low stock items
const lowStockItems = [
  {
    id: 1,
    name: "Rice (Basmati)",
    current: 50,
    minimum: 200,
    unit: "Kg",
    status: "Critical",
  },
  {
    id: 2,
    name: "Cooking Oil",
    current: 15,
    minimum: 50,
    unit: "Litre",
    status: "Low",
  },
  {
    id: 3,
    name: "Wheat Flour",
    current: 75,
    minimum: 150,
    unit: "Kg",
    status: "Low",
  },
  {
    id: 4,
    name: "Salt",
    current: 5,
    minimum: 20,
    unit: "Kg",
    status: "Critical",
  },
  {
    id: 5,
    name: "Sugar",
    current: 120,
    minimum: 200,
    unit: "Kg",
    status: "Low",
  },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start animate-fadeInDown">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-slideInUp" style={{animationDelay: '0ms'}}>
            <StatsCard
              title="Total Items in Stock"
              value={2847}
              icon={Package}
              color="blue"
              suffix="units"
              trend={{ value: 12, isPositive: true }}
            />
          </div>
          <div className="animate-slideInUp" style={{animationDelay: '100ms'}}>
            <StatsCard
              title="Today's Purchase"
              value={45}
              icon={TrendingUp}
              color="green"
              suffix="items"
              trend={{ value: 8, isPositive: true }}
            />
          </div>
          <div className="animate-slideInUp" style={{animationDelay: '200ms'}}>
            <StatsCard
              title="Today's Distribution"
              value={128}
              icon={TrendingDown}
              color="orange"
              suffix="items"
              trend={{ value: 3, isPositive: false }}
            />
          </div>
          <div className="animate-slideInUp" style={{animationDelay: '300ms'}}>
            <StatsCard
              title="Low Stock Alerts"
              value={12}
              icon={AlertTriangle}
              color="red"
              suffix="items"
              trend={{ value: 5, isPositive: false }}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fadeInUp" style={{animationDelay: '400ms'}}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white shadow-lg p-6 hover:shadow-xl transition-all">
              <ChartComponent
                title="Monthly Purchase vs Distribution"
                data={monthlyData}
                type="line"
                dataKeys={[
                  { key: "purchase", color: "#3b82f6", label: "Purchase" },
                  { key: "distribution", color: "#10b981", label: "Distribution" },
                ]}
              />
            </div>
          </div>
          <div className="animate-fadeInUp" style={{animationDelay: '500ms'}}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white shadow-lg p-6 hover:shadow-xl transition-all">
              <ChartComponent
                title="Stock Movement Trend"
                data={monthlyData}
                type="bar"
                dataKeys={[
                  { key: "purchase", color: "#3b82f6", label: "Purchase" },
                  { key: "distribution", color: "#10b981", label: "Distribution" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Low Stock Alert Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-fadeInUp" style={{animationDelay: '600ms'}}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Low Stock Items
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Items that need immediate attention
              </p>
            </div>
            <Link to="/inventory">
              <Button variant="outline" size="sm" className="gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-semibold rounded-lg">
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      value === "Critical"
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {value}
                  </span>
                ),
              },
            ]}
            data={lowStockItems}
            pageSize={5}
            searchableFields={["name"]}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/items">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer animate-slideInUp" style={{animationDelay: '700ms'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Manage Items
              </h3>
              <p className="text-sm text-gray-600">
                Add, edit, or delete stock items
              </p>
            </div>
          </Link>

          <Link to="/purchase">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer animate-slideInUp" style={{animationDelay: '800ms'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Create Purchase
              </h3>
              <p className="text-sm text-gray-600">
                Add new purchase orders
              </p>
            </div>
          </Link>

          <Link to="/reports">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer animate-slideInUp" style={{animationDelay: '900ms'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                View Reports
              </h3>
              <p className="text-sm text-gray-600">
                Analytics and detailed reports
              </p>
            </div>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
