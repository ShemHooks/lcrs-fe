"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function FloatingInput({
  label,
  icon,
  iconPosition = "left",
  type = "text",
  ...props
}: FloatingInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const hasIcon = !!icon;

  return (
    <div className="relative w-full">
      {/* ICON */}
      {icon && (
        <div
          className={`absolute top-4 text-gray-500 ${
            iconPosition === "left" ? "left-0" : "right-0 mr-2"
          }`}
        >
          {icon}
        </div>
      )}

      {/* INPUT */}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder=" "
        className={`
          peer
          w-full
           ${hasIcon ? (iconPosition === "left" ? "pl-12" : "pl-3") : "pl-3"}
          pr-12
          pt-6
          pb-2
          border-0
          border-b-2
          border-gray-300
          bg-transparent
          outline-none
          focus:border-blue-500
        `}
        {...props}
      />

      {/* LABEL */}
      <label
        className={`
          absolute
          text-gray-500
          pointer-events-none
          transition-all
          duration-200

          ${
            hasIcon
              ? iconPosition === "left"
                ? "left-12"
                : "left-3"
              : "left-3"
          }

          top-4
          peer-focus:top-1
          peer-focus:text-xs
          peer-focus:text-blue-500
          peer-[:not(:placeholder-shown)]:top-1
          peer-[:not(:placeholder-shown)]:text-xs
        `}
      >
        {label}
      </label>

      {/* PASSWORD TOGGLE */}
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
