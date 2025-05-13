import { CardItemProps } from "../components/CardItem";
import place from '@/assets/images/place.png';
import CircleBtn from "../components/Button/CircleBtn";
import filter from '@/assets/images/filter.png';
import List from "../components/List";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useModal from "../hooks/useModal";
import FilterModal from "../components/FilterModal";
import { useState } from "react";

export default function PostList(){
    const mockData: CardItemProps[] = Array.from({length:23}, (_, i) => ({
        id : i + 1,
        image: place,
        restaurantName: `센시티브 서울 ${i+1}`,
        description: '서울특별시 용산구 대사관로11길 49 2f',
        tags: ['조용해요', '주차 편해요', '분위기 좋아요', '데이트 장소', '느좋'],
        // reservationInfo: '2025.05.08 (목) 2명 13:37',
        //button: <RoundedBtn text='게시글 작성하러 가기' width="w-[350px]" bgColor="bg-main" height="h-[30px]" textColor="text-white" hoverBorderColor="hover:border-accent" hoverColor="hover:bg-white" hoverTextColor="hover:text-main"/>,
        // buttonPosition: 'bottom'
    }));

    const itemsPerPage = 6;

    const {isOpen, openModal, closeModal} = useModal({initialState : false});
    const [selectedTags, setSelectedTags] =useState<string[]>([]);

    const {currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage} = usePagination(mockData.length, itemsPerPage);

    const startIdx = (currentPage - 1) * itemsPerPage;
    const PaginatedItems = mockData.slice(startIdx, startIdx + itemsPerPage);

    const tagElements = selectedTags.map((tag, index) => (
        <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
    ));
    return(
    
            <div className="pt-[80px]">
            <div className="flex justify-between mx-6 my-2 flex-row">
                <div className="flex overflow-x-auto items-center justify-center">
                    {tagElements}
                </div>
                <CircleBtn onClick={openModal} image={filter} bgColor="bg-white"/>
            </div> 
            
            {isOpen ? (<FilterModal onClose={closeModal} selectedTags={selectedTags} setSelectedTags={setSelectedTags} mode="filter" />) : null}
            <div>
                <List linkTo="posts" items={PaginatedItems}/>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onNextPage={goToNextPage} onPrevPage={goToPrevPage} onFirstPage={goToFirstPage} onLastPage={goToLastPage} onPageChange={setPage}/>
                </div>
            </div>
        </div>
        
        
        
    )
}