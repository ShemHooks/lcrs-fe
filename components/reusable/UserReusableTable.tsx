import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { UserX, UserCheck, SquarePen, Trash2 } from "lucide-react";
import { User } from "@/lib/types/user";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  useDeactivateUser,
  useActivateUser,
  useDeleteUser,
} from "@/server/hooks/userHooks";

import UpdateUserModal from "../modal/UpdateUserModal";

interface Props {
  users: User[];
  isActive: boolean;
}

const UserReusableTable = ({ users, isActive }: Props) => {
  const deactivatedMutation = useDeactivateUser();
  const activateMutation = useActivateUser();
  const deleteUserMutation = useDeleteUser();

  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleDeactivate = (id: string) => {
    deactivatedMutation.mutate(id);
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = useMemo(() => {
    const sorted = [...users];

    if (!sortColumn) return sorted;

    sorted.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "boolean" && typeof valueB === "boolean") {
        return sortDirection === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      return 0;
    });

    return sorted;
  }, [users, sortColumn, sortDirection]);

  const handleUpdate = (id: string) => {
    setSelectedUserId(id);
    setUpdateModalOpen(true);
  };

  return (
    <Table>
      <UpdateUserModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        userId={selectedUserId}
      />
      <TableHeader className="bg-gray-100/40">
        <TableRow>
          <TableHead
            className="font-medium text-gray-500/80 cursor-pointer"
            onClick={() => handleSort("first_name")}
          >
            USER
          </TableHead>
          <TableHead
            className="font-medium text-gray-500/80 cursor-pointer"
            onClick={() => handleSort("username")}
          >
            USERNAME
          </TableHead>
          <TableHead
            className="font-medium text-gray-500/80 cursor-pointer"
            onClick={() => handleSort("email")}
          >
            EMAIL
          </TableHead>
          <TableHead
            className="font-medium text-gray-500/80 cursor-pointer"
            onClick={() => handleSort("role")}
          >
            ROLE
          </TableHead>
          <TableHead className="font-medium text-gray-500/80">STATUS</TableHead>
          <TableHead className="font-medium text-gray-500/80">
            ACTIONS
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.first_name} {user.last_name}
            </TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              <div className="flex gap-4 text-red-700">
                {isActive ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SquarePen
                          size={20}
                          className="cursor-pointer"
                          onClick={() => handleUpdate(user.id)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update User Info</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <UserX
                          size={20}
                          className="cursor-pointer"
                          onClick={() => handleDeactivate(user.id)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deactivate User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <UserCheck
                          size={20}
                          className="cursor-pointer"
                          onClick={() => handleActivate(user.id)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Activate User</p>
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Trash2
                              size={20}
                              className="cursor-pointer text-red-600"
                            />
                          </AlertDialogTrigger>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>Delete User</p>
                        </TooltipContent>
                      </Tooltip>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete User Account?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete
                            <span className="font-semibold">
                              {" "}
                              {user.first_name} {user.last_name}
                            </span>
                            's account and remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipProvider>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserReusableTable;
