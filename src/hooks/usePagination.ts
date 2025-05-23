import { useState } from "react";

export default function usePagination(totalPagesFromBackend: number) {
    const [currentPage, setCurrentPage] = useState(1);

    const setPage = (page:number) => {
        if(page >= 1 && page <= totalPagesFromBackend) {
            setCurrentPage(page);
        }
    };

    const goToNextPage = () => {
        setPage(currentPage + 1);
    };
    
    const goToPrevPage = () => {
        setPage(currentPage - 1);
    };

    const goToFirstPage = () => {
        setPage(1);
    }

    const goToLastPage = () => {
        setPage(totalPagesFromBackend);
    }

    return{
        currentPage, totalPagesFromBackend, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage
    };
};