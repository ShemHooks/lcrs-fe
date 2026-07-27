import React from "react";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const RecordsControl = () => {
  return (
    <div>
      <Card className="w-1/2 rounded-md p-4">
        <h3 className="font-semibold">Search Record</h3>
        <div className="flex flex-col gap-4">
          <Label>Record Filter</Label>
          <div className="flex gap-3">
            <select name="" id="" className="outline-none border-none">
              <option value="">All Records</option>
              <option value="birth">Birth Records </option>
              <option value="death">Death Records</option>
              <option value="marraige">Marriage Certificate Records</option>
            </select>
            <Filter />
          </div>
          <p>
            Use filters to narrow down the results and find what you need
            faster.
          </p>{" "}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label>Search Records</Label>
          <Input></Input>
        </div>
      </Card>
    </div>
  );
};

export default RecordsControl;
