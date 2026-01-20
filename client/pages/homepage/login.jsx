import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { 
  Utensils, 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Zap,
  Shield,
  Clock
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    let newErrors = {};
    if (!userId) newErrors.userId = "User Id is required";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length === 0) {
      // Handle login with userId and password
      navigate("/dashboard");
    } else {
      setErrors(newErrors);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Orders delivered in minutes"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data is encrypted & protected"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Track your order every second"
    }
  ];

  return (
    <div className="min-h-screen from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-black hover:bg-black/10 rounded-full p-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="w-full max-w-6xl relative z-10">
        <Card className="overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0 h-full">
            {/* Left Side - Image & Benefits */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden group">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
              </div>

              <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-12">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Utensils className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold">NEC Canteen</span>
                </div>

                {/* Hero Text */}
                <div className="space-y-6 mb-16">
                  <h2 className="text-4xl font-bold leading-tight">
                    Welcome to Campus Dining's Future
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Join thousands of students experiencing the fastest, most convenient campus ordering system.
                  </p>
                </div>

                {/* Illustration - Stylized Food Card */}
                <div className="relative mb-12">
                  <div className="relative w-full h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="space-y-4 text-center">
                      <Utensils className="w-24 h-24 text-white/40 mx-auto" />
                      <p className="text-white/60 font-medium">Delicious meals await you</p>
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3 group/benefit">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover/benefit:bg-white/20 transition-all">
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{benefit.title}</p>
                        <p className="text-sm text-white/70">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer text */}
              <div className="relative z-10 text-sm text-white/70">
                Join our community of 10,000+ happy students
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center p-8 sm:p-12 relative z-10">
              {/* Header */}
              <div className="space-y-2 mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg">
                  Sign in to your account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5 mb-6">
                {/* User Id Field */}
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-gray-700 font-semibold text-sm">
                    User Id
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="userId"
                      type="text"
                      placeholder="Enter your user id"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        if (errors.userId) setErrors({...errors, userId: ""});
                      }}
                      className={`h-12 pl-12 border-2 rounded-xl bg-white transition-all focus:bg-blue-50 ${
                        errors.userId
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.userId && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <span>●</span>
                      <span>{errors.userId}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({...errors, password: ""});
                      }}
                      className={`h-12 pl-12 pr-12 border-2 rounded-xl bg-white transition-all focus:bg-blue-50 ${
                        errors.password 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <span>●</span>
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Keep me signed in
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] rounded-xl mt-6"
                >
                  Sign In
                </Button>
              </form>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <Button 
                  variant="outline"
                  className="h-11 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2 text-gray-700 font-medium">Google</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-11 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span className="ml-2 text-gray-700 font-medium">GitHub</span>
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                    Sign up here
                  </a>
                </p>
                
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">Terms</a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
