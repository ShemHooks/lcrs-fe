import React from "react";
import { redirect } from "next/navigation";

const page = () => {
  redirect("/clerk/registration/birth");
};

export default page;
