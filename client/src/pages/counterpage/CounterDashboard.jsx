import { useState, useEffect } from "react";
import { Package, TrendingUp, TrendingDown, LayoutDashboard, ShoppingBag, History, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import MainLayout from "@/components/MainLayout.jsx";
import StatsCard from "@/components/StatsCard.jsx";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function CounterDashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [stats, setStats] = useState({
        todaySales: 0,
        totalItems: 0,
        pendingOrders: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.counter) {
            fetchDashboardData();
        }
    }, [user.counter]);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`/api/dashboard/counter?counter=${encodeURIComponent(user.counter)}`);
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setChartData(data.chartData);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                            <LayoutDashboard className="w-8 h-8 text-blue-600" />
                            {user.counter} Management Portal
                        </h1>
                        <p className="text-blue-700 mt-2 text-md">
                            Welcome back, {user.name}! Track your sales and inventory performance.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/counter/items">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all font-medium text-sm shadow-md">
                                <ShoppingBag className="w-4 h-4" />
                                Start Selling
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Today's Sales"
                        value={stats.todaySales}
                        icon={TrendingUp}
                        color="green"
                        suffix="total units"
                    />
                    <StatsCard
                        title="Items in Stock"
                        value={stats.totalItems}
                        icon={Package}
                        color="blue"
                        suffix="available types"
                    />
                    <StatsCard
                        title="Received Today"
                        value={stats.pendingOrders}
                        icon={TrendingDown}
                        color="orange"
                        suffix="batches"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-blue-50 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 text-lg">Sales Trend (Last 7 Days)</h3>
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-full">LIVE DATA</span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#3b82f6"
                                        radius={[6, 6, 0, 0]}
                                        barSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subdued Shortcuts Section */}
                    <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-slate-800 font-bold text-xl mb-2">Service Shortcuts</h3>
                            <p className="text-slate-500 text-sm mb-6">Access your frequently used tools.</p>

                            <div className="space-y-3">
                                <Link to="/counter/items" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <ShoppingBag className="w-5 h-5 text-blue-600 group-hover:text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-slate-700 font-bold text-sm">Sale Panel</p>
                                            <p className="text-slate-500 text-xs">Record new sales</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1" />
                                </Link>

                                <Link to="/counter/reports" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                            <History className="w-5 h-5 text-purple-600 group-hover:text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-slate-700 font-bold text-sm">Reports</p>
                                            <p className="text-slate-500 text-xs">View sales history</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 transition-all transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 text-center">
                            <p className="text-slate-400 text-xs italic">Session active for {user.counter}</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
