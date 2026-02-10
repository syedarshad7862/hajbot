import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, Info } from "lucide-react";

interface SystemNotificationProps {
  type: "success" | "pending" | "error" | "info";
  message: string;
}

const icons = {
  success: CheckCircle,
  pending: Clock,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
};

const SystemNotification = ({ type, message }: SystemNotificationProps) => {
  const Icon = icons[type];

  return (
    <div className="flex justify-center my-4 animate-fade-in">
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium",
          colors[type]
        )}
      >
        <Icon className="w-4 h-4" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default SystemNotification;
