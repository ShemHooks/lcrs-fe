"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/lib/types/menu";
import { clsx } from "clsx";

interface SidebarProps {
  menu: MenuItem[];
}

export default function Sidebar({ menu }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-red-900 text-white h-screen flex flex-col fixed border-r border-white/5">
      {/* Brand Header Section */}
      <div className="p-4 h-1/8 flex gap-2 border-b border-white/">
        <img
          src="/assets/CCRO.png"
          alt="Ishabella Logo"
          className="w-1/4 h-full object-contain mb-4 drop-shadow-2xl"
        />
        <div>
          <h3 className="text-sm font-semibold">City Civil Registry Office</h3>{" "}
          <p className="text-xs text-gray-100/80">City of Kabankalan</p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav>
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 w-full transition-all duration-200 group relative ${
                active
                  ? "bg-red-700/80 text-white shadow-md"
                  : "text-emerald-100/100 hover:bg-white/5 hover:text-white"
              }`}
            >
              {/* Active Indicator Accent */}
              {active && (
                <div className="absolute right-0 w-1 h-full bg-white " />
              )}

              <Icon
                size={20}
                className={`${active ? "text-white" : "group-hover:text-emerald-400"} transition-colors`}
              />

              <span className="text-xs font-black uppercase tracking-widest">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className=" absolute w-full p-6 bg-red-950 border-t border-white/5 bottom-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            System Online
          </span>
        </div>
        <p className="text-[9px] font-bold text-white/50 uppercase">
          © 2026 ISHABELLA CORP
        </p>
      </div>
    </aside>
  );
}
