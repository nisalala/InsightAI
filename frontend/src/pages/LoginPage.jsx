import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { Loader2 , BarChart3} from "lucide-react";

const LoginPage = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(""); // New state
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setAuthMessage(""); // Clear previous messages
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        if (user) {
          navigate("/"); // Only navigate if login succeeds
        }
      } else {
        const { user, error, data } = await signup(
          formData.email,
          formData.password,
          formData.name
        );

        if (error) {
          setAuthMessage(error.message);
        } else if (user === null) {
          // This means signup succeeded but confirmation required
          setAuthMessage(
            `Signup successful! Please check your email (${formData.email}) to confirm your account before logging in.`
          );
          setIsLogin(true);
          setFormData({ email: "", password: "", name: "" });
        } else {
          // No confirmation required, can navigate
          navigate("/");
        }
      }
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setLoading(false);
    }
  };




  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section with light theme */}
      <div className="w-1/2 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden flex">
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <BarChart3 className="w-10 h-10 text-teal-600" />
            <span className="text-3xl font-bold text-gray-900">InsightAI</span>
          </div>

          {/* Main headline - larger and more prominent */}
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your data,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                  analyzed instantly
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-md">
                Transform complex databases into actionable insights with natural language. No SQL required.
              </p>
            </div>

            {/* Simplified feature list - just text, no boxes */}
            <div className="space-y-3 pt-8">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span className="text-lg">AI-powered intelligence</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span className="text-lg">Lightning fast reports</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                <span className="text-lg">Enterprise security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form with matching light theme */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="hidden flex items-center gap-2 mb-8">
            <BarChart3 className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold text-gray-900">InsightAI</span>
          </div>

          {/* Auth card */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome back' : 'Get started free'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to continue to your workspace' : 'Create your account in seconds'}
              </p>
            </div>

            <div className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onKeyPress={handleKeyPress}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyPress={handleKeyPress}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
              {authMessage && (
  <p className="mt-3 text-sm text-red-600 text-center">{authMessage}</p>
)}

            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                {isLogin ? (
                  <>
                    Don't have an account? <span className="font-semibold text-teal-600">Sign up free</span>
                  </>
                ) : (
                  <>
                    Already have an account? <span className="font-semibold text-teal-600">Sign in</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our{' '}
                <span className="text-teal-600 hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-teal-600 hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;