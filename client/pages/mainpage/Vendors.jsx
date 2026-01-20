import { useState } from "react";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import { Button } from "@/components/ui/button.jsx";

const mockVendors = [
  {
    id: 1,
    name: "Fresh Foods Co.",
    email: "contact@freshfoods.com",
    phone: "9876543210",
    address: "123 Market Street, City",
    totalPurchases: 45,
  },
  {
    id: 2,
    name: "Organic Supplies",
    email: "info@organicsupply.com",
    phone: "8765432109",
    address: "456 Agricultural Road, Town",
    totalPurchases: 32,
  },
  {
    id: 3,
    name: "Quality Grains Ltd",
    email: "sales@qualitygrains.com",
    phone: "7654321098",
    address: "789 Warehouse Park, District",
    totalPurchases: 28,
  },
  {
    id: 4,
    name: "Premium Dairy",
    email: "orders@premiumdairy.com",
    phone: "6543210987",
    address: "321 Industrial Area, State",
    totalPurchases: 19,
  },
  {
    id: 5,
    name: "Spice Imports",
    email: "trade@spiceimports.com",
    phone: "5432109876",
    address: "654 Trade Zone, Region",
    totalPurchases: 15,
  },
];

export default function Vendors() {
  const [vendors, setVendors] = useState(mockVendors);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const startCreate = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setErrors({});
    setIsCreating(true);
  };

  const startEdit = (vendor) => {
    setEditingId(vendor.id);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
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
    if (!formData.name.trim()) newErrors.name = "Vendor name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setVendors(
        vendors.map((vendor) =>
          vendor.id === editingId ? { ...vendor, ...formData } : vendor
        )
      );
    } else {
      setVendors([
        ...vendors,
        {
          id: Math.max(...vendors.map((v) => v.id), 0) + 1,
          ...formData,
          totalPurchases: 0,
        },
      ]);
    }
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((vendor) => vendor.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start animate-fadeInDown">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="vendor@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <FormInput
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />

              <FormInput
                label="Address"
                placeholder="Complete address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
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
          <DataTable
            columns={[
              { key: "name", label: "Vendor Name", width: "25%" },
              { key: "email", label: "Email", width: "25%" },
              { key: "phone", label: "Phone", width: "15%" },
              { key: "address", label: "Address", width: "20%" },
              {
                key: "totalPurchases",
                label: "Total Purchases",
                render: (value) => `${value} orders`,
              },
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
            searchableFields={["name", "email"]}
            title="Vendors List"
          />
        </div>
      </div>
    </MainLayout>
  );
}
