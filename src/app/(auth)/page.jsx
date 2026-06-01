"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LogIn,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // temprorily disable captcha verification for testing
    // if (!captchaVerified) {
    //   setError("Please verify captcha");
    //   return;
    // }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://namami-infotech.com/Stepkaro/src/auth/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            password,
            captcha: captchaToken,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        // save tokens
        localStorage.setItem("access_token", data.access_token);

        localStorage.setItem("refresh_token", data.refresh_token);

        // save minimal user info
        localStorage.setItem(
          "user",
          JSON.stringify({
            role: data.role,
            email: email,
            name: data.name,
          }),
        );
        document.cookie = `role=${data.role}; path=/`;

        document.cookie = `access_token=${data.access_token}; path=/`;

        // redirect based on role
        if (data.role === "admin") {
          router.push("/admin/home");
        } else if (data.role === "seller") {
          router.push("/seller/home");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Brand Section - Left Side */}
        <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 lg:mx-0 mx-auto">
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-ping" />
            <span className="text-teal-300 text-sm font-medium">
              Platform Overview
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white">
            Step<span className="text-teal-400">Karo</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-md lg:mx-0 mx-auto">
            Manage your marketplace, track orders, and grow your business with
            powerful analytics.
          </p>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 animate-fade-in-up animation-delay-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@socialseller.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <ReCAPTCHA
                sitekey="6LflhNgsAAAAAPAp5TS5W-QxR2feOSikw3gGVKfR"
                onChange={(token) => {
                  setCaptchaVerified(true);
                  setCaptchaToken(token);
                }}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-gray-400"></div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Demo: admin@socialseller.com / any password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
