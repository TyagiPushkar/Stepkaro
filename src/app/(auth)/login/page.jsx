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
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle2,
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

  // ── Forgot password state ──────────────────────────────────────────────────
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
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

  // ── Forgot password submit ─────────────────────────────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess(false);

    try {
      const res = await fetch(
        "https://namami-infotech.com/Stepkaro/src/auth/forget_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setForgotSuccess(true);
      } else {
        setForgotError(data.message || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      setForgotError("Server error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgot(false);
    setForgotEmail("");
    setForgotError("");
    setForgotSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Brand Section - Left Side */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-3 bg-purple-50 rounded-2xl px-4 py-2 lg:mx-0 mx-auto border border-purple-100">
            <div className="w-3 h-3 bg-[#170a3b] rounded-full animate-pulse" />
            <span className="text-[#170a3b] text-sm font-medium">
              Secure Login
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-[#170a3b]">
            Step<span className="text-[#ff6b00]">Karo</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md lg:mx-0 mx-auto">
            Log in to manage your factory catalog, fulfill bulk wholesale
            orders, and scale your footwear business seamlessly.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <ShoppingBag size={16} className="text-purple-500" />
              <span className="text-sm text-gray-600">Product Management</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <TrendingUp size={16} className="text-orange-500" />
              <span className="text-sm text-gray-600">Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <Users size={16} className="text-purple-500" />
              <span className="text-sm text-gray-600">User Management</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">

            {/* ── FORGOT PASSWORD VIEW ── */}
            {showForgot ? (
              <div>
                {/* Back button */}
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>

                {forgotSuccess ? (
                  /* Success state */
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Check your email
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Password reset instructions have been sent to{" "}
                      <span className="font-medium text-gray-700">
                        {forgotEmail}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="mt-6 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      Return to login
                    </button>
                  </div>
                ) : (
                  /* Forgot password form */
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail size={28} className="text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Forgot Password?
                      </h2>
                      <p className="text-gray-500 mt-2 text-sm">
                        Enter your email and we&apos;ll send you reset instructions.
                      </p>
                    </div>

                    <form onSubmit={handleForgotSubmit} className="space-y-5">
                      {forgotError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-600 text-sm text-center">
                            {forgotError}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {forgotLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Send Reset Email
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            ) : (
              /* ── LOGIN VIEW ── */
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LogIn size={28} className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome Stepkaro Seller</h2>
                  <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@socialseller.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(true);
                        setError("");
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* <div className="flex justify-center">
                    <ReCAPTCHA
                      sitekey="6LflhNgsAAAAAPAp5TS5W-QxR2feOSikw3gGVKfR"
                      onChange={(token) => {
                        setCaptchaVerified(true);
                        setCaptchaToken(token);
                      }}
                    />
                  </div> */}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
