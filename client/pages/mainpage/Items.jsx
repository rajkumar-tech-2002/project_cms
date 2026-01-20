import { useState } from "react";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";

const mockItems = [
  { id: 1, name: "Rice (Basmati)", unit: "Kg", minimumStock: 200, status: "Active" },
  { id: 2, name: "Cooking Oil", unit: "Litre", minimumStock: 50, status: "Active" },
  { id: 3, name: "Wheat Flour", unit: "Kg", minimumStock: 150, status: "Active" },
  { id: 4, name: "Dal (Masoor)", unit: "Kg", minimumStock: 100, status: "Active" },
  { id: 5, name: "Sugar", unit: "Kg", minimumStock: 200, status: "Active" },
  { id: 6, name: "Salt", unit: "Kg", minimumStock: 20, status: "Inactive" },
  { id: 7, name: "Spice Mix", unit: "Kg", minimumStock: 50, status: "Active" },
  { id: 8, name: "Milk Powder", unit: "Kg", minimumStock: 75, status: "Active" },
];

export default function Items() {
  const [items, setItems] = useState(mockItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    unit: "Kg",
    minimumStock: 0,
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({ name: "", unit: "Kg", minimumStock: 0, status: "Active" });
    setErrors({});
    setEditingId(null);
  };

  const openForm = (item) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        unit: item.unit,
        minimumStock: item.minimumStock,
        status: item.status,
      });
    } else {
      resetForm();
    }
    setErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (formData.minimumStock < 0) newErrors.minimumStock = "Minimum stock must be >= 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      setItems([...items, { id: Math.max(...items.map((i) => i.id), 0) + 1, ...formData }]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start animate-fadeInDown">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Item Master</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage food and raw material items
            </p>
          </div>
          <Button onClick={() => openForm()} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {isFormOpen && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {editingId ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                aria-label="Close item form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Item Name"
                placeholder="e.g., Rice, Cooking Oil"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />

              <FormSelect
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                error={errors.unit}
                options={[
                  { value: "Kg", label: "Kilogram (Kg)" },
                  { value: "Litre", label: "Litre (L)" },
                  { value: "Piece", label: "Piece" },
                ]}
              />

              <FormInput
                label="Minimum Stock Level"
                type="number"
                min="0"
                value={formData.minimumStock}
                onChange={(e) =>
                  setFormData({ ...formData, minimumStock: parseInt(e.target.value, 10) || 0 })
                }
                error={errors.minimumStock}
              />

              <FormSelect
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
          <DataTable
          columns={[
            { key: "name", label: "Item Name" },
            { key: "unit", label: "Unit" },
            {
              key: "minimumStock",
              label: "Minimum Stock",
              render: (value) => `${value}`,
            },
            {
              key: "status",
              label: "Status",
              render: (value) => (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    value === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
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
                    onClick={() => openForm(row)}
                    className="p-2 hover:bg-blue-50 rounded text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="p-2 hover:bg-red-50 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={items}
          searchableFields={["name"]}
          title="Items List"
        />
        </div>
      </div>

    </MainLayout>
  );
}
