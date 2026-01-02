import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartComponentProps {
  title: string;
  data: ChartData[];
  type: "line" | "bar";
  dataKeys: {
    key: string;
    color: string;
    label: string;
  }[];
  height?: number;
}

export default function ChartComponent({
  title,
  data,
  type,
  dataKeys,
  height = 300,
}: ChartComponentProps) {
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
