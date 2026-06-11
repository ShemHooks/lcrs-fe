import React from "react";
import DashboardCard from "@/components/reusable/DashboardCard";
import { TrendingUp } from "lucide-react";

import { FileText, Heart, Skull, Users } from "lucide-react";

const cards = [
  {
    title: "Birth Records",
    value: 6,
    description: "Male: 3 | Female: 3",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500">
        <FileText className="h-8 w-8 text-white" />
      </div>
    ),
    action: <TrendingUp className="h-5 w-5 text-red-500" />,

    valueClassName: "text-red-500",
  },
  {
    title: "Marriage Records",
    value: 2,
    description: "Total Marriages Registered",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-500">
        <Heart className="h-8 w-8 text-white" />
      </div>
    ),
    action: <TrendingUp className="h-5 w-5 text-pink-500" />,

    valueClassName: "text-pink-500",
  },
  {
    title: "Death Records",
    value: 2,
    description: "Male: 1 | Female: 1",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-500">
        <Skull className="h-8 w-8 text-white" />
      </div>
    ),
    action: <TrendingUp className="h-5 w-5 text-slate-500" />,

    valueClassName: "text-slate-500",
  },
  {
    title: "System Users",
    value: 2,
    description: "Active Users",
    icon: (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-500">
        <Users className="h-8 w-8 text-white" />
      </div>
    ),
    action: <TrendingUp className="h-5 w-5 text-green-500" />,

    valueClassName: "text-green-500",
  },
];

const page = () => {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            action={card.action}
            valueClassName={card.valueClassName}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
