import React from "react";
import { Button } from "../ui/button";
import { Baby, Heart, Cross } from "lucide-react";

const CertificateRegistrationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex justify-center gap-4 p-6 items-cente">
        <button className="bg-transparent border border-gray-600 rounded-sm text-black w-1/3 h-35 hover:bg-gray-200 flex flex-col justify-center items-center ">
          <Baby size={40} />
          <h3>Birth Registration</h3>
        </button>
        <button className="bg-transparent border border-gray-600 rounded-sm text-black w-1/3 h-35 hover:bg-gray-200 flex flex-col justify-center items-center ">
          <Heart size={40} />
          <h3>Marriage Registration</h3>
        </button>
        <button className="bg-transparent border border-gray-600 rounded-sm text-black w-1/3 h-35 hover:bg-gray-200 flex flex-col justify-center items-center ">
          <Cross size={40} />
          <h3>Death Registration</h3>
        </button>
      </nav>

      <main className=" bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
};

export default CertificateRegistrationLayout;
