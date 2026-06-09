"use client";

import { Bell, User, LogOut, ChevronRight, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getProfile } from "@/server/hooks/authHooks";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError, error } = getProfile();

  const currentPath =
    pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  if (isLoading) {
    return <p>...Loading</p>;
  }

  if (isError) {
    return <div>Error loading user</div>;
  }

  console.log(data.data.username);

  return (
    <header className="bg-white border-b border-emerald-900/5 h-16 flex justify-between items-center px-8 sticky top-0 z-40">
      {/* Tactical Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-1.5 rounded-lg text-white shadow-sm shadow-emerald-200"></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/100">
            CITY OF KABANKALAN REGISTRY SYSTEM
          </span>
          <ChevronRight size={12} className="text-emerald-900/100" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900 italic">
            {currentPath}
          </span>
        </div>
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-emerald-900/100 over:text-emerald-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>
        <div className="h-8 w-[1px] bg-emerald-900/5" />
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-black-900/80">
              {data.data.username}
            </p>
            <p className="text-[9px] font-bold text-red-800/80 uppercase tracking-tighter">
              {data.data.role}
            </p>
          </div>

          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-red-900 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          {/* Logout  */}
          <button
            className="ml-2 p-2 text-emerald-900/100 hover:text-rose-600 transition-colors"
            onClick={() => router.replace("/")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
