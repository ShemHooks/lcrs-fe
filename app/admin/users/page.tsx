"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, List } from "lucide-react";
import ListControl from "@/components/reusable/ListControl";
import UserReusableTable from "@/components/reusable/UserReusableTable";
import TableControl from "@/components/reusable/TableControl";
import { useUsers } from "@/server/hooks/userHooks";
import AddUserModal from "@/components/modal/AddUserModal";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";

const page = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [role, setRole] = useState("");

  const router = useRouter();

  const [isActive, setIsActive] = useState(true);

  const { data, isLoading } = useUsers(page, limit, search, isActive, role);

  return (
    <div>
      <div>
        <h1 className="font-bold text-lg text-gray-600">User Management</h1>
      </div>
      <div className="pt-6">
        <Card className="rounded-sm p-6">
          <div className="flex justify-end gap-6">
            <Button
              className="p-4.5 bg-red-700 hover:bg-red-800"
              onClick={() => setIsAddUserOpen(true)}
            >
              <UserPlus /> Add User
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white p-4.5"
              onClick={() => setIsActive(!isActive)}
            >
              {" "}
              <List /> View Archive Users{" "}
            </Button>
          </div>
          <AddUserModal open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />
          <ListControl
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
            role={role}
            setRole={setRole}
          />

          <div>
            <UserReusableTable
              users={data?.data.users || []}
              isActive={isActive}
            />
          </div>
          <TableControl page={page} setPage={setPage} />
        </Card>
      </div>
    </div>
  );
};

export default page;
