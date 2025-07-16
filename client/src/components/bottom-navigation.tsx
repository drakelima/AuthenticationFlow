import { Home, User, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BottomNavigationProps {
  onLogout: () => void;
}

export function BottomNavigation({ onLogout }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You will be redirected to login page",
    });
    setTimeout(() => {
      onLogout();
    }, 500);
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      onClick: () => setLocation("/"),
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      onClick: () => setLocation("/profile"),
    },
    {
      icon: LogOut,
      label: "Logout",
      path: "",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 material-shadow pb-safe-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "bottom-nav-item flex flex-col items-center justify-center p-2 flex-1",
                isActive && "active"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
