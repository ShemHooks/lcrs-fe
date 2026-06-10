import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserFilterModal = ({ role, setRole, open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Filter User By Role
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <Select
            value={role}
            onValueChange={(value) => {
              setRole(value);
              onOpenChange(false);
            }}
          >
            <SelectTrigger className="w-full rounded-sm">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Staff">Clerk</SelectItem>
              <SelectItem value="Reviewer">Reviewer</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setRole("");
              onOpenChange(false);
            }}
          >
            Clear Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserFilterModal;
