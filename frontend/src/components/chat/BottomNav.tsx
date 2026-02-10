import { Home, MessageSquare, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden safe-area-pb z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-transform duration-200",
                activeTab === item.id && "scale-110"
              )}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute -bottom-0 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
