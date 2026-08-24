"use client";

import React, { useState } from "react";
import { Lock, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useChangePassword } from "@/server/hooks/authHooks";
import { cn } from "@/lib/utils";

export default function PasswordSecurityForm() {
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    changePasswordMutation.mutate(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setErrors({});
          setTimeout(() => setSuccess(false), 5000);
        },
        onError: (error: any) => {
          setErrors({
            currentPassword: error?.message || "Failed to change password",
          });
        },
      }
    );
  };

  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, label: "", color: "" };
    if (password.length < 8) return { level: 1, label: "Weak", color: "bg-red-500" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { level: 2, label: "Fair", color: "bg-yellow-500" };
    if (!/[!@#$%^&*]/.test(password))
      return { level: 3, label: "Good", color: "bg-blue-500" };
    return { level: 4, label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(formData.newPassword);

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-900 to-red-950 shadow-lg shadow-red-900/20">
          <Shield size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Password & Security
          </h1>
          <p className="text-sm text-gray-500">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">
            Password changed successfully!
          </span>
        </div>
      )}

      {/* Change Password Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-900/5">
              <Lock size={18} className="text-red-900" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">
                Ensure your account uses a strong, unique password
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  placeholder="Enter your current password"
                  className={cn(
                    "w-full px-4 py-2.5 pr-12 rounded-xl border bg-gray-50/50 transition-all duration-200 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900/30 focus:bg-white",
                    errors.currentPassword ? "border-red-500" : "border-gray-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="Enter your new password"
                  className={cn(
                    "w-full px-4 py-2.5 pr-12 rounded-xl border bg-gray-50/50 transition-all duration-200 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900/30 focus:bg-white",
                    errors.newPassword ? "border-red-500" : "border-gray-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password Strength */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className={cn(
                      "text-xs font-medium",
                      strength.level <= 1 && "text-red-600",
                      strength.level === 2 && "text-yellow-600",
                      strength.level === 3 && "text-blue-600",
                      strength.level >= 4 && "text-green-600"
                    )}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        strength.color
                      )}
                      style={{ width: `${(strength.level / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm your new password"
                  className={cn(
                    "w-full px-4 py-2.5 pr-12 rounded-xl border bg-gray-50/50 transition-all duration-200 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:border-red-900/30 focus:bg-white",
                    errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                "bg-gradient-to-r from-red-900 to-red-950 text-white",
                "hover:from-red-800 hover:to-red-900 hover:shadow-lg hover:shadow-red-900/20",
                "focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              )}
            >
              {changePasswordMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Changing...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Security Tips */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
        <h3 className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wider">
          Security Tips
        </h3>
        <ul className="space-y-1.5">
          {[
            "Use at least 8 characters with a mix of letters, numbers, and symbols",
            "Include uppercase and lowercase letters",
            "Avoid using personal information like birthdays or names",
            "Don't reuse passwords from other accounts",
          ].map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-blue-800">
              <CheckCircle size={12} className="mt-0.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
