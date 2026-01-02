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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your inventory overview.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/purchase">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Purchase
              </Button>
            </Link>
            <Link to="/distribution">
              <Button className="gap-2">
                <TrendingDown className="w-4 h-4" />
                Issue Stock
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Items in Stock"
            value={2847}
            icon={Package}
            color="blue"
            suffix="units"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Today's Purchase"
            value={45}
            icon={TrendingUp}
            color="green"
            suffix="items"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Today's Distribution"
            value={128}
            icon={TrendingDown}
            color="orange"
            suffix="items"
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard
            title="Low Stock Alerts"
            value={12}
            icon={AlertTriangle}
            color="red"
            suffix="items"
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartComponent
            title="Monthly Purchase vs Distribution"
            data={monthlyData}
            type="line"
            dataKeys={[
              { key: "purchase", color: "#3b82f6", label: "Purchase" },
              { key: "distribution", color: "#10b981", label: "Distribution" },
            ]}
          />
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

        {/* Low Stock Alert Table */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Low Stock Items
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Items that need immediate attention
              </p>
            </div>
            <Link to="/inventory">
              <Button variant="outline" size="sm" className="gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/items">
            <div className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer">
              <Package className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                Manage Items
              </h3>
              <p className="text-sm text-muted-foreground">
                Add, edit, or delete stock items
              </p>
            </div>
          </Link>

          <Link to="/purchase">
            <div className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer">
              <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                Create Purchase
              </h3>
              <p className="text-sm text-muted-foreground">
                Add new purchase orders
              </p>
            </div>
          </Link>

          <Link to="/reports">
            <div className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer">
              <TrendingDown className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                View Reports
              </h3>
              <p className="text-sm text-muted-foreground">
                Analytics and detailed reports
              </p>
            </div>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
