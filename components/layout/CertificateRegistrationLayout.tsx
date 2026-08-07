import React from "react";
import { Button } from "../ui/button";
import { Baby, Heart, Cross } from "lucide-react";

const CertificateRegistrationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 flex flex-col ">
      <nav className="flex gap-3 border-b bg-white px-6 py-4 mb-4">
        <Button variant="default" className="gap-2 rounded-lg">
          <Baby className="h-4 w-4" />
          Birth Registration
        </Button>

        <Button variant="outline" className="gap-2 rounded-lg">
          <Heart className="h-4 w-4" />
          Marriage Registration
        </Button>

        <Button variant="outline" className="gap-2 rounded-lg">
          <Cross className="h-4 w-4" />
          Death Registration
        </Button>
      </nav>

      <main className=" bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
};

export default CertificateRegistrationLayout;
