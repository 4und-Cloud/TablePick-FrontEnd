import CardItem from "../components/CardItem";
import place from '@/assets/images/place.png';
import TextBtn from "../components/Button/TextBtn";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";

export default function Landing(){
    const {currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage} = usePagination(100, 10);
    return(
        <div className="pt-[90px]">
            <CardItem image={place} restaurantName="센시티브서울" description="주소즈소즈소즈즈소즈조스주소주소"
            button = {<TextBtn text="수정하기 ->" />}
            reservationInfo={
                <div  className="flex gap-2">
                    <span>2025.04.28 (월)</span>
                    <span>2명</span>
                    <span>12:30</span>
                </div>
            }
            buttonPosition="middleRight"/>
            <div className="mb-6">
      </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} onPrevPage={goToPrevPage} onNextPage={goToNextPage} onFirstPage={goToFirstPage} onLastPage={goToLastPage}/>
            <p>랜딩</p>
        </div>
        
    )
}