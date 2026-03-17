import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Trash2,
  Plus,
  Edit2,
  X,
  UtensilsCrossed,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
// ...existing imports...
// For confirmation toast
const confirmToastIdRef = { current: null };

const categoryIcons = {
  "South Indian Tiffin": "🥞",
  "South Indian Meals": "🍛",
  Snacks: "🍟",
  "Fast Food": "🍜",
  Beverages: "🥤",
  Desserts: "🍨",
  Others: "🍽️",
};

const getCategoryLabel = (name) => {
  if (typeof name !== "string") return `🍽️ ${name || "Unknown"}`;
  const icon = Object.keys(categoryIcons).find((key) => name.includes(key));
  return icon ? `${categoryIcons[icon]} ${name}` : `🍽️ ${name}`;
};

export default function Items() {
  // Dummy grocery master list
  const [groceryMaster, setGroceryMaster] = useState([
    { id: 1, name: "Rice", unit: "Kg" },
    { id: 2, name: "Oil", unit: "Litre" },
    { id: 3, name: "Urad Dal", unit: "Kg" },
    { id: 4, name: "Salt", unit: "Kg" },
    { id: 5, name: "Potato", unit: "Kg" },
  ]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [productionFilter, setProductionFilter] = useState("all"); // all, current, prior
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantityPrepared: "",
    preparedDate: "",
    pricePerItem: "",
    totalPrice: "",
    groceriesUsed: [{ groceryId: "", quantity: "", unit: "" }],
  });
  const [errors, setErrors] = useState({});

  // Fetch items from backend
  useEffect(() => {
    fetch("/api/prepared-items")
      .then((res) => res.json())
      .then((data) => {
        // Parse groceriesUsed from string to array for display
        setItems(
          data.map((item) => ({
            ...item,
            quantityPrepared: item.quantity_prepared,
            preparedDate: item.prepared_date,
            pricePerItem: item.price_per_item,
            totalPrice: item.total_price,
            groceriesUsed: parseGroceriesString(item.groceries_used),
          })),
        );
      });
    // Fetch grocery master
    fetch("/api/groceries-master")
      .then((res) => res.json())
      .then((data) =>
        setGroceryMaster(
          data.map((g) => ({ id: g.id, name: g.grocery_name, unit: g.unit })),
        ),
      );

    // Fetch item categories
    fetch("/api/item-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Helper: convert groceriesUsed array to string
  function groceriesArrayToString(arr) {
    return arr
      .map((g) => {
        const grocery = groceryMaster.find((m) => m.id === Number(g.groceryId));
        const name = grocery ? grocery.name : g.groceryName || "";
        const unit = grocery ? grocery.unit : g.unit || "";
        return `${name} - ${g.quantity} ${unit}`;
      })
      .join(", ");
  }

  // Helper: parse groceries string to array
  function parseGroceriesString(str) {
    if (!str) return [];
    return str.split(",").map((s) => {
      const match = s.trim().match(/^(.*?) - ([\d.]+)\s*(\w+)$/);
      if (match) {
        return {
          groceryName: match[1].trim(),
          quantity: parseFloat(match[2]),
          unit: match[3],
        };
      }
      return { groceryName: s.trim(), quantity: "", unit: "" };
    });
  }

  const startCreate = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      quantityPrepared: "",
      preparedDate: "",
      pricePerItem: "",
      totalPrice: "",
      groceriesUsed: [{ groceryId: "", quantity: "", unit: "" }],
    });
    setErrors({});
    setIsEditing(false);
    setIsCreating(true);
  };

  const startEdit = (item) => {
    // Map groceriesUsed to include groceryId by matching groceryName with groceryMaster
    const groceriesUsed = item.groceriesUsed.map((g) => {
      let groceryId = g.groceryId;
      if (!groceryId) {
        const found = groceryMaster.find((m) => m.name === g.groceryName);
        groceryId = found ? found.id : "";
      }
      return {
        groceryId,
        quantity: g.quantity,
        unit: g.unit,
      };
    });
    setFormData({
      name: item.name,
      category: item.category || "",
      description: item.description,
      quantityPrepared: item.quantityPrepared,
      preparedDate: item.preparedDate || item.prepared_date || "",
      pricePerItem: item.pricePerItem || "",
      totalPrice: item.totalPrice || "",
      groceriesUsed,
    });
    setSelectedItem(item);
    setErrors({});
    setIsEditing(true);
    setIsCreating(false);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setErrors({});
    setSelectedItem(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (
      !formData.quantityPrepared ||
      isNaN(formData.quantityPrepared) ||
      Number(formData.quantityPrepared) <= 0
    )
      newErrors.quantityPrepared = "Quantity prepared must be > 0";
    if (!formData.preparedDate)
      newErrors.preparedDate = "Prepared date is required";
    if (
      !formData.pricePerItem ||
      isNaN(formData.pricePerItem) ||
      Number(formData.pricePerItem) < 0
    )
      newErrors.pricePerItem = "Price must be >= 0";
    formData.groceriesUsed.forEach((g, idx) => {
      if (!g.groceryId) newErrors[`grocery_${idx}`] = "Select grocery";
      if (!g.quantity || isNaN(g.quantity) || Number(g.quantity) <= 0)
        newErrors[`quantity_${idx}`] = "Enter valid quantity";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGroceryChange = (idx, field, value) => {
    const newGroceries = [...formData.groceriesUsed];
    newGroceries[idx][field] = value;
    // Set unit automatically if grocery selected
    if (field === "groceryId") {
      const found = groceryMaster.find((g) => g.id === Number(value));
      newGroceries[idx].unit = found ? found.unit : "";
    }
    setFormData({ ...formData, groceriesUsed: newGroceries });
  };

  const handleAddGrocery = () => {
    setFormData({
      ...formData,
      groceriesUsed: [
        ...formData.groceriesUsed,
        { groceryId: "", quantity: "", unit: "" },
      ],
    });
  };

  const handleRemoveGrocery = (idx) => {
    setFormData({
      ...formData,
      groceriesUsed: formData.groceriesUsed.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Map formData.groceriesUsed to the structured format expected by the backend
    const structuredGroceries = formData.groceriesUsed.map((g) => ({
      grocery_id: Number(g.groceryId),
      quantity_used: Number(g.quantity),
    }));

    const payload = {
      item_no: selectedItem?.item_no,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      quantity_prepared: formData.quantityPrepared,
      groceries_used: structuredGroceries,
      prepared_date: formData.preparedDate,
      price_per_item: Number(formData.pricePerItem),
      total_price: Number(formData.totalPrice),
    };
    try {
      if (isEditing && selectedItem) {
        const res = await fetch(`/api/prepared-items/${selectedItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Update failed");
        }

        const updated = await res.json();
        setItems(
          items.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...updated,
                  quantityPrepared: updated.quantity_prepared,
                  preparedDate: updated.prepared_date,
                  pricePerItem: updated.price_per_item,
                  totalPrice: updated.total_price,
                  groceriesUsed: parseGroceriesString(updated.groceries_used),
                }
              : item,
          ),
        );
        toast.success("Prepared item updated");
      } else {
        const res = await fetch("/api/prepared-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Add failed");
        }

        const added = await res.json();
        setItems([
          ...items,
          {
            ...added,
            quantityPrepared: added.quantity_prepared,
            preparedDate: added.prepared_date,
            pricePerItem: added.price_per_item,
            totalPrice: added.total_price,
            groceriesUsed: parseGroceriesString(added.groceries_used),
          },
        ]);
        toast.success("Prepared item added");
      }
      cancelForm();
    } catch (err) {
      toast.error(err.message || "Error saving item");
    }
  };

  const handleDelete = (id) => {
    if (confirmToastIdRef.current) toast.dismiss(confirmToastIdRef.current);
    confirmToastIdRef.current = toast(
      <div>
        <div>Are you sure you want to delete this prepared item?</div>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              try {
                const res = await fetch(`/api/prepared-items/${id}`, {
                  method: "DELETE",
                });
                if (!res.ok) {
                  const errorData = await res.json();
                  throw new Error(errorData.error || "Delete failed");
                }
                setItems((items) => items.filter((item) => item.id !== id));
                toast.success("Prepared item deleted");
                toast.dismiss(confirmToastIdRef.current);
              } catch (err) {
                toast.error(err.message || "Error deleting item");
              }
            }}
          >
            Confirm
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(confirmToastIdRef.current)}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false },
    );
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (confirmToastIdRef.current) toast.dismiss(confirmToastIdRef.current);
    confirmToastIdRef.current = toast(
      <div>
        <div>Are you sure you want to delete selected prepared items?</div>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              try {
                await Promise.all(
                  selectedRows.map((id) =>
                    fetch(`/api/prepared-items/${id}`, { method: "DELETE" }),
                  ),
                );
                setItems((items) =>
                  items.filter((item) => !selectedRows.includes(item.id)),
                );
                setSelectedRows([]);
                toast.success("Selected items deleted");
                toast.dismiss(confirmToastIdRef.current);
              } catch (err) {
                toast.error("Error deleting selected items");
              }
            }}
          >
            Confirm
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(confirmToastIdRef.current)}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false },
    );
  };

  const filteredItems = items.filter((item) => {
    if (productionFilter === "all") return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const itemDate = new Date(item.preparedDate || item.prepared_date);
    itemDate.setHours(0, 0, 0, 0);

    if (productionFilter === "current") {
      return itemDate.getTime() === today.getTime();
    }

    if (productionFilter === "prior") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return itemDate.getTime() === yesterday.getTime();
    }

    return true;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start animate-fadeInDown">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-blue-900" />
              Prepared Items
            </h1>
            <p className="text-blue-700 mt-2 text-md">
              Manage your prepared items
            </p>
          </div>
          <Button
            onClick={startCreate}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Production Timeframe Filters */}
        <div className="flex items-center gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm w-fit animate-fadeInDown">
          {[
            { id: "all", label: "All Items", icon: UtensilsCrossed },
            { id: "current", label: "Current Day Production", icon: Calendar },
            { id: "prior", label: "Prior Day Production", icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProductionFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                productionFilter === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {(isCreating || isEditing) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? "Edit Prepared Item" : "Add Prepared Item"}
              </h2>
              <button
                onClick={cancelForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Prepared Item Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={errors.name}
                  placeholder="e.g. Dosa, Vada, Idly"
                />
                <FormSelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  error={errors.category}
                  options={categories.map((cat) => ({
                    value: cat?.category_name || cat,
                    label: getCategoryLabel(cat?.category_name || cat),
                  }))}
                />
                <FormInput
                  label="Quantity Prepared (per batch)"
                  type="number"
                  min="1"
                  value={formData.quantityPrepared}
                  onChange={(e) => {
                    const qty = e.target.value;
                    const total = (
                      Number(qty) * Number(formData.pricePerItem)
                    ).toFixed(2);
                    setFormData({
                      ...formData,
                      quantityPrepared: qty,
                      totalPrice: total,
                    });
                  }}
                  error={errors.quantityPrepared}
                  placeholder="e.g. 50"
                />
                <FormInput
                  label="Prepared Date"
                  type="date"
                  value={formData.preparedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preparedDate: e.target.value })
                  }
                  error={errors.preparedDate}
                />
                <FormInput
                  label="Price Per Item"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerItem}
                  onChange={(e) => {
                    const price = e.target.value;
                    const total = (
                      Number(price) * Number(formData.quantityPrepared)
                    ).toFixed(2);
                    setFormData({
                      ...formData,
                      pricePerItem: price,
                      totalPrice: total,
                    });
                  }}
                  error={errors.pricePerItem}
                  placeholder="e.g. 10.00"
                />
                <FormInput
                  label="Total Price"
                  type="number"
                  value={formData.totalPrice}
                  disabled
                  placeholder="Calculated automatically"
                />
              </div>
              <FormInput
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Groceries Used
                </label>
                <div className="space-y-2">
                  {formData.groceriesUsed.map((g, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-2 items-end md:items-center"
                    >
                      <div className="flex-1">
                        <FormSelect
                          label="Grocery"
                          value={g.groceryId}
                          onChange={(e) =>
                            handleGroceryChange(
                              idx,
                              "groceryId",
                              e.target.value,
                            )
                          }
                          error={errors[`grocery_${idx}`]}
                          options={groceryMaster.map((gm) => ({
                            value: gm.id,
                            label: gm.name,
                          }))}
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          label="Quantity"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={g.quantity}
                          onChange={(e) =>
                            handleGroceryChange(idx, "quantity", e.target.value)
                          }
                          error={errors[`quantity_${idx}`]}
                          placeholder="e.g. 2"
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          label="Unit"
                          value={g.unit}
                          disabled
                          placeholder="Unit"
                        />
                      </div>
                      <div>
                        {formData.groceriesUsed.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGrocery(idx)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddGrocery}
                    className="text-primary hover:underline text-sm mt-2"
                  >
                    + Add Grocery
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelForm}
                  className="bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isEditing ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Prepared Items</span>
            <Button
              variant="destructive"
              disabled={selectedRows.length === 0}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
          <DataTable
            selectable={true}
            selectedRows={selectedRows}
            onSelectRow={(id, checked) => {
              setSelectedRows((prev) =>
                checked ? [...prev, id] : prev.filter((rowId) => rowId !== id),
              );
            }}
            onSelectAll={(checked, pageRows) => {
              const pageIds = pageRows.map((row) => row.id);
              setSelectedRows((prev) =>
                checked
                  ? Array.from(new Set([...prev, ...pageIds]))
                  : prev.filter((id) => !pageIds.includes(id)),
              );
            }}
            columns={[
              {
                key: "sno",
                label: "S.No",
                render: (_value, _row, index) => (
                  <div className="fw-medium">{index + 1}</div>
                ),
              },
              { key: "item_no", label: "Item No" },
              {
                key: "category",
                label: "Category",
                render: (val) => {
                  return (
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 uppercase tracking-tighter">
                      {val}
                    </span>
                  );
                },
              },
              { key: "name", label: "Prepared Item" },
              { key: "quantityPrepared", label: "Qty Prepared" },
              {
                key: "pricePerItem",
                label: "Price/Item",
                render: (v) => `₹${Number(v).toFixed(2)}`,
              },
              {
                key: "totalPrice",
                label: "Total Price",
                render: (v) => `₹${Number(v).toFixed(2)}`,
              },
              { key: "description", label: "Description" },
              {
                key: "preparedDate",
                label: "Prepared Date",
                render: (v) => {
                  if (!v) return "";
                  const d = new Date(v);
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const year = d.getFullYear();
                  return `${day}-${month}-${year}`;
                },
              },
              {
                key: "groceriesUsed",
                label: "Groceries Used",
                render: (value) => (
                  <ul className="text-xs list-disc pl-4">
                    {Array.isArray(value)
                      ? value.map((g, i) => (
                          <li key={i}>
                            {g.groceryName} - {g.quantity} {g.unit}
                          </li>
                        ))
                      : value}
                  </ul>
                ),
              },
              {
                key: "id",
                label: "Actions",
                render: (_, row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(row)}
                      className="p-2 hover:bg-blue-50 rounded text-blue-600"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="p-2 hover:bg-red-50 rounded text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredItems}
            searchableFields={["item_no", "name", "description", "category"]}
            title="Prepared Items"
          />
        </div>
      </div>
    </MainLayout>
  );
}
