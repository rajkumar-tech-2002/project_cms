import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, X, Users } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const confirmToastId = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    vendor_address: "",
  });
  const [errors, setErrors] = useState({});

  const API_URL = "/api/vendors";

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error fetching vendors");
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setFormData({ vendor_name: "", vendor_email: "", vendor_phone: "", vendor_address: "" });
    setErrors({});
    setIsCreating(true);
  };

  const startEdit = (vendor) => {
    setEditingId(vendor.id);
    setFormData({
      vendor_name: vendor.vendor_name,
      vendor_email: vendor.vendor_email,
      vendor_phone: vendor.vendor_phone,
      vendor_address: vendor.vendor_address,
    });
    setErrors({});
    setIsCreating(true);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vendor_name.trim()) newErrors.vendor_name = "Vendor name is required";
    if (!formData.vendor_email.trim()) newErrors.vendor_email = "Email is required";
    if (formData.vendor_email && !formData.vendor_email.includes("@"))
      newErrors.vendor_email = "Invalid email format";
    if (!formData.vendor_phone.trim()) newErrors.vendor_phone = "Phone number is required";
    if (!formData.vendor_address.trim()) newErrors.vendor_address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        fetchVendors();
        setIsCreating(false);
        toast.success(editingId ? "Vendor updated successfully" : "Vendor added successfully");
      } else {
        toast.error("Failed to save vendor");
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast.error("Error saving vendor");
    }
  };

  const handleDelete = (id) => {
    if (confirmToastId.current) toast.dismiss(confirmToastId.current);
    confirmToastId.current = toast(
      <div>
        <div>Are you sure you want to delete this vendor?</div>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              try {
                const response = await fetch(`${API_URL}/${id}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  fetchVendors();
                  toast.success("Vendor deleted successfully");
                } else {
                  toast.error("Failed to delete vendor");
                }
              } catch (error) {
                console.error("Error deleting vendor:", error);
                toast.error("Error deleting vendor");
              }
              toast.dismiss(confirmToastId.current);
            }}
          >
            Confirm
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(confirmToastId.current)}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (confirmToastId.current) toast.dismiss(confirmToastId.current);
    confirmToastId.current = toast(
      <div>
        <div>Are you sure you want to delete selected vendors?</div>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              await Promise.all(selectedRows.map(id => fetch(`${API_URL}/${id}`, { method: "DELETE" })));
              fetchVendors();
              setSelectedRows([]);
              toast.success("Selected vendors deleted");
              toast.dismiss(confirmToastId.current);
            }}
          >
            Confirm
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(confirmToastId.current)}
          >
            Cancel
          </button>
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
              <Users className="w-6 h-6 text-blue-900" />
              Vendor Management
            </h1>
            <p className="text-blue-700 mt-2 text-md">
              Add and manage vendors and suppliers
            </p>
          </div>
          <Button
            onClick={startCreate}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        </div>

        {isCreating && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {editingId ? "Edit Vendor" : "Add Vendor"}
              </h2>
              <button
                onClick={cancelCreate}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Vendor Name"
                placeholder="e.g., Fresh Foods Co."
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                error={errors.vendor_name}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="vendor@example.com"
                value={formData.vendor_email}
                onChange={(e) => setFormData({ ...formData, vendor_email: e.target.value })}
                error={errors.vendor_email}
              />

              <FormInput
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={formData.vendor_phone}
                onChange={(e) => setFormData({ ...formData, vendor_phone: e.target.value })}
                error={errors.vendor_phone}
              />

              <FormInput
                label="Address"
                placeholder="Complete address"
                value={formData.vendor_address}
                onChange={(e) => setFormData({ ...formData, vendor_address: e.target.value })}
                error={errors.vendor_address}
              />

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
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Vendors List</span>
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
              { key: "vendor_name", label: "Vendor Name", width: "25%" },
              { key: "vendor_email", label: "Email", width: "25%" },
              { key: "vendor_phone", label: "Phone", width: "15%" },
              { key: "vendor_address", label: "Address", width: "20%" },
              {
                key: "id",
                label: "Actions",
                render: (_, row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(row)}
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
            data={vendors}
            searchableFields={["vendor_name", "vendor_email"]}
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
