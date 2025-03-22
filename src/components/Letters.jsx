import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useState, useMemo, useEffect } from "react";
import { States } from "./App";
import { useNavigate, useParams } from "react-router-dom";
import Letter from "./Letter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Letters() {
  const { authentication } = useContext(States);
  const { letters } = useContext(States);
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [sortOption, setSortOption] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();
  useEffect(() => {
    if (!page) {
      navigate("/1", { replace: true });
    } else {
      const pageNum = parseInt(page);
      if (pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    }
  }, [page, navigate, currentPage]);
  const totalPages = Math.ceil(letters.length / itemsPerPage);
  const currentLetters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedLetters = [...letters];
    if (sortOption === "Newest") {
      sortedLetters.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } else if (sortOption === "Oldest") {
      sortedLetters.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    }
    return sortedLetters.slice(startIndex, endIndex);
  }, [letters, currentPage, itemsPerPage, sortOption]);
  const pageNumbers = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (number) => {
    setCurrentPage(number);
    navigate(`/${number}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mt-12 w-full h-full flex flex-col items-center ">
      <Select onValueChange={setSortOption} value={sortOption}>
        <SelectTrigger className="w-[180px] self-end mr-8 mb-4">
          <SelectValue placeholder="Sort By " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Oldest">Oldest</SelectItem>
            <SelectItem value="Newest">Newest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex w-full flex-col items-center gap-8">
        {currentLetters.map((letter) => (
          <Letter letter={letter} key={letter.messageid} />
        ))}
      </div>
      <Pagination className="mt-10 mb-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {pageNumbers.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                onClick={() => handlePageChange(number)}
                isActive={currentPage === number}
                className="cursor-pointer"
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
