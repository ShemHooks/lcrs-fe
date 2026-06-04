"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function FloatingInput({
  label,
  icon,
  type = "text",
  ...props
}: FloatingInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-0 top-4 text-gray-500">{icon}</div>
      )}

      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder=" "
        className="
          peer
          w-full
          pl-12
          pr-12
          pt-6
          pb-2
          border-0
          border-b-2
          border-gray-300
          bg-transparent
          outline-none
          focus:border-blue-500
        "
        {...props}
      />

      <label
        className="
          absolute
          left-12
          top-4
          text-gray-500
          pointer-events-none
          transition-all
          duration-200
          peer-focus:top-1
          peer-focus:text-xs
          peer-focus:text-blue-500
          peer-[:not(:placeholder-shown)]:top-1
          peer-[:not(:placeholder-shown)]:text-xs
        "
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-4 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
