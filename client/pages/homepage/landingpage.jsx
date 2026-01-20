import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Clock,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Smartphone,
  Zap,
  Shield,
  MapPin,
  ChevronDown,
  Plus
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const features = [
    {
      icon: Clock,
      title: "Lightning Fast Service",
      description: "Order ahead and skip the queue. Get your meal in minutes.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Utensils,
      title: "Fresh & Healthy",
      description: "Quality ingredients, nutritious meals prepared daily.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: ShoppingCart,
      title: "Easy Ordering",
      description: "Browse menu, customize orders, and pay seamlessly.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track inventory, sales, and optimize operations in real-time.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Happy Students", icon: Users },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
    { value: "5min", label: "Avg Wait Time", icon: Clock },
    { value: "500+", label: "Daily Orders", icon: ShoppingCart }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science, Year 3",
      content: "The best thing about our campus! Fast service, great food, and I never miss my next class.",
      rating: 5,
      image: "P"
    },
    {
      name: "Rahul Mehta",
      role: "Business Admin, Year 2",
      content: "Love the mobile ordering feature. I can order during class and pick up on my way out!",
      rating: 5,
      image: "R"
    },
    {
      name: "Ananya Patel",
      role: "Engineering, Year 4",
      content: "Healthy options, affordable prices, and super convenient. Couldn't ask for more!",
      rating: 5,
      image: "A"
    }
  ];

  const howItWorks = [
    {
      icon: Smartphone,
      title: "Download App",
      description: "Get the NEC Canteen app on your phone in seconds",
      step: "01"
    },
    {
      icon: Utensils,
      title: "Browse Menu",
      description: "Explore daily specials and customize your meal",
      step: "02"
    },
    {
      icon: ShoppingCart,
      title: "Place Order",
      description: "Add to cart and secure your meal with quick checkout",
      step: "03"
    },
    {
      icon: MapPin,
      title: "Pick Up Ready",
      description: "Get notified when your delicious meal is ready",
      step: "04"
    }
  ];

  const pricingPlans = [
    {
      name: "Student",
      price: "Free",
      period: "forever",
      description: "Perfect for casual ordering",
      features: [
        "Browse menu anytime",
        "Quick checkout",
        "Order tracking",
        "Weekly updates"
      ],
      highlight: false
    },
    {
      name: "Plus",
      price: "₹99",
      period: "per month",
      description: "Best for regular students",
      features: [
        "Everything in Student",
        "Priority pickup",
        "Exclusive discounts (15%)",
        "Loyalty rewards",
        "Personalized recommendations"
      ],
      highlight: true
    },
    {
      name: "Premium",
      price: "₹199",
      period: "per month",
      description: "Ultimate convenience",
      features: [
        "Everything in Plus",
        "VIP priority lane",
        "Monthly free meal",
        "24/7 support",
        "Special events access"
      ],
      highlight: false
    }
  ];

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Once you place an order, you'll receive real-time updates via notifications. You can also check the status in your app anytime."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept UPI, credit/debit cards, and campus wallet. You can also use Google Pay and Apple Pay for quick transactions."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Yes! You can modify your order within 2 minutes of placing it. After that, you can cancel with a small fee. Free cancellation is available 5 minutes before pickup."
    },
    {
      question: "Are there dietary options available?",
      answer: "Absolutely! We offer vegan, vegetarian, gluten-free, and low-calorie options. All nutritional information is clearly labeled."
    },
    {
      question: "What's your refund policy?",
      answer: "If you're unsatisfied with your order quality, we'll refund 100% or provide a free replacement meal within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NEC Canteen
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeInLeft">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-purple-600 animate-bounce-slow" />
                <span className="text-sm font-semibold text-purple-700">
                  #1 Campus Dining Experience
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Delicious Food,
                </span>
                <br />
                <span className="text-gray-900">Zero Wait Time</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your campus dining experience with smart ordering, 
                real-time inventory, and lightning-fast service. Built for students, by students.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 shadow-2xl hover:shadow-purple-200 transition-all transform hover:scale-105"
                >
                  Start Ordering Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-white font-semibold"
                    >
                      {i === 4 ? '+' : ''}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Join 10,000+ students</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm font-semibold text-gray-700 ml-2">4.9/5</span>
                  </div>
                </div>
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
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Why Students <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Love Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect campus dining experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 bg-white animate-fadeInUp"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Quick & Simple</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              4 Steps to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Delicious Meals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your favorite food in just a few taps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative animate-slideInUp" style={{animationDelay: `${idx * 100}ms`}}>
                <Card className="p-6 text-center h-full bg-white border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-2">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
              <Heart className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-semibold text-purple-700">Student Reviews</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Real Feedback from <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Real Students</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                className="p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 hover:shadow-xl transition-all hover:-translate-y-2 animate-slideInUp"
                style={{animationDelay: `${idx * 150}ms`}}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <ShoppingCart className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Flexible Plans</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Plans for Every <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Budget</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade anytime. No hidden charges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <Card
                key={idx}
                className={`relative p-8 transition-all transform hover:scale-105 animate-fadeInUp ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
                style={{animationDelay: `${idx * 100}ms`}}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mb-6 text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-2 text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>
                <Button
                  className={`w-full mb-8 ${
                    plan.highlight
                      ? 'bg-white text-purple-600 hover:bg-gray-100 font-semibold'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  Get Started
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center space-x-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-blue-100' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-blue-50' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Common Questions</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all animate-fadeInUp"
                style={{animationDelay: `${idx * 50}ms`}}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all text-left"
                >
                  <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 transition-transform flex-shrink-0 ${
                      expandedFaq === idx ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-t-2 border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-center space-y-6 shadow-2xl border-0">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Campus Dining?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of students enjoying faster, smarter, and more delicious meals every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl transform hover:scale-105 transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">CampusEats</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making campus dining better, one meal at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 CampusEats. All rights reserved. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
