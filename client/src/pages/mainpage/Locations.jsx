import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, X, MapPin } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function LocationsManagement() {
	const [locations, setLocations] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const confirmToastId = useRef(null);
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		type: "Counter",
		location: "",
		incharge: "",
		status: "Active",
	});
	const [errors, setErrors] = useState({});

	const API_URL = "/api/locations";

	useEffect(() => {
		fetch(API_URL)
			.then((res) => res.json())
			.then((data) => {
				setLocations(
					data.map((loc) => ({
						id: loc.id,
						name: loc.center,
						type: loc.type,
						location: loc.location,
						incharge: loc.incharge,
						status: loc.status,
					}))
				);
			})
			.catch(() => {
				toast.error("Failed to load locations");
			});
	}, []);

	const startCreate = () => {
		setEditingId(null);
		setFormData({
			name: "",
			type: "Counter",
			location: "",
			incharge: "",
			status: "Active",
		});
		setErrors({});
		setIsCreating(true);
	};

	const startEdit = (location) => {
		setEditingId(location.id);
		setFormData({
			name: location.name || "",
			type: location.type || "Counter",
			location: location.location || "",
			incharge: location.incharge || "",
			status: location.status || "Active",
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

		if (!formData.name.trim())
			newErrors.name = "Location name is required";
		if (!formData.type)
			newErrors.type = "Location type is required";
		if (!formData.incharge.trim())
			newErrors.incharge = "In-charge name is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const payload = {
			center: formData.name,
			type: formData.type,
			location: formData.location,
			incharge: formData.incharge,
			status: formData.status,
		};

		try {
			if (editingId) {
				await fetch(`${API_URL}/${editingId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				toast.success("Location updated successfully");
			} else {
				await fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				toast.success("Location added successfully");
			}
			// Refresh locations from backend
			fetch(API_URL)
				.then((res) => res.json())
				.then((data) => {
					setLocations(
						data.map((loc) => ({
							id: loc.id,
							name: loc.center,
							type: loc.type,
							location: loc.location,
							incharge: loc.incharge,
							status: loc.status,
						}))
					);
				});
			setIsCreating(false);
		} catch (err) {
			toast.error("Error saving location");
		}
	};

	const handleDelete = (id) => {
		if (confirmToastId.current) toast.dismiss(confirmToastId.current);
		confirmToastId.current = toast(
			<div>
				<div>Are you sure you want to delete this location?</div>
				<div className="mt-2 flex gap-2 justify-end">
					<button
						className="px-3 py-1 bg-red-600 text-white rounded"
						onClick={async () => {
							await fetch(`${API_URL}/${id}`, { method: "DELETE" });
							fetch(API_URL)
								.then((res) => res.json())
								.then((data) => {
									setLocations(
										data.map((loc) => ({
											id: loc.id,
											name: loc.center,
											type: loc.type,
											location: loc.location,
											incharge: loc.incharge,
											status: loc.status,
										}))
									);
								});
							setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
							toast.success("Location deleted");
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

	const handleBulkDelete = () => {
		if (selectedRows.length === 0) return;
		if (confirmToastId.current) toast.dismiss(confirmToastId.current);
		confirmToastId.current = toast(
			<div>
				<div>Are you sure you want to delete selected locations?</div>
				<div className="mt-2 flex gap-2 justify-end">
					<button
						className="px-3 py-1 bg-red-600 text-white rounded"
						onClick={async () => {
							await Promise.all(selectedRows.map(id => fetch(`${API_URL}/${id}`, { method: "DELETE" })));
							fetch(API_URL)
								.then((res) => res.json())
								.then((data) => {
									setLocations(
										data.map((loc) => ({
											id: loc.id,
											name: loc.center,
											type: loc.type,
											location: loc.location,
											incharge: loc.incharge,
											status: loc.status,
										}))
									);
								});
							setSelectedRows([]);
							toast.success("Selected locations deleted");
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
							<MapPin className="w-6 h-6 text-blue-900" />
							Locations Management
						</h1>
						<p className="text-blue-700 mt-2 text-md">
							Manage distribution points (counters)
						</p>
					</div>

					<Button
						onClick={startCreate}
						className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
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
								label="Center Name"
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
									setFormData({ ...formData, type: e.target.value })
								}
								options={[
									{ value: "Main Counter", label: "Main Counter" },
									{ value: "Counter", label: "Counter" },
								]}
								error={errors.type}
							/>

							<FormInput
								label="Location"
								value={formData.location}
								onChange={(e) =>
									setFormData({ ...formData, location: e.target.value })
								}
								error={errors.location}
							/>



							<FormInput
								label="In-Charge Person"
								value={formData.incharge}
								onChange={(e) =>
									setFormData({
										...formData,
										incharge: e.target.value,
									})
								}
								error={errors.incharge}
							/>

							<FormSelect
								label="Status"
								value={formData.status}
								onChange={(e) =>
									setFormData({ ...formData, status: e.target.value })
								}
								options={[
									{ value: "Active", label: "Active" },
									{ value: "Inactive", label: "Inactive" },
								]}
								error={errors.status}
							/>

							<div className="flex justify-end gap-3">
								<Button
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
						<span className="font-semibold">Locations List</span>
						<Button
							variant="destructive"
							disabled={selectedRows.length === 0}
							onClick={handleBulkDelete}
						>
							Delete Selected
						</Button>
					</div>
					<DataTable
						data={locations}
						searchableFields={["name", "incharge", "location", "status"]}
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
						columns={[
							{
								key: "sno",
								label: "S.No",
								render: (_value, _row, index) => <div className="fw-medium">{index + 1}</div>
							},
							{ key: "name", label: "Location Name" },
							{
								key: "type",
								label: "Type",
								render: (v) => (
									<span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
										{v}
									</span>
								),
							},
							{ key: "location", label: "Location" },
							{ key: "incharge", label: "In-Charge" },
							{
								key: "status",
								label: "Status",
								render: (v) => (
									<span className={`px-2 py-1 rounded text-xs ${v === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
										{v}
									</span>
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
					/>
				</div>
			</div>
		</MainLayout>
	);
}
