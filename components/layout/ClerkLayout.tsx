"use client";

import Topbar from "../reusable/Topbar";
import Sidebar from "../reusable/Sidebar";
import { clerkMenu } from "@/lib/menu/ClerkMenu";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar menu={clerkMenu} />

      <div className="flex-1 flex flex-col pl-64 ">
        <Topbar />

        <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
