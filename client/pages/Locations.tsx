import { useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";

interface Location {
  id: number;
  name: string;
  type: "Counter" | "Hostel" | "Block";
  capacity: number;
  incharge: string;
}

const mockLocations: Location[] = [
  { id: 1, name: "Counter A", type: "Counter", capacity: 100, incharge: "Raj Kumar" },
  { id: 2, name: "Counter B", type: "Counter", capacity: 80, incharge: "Priya Singh" },
  { id: 3, name: "Boys Hostel 1", type: "Hostel", capacity: 500, incharge: "Amit Sharma" },
  { id: 4, name: "Girls Hostel 1", type: "Hostel", capacity: 400, incharge: "Neha Patel" },
  { id: 5, name: "North Block", type: "Block", capacity: 300, incharge: "Vikram Desai" },
  { id: 6, name: "South Block", type: "Block", capacity: 250, incharge: "Anjali Gupta" },
  { id: 7, name: "Counter C", type: "Counter", capacity: 90, incharge: "Rohan Verma" },
];

export default function Locations() {
  const [locations, setLocations] = useState(mockLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Counter" as "Counter" | "Hostel" | "Block",
    capacity: 0,
    incharge: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingId(location.id);
      setFormData({
        name: location.name,
        type: location.type,
        capacity: location.capacity,
        incharge: location.incharge,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", type: "Counter", capacity: 0, incharge: "" });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Location name is required";
    if (!formData.type) newErrors.type = "Location type is required";
    if (formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    if (!formData.incharge.trim()) newErrors.incharge = "In-charge name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setLocations(
        locations.map((location) =>
          location.id === editingId ? { ...location, ...formData } : location
        )
      );
    } else {
      setLocations([
        ...locations,
        {
          id: Math.max(...locations.map((l) => l.id), 0) + 1,
          ...formData,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this location?")) {
      setLocations(locations.filter((location) => location.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Locations Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage distribution points (counters, hostels, blocks)
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        </div>

        <DataTable
          columns={[
            { key: "name", label: "Location Name" },
            {
              key: "type",
              label: "Type",
              render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {value}
                </span>
              ),
            },
            {
              key: "capacity",
              label: "Capacity",
              render: (value) => `${value} servings`,
            },
            { key: "incharge", label: "In-Charge" },
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
          data={locations}
          searchableFields={["name", "incharge"]}
          title="Locations List"
        />
      </div>

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? "Edit Location" : "Add New Location"}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Update" : "Add"}
      >
        <FormInput
          label="Location Name"
          placeholder="e.g., Counter A, Boys Hostel 1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <FormSelect
          label="Location Type"
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as "Counter" | "Hostel" | "Block",
            })
          }
          error={errors.type}
          options={[
            { value: "Counter", label: "Counter" },
            { value: "Hostel", label: "Hostel" },
            { value: "Block", label: "Block" },
          ]}
        />

        <FormInput
          label="Serving Capacity"
          type="number"
          min="1"
          placeholder="e.g., 100, 500"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
          }
          error={errors.capacity}
        />

        <FormInput
          label="In-Charge Person Name"
          placeholder="Full name"
          value={formData.incharge}
          onChange={(e) => setFormData({ ...formData, incharge: e.target.value })}
          error={errors.incharge}
        />
      </FormModal>
    </MainLayout>
  );
}
