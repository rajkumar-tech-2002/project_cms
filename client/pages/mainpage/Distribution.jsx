import { useState } from "react";
import { Trash2, Plus, Eye, X } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";

const mockDistributions = [
  {
    id: 1,
    issueNo: "DIS-2024-001",
    location: "Counter A",
    date: "2024-01-20",
    items: [
      { itemId: "1", itemName: "Rice (Basmati)", quantity: 25, availableStock: 100 },
      { itemId: "2", itemName: "Cooking Oil", quantity: 10, availableStock: 50 },
    ],
    totalItems: 35,
    status: "Issued",
  },
  {
    id: 2,
    issueNo: "DIS-2024-002",
    location: "Boys Hostel 1",
    date: "2024-01-21",
    items: [
      { itemId: "3", itemName: "Wheat Flour", quantity: 50, availableStock: 120 },
    ],
    totalItems: 50,
    status: "Issued",
  },
];

const mockLocations = [
  { value: "1", label: "Counter A" },
  { value: "2", label: "Counter B" },
  { value: "3", label: "Boys Hostel 1" },
  { value: "4", label: "Girls Hostel 1" },
  { value: "5", label: "North Block" },
];

const mockItems = [
  { value: "1", label: "Rice (Basmati)", stock: 50 },
  { value: "2", label: "Cooking Oil", stock: 15 },
  { value: "3", label: "Wheat Flour", stock: 75 },
  { value: "4", label: "Dal (Masoor)", stock: 120 },
  { value: "5", label: "Sugar", stock: 180 },
];

export default function Distribution() {
  const [distributions, setDistributions] = useState(mockDistributions);
  const [isCreating, setIsCreating] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    items: [{ itemId: "", itemName: "", quantity: 0, availableStock: 0 }],
  });
  const [errors, setErrors] = useState({});

  const startCreate = () => {
    setFormData({
      location: "",
      items: [{ itemId: "", itemName: "", quantity: 0, availableStock: 0 }],
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
      items: [...formData.items, { itemId: "", itemName: "", quantity: 0, availableStock: 0 }],
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
      newItems[index].availableStock = selected?.stock || 0;
    }

    setFormData({ ...formData, items: newItems });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location) newErrors.location = "Location is required";
    if (formData.items.length === 0) newErrors.items = "At least one item is required";
    formData.items.forEach((item, idx) => {
      if (!item.itemId) newErrors[`item_${idx}`] = "Item is required";
      if (item.quantity <= 0) newErrors[`qty_${idx}`] = "Quantity must be > 0";
      if (item.quantity > item.availableStock) {
        newErrors[`qty_${idx}`] = `Cannot issue more than available (${item.availableStock})`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const totalItems = formData.items.reduce((sum, item) => sum + item.quantity, 0);
    const newDistribution = {
      id: Math.max(...distributions.map((d) => d.id), 0) + 1,
      issueNo: `DIS-${new Date().getFullYear()}-${String(distributions.length + 1).padStart(3, "0")}`,
      location: mockLocations.find((l) => l.value === formData.location)?.label || "",
      date: new Date().toISOString().split("T")[0],
      items: formData.items,
      totalItems,
      status: "Issued",
    };
    setDistributions([...distributions, newDistribution]);
    setIsCreating(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start animate-fadeInDown">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stock Distribution
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Issue stock to counters, hostels, and blocks
            </p>
          </div>
          <Button
            onClick={startCreate}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Issue Stock
          </Button>
        </div>

        {isCreating && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Issue Stock to Location</h2>
              <button
                onClick={cancelCreate}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormSelect
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                error={errors.location}
                options={mockLocations}
              />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-foreground">Items to Issue</label>
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
                      options={mockItems.map((m) => ({
                        value: m.value,
                        label: `${m.label} (Available: ${m.stock})`,
                      }))}
                    />

                    <FormInput
                      label={`Quantity to Issue (Available: ${item.availableStock})`}
                      type="number"
                      min="1"
                      max={item.availableStock}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", parseInt(e.target.value) || 0)
                      }
                      error={errors[`qty_${idx}`]}
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Available: {item.availableStock}
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

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Total Items: </span>
                  {formData.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={cancelCreate} className="bg-white">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Issue Stock
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
          <DataTable
            columns={[
              { key: "issueNo", label: "Issue No." },
              { key: "location", label: "Location" },
              { key: "date", label: "Date" },
              { key: "totalItems", label: "Total Items", render: (v) => `${v} items` },
              {
                key: "status",
                label: "Status",
                render: (value) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                      setSelectedDistribution(row);
                      setIsDetailView(true);
                    }}
                    className="p-2 hover:bg-blue-50 rounded text-blue-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
            data={distributions}
            searchableFields={["issueNo", "location"]}
            title="Distribution Records"
          />
        </div>
      </div>

      {isDetailView && selectedDistribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{selectedDistribution.issueNo}</h2>
              <button
                onClick={() => setIsDetailView(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{selectedDistribution.location}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold text-foreground">{selectedDistribution.date}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Items Distributed</p>
                <div className="space-y-2">
                  {selectedDistribution.items.map((item, idx) => (
                    <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                      <p className="font-medium text-foreground">{item.itemName}</p>
                      <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{selectedDistribution.totalItems}</p>
              </div>

              <Button variant="outline" onClick={() => setIsDetailView(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
