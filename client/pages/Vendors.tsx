import { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
}

const mockVendors: Vendor[] = [
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingId(vendor.id);
      setFormData({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", phone: "", address: "" });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Vendor name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((vendor) => vendor.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendor Management</h1>
            <p className="text-muted-foreground mt-1">
              Add and manage vendors and suppliers
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        </div>

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
                    onClick={() => handleOpenModal(row)}
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

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Vendor" : "Add New Vendor"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Update" : "Add"}
      >
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
      </FormModal>
    </MainLayout>
  );
}
