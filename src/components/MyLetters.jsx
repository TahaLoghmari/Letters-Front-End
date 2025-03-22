import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { States } from "./App";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Letter from "./Letter";

export default function MyLetters() {
  const { letters, authentication } = useContext(States);
  const navigate = useNavigate();
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  useEffect(() => {
    if (!page) {
      navigate("/myLetters/1", { replace: true });
    } else {
      const pageNum = parseInt(page);
      if (pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    }
  }, [page, navigate]);
  const currentLettersStart = (currentPage - 1) * 4;
  const myLetters = letters
    .filter((letter) => letter.userid === authentication.userid)
    .slice(currentLettersStart, currentLettersStart + 5);
  const Pages = Math.ceil(
    letters.filter((letter) => letter.userid === authentication.userid).length /
      5
  );
  const currentPages = [];
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(Pages, currentPage + 4);
    ++i
  ) {
    currentPages.push(i);
  }
  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/myLetters/${pageNumber}`);
  };
  return (
    <div className="mt-12 w-full h-full flex flex-col items-center ">
      <div className="flex w-full flex-col items-center gap-8">
        {myLetters.map((letter) => (
          <Letter letter={letter} key={letter.messageid} />
        ))}
      </div>
      <Pagination className="mt-10 mb-10">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => handlePage(Math.max(1, currentPage - 1))}
            className="cursor-pointer"
          />
          {currentPages.map((Page) => (
            <PaginationItem
              onClick={() => handlePage(Page)}
              key={Page}
              className="cursor-pointer"
            >
              <PaginationLink>{Page}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {Pages > currentPages[currentPages - 1] ? (
              <PaginationEllipsis />
            ) : (
              ""
            )}
          </PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => handlePage(Math.min(currentPage + 1, Pages))}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}
