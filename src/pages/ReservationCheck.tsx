import { useState } from "react";
import { CardItemProps } from "../components/CardItem";
import place from '@/assets/images/place.png';
import CircleBtn from "../components/Button/CircleBtn";
import filter from '@/assets/images/filter.png';
import List from "../components/List";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import RoundedBtn from "../components/Button/RoundedBtn";
import { PostWriteModal } from "../components/PostWriteModal";


export default function ReservationCheck(){
    const mockData: CardItemProps[] = Array.from({length:23}, (_, i) => ({
        id : i + 1,
        image: place,
        restaurantName: `센시티브 서울 ${i+1}`,
        description: '서울특별시 용산구 대사관로11길 49 2f',
        reservationInfo: '2025.05.08 (목) 2명 13:37',
        button: <RoundedBtn text='게시글 작성하러 가기' width="w-[350px]" bgColor="bg-main" height="h-[30px]" textColor="text-white" hoverBorderColor="hover:border-accent" hoverColor="hover:bg-white" hoverTextColor="hover:text-main" onClick={() => setIsModalOpen(true)} />,
        buttonPosition: 'bottom'
    }));

    const itemsPerPage = 6;
    const {currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage} = usePagination(mockData.length, itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const PaginaetedItems = mockData.slice(startIdx, startIdx + itemsPerPage);

    // PostWriteModal 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
        <div className="pt-[80px] m-4">
            <div>
                <List items={PaginaetedItems}/>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onNextPage={goToNextPage} onPrevPage={goToPrevPage} onFirstPage={goToFirstPage} onLastPage={goToLastPage} onPageChange={setPage}/>
                </div>
            </div>
            {/* PostWriteModal 열기 */}
            {isModalOpen && <PostWriteModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    )
}
