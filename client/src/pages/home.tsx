import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, User, Settings, HelpCircle, Info, Check, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: pingData, isLoading } = useQuery({
    queryKey: ["/api/ping"],
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "No new notifications",
    });
  };

  // Handle unauthorized errors at page level
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen-mobile flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-material border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-mobile bg-background-material">
      {/* App Bar */}
      <div className="bg-primary-material text-white p-4 material-shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Home</h1>
          <button
            onClick={handleNotifications}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-nav">
        {/* Welcome Card */}
        <Card className="material-shadow">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-on-surface mb-2">Welcome back!</h2>
            <p className="text-on-surface-variant mb-4">
              {user?.name ? `Olá, ${user.name}!` : user?.displayName ? `Olá, ${user.displayName}!` : user?.email && `Olá, ${user.email}!`}
            </p>
            <p className="text-on-surface-variant mb-4">
              {pingData?.message === "pong" ? "API connection successful" : "Connecting to API..."}
            </p>
            <Button className="bg-primary-material hover:bg-primary-dark text-white">
              View All
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="material-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <User className="w-8 h-8 text-primary-material mb-2" />
                <span className="text-sm text-on-surface">Profile</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-8 h-8 text-primary-material mb-2" />
                <span className="text-sm text-on-surface">Settings</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-8 h-8 text-primary-material mb-2" />
                <span className="text-sm text-on-surface">Help</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Info className="w-8 h-8 text-primary-material mb-2" />
                <span className="text-sm text-on-surface">About</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="material-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-material rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface">Profile updated successfully</p>
                  <p className="text-xs text-on-surface-variant">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface">Logged in successfully</p>
                  <p className="text-xs text-on-surface-variant">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation onLogout={handleLogout} />
    </div>
  );
}
