import { useState, useEffect } from "react";
import { FileText, Search, Calendar, Download, RefreshCcw, TrendingUp, ShoppingBag, Boxes, AlertCircle } from "lucide-react";
import MainLayout from "@/components/MainLayout.jsx";
import DataTable from "@/components/DataTable.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "sonner";

export default function CounterReports() {
    const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [salesData, setSalesData] = useState([]);
    const [summary, setSummary] = useState({ total_sold: 0, total_revenue: 0, total_transactions: 0 });
    const [stockStatus, setStockStatus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (user.counter) {
            fetchAllReportData();
        }
    }, [user.counter, startDate, endDate]);

    const fetchAllReportData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Sales List
            const reportUrl = `/api/sales/report?counter=${encodeURIComponent(user.counter)}&startDate=${startDate}&endDate=${endDate}`;
            const reportRes = await fetch(reportUrl);
            if (reportRes.ok) {
                const data = await reportRes.json();
                setSalesData(data);
            }

            // 2. Fetch Summary Statistics & Current Stock
            const summaryUrl = `/api/sales/report-summary?counter=${encodeURIComponent(user.counter)}&startDate=${startDate}&endDate=${endDate}`;
            const summaryRes = await fetch(summaryUrl);
            if (summaryRes.ok) {
                const data = await summaryRes.json();
                setSummary(data.summary);
                setStockStatus(data.stock);
            }
        } catch (error) {
            console.error("Report Fetch Error:", error);
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (salesData.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Define Headers
        const headers = ["TRANSACTION ID", "DATE", "TIME", "ITEM No.", "PRODUCT NAME", "QTY", "UNIT PRICE", "TOTAL AMOUNT"];

        // Format Rows
        const rows = salesData.map(s => {
            const dateObj = new Date(s.sale_date);
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const yyyy = dateObj.getFullYear();
            const formattedDate = `${dd}-${mm}-${yyyy}`;

            let hours = dateObj.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes} ${ampm}`;

            return [
                s.id,
                formattedDate,
                formattedTime,
                s.item_no || 'N/A',
                s.item_name.toUpperCase(),
                s.quantity,
                s.price,
                (s.quantity * s.price).toFixed(2)
            ];
        });

        // Create CSV Content with proper escaping
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(val => `"${val}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        // Dynamic filename with counter and date
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `Sales_Report_${user.counter}_${today}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Report downloaded successfully");
    };

    return (
        <MainLayout>
            <div className="space-y-4 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-blue-50 shadow-sm gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                                Counter Analytics - {user.counter}
                            </h1>
                            <p className="text-slate-500 text-xs font-medium">
                                Monitoring sales performance and shelf inventory
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={fetchAllReportData}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 rounded-lg gap-2 h-9"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">Sync Data</span>
                        </Button>
                        <Button onClick={handleExport} size="sm" className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg gap-2 h-9">
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Export CSV</span>
                        </Button>
                    </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filter Card */}
                    <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Date Range</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <div className="relative">
                                <span className="absolute -top-1.5 left-2 px-1 bg-white text-[9px] font-black text-blue-500 uppercase z-10">From</span>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-9 text-xs border-slate-100 rounded-lg focus:ring-blue-500 w-full pt-1"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute -top-1.5 left-2 px-1 bg-white text-[9px] font-black text-slate-400 uppercase z-10">To</span>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-9 text-xs border-slate-100 rounded-lg focus:ring-blue-500 w-full pt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Card 1: Revenue */}
                    <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex items-center gap-4 group hover:border-green-200 transition-colors">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Period Revenue</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-800">₹{parseFloat(summary.total_revenue || 0).toLocaleString()}</span>
                                <span className="text-xs text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded uppercase">Live</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card 2: Sales */}
                    <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-colors">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Units Sold</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-800">{summary.total_sold || 0}</span>
                                <span className="text-xs text-slate-400 font-medium">items moved</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card 3: Stock */}
                    <div className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex items-center gap-4 group hover:border-purple-200 transition-colors">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <Boxes className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Active SKU</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-800">{stockStatus.length}</span>
                                <span className="text-xs text-slate-400 font-medium font-bold">on shelf</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Recent Sales Log Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <h3 className="font-bold text-slate-800 text-lg">Recent Sales Log</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase tracking-wider">
                                    {salesData.length} entries
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <DataTable
                                columns={[
                                    {
                                        key: "sale_date",
                                        label: "Date",
                                        render: (val) => {
                                            const date = new Date(val);
                                            return (
                                                <span className="font-bold text-slate-600 text-[12px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                                    {String(date.getDate()).padStart(2, '0')}-{String(date.getMonth() + 1).padStart(2, '0')}-{date.getFullYear()}
                                                </span>
                                            )
                                        }
                                    },
                                    {
                                        key: "sale_date",
                                        label: "Time",
                                        render: (val) => {
                                            const date = new Date(val);
                                            let hours = date.getHours();
                                            const ampm = hours >= 12 ? 'PM' : 'AM';
                                            hours = hours % 12 || 12;
                                            const minutes = String(date.getMinutes()).padStart(2, '0');
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex flex-col items-center justify-center border border-blue-100 shadow-sm">
                                                        <span className="text-[11px] font-black text-blue-600 leading-none">{hours}:{minutes}</span>
                                                        <span className="text-[8px] font-black text-blue-400 uppercase mt-0.5">{ampm}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    },
                                    {
                                        key: "item_name",
                                        label: "Product",
                                        render: (val) => <span className="font-bold text-slate-700 text-xs tracking-tight uppercase px-1">{val}</span>
                                    },
                                    {
                                        key: "quantity",
                                        label: "Qty Sold",
                                        render: (val) => (
                                            <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg inline-block shadow-inner">
                                                <span className="font-black text-slate-800 text-xs">{val}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        key: "total",
                                        label: "Amount Received",
                                        render: (_, row) => (
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                                <span className="font-black text-blue-800 text-sm">
                                                    ₹{(row.quantity * row.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        )
                                    }
                                ]}
                                data={salesData}
                                searchableFields={["item_name"]}
                            />
                        </div>
                    </div>

                    {/* Shelf Status Card */}
                    <div className="bg-white rounded-3xl border border-indigo-50 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-indigo-50 flex justify-between items-center bg-gradient-to-r from-indigo-50/40 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                <h3 className="font-bold text-slate-800 text-lg">Shelf Live Status</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                                    AUTO-SYNC CAPTURE
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <DataTable
                                columns={[
                                    {
                                        key: "item_no",
                                        label: "SKU / Code",
                                        render: (val) => <span className="text-[12px] font-mono font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg">{val}</span>
                                    },
                                    {
                                        key: "item_name",
                                        label: "Item Name",
                                        render: (val) => <span className="font-black text-slate-700 text-xs uppercase letter-spacing-wide tracking-tight">{val}</span>
                                    },
                                    {
                                        key: "available_quantity",
                                        label: "Inventory Level & Status",
                                        render: (val) => (
                                            <div className="flex flex-col gap-2 max-w-[450px]">
                                                <div className="flex justify-between items-center px-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-black ${val < 10 ? 'text-red-600' : 'text-indigo-700'}`}>{val} units</span>
                                                        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Current Stock</span>
                                                    </div>
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shadow-sm ${val < 10 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                                        {val < 10 ? 'LOW STOCK' : 'IN STOCK'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ease-in-out shadow-sm rounded-full ${val < 10 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-indigo-400 to-indigo-600'}`}
                                                        style={{ width: `${Math.min(100, Math.max(6, (val / 100) * 100))}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )
                                    }
                                ]}
                                data={stockStatus}
                            />
                            {stockStatus.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300 bg-slate-50/40 rounded-3xl border-2 border-dashed border-slate-100 m-2">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <Boxes className="w-8 h-8 opacity-20" />
                                    </div>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Shelf is empty</p>
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Pending distribution from kitchen...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
