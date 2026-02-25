import { useState, useEffect } from "react";
import { Trash2, Plus, Edit2, X, CheckCircle2, UserPlus, Users, Shield, Mail, Key, MapPin } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import FormInput from "@/components/FormInput.jsx";
import FormSelect from "@/components/FormSelect.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";

const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "CounterOperator", label: "CounterOperator" }
];

const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
];

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        user_id: "",
        password: "",
        role: "",
        counter: "",
        status: "Active",
    });
    const [errors, setErrors] = useState({});

    // Fetch initial data
    useEffect(() => {
        fetchUsers();
        fetchLocations();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/users`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('/api/locations');
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const startCreate = () => {
        setFormData({
            name: "",
            email: "",
            user_id: "",
            password: "",
            role: "",
            counter: "Main Counter",
            status: "Active",
        });
        setEditingId(null);
        setErrors({});
        setIsCreating(true);
    };

    const startEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            user_id: user.user_id,
            password: "", // Don't show password
            role: user.role,
            counter: user.counter || "",
            status: user.status,
        });
        setEditingId(user.id);
        setErrors({});
        setIsCreating(true);
    };

    const handleDelete = (id) => {
        toast("Are you sure you want to delete this user?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const response = await fetch(`/api/users/${id}`, {
                            method: 'DELETE',
                        });

                        if (response.ok) {
                            toast.success("User deleted successfully", {
                                icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
                            });
                            fetchUsers();
                        } else {
                            const error = await response.json();
                            toast.error(error.error || 'Failed to delete user');
                        }
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        toast.error('Failed to delete user');
                    }
                }
            },
            cancel: {
                label: "Cancel"
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.user_id) newErrors.user_id = "User ID is required";
        if (!editingId && !formData.password) newErrors.password = "Password is required";
        if (!formData.role) newErrors.role = "Role is required";
        if (!formData.counter) newErrors.counter = "Counter access is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const url = editingId ? `/api/users/${editingId}` : `/api/users`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(`User ${editingId ? 'updated' : 'created'} successfully`);
                fetchUsers();
                setIsCreating(false);
            } else {
                const error = await response.json();
                toast.error(error.error || `Failed to ${editingId ? 'update' : 'create'} user`);
            }
        } catch (error) {
            console.error(`Error ${editingId ? 'updating' : 'creating'} user:`, error);
            toast.error(`Error ${editingId ? 'updating' : 'creating'} user`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-start animate-fadeInDown">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-900" />
                            User Management
                        </h1>
                        <p className="text-blue-700 mt-2 text-md">Control access and manage team credentials</p>
                    </div>
                    <Button
                        onClick={startCreate}
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                        <UserPlus className="w-5 h-5" />
                        Create New User
                    </Button>
                </div>

                {isCreating && (
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl animate-scaleIn relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    {editingId ? <Edit2 className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
                                </div>
                                <h2 className="text-md font-bold text-slate-600">
                                    {editingId ? 'Edit Team Member' : 'Add New Member'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <FormInput
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    error={errors.name}
                                    placeholder="Enter member's full name"
                                    icon={<Users className="w-4 h-4 text-slate-400" />}
                                />

                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    error={errors.email}
                                    placeholder="Member's official email"
                                    icon={<Mail className="w-4 h-4 text-slate-400" />}
                                />

                                <FormSelect
                                    label="System Role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    error={errors.role}
                                    options={roleOptions}
                                    icon={<Shield className="w-4 h-4 text-slate-400" />}
                                />

                                <FormSelect
                                    label="Counter Access"
                                    value={formData.counter}
                                    onChange={(e) => setFormData({ ...formData, counter: e.target.value })}
                                    error={errors.counter}
                                    options={locations.map(loc => ({ value: loc.center, label: `${loc.center} - ${loc.location}` }))}
                                    icon={<MapPin className="w-4 h-4 text-slate-400" />}
                                />
                            </div>

                            <div className="space-y-6">
                                <FormInput
                                    label="User ID / Login ID"
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    error={errors.user_id}
                                    placeholder="Unique ID for login"
                                    icon={<UserPlus className="w-4 h-4 text-slate-400" />}
                                />

                                <FormInput
                                    label={editingId ? "New Password (Optional)" : "Password"}
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    error={errors.password}
                                    placeholder={editingId ? "Leave blank to keep current" : "Set strong password"}
                                    icon={<Key className="w-4 h-4 text-slate-400" />}
                                />

                                <FormSelect
                                    label="Account Status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    error={errors.status}
                                    options={statusOptions}
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-6 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreating(false)}
                                    className="px-8 h-12 rounded-xl"
                                    disabled={loading}
                                >
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-10 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : (editingId ? 'Update Permanent Account' : 'Register New Member')}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-50 p-6 shadow-xl animate-slideInUp">
                    <DataTable
                        columns={[
                            {
                                key: "name",
                                label: "Member",
                                render: (value, row) => (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {value.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{value}</p>
                                            <p className="text-xs text-slate-500 lowercase">{row.email}</p>
                                        </div>
                                    </div>
                                )
                            },
                            { key: "user_id", label: "Login ID" },
                            { key: "counter", label: "Counter", render: (value) => <span className="text-sm font-medium text-slate-700">{value}</span> },
                            {
                                key: "role",
                                label: "Role",
                                render: (value) => (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${value === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                        value === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {value}
                                    </span>
                                )
                            },
                            {
                                key: "status",
                                label: "Account Status",
                                render: (value) => (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${value === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                        <span className={`text-sm font-medium ${value === 'Active' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            {value}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                key: "id",
                                label: "Operations",
                                render: (_, row) => (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(row)}
                                            className="p-2.5 hover:bg-blue-50 rounded-xl text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                            title="Modify User"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(row.id)}
                                            className="p-2.5 hover:bg-rose-50 rounded-xl text-rose-600 transition-all border border-transparent hover:border-rose-100"
                                            title="Delete Account"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        data={users}
                        searchableFields={["name", "email", "user_id", "counter"]}
                        title="Staff Directory"
                    />
                </div>
            </div>
        </MainLayout>
    );
}