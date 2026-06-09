import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserX, UserCheck, SquarePen } from "lucide-react";
import { User } from "@/lib/types/user";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  users: User[];
}

const UserReusableTable = ({ users }: Props) => {
  console.log("users", users);
  return (
    <Table>
      <TableHeader className="bg-gray-100/40">
        <TableRow>
          <TableHead className="font-medium text-gray-500/80">USER</TableHead>
          <TableHead className="font-medium text-gray-500/80">
            USERNAME
          </TableHead>
          <TableHead className="font-medium text-gray-500/80">EMAIL</TableHead>
          <TableHead className="font-medium text-gray-500/80">ROLE</TableHead>
          <TableHead className="font-medium text-gray-500/80">STATUS</TableHead>
          <TableHead className="font-medium text-gray-500/80">
            ACTIONS
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SquarePen size={20} className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Update User Info</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <UserX size={20} className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Deactivate User</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserReusableTable;
