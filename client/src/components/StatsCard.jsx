import { cn } from "@/lib/utils.js";

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  suffix,
}) {
  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className={cn(
              "text-2xl font-bold",
              color === "emerald" ? "text-emerald-700" :
                color === "red" ? "text-red-700" : "text-foreground"
            )}>
              {value}
            </p>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium mt-2",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
