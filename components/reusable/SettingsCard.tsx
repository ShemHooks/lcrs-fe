"use client";

import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  /** The icon to display */
  icon: LucideIcon;
  /** The title of the settings section */
  title: string;
  /** Optional description text */
  description?: string;
  /** Click handler - if provided, the card becomes clickable */
  onClick?: () => void;
  /** Optional href for navigation */
  href?: string;
  /** Custom className to override styles */
  className?: string;
  /** Optional badge or status indicator */
  badge?: React.ReactNode;
  /** Whether to show the chevron arrow */
  showArrow?: boolean;
  /** Icon color override */
  iconClassName?: string;
}

export default function SettingsCard({
  icon: Icon,
  title,
  description,
  onClick,
  href,
  className,
  badge,
  showArrow = true,
  iconClassName,
}: SettingsCardProps) {
  const Component = href ? "a" : "button";

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        // Base styles
        "group relative w-full flex items-center gap-5 p-5 rounded-2xl border border-gray-200/80 bg-white",
        // Hover & transition effects
        "transition-all duration-300 ease-out",
        "hover:border-red-900/20 hover:bg-gradient-to-r hover:from-red-900/[0.03] hover:to-transparent",
        "hover:shadow-lg hover:shadow-red-900/5",
        "hover:-translate-y-0.5",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-red-900/20 focus:ring-offset-2",
        // Active state
        "active:translate-y-0 active:shadow-md",
        className
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl",
          "bg-gradient-to-br from-red-900 to-red-950",
          "shadow-md shadow-red-900/20",
          "group-hover:shadow-lg group-hover:shadow-red-900/30",
          "group-hover:scale-105",
          "transition-all duration-300"
        )}
      >
        <Icon
          size={22}
          className={cn(
            "text-white",
            "group-hover:rotate-3",
            "transition-transform duration-300",
            iconClassName
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-3">
          <h3
            className={cn(
              "font-semibold text-gray-900 text-[15px]",
              "group-hover:text-red-900",
              "transition-colors duration-300"
            )}
          >
            {title}
          </h3>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Arrow */}
      {showArrow && (
        <ChevronRight
          size={18}
          className={cn(
            "text-gray-300",
            "group-hover:text-red-900 group-hover:translate-x-1",
            "transition-all duration-300"
          )}
        />
      )}

      {/* Decorative hover line */}
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-full",
          "bg-gradient-to-b from-red-900 to-red-950",
          "group-hover:h-3/4",
          "transition-all duration-300"
        )}
      />
    </Component>
  );
}
