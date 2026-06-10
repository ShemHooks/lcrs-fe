import { FloatingInput } from "@/components/reusable/FloatingInput";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import UserFilterModal from "../modal/UserFilterModal";

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

const ListControl = ({
  search,
  setSearch,
  limit,
  setLimit,
  role,
  setRole,
}: Props) => {
  const [isFilterUserOpen, setIFilterUserOpen] = useState(false);

  return (
    <div className="flex items-center gap-8">
      <UserFilterModal
        role={role}
        setRole={setRole}
        open={isFilterUserOpen}
        onOpenChange={setIFilterUserOpen}
      />
      <div className="w-[40%] border  ">
        <FloatingInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search"
          icon={<Search size={24} />}
          iconPosition="right"
        />
      </div>
      <div className="border border-gray-300/90 w-20 h-10 flex justify-end pr-2">
        <select
          name="pagination"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full focus:border-0 focus:outline-0"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div className="border border-gray-300/90 flex justify-end p-2">
        <Filter
          className="cursor-pointer text-gray-600"
          onClick={() => setIFilterUserOpen(true)}
        />
      </div>
    </div>
  );
};

export default ListControl;
