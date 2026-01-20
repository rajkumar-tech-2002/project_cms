import { useState } from "react";
import { Trash2, Plus, Eye, X } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";

const mockPurchases = [
	{
		id: 1,
		orderNo: "PO-2024-001",
		vendor: "Fresh Foods Co.",
		date: "2024-01-15",
		items: [
			{ itemId: "1", itemName: "Rice (Basmati)", quantity: 100, rate: 45, amount: 4500 },
			{ itemId: "2", itemName: "Cooking Oil", quantity: 50, rate: 200, amount: 10000 },
		],
		totalAmount: 14500,
		status: "Received",
	},
	{
		id: 2,
		orderNo: "PO-2024-002",
		vendor: "Quality Grains Ltd",
		date: "2024-01-20",
		items: [
			{ itemId: "3", itemName: "Wheat Flour", quantity: 75, rate: 35, amount: 2625 },
		],
		totalAmount: 2625,
		status: "Pending",
	},
];

const mockVendors = [
	{ value: "1", label: "Fresh Foods Co." },
	{ value: "2", label: "Organic Supplies" },
	{ value: "3", label: "Quality Grains Ltd" },
];

const mockItems = [
	{ value: "1", label: "Rice (Basmati)" },
	{ value: "2", label: "Cooking Oil" },
	{ value: "3", label: "Wheat Flour" },
	{ value: "4", label: "Dal (Masoor)" },
];

export default function Purchase() {
	const [purchases, setPurchases] = useState(mockPurchases);
	const [isCreating, setIsCreating] = useState(false);
	const [isDetailView, setIsDetailView] = useState(false);
	const [selectedPurchase, setSelectedPurchase] = useState(null);
	const [formData, setFormData] = useState({
		vendor: "",
		items: [{ itemId: "", itemName: "", quantity: 0, rate: 0, amount: 0 }],
	});
	const [errors, setErrors] = useState({});

	const startCreate = () => {
		setFormData({
			vendor: "",
			items: [{ itemId: "", itemName: "", quantity: 0, rate: 0, amount: 0 }],
		});
		setErrors({});
		setIsDetailView(false);
		setIsCreating(true);
	};

	const cancelCreate = () => {
		setIsCreating(false);
		setErrors({});
	};

	const handleAddItem = () => {
		setFormData({
			...formData,
			items: [
				...formData.items,
				{ itemId: "", itemName: "", quantity: 0, rate: 0, amount: 0 },
			],
		});
	};

	const handleRemoveItem = (index) => {
		setFormData({
			...formData,
			items: formData.items.filter((_, i) => i !== index),
		});
	};

	const handleItemChange = (index, field, value) => {
		const newItems = [...formData.items];
		newItems[index] = { ...newItems[index], [field]: value };

		if (field === "itemId") {
			const selected = mockItems.find((m) => m.value === value);
			newItems[index].itemName = selected?.label || "";
		}

		if (field === "quantity" || field === "rate") {
			newItems[index].amount = newItems[index].quantity * newItems[index].rate;
		}

		setFormData({ ...formData, items: newItems });
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.vendor) newErrors.vendor = "Vendor is required";
		if (formData.items.length === 0) newErrors.items = "At least one item is required";
		formData.items.forEach((item, idx) => {
			if (!item.itemId) newErrors[`item_${idx}`] = "Item is required";
			if (item.quantity <= 0) newErrors[`qty_${idx}`] = "Quantity must be > 0";
			if (item.rate <= 0) newErrors[`rate_${idx}`] = "Rate must be > 0";
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0);
		const newPurchase = {
			id: Math.max(...purchases.map((p) => p.id), 0) + 1,
			orderNo: `PO-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, "0")}`,
			vendor: mockVendors.find((v) => v.value === formData.vendor)?.label || "",
			date: new Date().toISOString().split("T")[0],
			items: formData.items,
			totalAmount,
			status: "Pending",
		};

		setPurchases([...purchases, newPurchase]);
		setIsCreating(false);
	};

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-start animate-fadeInDown">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Purchase Orders
						</h1>
						<p className="text-gray-600 mt-2 text-lg">Create and manage bulk purchase orders</p>
					</div>
					<Button
						onClick={startCreate}
						className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
					>
						<Plus className="w-4 h-4" />
						Create Purchase Order
					</Button>
				</div>

				{isCreating && (
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-foreground">Create Purchase Order</h2>
							<button
								onClick={cancelCreate}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
								aria-label="Close create form"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<FormSelect
								label="Vendor"
								value={formData.vendor}
								onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
								error={errors.vendor}
								options={mockVendors}
							/>

							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<label className="block text-sm font-medium text-foreground">Items</label>
									<button
										type="button"
										onClick={handleAddItem}
										className="text-sm text-primary hover:underline"
									>
										+ Add Item
									</button>
								</div>

								{formData.items.map((item, idx) => (
									<div key={idx} className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
										<FormSelect
											label="Item"
											value={item.itemId}
											onChange={(e) => handleItemChange(idx, "itemId", e.target.value)}
											error={errors[`item_${idx}`]}
											options={mockItems}
										/>

										<div className="grid grid-cols-2 gap-2">
											<FormInput
												label="Quantity"
												type="number"
												min="1"
												value={item.quantity}
												onChange={(e) =>
													handleItemChange(idx, "quantity", parseInt(e.target.value) || 0)
												}
												error={errors[`qty_${idx}`]}
											/>
											<FormInput
												label="Rate (₹)"
												type="number"
												min="0"
												step="0.01"
												value={item.rate}
												onChange={(e) =>
													handleItemChange(idx, "rate", parseFloat(e.target.value) || 0)
												}
												error={errors[`rate_${idx}`]}
											/>
										</div>

										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">
												Amount: ₹{item.amount.toLocaleString()}
											</span>
											{formData.items.length > 1 && (
												<button
													type="button"
													onClick={() => handleRemoveItem(idx)}
													className="text-red-600 hover:text-red-700"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											)}
										</div>
									</div>
								))}

								{errors.items && <p className="text-xs text-destructive">{errors.items}</p>}
							</div>

							<div className="bg-blue-50 p-3 rounded border border-blue-200 flex items-center justify-between">
								<p className="text-sm text-foreground">
									<span className="font-semibold">Total Amount: </span>
									₹{formData.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
								</p>
							</div>

							<div className="flex justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={cancelCreate}
									className="bg-white"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
								>
									Create Order
								</Button>
							</div>
						</form>
					</div>
				)}

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
					<DataTable
						columns={[
							{ key: "orderNo", label: "Order No." },
							{ key: "vendor", label: "Vendor" },
							{ key: "date", label: "Date" },
							{
								key: "totalAmount",
								label: "Total Amount",
								render: (value) => `₹${value.toLocaleString()}`,
							},
							{
								key: "status",
								label: "Status",
								render: (value) => (
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											value === "Received"
												? "bg-green-100 text-green-800"
												: value === "Pending"
												? "bg-yellow-100 text-yellow-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{value}
									</span>
								),
							},
							{
								key: "id",
								label: "Actions",
								render: (_, row) => (
									<button
										onClick={() => {
											setSelectedPurchase(row);
											setIsDetailView(true);
										}}
										className="p-2 hover:bg-blue-50 rounded text-blue-600"
									>
										<Eye className="w-4 h-4" />
									</button>
								),
							},
						]}
						data={purchases}
						searchableFields={["orderNo", "vendor"]}
						title="Purchase Orders"
					/>
				</div>
			</div>

			{isDetailView && selectedPurchase && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between p-6 border-b border-border">
							<h2 className="text-lg font-semibold text-foreground">
								{selectedPurchase.orderNo}
							</h2>
							<button
								onClick={() => {
									setIsDetailView(false);
								}}
								className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
							>
								✕
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div>
								<p className="text-xs text-muted-foreground">Vendor</p>
								<p className="font-semibold text-foreground">{selectedPurchase.vendor}</p>
							</div>

							<div>
								<p className="text-xs text-muted-foreground">Date</p>
								<p className="font-semibold text-foreground">{selectedPurchase.date}</p>
							</div>

							<div>
								<p className="text-xs text-muted-foreground mb-2">Items</p>
								<div className="space-y-2">
									{selectedPurchase.items.map((item, idx) => (
										<div key={idx} className="text-sm p-2 bg-gray-50 rounded">
											<p className="font-medium text-foreground">{item.itemName}</p>
											<p className="text-muted-foreground">
												{item.quantity} × ₹{item.rate} = ₹{item.amount}
											</p>
										</div>
									))}
								</div>
							</div>

							<div className="border-t border-border pt-4">
								<p className="text-sm text-muted-foreground">Total Amount</p>
								<p className="text-2xl font-bold text-primary">
									₹{selectedPurchase.totalAmount.toLocaleString()}
								</p>
							</div>

							<Button
								variant="outline"
								onClick={() => {
									setIsDetailView(false);
								}}
								className="w-full"
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			)}
		</MainLayout>
	);
}
