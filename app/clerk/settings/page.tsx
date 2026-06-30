import { Button } from "@/components/ui/button";
import React from "react";
import { Card } from "@/components/ui/card";
import { User, Lock, Bell } from "lucide-react";

const page = () => {
  return (
    <div>
      <Card className="p-10 bg-gray-100">
        <Button className="bg-white border border-gray-600/30 text-black hover:bg-gray-100 rounded-sm">
          <User />
          My Profile
        </Button>
        <Button className="bg-white border border-gray-600/30 text-black  hover:bg-gray-100 rounded-sm ">
          <Lock />
          Password & Security
        </Button>
        <Button className="bg-white border border-gray-600/30 text-black  hover:bg-gray-100 rounded-sm">
          <Bell />
          Notifications
        </Button>
      </Card>
    </div>
  );
};

export default page;
