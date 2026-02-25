import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Monitor, Boxes, RefreshCw, Calendar, Filter } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

const CATEGORIES = [
    { value: "South Indian Tiffin", label: "🥞 South Indian Tiffin / Breakfast" },
    { value: "South Indian Meals", label: "🍛 South Indian Meals" },
    { value: "Snacks", label: "🍟 Snacks & Evening Tiffin" },
    { value: "Fast Food", label: "🍜 Fast Food" },
    { value: "Beverages", label: "🥤 Beverages" },
    { value: "Desserts", label: "🍨 Desserts" },
    { value: "Others", label: "🍽️ Others" }
];

export default function CounterMonitor() {
    const today = new Date().toISOString().split('T')[0];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        from: today,
        to: today
    });

    useEffect(() => {
        fetchMonitorData();
    }, []);

    const fetchMonitorData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/sales/monitor?startDate=${dateRange.from}&endDate=${dateRange.to}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
                toast.success("Monitor data updated");
            }
        } catch (error) {
            toast.error("Failed to fetch monitoring data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/50 p-4 sm:p-6 rounded-3xl border border-white/20 backdrop-blur-xl shadow-xl shadow-blue-900/5 animate-fadeInDown">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center gap-2">
                            <Monitor className="w-6 h-6 text-blue-900" />
                            Counter Stock Monitor
                        </h1>
                        <p className="text-blue-700 mt-1 text-sm sm:text-md">
                            Live tracking of assigned stock vs actual sales across all counters.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 sm:p-2 rounded-2xl border border-blue-50 shadow-inner w-full sm:w-auto">
                        <div className="flex items-center gap-2 px-3 sm:border-r border-blue-50 w-full sm:w-auto justify-center sm:justify-start shrink-0">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold text-blue-800 tracking-wider uppercase whitespace-nowrap">Range:</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                            <div className="flex items-center gap-2 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl w-full sm:w-auto justify-center">
                                <Input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                    className="w-full sm:w-32 lg:w-40 border-0 bg-transparent focus-visible:ring-0 text-slate-600 font-bold text-xs sm:text-base p-0 text-center sm:text-left"
                                />
                            </div>
                            <span className="text-sm font-bold text-blue-800 tracking-wider uppercase whitespace-nowrap shrink-0">To:</span>
                            <div className="flex items-center gap-2 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl w-full sm:w-auto justify-center">
                                <Input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                    className="w-full sm:w-32 lg:w-40 border-0 bg-transparent focus-visible:ring-0 text-slate-600 font-bold text-xs sm:text-base p-0 text-center sm:text-left"
                                />
                            </div>
                            <Button
                                size="sm"
                                onClick={fetchMonitorData}
                                disabled={loading}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 mt-2 sm:mt-0"
                            >
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Filter className="w-4 h-4 text-white" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-blue-50 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Total Assigned</p>
                            <p className="text-lg sm:text-2xl font-bold text-blue-900 truncate">
                                {data.reduce((acc, curr) => acc + curr.assigned, 0)} <span className="text-xs sm:text-sm font-normal text-slate-400">units</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-green-50 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Total Sold</p>
                            <p className="text-lg sm:text-2xl font-bold text-green-900 truncate">
                                {data.reduce((acc, curr) => acc + curr.sold, 0)} <span className="text-xs sm:text-sm font-normal text-slate-400">units</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-purple-50 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Remaining</p>
                            <p className="text-lg sm:text-2xl font-bold text-purple-900 truncate">
                                {data.reduce((acc, curr) => acc + curr.remaining, 0)} <span className="text-xs sm:text-sm font-normal text-slate-400">units</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-6 rounded-3xl shadow-lg shadow-blue-200 flex items-center gap-4 transition-all hover:scale-[1.02]">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-sm text-blue-100 font-medium uppercase tracking-wider">Total Revenue</p>
                            <p className="text-lg sm:text-2xl font-bold text-white truncate">
                                ₹{data.reduce((acc, curr) => acc + (curr.revenue || 0), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-xl">
                    <DataTable
                        columns={[
                            {
                                key: "counter_name",
                                label: "Counter",
                                render: (val) => <span className="font-bold text-slate-700 uppercase">{val}</span>
                            },
                            { key: "item_no", label: "Item No" },
                            {
                                key: "category",
                                label: "Category",
                                render: (val) => {
                                    const cat = CATEGORIES.find(c => c.value === val);
                                    return <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 uppercase tracking-tighter">
                                        {cat ? cat.label.split(' ').slice(1).join(' ') : 'Others'}
                                    </span>
                                }
                            },
                            { key: "item_name", label: "Product Name" },
                            {
                                key: "price",
                                label: "Rate (₹)",
                                render: (val) => <span className="text-slate-500 font-medium">₹{parseFloat(val || 0).toFixed(2)}</span>
                            },
                            {
                                key: "assigned",
                                label: "Issued",
                                render: (val) => <span className="text-blue-600 font-bold">{val}</span>
                            },
                            {
                                key: "sold",
                                label: "Sold",
                                render: (val) => <span className="text-green-600 font-bold">{val}</span>
                            },
                            {
                                key: "revenue",
                                label: "Revenue",
                                render: (val) => <span className="text-indigo-600 font-black">₹{parseFloat(val || 0).toFixed(2)}</span>
                            },
                            {
                                key: "last_issue",
                                label: "Last Issue",
                                render: (val) => val ? (
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                                        {new Date(val).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                    </span>
                                ) : <span className="text-[11px] font-bold text-slate-500 uppercase">N/A</span>
                            },
                            {
                                key: "last_sale",
                                label: "Last Sale",
                                render: (val) => val ? (
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                                        {new Date(val).toLocaleDateString('en-GB').replace(/\//g, '-')}
                                    </span>
                                ) : <span className="text-[11px] font-bold text-slate-500 uppercase">N/A</span>
                            },
                            {
                                key: "remaining",
                                label: "Live Stock",
                                render: (val) => (
                                    <div className="flex flex-col gap-1 min-w-[100px]">
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${val < 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${Math.min(100, (val / 50) * 100)}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-bold ${val < 5 ? 'text-red-600' : 'text-blue-700'}`}>
                                            {val} left
                                        </span>
                                    </div>
                                )
                            }
                        ]}
                        data={data}
                        searchableFields={["counter_name", "item_name"]}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
