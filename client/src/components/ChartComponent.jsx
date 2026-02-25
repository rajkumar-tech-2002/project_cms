import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export default function ChartComponent({
  title,
  data,
  type,
  dataKeys,
  height = 300,
}) {
  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            {dataKeys.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                name={item.label}
                strokeWidth={2}
                dot={{ fill: item.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : type === "pie" ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={dataKeys[0].key}
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            {dataKeys.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                fill={item.color}
                name={item.label}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
