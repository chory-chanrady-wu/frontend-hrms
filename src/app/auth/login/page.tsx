"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth-query";
import "../../../styles/globals.css";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending: isLoading } = useLogin();

  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    let isValid = true;
    const newErrors = { identifier: "", password: "" };

    // Email/Username validation
    if (loginType === "email") {
      if (!formData.email) {
        newErrors.identifier = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.identifier = "Please enter a valid email";
        isValid = false;
      }
    } else {
      if (!formData.username) {
        newErrors.identifier = "Username is required";
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.identifier = "Username must be at least 3 characters";
        isValid = false;
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors.identifier || errors.password) {
      setErrors((prev) => ({
        ...prev,
        identifier: "",
        password: "",
      }));
    }
    setGeneralError("");
  };

  const handleLoginTypeChange = (type: "email" | "username") => {
    setLoginType(type);
    setFormData({ email: "", username: "", password: "" });
    setErrors({ identifier: "", password: "" });
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    const credentials = {
      [loginType]: loginType === "email" ? formData.email : formData.username,
      password: formData.password,
    };

    login(credentials, {
      onSuccess: (data: any) => {
        // Store tokens in localStorage
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          // Store in cookies for middleware
          document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
          document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
        }
        // Backward compatibility
        if (data.token) {
          localStorage.setItem("token", data.token);
          document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }

        // Store user identity for profile & other pages
        if (data.user?.id) localStorage.setItem("userId", String(data.user.id));
        if (data.user?.employeeId)
          localStorage.setItem("employeeId", String(data.user.employeeId));
        if (data.user?.username) localStorage.setItem("username", data.user.username);
        if (data.user?.fullName) localStorage.setItem("fullName", data.user.fullName);
        if (data.user?.email) localStorage.setItem("email", data.user.email);

        // Fallback: decode JWT to extract userId if not in response body
        const token = data.accessToken || data.token;
        if (token && !data.userId && !data.employeeId && !data.id) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.userId)
              localStorage.setItem("userId", String(payload.userId));
            if (payload.employeeId)
              localStorage.setItem("employeeId", String(payload.employeeId));
            if (payload.sub)
              localStorage.setItem("userId", String(payload.sub));
          } catch {
            // ignore decode errors
          }
        }

        router.push("/dashboard");
      },
      onError: (error: any) => {
        setGeneralError(
          error?.message || "Invalid login credentials. Please try again.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Login Form Card */}
        <div className="rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-white">
          <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">
            HR Management System
          </h1>

          {/* Login Type Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleLoginTypeChange("email")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === "email"
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => handleLoginTypeChange("username")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === "username"
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Username
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {generalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {generalError}
              </div>
            )}

            {/* Email/Username Field */}
            <div>
              <label
                htmlFor={loginType}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {loginType === "email" ? "Email Address" : "Username"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginType === "email" ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <input
                  id={loginType}
                  name={loginType}
                  type={loginType === "email" ? "email" : "text"}
                  autoComplete={loginType === "email" ? "email" : "username"}
                  value={
                    loginType === "email" ? formData.email : formData.username
                  }
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border text-black ${
                    errors.identifier
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder={
                    loginType === "email" ? "you@example.com" : "username"
                  }
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border text-black ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
