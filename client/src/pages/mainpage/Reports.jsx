import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  ShoppingCart,
  Truck,
  TrendingUp,
  Search,
  RefreshCw,
  Filter,
  ChartBar
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/DataTable";
import StatsCard from "@/components/StatsCard";
import MainLayout from "@/components/MainLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState({
    from: today,
    to: today
  });
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    sales: [],
    purchases: [],
    distributions: [],
    profitSummary: { total_sales: 0, total_purchase: 0 },
    counterSales: []
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/admin?startDate=${dateRange.from}&endDate=${dateRange.to}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
        toast.success("Reports updated for selected range");
      } else {
        toast.error("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Report fetch error:", error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const totalStats = {
    revenue: data.profitSummary?.total_sales || 0,
    purchases_cost: data.profitSummary?.total_purchase || 0,
    netProfit: (data.profitSummary?.total_sales || 0) - (data.profitSummary?.total_purchase || 0),
    itemsSold: data.sales.reduce((sum, s) => sum + parseInt(s.total_quantity || 0), 0)
  };

  const handleExport = (type) => {
    let exportData = [];
    let headers = [];
    let filename = "";
    let csvContent = "";

    if (type === 'sales') {
      exportData = data.sales;
      headers = ["Counter Name", "Item Name", "Item No", "Total Sold", "Total Revenue", "Last Sale"];
      filename = `Sales_Report_${dateRange.from}_to_${dateRange.to}.csv`;
    } else if (type === 'purchases') {
      exportData = data.purchases;
      headers = ["Order No", "Vendor", "Phone", "Date", "Details", "Status"];
      filename = `Purchase_Report_${dateRange.from}_to_${dateRange.to}.csv`;
    } else if (type === 'distributions') {
      exportData = data.distributions;
      headers = ["Issue No", "Counter", "Location", "Date", "Items Issued"];
      filename = `Distribution_Report_${dateRange.from}_to_${dateRange.to}.csv`;
    } else if (type === 'profit') {
      exportData = data.counterSales;
      headers = ["Counter Name", "Total Revenue", "Total Transactions"];
      filename = `Profit_Loss_Report_${dateRange.from}_to_${dateRange.to}.csv`;
    }

    if (exportData.length === 0) {
      toast.error("No data to export");
      return;
    }

    if (type === 'profit') {
      const summaryRows = [
        ["Profit/Loss Report Summary"],
        [`Period: ${dateRange.from} to ${dateRange.to}`],
        [`Total Sales Revenue: ₹${totalStats.revenue}`],
        [`Total Purchase Cost: ₹${totalStats.purchases_cost}`],
        [`Net Profit/Loss: ₹${totalStats.netProfit}`],
        [],
        ["Counter-wise Performance Breakdown"],
        headers
      ].map(row => row.join(",")).join("\n");

      const dataRows = exportData.map(item => [
        item.counter_name,
        item.revenue,
        item.transactions
      ].join(",")).join("\n");

      csvContent = summaryRows + "\n" + dataRows;
    } else {
      csvContent = [
        headers.join(","),
        ...exportData.map(item => {
          if (type === 'sales') {
            return [
              item.counter_name,
              item.item_name,
              item.item_no || 'N/A',
              item.total_quantity,
              item.total_revenue,
              new Date(item.last_sale).toLocaleDateString('en-GB').replace(/\//g, '-')
            ].join(",");
          } else if (type === 'purchases') {
            return [
              item.order_no,
              item.vendor_name,
              item.vendor_phone,
              new Date(item.purchase_date).toLocaleDateString('en-GB').replace(/\//g, '-'),
              `"${item.grocery_name_unit.replace(/"/g, '""')}"`,
              item.status
            ].join(",");
          } else if (type === 'distributions') {
            return [
              item.issue_no,
              item.counter_name,
              item.location,
              new Date(item.issue_date).toLocaleDateString('en-GB').replace(/\//g, '-'),
              `"${item.issued_items.replace(/"/g, '""')}"`
            ].join(",");
          }
        })
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Downloaded Successfully");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Counter Name", "Revenue Generated", "Total Sales"];
    const tableRows = [];

    data.counterSales.forEach(item => {
      const itemData = [
        item.counter_name,
        `Rs.${parseFloat(item.revenue).toLocaleString()}`,
        `${item.transactions} Orders`
      ];
      tableRows.push(itemData);
    });

    const logoUrl = "/api/purchases/logo";
    const collegeName = "NANDHA ENGINEERING COLLEGE (AUTONOMOUS)";
    const collegeDetails = "Erode – 638051";
    const canteenName = "Nandha Canteen";

    // Add Logo
    try {
      doc.addImage(logoUrl, 'PNG', 14, 10, 22, 19);
    } catch (e) {
      console.error("Could not add logo to PDF:", e);
    }

    // Add College Name
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text(collegeName, 45, 18);

    doc.setFontSize(12);
    doc.text(collegeDetails, 45, 24);

    // Add Canteen Name Subheading
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(canteenName, doc.internal.pageSize.getWidth() / 2, 32, {
      align: 'center'
    });

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(14, 40, 196, 40);

    // Add Report Title
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text("PROFIT/LOSS REPORT", 14, 50);

    // Add Date Info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(`Report Period: ${dateRange.from} to ${dateRange.to}`, 14, 56);

    // Add Summary Overview Title
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text("Summary Overview", 14, 70);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Sales Revenue:`, 14, 78);
    doc.text(`Rs.${parseFloat(totalStats.revenue).toLocaleString()}`, 100, 78);

    doc.text(`Total Purchase Cost:`, 14, 84);
    doc.text(`Rs.${parseFloat(totalStats.purchases_cost).toLocaleString()}`, 100, 84);

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    if (totalStats.netProfit >= 0) {
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(`Net Profit:`, 14, 94);
    } else {
      doc.setTextColor(220, 38, 38); // red-600
      doc.text(`Net Loss:`, 14, 94);
    }
    doc.text(`Rs.${parseFloat(Math.abs(totalStats.netProfit)).toLocaleString()}`, 100, 94);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');

    doc.line(14, 100, 196, 100);

    // Add Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 105,
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    doc.save(`Profit_Loss_Report_${dateRange.from}_to_${dateRange.to}.pdf`);
    toast.success("PDF Downloaded Successfully");
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header & Date Filter */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/50 p-4 sm:p-6 rounded-3xl border border-white/20 backdrop-blur-xl shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <ChartBar className="w-6 h-6 text-blue-900" />
              Admin Reports
            </h1>
            <p className="text-blue-700 mt-1 text-sm sm:text-md">Consolidated monitoring & analytics</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 sm:p-2 rounded-2xl border border-blue-50 shadow-inner w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 sm:border-r border-blue-50 w-full sm:w-auto justify-center sm:justify-start">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-wider">Range:</span>
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
              <span className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-wider">To:</span>
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
                onClick={fetchReports}
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 mt-2 sm:mt-0"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Filter className="w-4 h-4 text-white" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={`₹${parseFloat(totalStats.revenue).toLocaleString()}`}
            icon={TrendingUp}
            color="emerald"
          />
          <StatsCard
            title="Purchase Cost"
            value={`₹${parseFloat(totalStats.purchases_cost).toLocaleString()}`}
            icon={ShoppingCart}
            color="blue"
          />
          <StatsCard
            title="Net Profit/Loss"
            value={`₹${parseFloat(totalStats.netProfit).toLocaleString()}`}
            icon={FileText}
            color={totalStats.netProfit >= 0 ? "emerald" : "red"}
          />
          <StatsCard
            title="Items Sold"
            value={totalStats.itemsSold.toLocaleString()}
            icon={Truck}
            color="orange"
          />
        </div>

        {/* Main Tabs */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl overflow-hidden shadow-blue-900/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-50 border-b border-blue-50 gap-4">
            <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-blue-50 shadow-sm overflow-x-auto max-w-full scrollbar-hide no-scrollbar">
              {[
                { id: 'sales', label: 'Sales Summary', icon: TrendingUp },
                { id: 'profit', label: 'Profit/Loss', icon: FileText },
                { id: 'purchases', label: 'Purchase Log', icon: ShoppingCart },
                { id: 'distributions', label: 'Distribution Log', icon: Truck }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105"
                    : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-center sm:justify-end">
              <Button
                onClick={() => handleExport(activeTab)}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 font-bold gap-2 rounded-xl h-10"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </Button>

              {activeTab === 'profit' && (
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold gap-2 rounded-xl h-10"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </Button>
              )}
            </div>
          </div>

          <div className="p-0">
            {activeTab === 'sales' && (
              <DataTable
                columns={[
                  { key: "counter_name", label: "Counter" },
                  { key: "item_name", label: "Product" },
                  { key: "total_quantity", label: "Qty Sold", render: (val) => <span className="font-black text-blue-600">{val}</span> },
                  {
                    key: "total_revenue",
                    label: "Revenue",
                    render: (val) => (
                      <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        ₹{parseFloat(val).toLocaleString()}
                      </span>
                    )
                  },
                  {
                    key: "last_sale",
                    label: "Last Transaction",
                    render: (val) => (
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {new Date(val).toLocaleDateString('en-GB').replace(/\//g, '-')} {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )
                  }
                ]}
                data={data.sales}
              />
            )}

            {activeTab === 'profit' && (
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="text-emerald-700 text-sm font-black uppercase mb-2">Total Sales Revenue</h4>
                    <p className="text-3xl font-black text-emerald-900">₹{parseFloat(totalStats.revenue).toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="text-blue-700 text-sm font-black uppercase mb-2">Total Purchase Cost</h4>
                    <p className="text-3xl font-black text-blue-900">₹{parseFloat(totalStats.purchases_cost).toLocaleString()}</p>
                  </div>
                  <div className={`p-6 rounded-2xl border ${totalStats.netProfit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <h4 className={`text-sm font-black uppercase mb-2 ${totalStats.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {totalStats.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                    </h4>
                    <p className={`text-3xl font-black ${totalStats.netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                      ₹{parseFloat(Math.abs(totalStats.netProfit)).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-black text-slate-800 text-sm uppercase">Counter-wise Performance</h3>
                  </div>
                  <DataTable
                    columns={[
                      { key: "counter_name", label: "Counter Name" },
                      {
                        key: "revenue",
                        label: "Revenue Generated",
                        render: (val) => <span className="font-black text-emerald-600">₹{parseFloat(val).toLocaleString()}</span>
                      },
                      {
                        key: "transactions",
                        label: "Total Sales",
                        render: (val) => <span className="font-bold text-slate-600">{val} Orders</span>
                      }
                    ]}
                    data={data.counterSales}
                  />
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <DataTable
                columns={[
                  { key: "order_no", label: "Order #" },
                  {
                    key: "vendor_name",
                    label: "Vendor",
                    render: (val, row) => (
                      <div>
                        <p className="font-bold text-slate-800 uppercase">{val}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{row.vendor_phone}</p>
                      </div>
                    )
                  },
                  {
                    key: "purchase_date",
                    label: "Date",
                    render: (val) => (
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {new Date(val).toLocaleDateString('en-GB').replace(/\//g, '-')}
                      </span>
                    )
                  },
                  {
                    key: "grocery_name_unit",
                    label: "Purchased Items",
                    render: (val) => (
                      <p className="max-w-xs truncate text-[11px] text-slate-600 font-medium" title={val}>
                        {val}
                      </p>
                    )
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (val) => (
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${val === 'Received' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                        {val}
                      </span>
                    )
                  }
                ]}
                data={data.purchases}
              />
            )}

            {activeTab === 'distributions' && (
              <DataTable
                columns={[
                  { key: "issue_no", label: "Issue #" },
                  { key: "counter_name", label: "Destination" },
                  { key: "location", label: "Location" },
                  {
                    key: "issue_date",
                    label: "Date",
                    render: (val) => (
                      <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                        {new Date(val).toLocaleDateString('en-GB').replace(/\//g, '-')}
                      </span>
                    )
                  },
                  {
                    key: "issued_items",
                    label: "Items List",
                    render: (val) => (
                      <p className="max-w-xs truncate text-[11px] text-slate-600 font-medium italic" title={val}>
                        {val}
                      </p>
                    )
                  }
                ]}
                data={data.distributions}
              />
            )}

            {!loading && (activeTab === 'profit' ? data.counterSales : data[activeTab])?.length === 0 && (
              <div className="p-20 text-center bg-slate-50/30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-50 shadow-sm">
                  <Search className="w-8 h-8 text-blue-200" />
                </div>
                <h3 className="text-lg font-bold text-blue-900/50 uppercase tracking-widest">No Records Found</h3>
                <p className="text-slate-400 text-sm font-medium italic">Adjust the date range or filters above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
