import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, User, Lock, Shield, Download, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { BottomNavigation } from "@/components/bottom-navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { updateUserDocument, signOutUser, getFirebaseErrorMessage } from "@/lib/firebase";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

type UpdateProfile = z.infer<typeof updateProfileSchema>;

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();


  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Set form values when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfile) => {
      if (!user?.id) throw new Error("User not authenticated");
      await updateUserDocument(user.id, data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Perfil Atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });
      // Refresh auth context by forcing re-fetch
      window.location.reload();
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      toast({
        title: "Erro ao Atualizar",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logout Realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      toast({
        title: "Erro no Logout",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (data: UpdateProfile) => {
    updateProfileMutation.mutate(data);
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
          <h1 className="text-xl font-medium">Profile</h1>
          <button className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4 space-y-6 pb-nav">
        {/* Profile Header */}
        <Card className="material-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-primary-material rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-on-surface">
              {user?.displayName || user?.email || "user@example.com"}
            </h2>
            <p className="text-on-surface-variant mt-1">
              Member since {new Date(user?.createdAt || new Date()).getFullYear()}
            </p>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="material-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Personal Information</h3>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FloatingInput
                label="Full Name"
                error={form.formState.errors.name?.message}
                {...form.register("name")}
              />
              
              <FloatingInput
                label="Phone Number"
                type="tel"
                error={form.formState.errors.phone?.message}
                {...form.register("phone")}
              />
              
              <FloatingInput
                label="Email Address"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
              
              <Button
                type="submit"
                className="btn-primary w-full py-4 font-medium"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="material-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Security</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => toast({
                  title: "Password Management",
                  description: "Password changes are managed through your Google account.",
                })}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-primary-material" />
                  <span className="text-on-surface">Password Management</span>
                </div>
                <span className="text-on-surface-variant">›</span>
              </button>
              
              <button 
                onClick={() => toast({
                  title: "Two-Factor Authentication",
                  description: "2FA is managed through your Google account security settings.",
                })}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-primary-material" />
                  <span className="text-on-surface">Two-Factor Authentication</span>
                </div>
                <span className="text-on-surface-variant">›</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="material-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">Account</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-primary-material" />
                  <span className="text-on-surface">Download My Data</span>
                </div>
                <span className="text-on-surface-variant">›</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-error" />
                  <span className="text-error">Delete Account</span>
                </div>
                <span className="text-on-surface-variant">›</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation onLogout={handleLogout} />
    </div>
  );
}
