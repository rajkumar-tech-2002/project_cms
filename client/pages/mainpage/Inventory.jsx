import { useState } from "react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils.js";

const mockInventory = [
	{
		id: 1,
		name: "Rice (Basmati)",
		currentStock: 50,
		minimumLevel: 200,
		unit: "Kg",
		status: "Critical",
		lastUpdated: "2024-01-22",
	},
	{
		id: 2,
		name: "Cooking Oil",
		currentStock: 15,
		minimumLevel: 50,
		unit: "Litre",
		status: "Critical",
		lastUpdated: "2024-01-22",
	},
	{
		id: 3,
		name: "Wheat Flour",
		currentStock: 75,
		minimumLevel: 150,
		unit: "Kg",
		status: "Low",
		lastUpdated: "2024-01-21",
	},
	{
		id: 4,
		name: "Dal (Masoor)",
		currentStock: 120,
		minimumLevel: 100,
		unit: "Kg",
		status: "Normal",
		lastUpdated: "2024-01-20",
	},
	{
		id: 5,
		name: "Sugar",
		currentStock: 180,
		minimumLevel: 200,
		unit: "Kg",
		status: "Low",
		lastUpdated: "2024-01-22",
	},
	{
		id: 6,
		name: "Salt",
		currentStock: 5,
		minimumLevel: 20,
		unit: "Kg",
		status: "Critical",
		lastUpdated: "2024-01-22",
	},
	{
		id: 7,
		name: "Spice Mix",
		currentStock: 45,
		minimumLevel: 50,
		unit: "Kg",
		status: "Low",
		lastUpdated: "2024-01-21",
	},
	{
		id: 8,
		name: "Milk Powder",
		currentStock: 95,
		minimumLevel: 75,
		unit: "Kg",
		status: "Normal",
		lastUpdated: "2024-01-20",
	},
	{
		id: 9,
		name: "Ghee",
		currentStock: 25,
		minimumLevel: 20,
		unit: "Kg",
		status: "Normal",
		lastUpdated: "2024-01-19",
	},
	{
		id: 10,
		name: "Honey",
		currentStock: 30,
		minimumLevel: 40,
		unit: "Kg",
		status: "Low",
		lastUpdated: "2024-01-21",
	},
];

const getStatusBadgeColor = (status) => {
	switch (status) {
		case "Normal":
			return "bg-green-100 text-green-800";
		case "Low":
			return "bg-orange-100 text-orange-800";
		case "Critical":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export default function Inventory() {
	const [inventory] = useState(mockInventory);
	const [filterStatus, setFilterStatus] = useState("All");

	const filteredInventory =
		filterStatus === "All" ? inventory : inventory.filter((item) => item.status === filterStatus);

	const stats = {
		total: inventory.length,
		critical: inventory.filter((i) => i.status === "Critical").length,
		low: inventory.filter((i) => i.status === "Low").length,
		normal: inventory.filter((i) => i.status === "Normal").length,
	};

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-start animate-fadeInDown">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Central Inventory
						</h1>
						<p className="text-gray-600 mt-2 text-lg">Real-time stock view of all items</p>
					</div>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<button
							onClick={() => setFilterStatus("All")}
							className={cn(
								"p-4 rounded-lg border-2 text-left transition-all",
								filterStatus === "All"
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary"
							)}
						>
							<p className="text-xs text-muted-foreground">Total Items</p>
							<p className="text-2xl font-bold text-foreground">{stats.total}</p>
						</button>
						<button
							onClick={() => setFilterStatus("Normal")}
							className={cn(
								"p-4 rounded-lg border-2 text-left transition-all",
								filterStatus === "Normal"
									? "border-green-500 bg-green-50"
									: "border-border hover:border-green-500"
							)}
						>
							<p className="text-xs text-muted-foreground">Normal Stock</p>
							<p className="text-2xl font-bold text-green-600">{stats.normal}</p>
						</button>
						<button
							onClick={() => setFilterStatus("Low")}
							className={cn(
								"p-4 rounded-lg border-2 text-left transition-all",
								filterStatus === "Low"
									? "border-orange-500 bg-orange-50"
									: "border-border hover:border-orange-500"
							)}
						>
							<p className="text-xs text-muted-foreground">Low Stock</p>
							<p className="text-2xl font-bold text-orange-600">{stats.low}</p>
						</button>
						<button
							onClick={() => setFilterStatus("Critical")}
							className={cn(
								"p-4 rounded-lg border-2 text-left transition-all",
								filterStatus === "Critical"
									? "border-red-500 bg-red-50"
									: "border-border hover:border-red-500"
							)}
						>
							<p className="text-xs text-muted-foreground">Critical Stock</p>
							<p className="text-2xl font-bold text-red-600">{stats.critical}</p>
						</button>
					</div>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
					<DataTable
						columns={[
							{ key: "name", label: "Item Name" },
							{
								key: "currentStock",
								label: "Current Stock",
								render: (value, row) => `${value} ${row.unit}`,
							},
							{
								key: "minimumLevel",
								label: "Minimum Level",
								render: (value, row) => `${value} ${row.unit}`,
							},
							{
								key: "status",
								label: "Stock Status",
								render: (value) => (
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
											value
										)}`}
									>
										{value}
									</span>
								),
							},
							{
								key: "lastUpdated",
								label: "Last Updated",
							},
						]}
						data={filteredInventory}
						searchableFields={["name"]}
						pageSize={10}
						title={`Stock Items (${filteredInventory.length})`}
					/>
				</div>

				{(stats.critical > 0 || stats.low > 0) && (
					<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3 animate-slideInUp">
						<AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
						<div>
							<h3 className="font-semibold text-orange-900">Low Stock Alert</h3>
							<p className="text-sm text-orange-700 mt-1">
								{stats.critical} items at critical levels and {stats.low} items at low stock.
								Consider creating purchase orders to replenish inventory.
							</p>
						</div>
					</div>
				)}
			</div>
		</MainLayout>
	);
}
