export interface paginationProps {
    currentPage: number; // 현재 페이지
    totalPages: number; // 총 페이지
    onPrevPage: () => void; // 이전 페이지 이동
    onNextPage: () => void; // 다음 페이지 이동
    onPageChange: (page: number) => void; // 페이지 이동
    onFirstPage: () => void; // 첫 페이지 이동
    onLastPage: () => void; // 마지막 페이지 이동
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPrevPage,
                                       onNextPage,
                                       onPageChange,
                                       onFirstPage,
                                       onLastPage
                                   }: paginationProps) {
    // 페이지 계산 함수
    const getPageNumbers = () => {
        const maxBtn = 5;
        const half = Math.floor(maxBtn / 2);
        let startPage = Math.max(1, currentPage - half);
        let endPage = startPage + maxBtn - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxBtn + 1);
        }

        return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
    };

    return (
        <div className="flex items-center justify-center gap-2 m-2">
            <button className='bg-main text-white rounded-md px-3 py-1 disabled:opacity-40'
                    onClick={onFirstPage}>&lt;&lt;</button>
            <button
                className="bg-main text-white rounded-md px-3 py-1 disabled:opacity-40"
                onClick={onPrevPage}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md border ${
                        page === currentPage
                            ? "bg-main text-white"
                            : "bg-white text-black hover:bg-gray-100"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                className="bg-main text-white rounded-md px-3 py-1 disabled:opacity-40"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
            <button className="bg-main text-white rounded-md px-3 py-1 disabled:opacity-40"
                    onClick={onLastPage}>&gt;&gt;</button>
        </div>
    );
}
