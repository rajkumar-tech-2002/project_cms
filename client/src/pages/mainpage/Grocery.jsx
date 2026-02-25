import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, X, Package } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";

// Backend API base URL
const API_URL = "/api/items";
const CAT_API_URL = "/api/categories";
const UNIT_API_URL = "/api/units";

export default function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const confirmToastId = useRef(null);
  // Fetch items and categories from backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Map backend fields to frontend
        setItems(
          data.map((item) => ({
            id: item.id,
            name: item.grocery_name,
            category: item.category,
            unit: item.unit,
            minimumStock: item.minimum_stock,
            status: item.status,
          }))
        );
      });

    fetch(CAT_API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });

    fetch(UNIT_API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUnits(data);
      });
  }, []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "Kg",
    minimumStock: 0,
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({ name: "", category: "", unit: "Kg", minimumStock: 0, status: "Active" });
    setErrors({});
    setEditingId(null);
  };

  const openForm = (item) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        category: item.category || "",
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
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (formData.minimumStock < 0) newErrors.minimumStock = "Minimum stock must be >= 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare payload for backend
    const payload = {
      grocery_name: formData.name,
      category: formData.category,
      unit: formData.unit,
      minimum_stock: formData.minimumStock,
      status: formData.status,
    };

    if (editingId) {
      // Edit item
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Item updated successfully!");
    } else {
      // Add item
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Item added successfully!");
    }
    // Refresh items
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setItems(
          data.map((item) => ({
            id: item.id,
            name: item.grocery_name,
            category: item.category,
            unit: item.unit,
            minimumStock: item.minimum_stock,
            status: item.status,
          }))
        );
      });
    setIsFormOpen(false);
    resetForm();
  };

  // Single item delete with toast confirmation
  const handleDelete = (id) => {
    if (confirmToastId.current) toast.dismiss(confirmToastId.current);
    confirmToastId.current = toast(
      <div>
        <div>Are you sure you want to delete this item?</div>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              await fetch(`${API_URL}/${id}`, { method: "DELETE" });
              toast.success("Item deleted successfully!");
              fetch(API_URL)
                .then((res) => res.json())
                .then((data) => {
                  setItems(
                    data.map((item) => ({
                      id: item.id,
                      name: item.grocery_name,
                      unit: item.unit,
                      minimumStock: item.minimum_stock,
                      status: item.status,
                    }))
                  );
                });
              toast.dismiss(confirmToastId.current);
            }}
          >Confirm</button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(confirmToastId.current)}
          >Cancel</button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  // Bulk delete with toast confirmation
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (confirmToastId.current) toast.dismiss(confirmToastId.current);
    confirmToastId.current = toast(
      <div>
        <div>Are you sure you want to delete selected items?</div>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              await Promise.all(selectedRows.map(id => fetch(`${API_URL}/${id}`, { method: "DELETE" })));
              toast.success("Selected items deleted successfully!");
              fetch(API_URL)
                .then((res) => res.json())
                .then((data) => {
                  setItems(
                    data.map((item) => ({
                      id: item.id,
                      name: item.grocery_name,
                      unit: item.unit,
                      minimumStock: item.minimum_stock,
                      status: item.status,
                    }))
                  );
                });
              setSelectedRows([]);
              toast.dismiss(confirmToastId.current);
            }}
          >Confirm</button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(confirmToastId.current)}
          >Cancel</button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start animate-fadeInDown">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-900" />
              Grocery Master
            </h1>
            <p className="text-blue-700 mt-2 text-md">
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
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                error={errors.category}
                options={categories.map(cat => ({ value: cat.category_name, label: cat.category_name }))}
              />

              <FormSelect
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                error={errors.unit}
                options={units.map(u => ({ value: u.unit_name, label: u.unit_name }))}
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
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Items List</span>
            <Button
              variant="destructive"
              disabled={selectedRows.length === 0}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
          <DataTable
            columns={[
              {
                key: "sno",
                label: "S.No",
                render: (_value, _row, index) => <div className="fw-medium">{index + 1}</div>
              },
              { key: "name", label: "Item Name" },
              { key: "category", label: "Category" },
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === "Active"
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
            selectable={true}
            selectedRows={selectedRows}
            onSelectRow={(id, checked) => {
              setSelectedRows((prev) =>
                checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
              );
            }}
            onSelectAll={(checked, pageRows) => {
              const pageIds = pageRows.map((row) => row.id);
              setSelectedRows((prev) =>
                checked
                  ? Array.from(new Set([...prev, ...pageIds]))
                  : prev.filter((id) => !pageIds.includes(id))
              );
            }}
          />
        </div>
      </div>

    </MainLayout>
  );
}
