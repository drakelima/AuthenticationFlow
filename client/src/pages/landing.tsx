import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Successfully signed in with Google!",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleRegister = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen-mobile flex flex-col justify-center px-4 py-8 bg-background-material">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-material rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-medium text-on-surface">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-on-surface-variant mt-2">
          {isLogin ? "Sign in to your account" : "Join us to get started"}
        </p>
      </div>

      {/* Auth Form Card */}
      <Card className="material-shadow mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-6 text-on-surface">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>
          
          <form className="space-y-4">
            <FloatingInput
              label="Email Address"
              type="email"
              required
            />
            
            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-on-surface-variant hover:text-on-surface"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {!isLogin && (
              <div className="relative">
                <FloatingInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-on-surface-variant hover:text-on-surface"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}
            
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-on-surface-variant">
                  <input type="checkbox" className="mr-2 w-4 h-4 text-primary-material" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-primary-material hover:text-primary-dark">
                  Forgot password?
                </button>
              </div>
            )}
            
            <Button
              type="button"
              onClick={isLogin ? handleLogin : handleRegister}
              className="btn-primary w-full py-4 font-medium"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
          
          {/* Google Sign In */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-on-surface-variant">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full mt-4 py-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-on-surface-variant">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-material hover:text-primary-dark font-medium"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center">
        <p className="text-on-surface-variant text-sm">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
