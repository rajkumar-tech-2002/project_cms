import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  ArrowLeft,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Footer from "@/components/Footer.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [counter, setCounter] = useState("");
  const [roles, setRoles] = useState([]);
  const [counters, setCounters] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => {
        if (data.roles) setRoles(data.roles);
      })
      .catch(() => setRoles([]));

    fetch("/api/counters")
      .then((res) => res.json())
      .then((data) => {
        if (data.counters) setCounters(data.counters);
      })
      .catch(() => setCounters([]));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!userId) newErrors.userId = "User Id is required";
    if (!password) newErrors.password = "Password is required";
    if (!role) newErrors.role = "Role is required";
    if (!counter) newErrors.counter = "Counter access is required";
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setLoginError("");
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, password, role, counter }),
        });
        const data = await response.json();
        if (response.ok) {
          // Save token and user info to localStorage
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            // Redirect based on role
            if (data.user.role === "Admin") {
              navigate("/dashboard");
            } else if (data.user.role === "CounterOperator") {
              navigate("/counter/dashboard");
            } else {
              navigate("/dashboard");
            }
          }
        } else {
          setLoginError(data.error || data.message || "Login failed");
        }
      } catch (err) {
        setLoginError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen from-slate-950 via-blue-950 to-purple-950 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main content flex-1 to push footer down */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-black hover:bg-black/10 rounded-full p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="w-full max-w-6xl relative z-10 scale-95 md:scale-100">
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
                    <span className="text-2xl font-bold">Nandha Canteen</span>
                  </div>

                  {/* Hero Text */}
                  <div className="space-y-6 mb-16">
                    <h2 className="text-4xl font-bold leading-tight">
                      Welcome to Nandha Canteen
                    </h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                      A digital canteen management solution for Nandha
                      institutions that supports seamless ordering, live
                      inventory monitoring, and operational efficiency.
                    </p>
                  </div>

                  {/* Illustration - Stylized Food Card */}
                  <div className="relative mb-12">
                    <div className="relative w-full h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                      <div className="space-y-4 text-center">
                        <Utensils className="w-24 h-24 text-white/40 mx-auto" />
                        <p className="text-white/60 font-medium">
                          Powering efficient canteen operations from kitchen to
                          counter
                        </p>
                      </div>
                    </div>
                  </div>
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
                  {/* Role Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-gray-700 font-semibold text-sm"
                    >
                      Role
                    </Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`h-12 border-2 rounded-xl bg-white px-4 w-full focus:bg-blue-50 transition-all ${
                        errors.role
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select role</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>●</span>
                        <span>{errors.role}</span>
                      </p>
                    )}
                  </div>

                  {/* Counter Access Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="counter"
                      className="text-gray-700 font-semibold text-sm"
                    >
                      Counter Access
                    </Label>
                    <select
                      id="counter"
                      value={counter}
                      onChange={(e) => {
                        setCounter(e.target.value);
                        if (errors.counter)
                          setErrors({ ...errors, counter: "" });
                      }}
                      className={`h-12 border-2 rounded-xl bg-white px-4 w-full focus:bg-blue-50 transition-all ${
                        errors.counter
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select counter</option>
                      {counters.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.counter && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>●</span>
                        <span>{errors.counter}</span>
                      </p>
                    )}
                  </div>
                  {/* User Id Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="userId"
                      className="text-gray-700 font-semibold text-sm"
                    >
                      User Id
                    </Label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        id="userId"
                        type="text"
                        placeholder="Enter your user id"
                        value={userId}
                        onChange={(e) => {
                          setUserId(e.target.value);
                          if (errors.userId)
                            setErrors({ ...errors, userId: "" });
                        }}
                        className={`h-12 pl-12 border-2 rounded-xl bg-white transition-all focus:bg-blue-50 ${
                          errors.userId
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
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
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-semibold text-sm"
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
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
                          if (errors.password)
                            setErrors({ ...errors, password: "" });
                        }}
                        className={`h-12 pl-12 pr-12 border-2 rounded-xl bg-white transition-all focus:bg-blue-50 ${
                          errors.password
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
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
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Keep me signed in
                    </label>
                  </div>

                  {/* Login Error */}
                  {loginError && (
                    <div className="text-red-600 text-center font-medium">
                      {loginError}
                    </div>
                  )}
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] rounded-xl mt-6"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer at the bottom */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
