import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle, MapPin, Package, Star } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const quickActions = [
  { id: "umrah", label: "Ritual Guide", icon: Star },
  { id: "hajj", label: "Ask Questions", icon: HelpCircle },
  { id: "hotel", label: "Ziyarat Info", icon: MapPin },
  { id: "flight", label: "AI Chat", icon: MessageCircle },
  { id: "packages", label: "Hajj and Umrah", icon: MessageCircle },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
      {quickActions.map((action) => (
        <Button
          key={action.id}
          variant="quickAction"
          size="quickAction"
          onClick={() => onAction(action.id)}
          className="flex-shrink-0 flex-col gap-1 min-w-[80px]"
        >
          <action.icon className="w-5 h-5 text-primary" />
          <span className="whitespace-nowrap">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
