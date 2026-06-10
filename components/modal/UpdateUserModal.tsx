"use client";

import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUserByID, useUpdateUser } from "@/server/hooks/userHooks";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const UpdateUserModal = ({ open, onOpenChange, userId }: Props) => {
  const { data: userData, isLoading } = useUserByID(userId);
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "",
  });

  console.log("User Data", userData);

  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [successDialog, setSuccessDialog] = useState(false);

  useEffect(() => {
    if (userData && open) {
      setFormData({
        id: userData.id,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        username: userData.username || "",
        email: userData.email || "",
        role: userData.role || "",
      });
    }
  }, [userData, open]);

  const handleSubmit = () => {
    updateUserMutation.mutate(formData, {
      onSuccess: () => {
        setSuccessDialog(true);
        onOpenChange(false);
      },

      onError: (error: any) => {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update user.",
        );

        setErrorDialog(true);
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {(isLoading || updateUserMutation.isPending) && (
            <div className="absolute top-0 left-0 h-1 w-full overflow-hidden rounded-t-lg">
              <div className="h-full w-1/3 bg-blue-500 animate-loading-bar" />
            </div>
          )}

          <DialogHeader>
            <DialogTitle className="font-semibold">Update User</DialogTitle>
          </DialogHeader>

          <div
            className={`flex flex-col gap-8 ${
              updateUserMutation.isPending
                ? "pointer-events-none opacity-80"
                : ""
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <Label>
                    First Name <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <Label>
                    Last Name <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label>
                  Username <span className="text-red-500">*</span>
                </Label>

                <Input
                  className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>

                <Input
                  type="email"
                  className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>
                  Role <span className="text-red-500">*</span>
                </Label>

                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: value,
                    }))
                  }
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
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                disabled={updateUserMutation.isPending}
                className="p-4 rounded-sm bg-transparent border border-gray-800/80 text-black hover:bg-gray-200"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={updateUserMutation.isPending || isLoading}
                className="p-4 rounded-sm bg-red-700 hover:bg-red-800"
              >
                {updateUserMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Update Failed</DialogTitle>
          </DialogHeader>

          <p>{errorMessage}</p>

          <Button className="w-full" onClick={() => setErrorDialog(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">
              User Updated Successfully
            </DialogTitle>
          </DialogHeader>

          <p>The user's information has been updated.</p>

          <Button className="w-full" onClick={() => setSuccessDialog(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateUserModal;
