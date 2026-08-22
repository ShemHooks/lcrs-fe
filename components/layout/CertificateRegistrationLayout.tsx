import React, { useState } from "react";
import { Button } from "../ui/button";
import { Baby, Heart, Cross } from "lucide-react";

import BirthRegistrationPage from "@/app/admin/registration/birth/page";
import MarriageRegistrationPage from "@/app/admin/registration/marriage/page";
import DeathRegistrationPage from "@/app/admin/registration/death/page";

type RegistrationType = "birth" | "marriage" | "death";

interface CertificateRegistrationLayoutProps {
  children?: React.ReactNode;
}

const CertificateRegistrationLayout = ({
  children,
}: CertificateRegistrationLayoutProps) => {
  const [selectedType, setSelectedType] = useState<RegistrationType>("birth");

  const typeMap: Record<RegistrationType, React.ReactNode> = {
    birth: <BirthRegistrationPage key="birth" />,
    marriage: <MarriageRegistrationPage key="marriage" />,
    death: <DeathRegistrationPage key="death" />,
  };

  const getActiveClass = (type: RegistrationType) =>
    selectedType === type
      ? "bg-primary text-primary-foreground font-bold"
      : "";

  // If children are provided (e.g., by clerk registration layout), render them
  // in the main area alongside the nav. Otherwise, render the selected
  // registration type page.
  if (children !== undefined) {
    return (
      <div className="flex-1 flex flex-col ">
        <nav className="flex gap-3 border-b bg-white px-6 py-4 mb-4">
          <Button
            variant="outline"
            className={`gap-2 rounded-lg ${getActiveClass("birth")}`}
            onClick={() => setSelectedType("birth")}
          >
            <Baby className="h-4 w-4" />
            Birth Registration
          </Button>

          <Button
            variant="outline"
            className={`gap-2 rounded-lg ${getActiveClass("marriage")}`}
            onClick={() => setSelectedType("marriage")}
          >
            <Heart className="h-4 w-4" />
            Marriage Registration
          </Button>

          <Button
            variant="outline"
            className={`gap-2 rounded-lg ${getActiveClass("death")}`}
            onClick={() => setSelectedType("death")}
          >
            <Cross className="h-4 w-4" />
            Death Registration
          </Button>
        </nav>

        <main className="bg-gray-100 min-h-screen">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ">
      <nav className="flex gap-3 border-b bg-white px-6 py-4 mb-4">
        <Button
          variant="outline"
          className={`gap-2 rounded-lg ${getActiveClass("birth")}`}
          onClick={() => setSelectedType("birth")}
        >
          <Baby className="h-4 w-4" />
          Birth Registration
        </Button>

        <Button
          variant="outline"
          className={`gap-2 rounded-lg ${getActiveClass("marriage")}`}
          onClick={() => setSelectedType("marriage")}
        >
          <Heart className="h-4 w-4" />
          Marriage Registration
        </Button>

        <Button
          variant="outline"
          className={`gap-2 rounded-lg ${getActiveClass("death")}`}
          onClick={() => setSelectedType("death")}
        >
          <Cross className="h-4 w-4" />
          Death Registration
        </Button>
      </nav>

      <main className="bg-gray-100 min-h-screen">{typeMap[selectedType]}</main>
    </div>
  );
};

export default CertificateRegistrationLayout;
