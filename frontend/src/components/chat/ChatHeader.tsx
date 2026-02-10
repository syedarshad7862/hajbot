import { Plane, MoreVertical, LogIn, LogOut, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {User} from "@/types"
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onNewChat?: () => void;
  onOpenHistory?: () => void;
  isSidebarOpen?: boolean;
}

const ChatHeader = ({ user, onLogin, onLogout, onNewChat, isSidebarOpen }: ChatHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-primary px-4 py-3 shadow-soft">
      <div className={cn(
        "flex items-center justify-between transition-all",
        isSidebarOpen ? "md:pl-0" : "md:pl-10"
      )}>
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="relative w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-soft overflow-hidden">
            <div className="absolute inset-0 bg-gradient-gold opacity-20" />
            <Plane className="w-5 h-5 text-primary relative z-10" />
          </div>
          
          {/* Title & Status */}
          <div className="flex flex-col">
            <h1 className="text-primary-foreground font-serif text-lg font-bold leading-tight">
              Salaam Haji
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full pulse-ring" />
              </div>
              <span className="text-primary-foreground/80 text-xs">
                {user ? `Welcome, ${user.fullName || 'Traveler'}` : 'Travel Assistant • Online'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover">
            {user ? (
              <>
                <DropdownMenuItem onClick={onNewChat} className="cursor-pointer">
                  <MessageSquarePlus className="w-4 h-4 mr-2" />
                  New Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={onLogin} className="cursor-pointer">
                <LogIn className="w-4 h-4 mr-2" />
                Login / Sign Up
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
