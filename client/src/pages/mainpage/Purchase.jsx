
import { useState, useEffect } from "react";
import { Trash2, Plus, Eye, IndianRupee, X, Printer, CheckCircle2, ShoppingCart, Pencil } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";

const unitOptions = [
	{ value: "Kg", label: "Kilogram (Kg)" },
	{ value: "Litre", label: "Litre (L)" },
	{ value: "Piece", label: "Piece" },
];

export default function PurchaseOrders() {
	const [purchases, setPurchases] = useState([]);
	const [vendors, setVendors] = useState([]);
	const [activeView, setActiveView] = useState("list"); // list, form, detail, billing, history, bill-details
	const [isPrintView, setIsPrintView] = useState(false);
	const [selectedPurchase, setSelectedPurchase] = useState(null);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		vendor: "",
		vendorPhone: "",
		items: [{ itemName: "", unit: "", quantity: 0 }],
	});
	const [editingId, setEditingId] = useState(null);
	const [errors, setErrors] = useState({});
	const [billingPurchase, setBillingPurchase] = useState(null);
	const [billingData, setBillingData] = useState({
		bill_no: "",
		bill_date: new Date().toISOString().split("T")[0],
		items: [],
		total_amount: 0
	});
	const [groceries, setGroceries] = useState([]);
	const [purchaseBills, setPurchaseBills] = useState([]);
	const [selectedBill, setSelectedBill] = useState(null);


	// Table cell styles for print view
	const th = {
		border: "1px solid #000",
		padding: "6px",
		fontWeight: "bold"
	};

	const td = {
		border: "1px solid #000",
		padding: "6px"
	};

	// Fetch initial data
	useEffect(() => {
		fetchPurchases();
		fetchVendors();
		fetchGroceries();
	}, []);

	const fetchPurchases = async () => {
		try {
			const response = await fetch(`/api/purchases`);
			if (response.ok) {
				const data = await response.json();
				setPurchases(data);
			}
		} catch (error) {
			console.error('Error fetching purchases:', error);
			toast.error('Failed to load purchases');
		}
	};

	const fetchVendors = async () => {
		try {
			const response = await fetch(`/api/vendors/dropdown`);
			if (response.ok) {
				const data = await response.json();
				setVendors(data);
			}
		} catch (error) {
			console.error('Error fetching vendors:', error);
			toast.error('Failed to load vendors');
		}
	};

	const fetchGroceries = async () => {
		try {
			const response = await fetch(`/api/groceries/dropdown`);
			if (response.ok) {
				const data = await response.json();
				setGroceries(data);
			}
		} catch (error) {
			console.error('Error fetching groceries:', error);
			toast.error('Failed to load groceries');
		}
	};

	const startCreate = () => {
		setFormData({
			vendor: "",
			vendorPhone: "",
			items: [{ itemName: "", unit: "", quantity: 0 }],
		});
		setEditingId(null);
		setErrors({});
		setActiveView("form");
	};

	const startEdit = (purchase) => {
		const parsedItems = purchase.grocery_name_unit ? purchase.grocery_name_unit.split('; ').map((item) => {
			const match = item.match(/^(.+?)\s*\((.+?)\)\s*-\s*Qty:\s*(\d+)$/);
			if (!match) return null;
			const name = match[1];
			const unit = match[2];
			const grocery = groceries.find(g => g.label === name && g.unit === unit);
			return {
				itemName: name,
				unit: unit,
				groceryId: grocery?.value,
				quantity: parseInt(match[3], 10),
			};
		}).filter(Boolean) : [];

		const vendorObj = vendors.find(v => v.label === purchase.vendor_name);

		setFormData({
			vendor: vendorObj?.value || "",
			vendorPhone: purchase.vendor_phone,
			items: parsedItems.length > 0 ? parsedItems : [{ itemName: "", unit: "", quantity: 0 }],
			orderNo: purchase.order_no,
			status: purchase.status
		});
		setEditingId(purchase.id);
		setErrors({});
		setActiveView("form");
	};

	const handleDelete = (id) => {
		toast("Are you sure you want to delete this purchase order?", {
			action: {
				label: "Delete",
				onClick: async () => {
					try {
						const response = await fetch(`/api/purchases/${id}`, {
							method: 'DELETE',
						});

						if (response.ok) {
							toast("Purchase order deleted successfully", {
								className: "border-red-600 bg-red-50 text-red-700",
								icon: <CheckCircle2 className="w-5 h-5 text-red-600" />,
							});
							await fetchPurchases();
						} else {
							const error = await response.json();
							toast.error(error.error || 'Failed to delete purchase order');
						}
					} catch (error) {
						console.error('Error deleting purchase:', error);
						toast.error('Failed to delete purchase order');
					}
				}
			},
			cancel: {
				label: "Cancel"
			}
		});
	};

	const handlePrint = (purchase) => {
		setSelectedPurchase(purchase);
		setIsPrintView(true);

		// Pre-load the logo image to ensure it's loaded before printing
		const img = new Image();
		img.src = "/api/purchases/logo";

		const triggerPrint = () => {
			// Wait a bit for React to render the print container
			setTimeout(() => {
				window.print();
				// Turn off print view after a delay
				setTimeout(() => setIsPrintView(false), 500);
			}, 300);
		};

		if (img.complete) {
			triggerPrint();
		} else {
			img.onload = triggerPrint;
			img.onerror = triggerPrint; // Fallback: still attempt to print if logo fails
		}
	};

	const cancelCreate = () => {
		setActiveView("list");
		setErrors({});
	};

	const handleAddItem = () => {
		setFormData({
			...formData,
			items: [
				...formData.items,
				{ itemName: "", unit: "", quantity: 0 },
			],
		});
	};

	const handleRemoveItem = (index) => {
		setFormData({
			...formData,
			items: formData.items.filter((_, i) => i !== index),
		});
	};

	const handleVendorChange = (value) => {
		const selectedVendor = vendors.find((v) => v.value === value);
		setFormData({
			...formData,
			vendor: value,
			vendorPhone: selectedVendor?.phone || "",
		});
	};

	const handleItemChange = (index, field, value) => {
		const newItems = [...formData.items];

		if (field === "itemName") {
			const selectedGrocery = groceries.find(g => g.value === value);
			newItems[index] = {
				...newItems[index],
				itemName: selectedGrocery?.label || "",
				unit: selectedGrocery?.unit || newItems[index].unit,
				groceryId: value
			};
		} else {
			newItems[index] = { ...newItems[index], [field]: value };
		}

		setFormData({ ...formData, items: newItems });
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.vendor) newErrors.vendor = "Vendor is required";
		if (formData.items.length === 0) newErrors.items = "At least one item is required";
		formData.items.forEach((item, idx) => {
			if (!item.itemName) newErrors[`item_${idx}`] = "Item name is required";
			if (!item.unit) newErrors[`unit_${idx}`] = "Unit is required";
			if (item.quantity <= 0) newErrors[`qty_${idx}`] = "Quantity must be > 0";
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);

		const selectedVendor = vendors.find((v) => v.value === formData.vendor);

		let orderNo = formData.orderNo;
		if (!editingId) {
			orderNo = `PO-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, "0")}`;
		}

		// Format items as string for database storage
		const itemsString = formData.items
			.map((item) => `${item.itemName} (${item.unit}) - Qty: ${item.quantity}`)
			.join("; ");

		const purchaseData = {
			order_no: orderNo,
			vendor_name: selectedVendor?.label || "",
			vendor_phone: formData.vendorPhone || "",
			purchase_date: new Date().toISOString().split("T")[0],
			grocery_name_unit: itemsString,
			status: formData.status || "Pending",
		};

		const url = editingId ? `/api/purchases/${editingId}` : `/api/purchases`;
		const method = editingId ? 'PUT' : 'POST';

		try {
			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(purchaseData),
			});

			if (response.ok) {
				toast.success(`Purchase order ${editingId ? 'updated' : 'created'} successfully`);
				await fetchPurchases();
				setActiveView("list");
			} else {
				const error = await response.json();
				toast.error(error.error || `Failed to ${editingId ? 'update' : 'create'} purchase order`);
			}
		} catch (error) {
			console.error(`Error ${editingId ? 'updating' : 'creating'} purchase:`, error);
			toast.error(`Failed to ${editingId ? 'update' : 'create'} purchase order`);
		} finally {
			setLoading(false);
		}
	};

	const openBillingModal = (purchase) => {
		setBillingPurchase(purchase);

		// Initialize billing items from PO if possible
		let initialItems = [];
		if (purchase.grocery_name_unit) {
			initialItems = purchase.grocery_name_unit.split('; ').map((item, idx) => {
				const match = item.match(/^(.+?)\s*\((.+?)\)\s*-\s*Qty:\s*(\d+)$/);
				if (!match) return null;
				const name = match[1];
				const unit = match[2];
				const grocery = groceries.find(g => g.label === name && g.unit === unit);
				return {
					id: `bill-item-${idx}`,
					grocery_id: grocery?.value || "",
					name: name,
					unit: unit,
					quantity: parseInt(match[3], 10),
					price_per_unit: 0,
					total: 0
				};
			}).filter(Boolean);
		}

		setBillingData({
			bill_no: "",
			bill_date: new Date().toISOString().split("T")[0],
			items: initialItems,
			total_amount: 0
		});
		setActiveView("billing");
	};

	const handleBillingItemChange = (index, field, value) => {
		const newItems = [...billingData.items];
		if (field === "grocery_id") {
			const grocery = groceries.find(g => g.value === value);
			newItems[index] = {
				...newItems[index],
				grocery_id: value,
				name: grocery?.label || "",
				unit: grocery?.unit || ""
			};
		} else {
			newItems[index] = { ...newItems[index], [field]: value };
		}

		// Recalculate totals
		const quantity = parseFloat(newItems[index].quantity) || 0;
		const price = parseFloat(newItems[index].price_per_unit) || 0;
		newItems[index].total = quantity * price;

		const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

		setBillingData({ ...billingData, items: newItems, total_amount: totalAmount });
	};

	const addBillingItem = () => {
		setBillingData({
			...billingData,
			items: [...billingData.items, {
				id: `bill-item-${Date.now()}`,
				grocery_id: "",
				name: "",
				unit: "Kg",
				quantity: 0,
				price_per_unit: 0,
				total: 0
			}]
		});
	};

	const removeBillingItem = (index) => {
		const newItems = billingData.items.filter((_, i) => i !== index);
		const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
		setBillingData({ ...billingData, items: newItems, total_amount: totalAmount });
	};

	const submitBill = async () => {
		if (!billingData.bill_no || !billingData.bill_date || billingData.items.length === 0) {
			toast.error("Please fill all required fields");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/purchases/bills', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					purchase_id: billingPurchase.id,
					...billingData
				})
			});

			if (response.ok) {
				toast.success("Bill generated successfully and stock updated");
				setActiveView("list");
				fetchPurchases();
			} else {
				const err = await response.json();
				toast.error(err.error || "Failed to generate bill");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const viewBills = async (purchase) => {
		setSelectedPurchase(purchase);
		try {
			const response = await fetch(`/api/purchases/${purchase.id}/bills`);
			if (response.ok) {
				const data = await response.json();
				setPurchaseBills(data);
				setActiveView("history");
			}
		} catch (error) {
			toast.error("Failed to load bills");
		}
	};

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-start animate-fadeInDown">
					<div>
						<h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
							<ShoppingCart className="w-6 h-6 text-blue-900" />
							Purchase Orders
						</h1>
						<p className="text-blue-700 mt-2 text-md">Create and manage bulk purchase orders</p>
					</div>
					{activeView === "list" && (
						<Button
							onClick={startCreate}
							className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
						>
							<Plus className="w-4 h-4" />
							Create Purchase Order
						</Button>
					)}
					{activeView !== "list" && (
						<Button
							variant="outline"
							onClick={() => setActiveView("list")}
							className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
						>
							Back to List
						</Button>
					)}
				</div>

				{activeView === "form" && (
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-foreground">
								{editingId ? 'Edit Purchase Order' : 'Create Purchase Order'}
							</h2>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<FormSelect
								label="Vendor"
								value={formData.vendor}
								onChange={(e) => handleVendorChange(e.target.value)}
								error={errors.vendor}
								options={vendors}
							/>

							{formData.vendorPhone && (
								<div className="text-sm text-gray-600">
									<span className="font-medium">Vendor Phone:</span> {formData.vendorPhone}
								</div>
							)}

							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<label className="block text-sm font-medium text-foreground">Items</label>
								</div>

								{formData.items.map((item, idx) => (
									<div key={idx} className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
										<FormSelect
											label="Item Name"
											value={item.groceryId || ""}
											onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
											error={errors[`item_${idx}`]}
											options={groceries}
										/>

										<FormSelect
											label="Unit"
											value={item.unit}
											onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
											error={errors[`unit_${idx}`]}
											options={unitOptions}
											disabled={!!item.groceryId}
										/>

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

										<div className="flex justify-end items-center">
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

								<button
									type="button"
									onClick={handleAddItem}
									className="text-sm text-primary hover:underline flex items-center gap-1"
								>
									<Plus className="w-4 h-4" /> Add Item
								</button>

								{errors.items && <p className="text-xs text-destructive">{errors.items}</p>}
							</div>

							<div className="flex justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => setActiveView("list")}
									className="bg-white"
									disabled={loading}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
									disabled={loading}
								>
									{loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Order' : 'Create Order')}
								</Button>
							</div>
						</form>
					</div>
				)}

				{activeView === "list" && (
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
						<DataTable
							columns={[
								{ key: "order_no", label: "Order No." },
								{ key: "vendor_name", label: "Vendor" },
								{
									key: "purchase_date",
									label: "Date",
									render: (value) => {
										if (!value) return '';
										const date = new Date(value);
										const day = String(date.getDate()).padStart(2, '0');
										const month = String(date.getMonth() + 1).padStart(2, '0');
										const year = date.getFullYear();
										return `${day}-${month}-${year}`;
									}
								},
								{
									key: "status",
									label: "Status",
									render: (value) => (
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === "Received"
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
										<div className="flex gap-2">
											<button
												onClick={() => {
													setSelectedPurchase(row);
													setActiveView("detail");
												}}
												className="p-2 hover:bg-blue-50 rounded text-blue-600"
												title="View Details"
											>
												<Eye className="w-4 h-4" />
											</button>
											<button
												onClick={() => handlePrint(row)}
												className="p-2 hover:bg-green-50 rounded text-green-600"
												title="Print"
											>
												<Printer className="w-4 h-4" />
											</button>
											{row.status === "Pending" && (
												<>
													<button
														onClick={() => startEdit(row)}
														className="p-2 hover:bg-yellow-50 rounded text-yellow-600"
														title="Edit"
													>
														<Pencil className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDelete(row.id)}
														className="p-2 hover:bg-red-50 rounded text-red-600"
														title="Delete"
													>
														<Trash2 className="w-4 h-4" />
													</button>
													<button
														onClick={() => openBillingModal(row)}
														className="p-2 hover:bg-indigo-50 rounded text-indigo-600"
														title="Generate Bill"
													>
														<CheckCircle2 className="w-4 h-4" />
													</button>
												</>
											)}
											{(row.status === "Received") && (
												<button
													onClick={() => viewBills(row)}
													className="p-2 hover:bg-slate-50 rounded text-slate-600"
													title="View Bills"
												>
													<IndianRupee className="w-4 h-4" />
												</button>
											)}
										</div>
									),
								},
							]}
							data={purchases}
							searchableFields={["order_no", "vendor_name"]}
							title="Purchase Orders"
						/>
					</div>
				)}

				{activeView === "detail" && selectedPurchase && (
					<div className="bg-white rounded-2xl border-2 border-white p-8 shadow-lg animate-slideInUp">
						<div className="flex items-center justify-between mb-8 border-b pb-4">
							<h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
								<Eye className="w-6 h-6" /> Order Details: {selectedPurchase.order_no}
							</h2>
							<div className="flex gap-2">
								<Button variant="outline" onClick={() => handlePrint(selectedPurchase)}>
									<Printer className="w-4 h-4 mr-2" /> Print PO
								</Button>
								<Button variant="outline" onClick={() => setActiveView("list")}>Back to List</Button>
							</div>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							<div className="space-y-6">
								<div>
									<p className="text-xs text-muted-foreground uppercase font-semibold">Vendor Information</p>
									<p className="text-lg font-bold text-gray-900 mt-1">{selectedPurchase.vendor_name}</p>
									{selectedPurchase.vendor_phone && (
										<p className="text-blue-600 font-medium underline underline-offset-4 decoration-blue-200">{selectedPurchase.vendor_phone}</p>
									)}
								</div>

								<div>
									<p className="text-xs text-muted-foreground uppercase font-semibold">Order Metada</p>
									<div className="mt-2 space-y-2">
										<p className="flex justify-between text-sm py-1 border-b">
											<span className="text-gray-500">Date:</span>
											<span className="font-semibold">{selectedPurchase.purchase_date && new Date(selectedPurchase.purchase_date).toLocaleDateString()}</span>
										</p>
										<p className="flex justify-between text-sm py-1 border-b">
											<span className="text-gray-500">Status:</span>
											<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
												{selectedPurchase.status}
											</span>
										</p>
									</div>
								</div>
							</div>

							<div className="md:col-span-2">
								<p className="text-xs text-muted-foreground uppercase font-semibold mb-4">Ordered Items</p>
								<div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
									{selectedPurchase.grocery_name_unit}
								</div>
							</div>
						</div>
					</div>
				)}

				{activeView === "billing" && billingPurchase && (
					<div className="bg-white rounded-2xl border-2 border-white shadow-xl overflow-hidden animate-slideInUp">
						<div className="flex items-center justify-between p-8 border-b bg-gray-50/50">
							<div>
								<h2 className="text-2xl font-bold text-blue-900">Generate Purchase Bill</h2>
								<p className="text-blue-600 mt-1 font-medium">Order: {billingPurchase.order_no} • {billingPurchase.vendor_name}</p>
							</div>
							<Button variant="outline" onClick={() => setActiveView("list")}>Back to List</Button>
						</div>

						<div className="p-8 space-y-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormInput
									label="Bill Number"
									placeholder="Enter Invoice/Bill No."
									value={billingData.bill_no}
									onChange={(e) => setBillingData({ ...billingData, bill_no: e.target.value })}
									required
								/>
								<FormInput
									label="Bill Date"
									type="date"
									value={billingData.bill_date}
									onChange={(e) => setBillingData({ ...billingData, bill_date: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider">Bill Items</h3>
									<Button type="button" variant="outline" size="sm" onClick={addBillingItem} className="gap-1 h-9 text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold px-4">
										<Plus className="w-4 h-4" /> Add Item
									</Button>
								</div>

								<div className="border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
									<table className="w-full text-sm">
										<thead className="bg-gray-50/80 border-b">
											<tr>
												<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter">Item Name</th>
												<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter w-28">Qty</th>
												<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter w-40">Unit Price</th>
												<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter w-40">Total</th>
												<th className="px-6 py-4 text-center font-bold text-gray-500 uppercase tracking-tighter w-20">Action</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{billingData.items.map((item, idx) => (
												<tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
													<td className="px-6 py-4">
														<FormSelect
															className="w-full h-10"
															value={item.grocery_id}
															onChange={(e) => handleBillingItemChange(idx, "grocery_id", e.target.value)}
															options={groceries}
														/>
													</td>
													<td className="px-6 py-4">
														<input
															type="number"
															className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
															value={item.quantity}
															onChange={(e) => handleBillingItemChange(idx, "quantity", e.target.value)}
														/>
													</td>
													<td className="px-6 py-4">
														<div className="relative">
															<span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
															<input
																type="number"
																className="w-full border-2 border-gray-100 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
																value={item.price_per_unit}
																onChange={(e) => handleBillingItemChange(idx, "price_per_unit", e.target.value)}
															/>
														</div>
													</td>
													<td className="px-6 py-4 font-bold text-gray-800 text-lg">
														₹{(parseFloat(item.total) || 0).toLocaleString()}
													</td>
													<td className="px-6 py-4 text-center">
														<button onClick={() => removeBillingItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
															<Trash2 className="w-5 h-5" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
										<tfoot className="bg-blue-50/50">
											<tr>
												<td colSpan="3" className="px-6 py-6 text-right font-black text-blue-900 uppercase text-sm tracking-widest">Grand Total</td>
												<td className="px-6 py-6 text-2xl font-black text-blue-700">₹{billingData.total_amount.toLocaleString()}</td>
												<td></td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>

							<div className="flex justify-end gap-4 pt-4 border-t">
								<Button variant="outline" size="lg" onClick={() => setActiveView("list")} disabled={loading} className="px-8 h-12">Cancel</Button>
								<Button onClick={submitBill} size="lg" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white min-w-[180px] h-12 shadow-xl hover:shadow-2xl transition-all rounded-xl font-bold">
									{loading ? "Generating..." : "Generate Bill"}
								</Button>
							</div>
						</div>
					</div>
				)}

				{activeView === "history" && (
					<div className="bg-white rounded-2xl border-2 border-white shadow-xl animate-slideInUp">
						<div className="flex items-center justify-between p-8 border-b bg-gray-50/50">
							<div>
								<h2 className="text-1xl font-bold text-blue-900">Purchase Bills History</h2>
								<p className="text-blue-600 font-medium">Order: {selectedPurchase?.order_no} • {selectedPurchase?.vendor_name}</p>
							</div>
							<Button variant="outline" onClick={() => setActiveView("list")}>Back to List</Button>
						</div>
						<div className="p-8">
							{purchaseBills.length === 0 ? (
								<div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
									<Printer className="w-12 h-12 text-gray-300 mx-auto mb-4" />
									<p className="text-gray-500 text-lg font-medium">No bills generated for this order yet.</p>
								</div>
							) : (
								<div className="grid gap-6">
									{purchaseBills.map((bill) => (
										<div key={bill.id} className="group bg-white border-2 border-gray-100 rounded-2xl p-6 flex justify-between items-center hover:border-blue-200 hover:shadow-lg transition-all">
											<div className="flex items-center gap-6">
												<div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
													<Printer className="w-5 h-5" />
												</div>
												<div>
													<p className="font-black text-blue-950 text-sm tracking-tight">Bill #{bill.bill_no}</p>
													<p className="text-sm text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-tighter">
														{new Date(bill.bill_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
													</p>
												</div>
											</div>
											<div className="text-right flex flex-col items-end gap-2">
												<p className="text-1xl font-black text-emerald-700 tracking-tighter">₹{parseFloat(bill.total_amount).toLocaleString()}</p>
												<Button variant="outline" size="sm" onClick={async () => {
													try {
														const res = await fetch(`/api/purchases/bills/${bill.id}`);
														const data = await res.json();
														setSelectedBill(data);
														setActiveView("bill-details");
													} catch (e) {
														toast.error("Error loading details");
													}
												}} className="bg-slate-50 text-sm border-slate-200 text-slate-600 font-bold px-4 hover:bg-slate-600">
													View Items
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{activeView === "bill-details" && selectedBill && (
					<div className="bg-white rounded-2xl border-2 border-white shadow-xl animate-slideInUp">
						<div className="flex items-center justify-between p-8 border-b bg-gray-50/50">
							<div>
								<h2 className="text-xl font-bold text-blue-900">Bill Details: #{selectedBill.bill_no}</h2>
								<p className="text-blue-600 font-medium">Date: {new Date(selectedBill.bill_date).toLocaleDateString()}</p>
							</div>
							<Button variant="outline" onClick={() => setActiveView("history")}>Back to History</Button>
						</div>
						<div className="p-8">
							<div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
								<table className="w-full text-sm">
									<thead className="bg-gray-50 border-b">
										<tr>
											<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter">Item Name</th>
											<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter w-28">Qty</th>
											<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter w-40">Unit Price</th>
											<th className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-tighter w-40">Total</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{selectedBill.items.map((item, idx) => (
											<tr key={idx} className="hover:bg-blue-50/20 transition-colors">
												<td className="px-6 py-4 font-bold text-gray-800">{item.grocery_name}</td>
												<td className="px-6 py-4 text-gray-600 font-medium">{item.quantity} {item.unit}</td>
												<td className="px-6 py-4 text-gray-600 font-medium tracking-tight">₹{parseFloat(item.price_per_unit).toLocaleString()}</td>
												<td className="px-6 py-4 font-bold text-blue-700 tracking-tight">₹{parseFloat(item.total_price).toLocaleString()}</td>
											</tr>
										))}
									</tbody>
									<tfoot className="bg-blue-50/50">
										<tr>
											<td colSpan="3" className="px-6 py-6 text-right font-black text-blue-900 uppercase text-xs tracking-widest">Grand Total</td>
											<td className="px-6 py-6 text-1xl font-black text-blue-700 tracking-tighter">₹{parseFloat(selectedBill.total_amount).toLocaleString()}</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>





			{isPrintView && selectedPurchase && (
				<>
					<style>{`
  @media screen {
    .print-container {
      position: fixed;
      left: -9999px;
      top: 0;
      width: 210mm;
    }
  }

@media print {
  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  body * {
    visibility: hidden;
  }

  .print-container,
  .print-container * {
    visibility: visible;
  }

  .print-container {
    position: absolute;
    top: 0;
    left: 0;

    width: 180mm;          /* ✅ FIX */
    padding-top: 15mm;
    margin-left: auto;
    margin-right: auto;
  }

  table {
 	max-width: 100%;
    border-collapse: collapse;
	}

    th, td { 
    word-break: break-word;
    }

  @page {
    size: A4;
    margin: 10mm 15mm 18mm 15mm;
  }

  .page-break {
    page-break-after: always;
  }
}

`}</style>


					<div
						className="print-container"
						style={{
							fontFamily: '"Times New Roman", Times, serif',
							fontSize: "14px",
							lineHeight: "1.4",
							color: "#000"
						}}
					>
						{/* ================= HEADER ================= */}
						<div style={{ marginBottom: "10px" }}>

							<div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingLeft: "40px" }}>
								<img
									src="/api/purchases/logo"
									alt="Logo"
									style={{ width: "80px", position: "absolute", left: "0" }}
								/>
								<div style={{ fontSize: "18px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center", marginLeft: "40px" }}>
									NANDHA ENGINEERING COLLEGE (AUTONOMOUS), Erode – 638051
								</div>
							</div>

							<div style={{ fontSize: "15px", fontWeight: "bold", marginTop: "6px", textAlign: "center" }}>
								PURCHASE ORDER
							</div>

							<hr style={{ border: "1px solid #000", marginTop: "8px" }} />
						</div>

						{/* ================= ORDER INFO ================= */}
						<table style={{ width: "100%", marginBottom: "8px" }}>
							<tbody>
								<tr>
									<td><strong>Order No:</strong> {selectedPurchase.order_no}</td>
									<td style={{ textAlign: "right" }}>
										<strong>Date:</strong>{" "}
										{new Date(selectedPurchase.purchase_date).toLocaleDateString("en-GB")}
									</td>
								</tr>
							</tbody>
						</table>

						{/* ================= VENDOR DETAILS ================= */}
						<div style={{ border: "1px solid #000", padding: "6px", marginBottom: "10px" }}>
							<strong>Vendor Details</strong><br />
							Name: {selectedPurchase.vendor_name}<br />
							Phone: {selectedPurchase.vendor_phone}
						</div>

						{/* ================= ITEMS ================= */}
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr>
									<th style={th}>S.No</th>
									<th style={th}>Item Name</th>
									<th style={th}>Quantity</th>
								</tr>
							</thead>
							<tbody>
								{selectedPurchase.grocery_name_unit?.split("; ").map((item, i) => {
									const [, name, unit, qty] =
										item.match(/^(.+?)\s*\((.+?)\)\s*-\s*Qty:\s*(\d+)$/) || [];
									if (!name) return null;

									return (
										<>
											<tr key={i}>
												<td style={{ ...td, textAlign: "center" }}>{i + 1}</td>
												<td style={td}>{name}</td>
												<td style={{ ...td, textAlign: "center" }}>{qty} {unit}</td>
											</tr>

											{(i + 1) % 25 === 0 && (
												<tr className="page-break"><td colSpan="3"></td></tr>
											)}
										</>
									);
								})}
							</tbody>
						</table>

						{/* ================= FOOTER ================= */}
						<div style={{ position: "fixed", bottom: "15mm", width: "100%" }}>
							<table style={{ width: "100%", textAlign: "center" }}>
								<tbody>
									<tr>
										<td>Prepared By</td>
										<td>Checked By</td>
										<td>Approved By</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}


		</MainLayout >
	);
}

