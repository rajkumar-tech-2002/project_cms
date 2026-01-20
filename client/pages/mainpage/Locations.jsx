import { useState } from "react";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";

const mockLocations = [
	{
		id: 1,
		name: "Counter A",
		type: "Counter",
		capacity: 100,
		incharge: "Raj Kumar",
	},
	{
		id: 2,
		name: "Counter B",
		type: "Counter",
		capacity: 80,
		incharge: "Priya Singh",
	},
	{
		id: 3,
		name: "Boys Hostel 1",
		type: "Hostel",
		capacity: 500,
		incharge: "Amit Sharma",
	},
	{
		id: 4,
		name: "Girls Hostel 1",
		type: "Hostel",
		capacity: 400,
		incharge: "Neha Patel",
	},
	{
		id: 5,
		name: "North Block",
		type: "Block",
		capacity: 300,
		incharge: "Vikram Desai",
	},
	{
		id: 6,
		name: "South Block",
		type: "Block",
		capacity: 250,
		incharge: "Anjali Gupta",
	},
	{
		id: 7,
		name: "Counter C",
		type: "Counter",
		capacity: 90,
		incharge: "Rohan Verma",
	},
];

export default function Locations() {
	const [locations, setLocations] = useState(mockLocations);
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		type: "Counter",
		capacity: 0,
		incharge: "",
	});
	const [errors, setErrors] = useState({});

	const startCreate = () => {
		setEditingId(null);
		setFormData({ name: "", type: "Counter", capacity: 0, incharge: "" });
		setErrors({});
		setIsCreating(true);
	};

	const startEdit = (location) => {
		setEditingId(location.id);
		setFormData({
			name: location.name,
			type: location.type,
			capacity: location.capacity,
			incharge: location.incharge,
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
		if (!formData.name.trim()) newErrors.name = "Location name is required";
		if (!formData.type) newErrors.type = "Location type is required";
		if (formData.capacity <= 0)
			newErrors.capacity = "Capacity must be greater than 0";
		if (!formData.incharge.trim())
			newErrors.incharge = "In-charge name is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
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
		setIsCreating(false);
	};

	const handleDelete = (id) => {
		if (confirm("Are you sure you want to delete this location?")) {
			setLocations(locations.filter((location) => location.id !== id));
		}
	};

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-start animate-fadeInDown">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Locations Management
						</h1>
						<p className="text-gray-600 mt-2 text-lg">
							Manage distribution points (counters, hostels, blocks)
						</p>
					</div>
					<Button
						onClick={startCreate}
						className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
					>
						<Plus className="w-4 h-4" />
						Add Location
					</Button>
				</div>

				{isCreating && (
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-white p-6 shadow-lg hover:shadow-xl transition-all animate-slideInUp">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-foreground">
								{editingId ? "Edit Location" : "Add New Location"}
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
								label="Location Name"
								placeholder="e.g., Counter A, Boys Hostel 1"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								error={errors.name}
							/>

							<FormSelect
								label="Location Type"
								value={formData.type}
								onChange={(e) =>
									setFormData({
										...formData,
										type: e.target.value,
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
									setFormData({
										...formData,
										capacity: parseInt(e.target.value) || 0,
									})
								}
								error={errors.capacity}
							/>

							<FormInput
								label="In-Charge Person Name"
								placeholder="Full name"
								value={formData.incharge}
								onChange={(e) =>
									setFormData({ ...formData, incharge: e.target.value })
								}
								error={errors.incharge}
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
								render: (v) => `${v} servings`,
							},
							{ key: "incharge", label: "In-Charge" },
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
						data={locations}
						searchableFields={["name", "incharge"]}
						title="Locations List"
					/>
				</div>
			</div>
		</MainLayout>
	);
}
