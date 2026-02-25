import { useState, useEffect } from "react";
import { Package, Search, Filter, ShoppingBag, X, Check } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";

const CATEGORIES = [
    { value: "South Indian Tiffin", label: "🥞 South Indian Tiffin / Breakfast" },
    { value: "South Indian Meals", label: "🍛 South Indian Meals" },
    { value: "Snacks", label: "🍟 Snacks & Evening Tiffin" },
    { value: "Fast Food", label: "🍜 Fast Food" },
    { value: "Beverages", label: "🥤 Beverages" },
    { value: "Desserts", label: "🍨 Desserts" },
    { value: "Others", label: "🍽️ Others" }
];

export default function CounterItems() {
    const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sellQty, setSellQty] = useState("1");
    const [sellPrice, setSellPrice] = useState("");

    useEffect(() => {
        fetchCounterItems();
    }, []);

    const fetchCounterItems = async () => {
        setLoading(true);
        try {
            // Fetch real-time stock from the new table
            const response = await fetch(`/api/sales/stock/${encodeURIComponent(user.counter)}`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to fetch items for your counter");
        } finally {
            setLoading(false);
        }
    };

    const handleSell = async (e) => {
        e.preventDefault();
        if (!sellQty || parseInt(sellQty) <= 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        if (parseInt(sellQty) > selectedItem.available_quantity) {
            toast.error("Not enough stock available");
            return;
        }

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    counter_name: user.counter,
                    item_name: selectedItem.item_name,
                    item_no: selectedItem.item_no,
                    quantity: parseInt(sellQty),
                    price: parseFloat(sellPrice) || 0,
                    staff_id: user.user_id
                })
            });

            if (response.ok) {
                toast.success(`Sold ${sellQty} units of ${selectedItem.item_name}`);
                setSelectedItem(null);
                setSellQty("");
                setSellPrice("");
                fetchCounterItems(); // Refresh stock
            } else {
                const err = await response.json();
                toast.error(err.error || "Failed to record sale");
            }
        } catch (error) {
            toast.error("Server error. Please try again.");
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                            <Package className="w-8 h-8 text-blue-600" />
                            Items at {user.counter}
                        </h1>
                        <p className="text-blue-700 mt-2 text-md">
                            Manage and sell items assigned to your counter.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-xl relative overflow-hidden">
                    <DataTable
                        columns={[
                            { key: "item_name", label: "Item Name" },
                            {
                                key: "category",
                                label: "Category",
                                render: (val) => {
                                    const cat = CATEGORIES.find(c => c.value === val);
                                    return <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 uppercase tracking-tighter">
                                        {cat ? cat.label.split(' ').slice(1).join(' ') : 'Others'}
                                    </span>
                                }
                            },
                            {
                                key: "available_quantity",
                                label: "In Stock",
                                render: (val) => (
                                    <span className={`font-bold ${val < 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {val} units
                                    </span>
                                )
                            },
                            {
                                key: "last_updated",
                                label: "Last Sync",
                                render: (val) => {
                                    const date = new Date(val);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    return `${day}-${month}-${year} ${hours}:${minutes}`;
                                }
                            },
                            {
                                key: "price",
                                label: "Price",
                                render: (val) => <span className="font-bold text-blue-600">₹{parseFloat(val).toFixed(2)}</span>
                            },
                            {
                                key: "actions",
                                label: "Operations",
                                render: (_, row) => (
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedItem(row);
                                            setSellPrice(row.price);
                                            setSellQty("1");
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 gap-2 rounded-xl"
                                        disabled={row.available_quantity <= 0}
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Sell
                                    </Button>
                                )
                            }
                        ]}
                        data={items}
                        searchableFields={["item_name"]}
                    />
                </div>

                {/* Sell Dialog */}
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-blue-50 animate-scaleIn">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Record Sale</h3>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSell} className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
                                    <p className="text-sm text-blue-600 font-medium uppercase tracking-wider">Item Details</p>
                                    <p className="text-lg font-bold text-blue-900">{selectedItem.item_name}</p>
                                    <p className="text-sm text-blue-700">Available: <strong>{selectedItem.available_quantity} units</strong></p>
                                </div>

                                <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
                                    <div>
                                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Rate</p>
                                        <p className="text-lg font-bold text-blue-900">₹{parseFloat(selectedItem.price || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Amount</p>
                                        <p className="text-xl font-black text-blue-900">₹{(parseInt(sellQty || 0) * parseFloat(selectedItem.price || 0)).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-600 font-medium">Selling Quantity</Label>
                                        <Input
                                            type="number"
                                            value={sellQty}
                                            onChange={(e) => setSellQty(e.target.value)}
                                            placeholder="Enter quantity to sell"
                                            className="h-12 rounded-xl border-2 focus:ring-blue-500 focus:border-blue-500"
                                            max={selectedItem.available_quantity}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600 font-medium">Selling Price (₹)</Label>
                                        <Input
                                            type="number"
                                            value={sellPrice}
                                            onChange={(e) => setSellPrice(e.target.value)}
                                            placeholder="Price per unit"
                                            className="h-12 rounded-xl border-2 focus:ring-blue-500 focus:border-blue-500"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelectedItem(null)}
                                        className="flex-1 h-12 rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                    >
                                        Complete Sale
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

