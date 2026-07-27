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
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "",
    position: "",
    isActive: true,
  });

  const [password] = useState(() => generateSecureString(10));

  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [successDialog, setSuccessDialog] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState({
    email: "",
    password: "",
  });

  const createUserMutation = useCreateUser();

  const handleSubmit = () => {
    createUserMutation.mutate(
      {
        ...formData,
        password,
      },
      {
        onSuccess: () => {
          setCreatedCredentials({
            email: formData.email,
            password,
          });

          setSuccessDialog(true);

          setFormData({
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            role: "",
            isActive: true,
            position: "",
          });

          onOpenChange(false);
        },

        onError: (error: any) => {
          setErrorMessage(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to create user.",
          );

          setErrorDialog(true);
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {createUserMutation.isPending && (
            <div className="absolute top-0 left-0 h-1 w-full overflow-hidden rounded-t-lg">
              <div className="h-full w-1/3 bg-blue-500 animate-loading-bar" />
            </div>
          )}
          <DialogHeader>
            <DialogTitle className="font-semibold">Add New User</DialogTitle>
          </DialogHeader>

          <div
            className={`flex flex-col gap-8 ${
              createUserMutation.isPending
                ? "pointer-events-none opacity-80"
                : ""
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <Label>
                    First Name <p className="text-red-500">*</p>
                  </Label>
                  <Input
                    className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>
                    Last Name <p className="text-red-500">*</p>
                  </Label>
                  <Input
                    className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label>
                  Username <p className="text-red-500">*</p>
                </Label>
                <Input
                  className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>
                  Email <p className="text-red-500">*</p>
                </Label>
                <Input
                  className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>
                  Position <p className="text-red-500">*</p>
                </Label>
                <Input
                  className="rounded-sm focus-visible:border-red-500 focus-visible:ring-0"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>
                  Role <p className="text-red-500">*</p>
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
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
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
                disabled={createUserMutation.isPending}
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
      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              User Creation Failed
            </DialogTitle>
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
              User Created Successfully
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>Save these credentials before closing this window.</p>

            <div className="rounded-md border bg-muted p-4 font-mono">
              <div>
                <strong>Email:</strong> {createdCredentials.email}
              </div>

              <div>
                <strong>Temporary Password:</strong>{" "}
                {createdCredentials.password}
              </div>
            </div>

            <p className="text-sm text-amber-600">
              Take a screenshot, print, or copy these credentials. The temporary
              password will not be shown again.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`,
                  )
                }
              >
                Copy Credentials
              </Button>

              <Button onClick={() => setSuccessDialog(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserModal;
