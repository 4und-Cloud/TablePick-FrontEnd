import { useState } from "react";

export default function usePagination(totalItems: number, itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems/itemsPerPage);

    const setPage = (page:number) => {
        if(page >= 1 && page <= totalPages) {
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
        setPage(totalPages);
    }

    return{
        currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage
    };
};