import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Split,
  Utensils,
  Clock,
  HandPlatter,
  FileChartPie,
  ShoppingCart,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer.jsx";

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { value: "4K+", label: "Happy Students", icon: Users },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
  ];

  const howItWorks = [
    {
      icon: Store,
      title: "Store",
      description: "Storing the food items available",
      step: "01",
    },
    {
      icon: Split,
      title: "Distribution",
      description: "Distributed among various counters for easy access",
      step: "02",
    },
    {
      icon: HandPlatter,
      title: "Serving",
      description: "Serving delicious meals to students quickly",
      step: "03",
    },
    {
      icon: FileChartPie,
      title: "Analytics",
      description: "Gathering report data to improve service quality",
      step: "04",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nandha Canteen
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeInLeft">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-purple-600 animate-bounce-slow" />
                <span className="text-sm font-semibold text-purple-700">
                  Nandha Canteen
                </span>
              </div>

              <h1 className="text-3xl lg:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Delicious Food,
                </span>
                <br />
                <span className="text-gray-900">Zero Wait Time</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                A digital canteen management solution for Nandha institutions
                that supports seamless ordering, live inventory monitoring, and
                operational efficiency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 shadow-2xl hover:shadow-purple-200 transition-all transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-fadeInRight">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <Card className="relative p-8 bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-white transform hover:scale-105 transition-transform duration-500 hover:shadow-3xl">
                <div className="space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Utensils className="w-24 h-24 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg transition-all"
                      >
                        <stat.icon className="w-8 h-8 text-blue-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Quick & Simple
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              4 Steps to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Delicious Meals
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your favorite food in just a few taps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className="relative animate-slideInUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Card className="p-6 text-center h-full bg-white border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-2">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </Card>
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/3 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
