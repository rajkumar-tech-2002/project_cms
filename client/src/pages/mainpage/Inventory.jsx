import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import { AlertTriangle, Boxes } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { toast } from "sonner";




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
	const [inventory, setInventory] = useState([]);
	const [filterStatus, setFilterStatus] = useState("All");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchInventory();
	}, []);

	const fetchInventory = async () => {
		try {
			const response = await fetch('/api/inventory');
			if (response.ok) {
				const data = await response.json();
				setInventory(data);
			} else {
				toast.error("Failed to fetch inventory data");
			}
		} catch (error) {
			console.error("Error fetching inventory:", error);
			toast.error("An error occurred while fetching inventory");
		} finally {
			setLoading(false);
		}
	};


	const filteredInventory =
		filterStatus === "All" ? inventory : inventory.filter((item) => item.status === filterStatus);

	const stats = {
		total: inventory.length,
		critical: inventory.filter((i) => i.status === "Critical").length,
		low: inventory.filter((i) => i.status === "Low").length,
		normal: inventory.filter((i) => i.status === "Normal").length,
	};

	if (loading) {
		return (
			<MainLayout>
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-xl font-semibold text-blue-900 animate-pulse">Loading Inventory...</div>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-start animate-fadeInDown">
					<div>
						<h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
							<Boxes className="w-6 h-6 text-blue-900" />
							Central Inventory
						</h1>
						<p className="text-blue-700 mt-2 text-md">Real-time stock view of all items</p>
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
								key: "openingStock",
								label: "Opening Stock",
								render: (value, row) => `${value || 0} ${row.unit}`,
							},
							{
								key: "freshStock",
								label: "Fresh Stock",
								render: (value, row) => `${value || 0} ${row.unit}`,
							},
							{
								key: "totalStock",
								label: "Total Stock",
								render: (value, row) => (
									<span className="font-semibold text-blue-900">
										{value || 0} {row.unit}
									</span>
								),
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
