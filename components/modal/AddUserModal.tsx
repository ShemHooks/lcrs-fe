"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
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
import { generateSecureString } from "@/lib/utils";
import { useCreateUser } from "@/server/hooks/userHooks";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal = ({ open, onOpenChange }: Props) => {
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "",
    isActive: true,
  });

  const password = generateSecureString(10);

  const createUserMutation = useCreateUser();

  const handleSubmit = () => {
    createUserMutation.mutate({ ...formData, password });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Add New User</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1">
                <Label>
                  First Name <p className="text-red-500">*</p>
                </Label>
                <Input className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0" />
              </div>
              <div className="flex flex-col gap-1">
                <Label>
                  Last Name <p className="text-red-500">*</p>
                </Label>
                <Input className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>
                Username <p className="text-red-500">*</p>
              </Label>
              <Input className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>
                Email <p className="text-red-500">*</p>
              </Label>
              <Input className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0" />
            </div>
            <div className="flex flex-col gap-1">
              <Label>
                Role <p className="text-red-500">*</p>
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full rounded-sm">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Clerk</SelectItem>
                  <SelectItem value="Responder">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" />
              <Label>Active</Label>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Temporary Password</Label>
              <Input
                value={password}
                readOnly
                className="rounded-sm  font-mono selection:bg-transparent font-medium"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              className="p-4 rounded-sm bg-transparent border border-gray-800/80 text-black hover:bg-gray-200"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createUserMutation.isPending}
              className="p-4 rounded-sm bg-red-700 hover:bg-red-800"
            >
              {createUserMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
