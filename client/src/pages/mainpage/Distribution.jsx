import { useState, useEffect } from "react";
import { Trash2, Plus, Eye, X, Truck } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";




export default function Distribution() {
  const [distributions, setDistributions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [itemsMaster, setItemsMaster] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    items: [{ itemId: "", itemName: "", itemNo: "", quantity: 0, availableStock: 0 }],
  });
  const [errors, setErrors] = useState({});

  // Fetch distributions, locations, and items from server
  useEffect(() => {
    fetch('/api/distributed-items')
      .then(res => res.json())
      .then(data => {
        setDistributions(data.map(row => ({
          id: row.id,
          issueNo: row.issue_no,
          location: row.center,
          date: formatDate(row.issue_date),
          items: parseIssuedItems(row.issued_items),
          totalItems: parseIssuedItems(row.issued_items).reduce((sum, i) => sum + i.quantity, 0),
          status: "Issued"
        })));
      });
    // Format date to dd-mm-yyyy for display
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
    fetch('/api/distribution-locations')
      .then(res => res.json())
      .then(data => setLocations(data.map(l => ({ value: l.center, label: l.center }))));
  }, []);

  // Fetch itemsMaster when date changes
  useEffect(() => {
    if (!formData.date) {
      setItemsMaster([]);
      return;
    }
    fetch(`/api/distribution-prepared-items?date=${encodeURIComponent(formData.date)}`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(i => ({
          value: i.item_no,
          label: `${i.item_no} - ${i.item_name}`,
          itemNo: i.item_no,
          availableStock: Number(i.available_quantity) || 0
        }));
        setItemsMaster(mapped);
      });
  }, [formData.date]);

  // Helper: parse issued_items string to array
  function parseIssuedItems(str) {
    if (!str) return [];
    return str.split(',').map(s => {
      const match = s.trim().match(/^(.*?)\((\d+)\)$/);
      if (match) {
        return { itemName: match[1].trim(), quantity: parseInt(match[2]), itemId: '', availableStock: 0 };
      }
      return { itemName: s.trim(), quantity: 0, itemId: '', availableStock: 0 };
    });
  }

  const startCreate = () => {
    setFormData({
      location: "",
      date: "",
      items: [{ itemId: "", itemName: "", itemNo: "", quantity: 0, availableStock: 0 }],
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
      items: [...formData.items, { itemId: "", itemName: "", itemNo: "", quantity: 0, availableStock: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...formData.items];
    // Always initialize all fields to avoid undefined
    newItems[index] = {
      itemId: newItems[index].itemId || "",
      itemName: newItems[index].itemName || "",
      itemNo: newItems[index].itemNo || "",
      quantity: typeof newItems[index].quantity === 'number' ? newItems[index].quantity : 0,
      availableStock: typeof newItems[index].availableStock === 'number' ? newItems[index].availableStock : 0,
      ...newItems[index],
      [field]: value
    };

    if (field === "itemId") {
      // Find by item_no (value is item_no)
      const selected = itemsMaster.find((m) => m.itemNo === value || m.value === value);
      newItems[index].itemName = selected?.label || "";
      newItems[index].itemNo = selected?.itemNo || "";
      newItems[index].availableStock = typeof selected?.availableStock === 'number' ? selected.availableStock : 0;
      // Reset quantity to 0 when changing item
      newItems[index].quantity = 0;
    }

    // Show toast if quantity > availableStock
    if (field === "quantity" && newItems[index].quantity > newItems[index].availableStock) {
      toast.error(`Cannot issue more than available (${newItems[index].availableStock})`, { autoClose: 2000 });
    }

    setFormData({ ...formData, items: newItems });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.date) newErrors.date = "Date is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Format issued_items string: Dosa(15), Idly(20)
    const issued_items = formData.items.map(i => `${i.itemName}(${i.quantity})`).join(', ');
    const payload = {
      issue_no: `DIS-${new Date().getFullYear()}-${String(distributions.length + 1).padStart(3, "0")}`,
      center: formData.location,
      location: formData.location, // or use a separate field if needed
      issue_date: formData.date,
      issued_items
    };
    const res = await fetch('/api/distributed-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      // Refresh distributions
      const data = await res.json();
      setDistributions(prev => [
        ...prev,
        {
          id: data.id,
          issueNo: data.issue_no,
          location: data.center,
          date: data.issue_date,
          items: parseIssuedItems(data.issued_items),
          totalItems: parseIssuedItems(data.issued_items).reduce((sum, i) => sum + i.quantity, 0),
          status: "Issued"
        }
      ]);
      setIsCreating(false);
      toast.success('Distributed item saved!', { autoClose: 2000 });
    }
  };

  return (
    <>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start animate-fadeInDown">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <Truck className="w-6 h-6 text-blue-900" />
                Stock Distribution
              </h1>
              <p className="text-blue-700 mt-2 text-md">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    error={errors.location}
                    options={locations}
                  />
                  <FormInput
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={e => {
                      // Always save in yyyy-mm-dd format
                      setFormData({ ...formData, date: e.target.value });
                    }}
                    error={errors.date}
                  />
                </div>

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
                        options={itemsMaster}
                      />
                      <FormInput
                        label={`Quantity to Issue (Available: ${typeof item.availableStock === 'number' ? item.availableStock : 0})`}
                        type="number"
                        min="1"
                        max={typeof item.availableStock === 'number' ? item.availableStock : 0}
                        value={typeof item.quantity === 'number' ? item.quantity : 0}
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
                <h2 className="text-md font-semibold text-foreground">{selectedDistribution.issueNo}</h2>
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
    </>
  );
}
