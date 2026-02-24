import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  variant?: "default" | "primary" | "accent" | "berry";
}

const variantStyles = {
  default: "glass-card",
  primary: "gradient-primary text-primary-foreground",
  accent: "gradient-accent text-secondary",
  berry: "gradient-berry text-primary-foreground",
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, variant = "default" }: StatCardProps) => {
  return (
    <div className={`rounded-xl p-5 animate-slide-up ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${variant === "default" ? "text-muted-foreground" : "opacity-80"}`}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${variant === "default" ? "text-muted-foreground" : "opacity-70"}`}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${variant === "default" ? "bg-primary/10" : "bg-white/10"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
