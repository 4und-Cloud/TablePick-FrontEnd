import { useEffect, useState, useCallback } from "react";

export default function usePagination(totalPagesFromBackend: number) {
  const [currentPage, setCurrentPage] = useState(0); // 0-based로 초기화

  useEffect(() => {
    const lastPageIndex = Math.max(totalPagesFromBackend - 1, 0);

    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage > lastPageIndex && totalPagesFromBackend > 0) {
      setCurrentPage(lastPageIndex);
    }
  }, [currentPage, totalPagesFromBackend]);

  const goToNextPage = useCallback(() => {
    const lastPageIndex = totalPagesFromBackend > 0 ? totalPagesFromBackend - 1 : 0;
    setCurrentPage((prevPage) => (prevPage < lastPageIndex ? prevPage + 1 : prevPage));
  }, [totalPagesFromBackend]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  }, []);

  const setPage = useCallback(
    (page: number) => {
      const lastPageIndex = totalPagesFromBackend > 0 ? totalPagesFromBackend - 1 : 0;
      if (page >= 0 && page <= lastPageIndex) {
        setCurrentPage(page);
      } else if (page < 0) {
        setCurrentPage(0);
      } else if (page > lastPageIndex) {
        setCurrentPage(lastPageIndex);
      }
    },
    [totalPagesFromBackend]
  );

  const goToFirstPage = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const goToLastPage = useCallback(() => {
    const lastPageIndex = totalPagesFromBackend > 0 ? totalPagesFromBackend - 1 : 0;
    setCurrentPage(lastPageIndex);
  }, [totalPagesFromBackend]);

  return {
    currentPage,
    goToNextPage,
    goToPrevPage,
    setPage,
    goToFirstPage,
    goToLastPage,
  };
}