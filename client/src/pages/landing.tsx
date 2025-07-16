import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
