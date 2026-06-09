import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const TableControl = ({ page, setPage }: Props) => {
  return (
    <div className="flex justify-end items-center mt-6 ">
      <button
        className="cursor-pointer"
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
      >
        <ChevronLeft />
      </button>

      <p>{page}</p>

      <button
        className="cursor-pointer"
        onClick={() => setPage((prev) => prev + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default TableControl;
