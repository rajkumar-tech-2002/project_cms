import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Mail,
  CheckCircle,
  Clock,
  Shield,
  Send,
  AlertCircle
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (Object.keys(newErrors).length === 0) {
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1500);
    } else {
      setErrors(newErrors);
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Clock,
      title: "Quick Reset",
      description: "Reset your password in seconds"
    },
    {
      icon: Shield,
      title: "Secure Link",
      description: "Safe, encrypted reset process"
    },
    {
      icon: CheckCircle,
      title: "Instant Access",
      description: "Back to ordering immediately"
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
        onClick={() => navigate("/login")}
        className="absolute top-8 left-8 text-white hover:bg-white/10 rounded-full p-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="w-full max-w-6xl relative z-10">
        <Card className="overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0 h-full">
            {/* Left Side - Information & Benefits */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden group">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="space-y-2 mb-12">
                  <h2 className="text-4xl font-bold leading-tight">
                    Reset Your Password
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Don't worry! We'll help you regain access to your account in just a few steps.
                  </p>
                </div>

                {/* Illustration - Lock with checkmark */}
                <div className="relative mb-12">
                  <div className="relative w-full h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="space-y-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle className="w-24 h-24 text-white/40" />
                      </div>
                      <p className="text-white/60 font-medium">We'll send you a reset link</p>
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
                Lost access? We've got your back
              </div>
            </div>

            {/* Right Side - Reset Form */}
            <div className="flex flex-col justify-center p-8 sm:p-12 relative z-10">
              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="space-y-2 mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Forgot Password?
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Enter your email and we'll send you a reset link
                    </p>
                  </div>

                  {/* Reset Form */}
                  <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="student@college.edu"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({...errors, email: ""});
                          }}
                          className={`h-12 pl-12 border-2 rounded-xl bg-white transition-all focus:bg-green-50 ${
                            errors.email 
                              ? 'border-red-400 focus:border-red-500' 
                              : 'border-gray-200 focus:border-green-500'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-800">
                        We'll send a password reset link to your email. The link will be valid for 24 hours.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] rounded-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Send Reset Link</span>
                        </div>
                      )}
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

                  {/* Links */}
                  <div className="space-y-3 text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/login")}
                      className="w-full h-11 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all text-gray-700 font-medium"
                    >
                      Back to Login
                    </Button>
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <button
                        onClick={() => navigate("/login")}
                        className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                // Success State
                <div className="space-y-8 text-center py-12">
                  {/* Success Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Check Your Email
                    </h2>
                    <p className="text-gray-600 text-lg">
                      We've sent a password reset link to:
                    </p>
                    <p className="text-2xl font-semibold text-green-600 break-all">
                      {email}
                    </p>
                    <p className="text-gray-600 mt-4">
                      The link will expire in 24 hours. If you don't see the email, check your spam folder.
                    </p>
                  </div>

                  {/* Success Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Back to Login
                    </Button>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setEmail("");
                      }}
                      className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 font-semibold transition-all hover:bg-gray-50"
                    >
                      Try Another Email
                    </button>
                  </div>

                  {/* Help Text */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-8">
                    <p className="text-sm text-blue-800">
                      <strong>Didn't receive the email?</strong> Contact our support team at support@neccanteen.com
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
