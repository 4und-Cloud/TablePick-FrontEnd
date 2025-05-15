import { CardItemProps } from "../components/CardItem";
import place from '@/assets/images/place.png';
import CircleBtn from "../components/Button/CircleBtn";
import filter from '@/assets/images/filter.png';
import List from "../components/List";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import FilterModal from "../components/FilterModal";
import useModal from "../hooks/useModal";
import { useState, useEffect } from "react";
import RestaurantDetail from "./RestaurantDetail";



export default function RestaurantList() {
  const [restaurantList, setRestaurantList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  const { isOpen, openModal, closeModal } = useModal({ initialState: false });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage } =
    usePagination(restaurantList.length, itemsPerPage);

  // ✅ fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_TABLE_PICK_URL}/api/restaurants/list`); 
        const data = await res.json();
         console.log(data); // 실제 데이터 형태 확인해보기

        // ✅ CardItemProps에 맞게 데이터 변환
        const convertedData = data.map((item: any, i: number) => ({
          id: item.id || i + 1,
          image: place, // 백엔드에서 이미지 URL이 오면 그걸로 바꿔도 됨
          restaurantName: item.name || `식당 ${i + 1}`,
          description: item.address || '주소 없음',
          tags: item.tags || ['기본 태그'],
        }));

        setRestaurantList(convertedData);
      } catch (error) {
        console.error("식당 리스트 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const PaginatedItems = restaurantList.slice(startIdx, startIdx + itemsPerPage);

  const tagElements = selectedTags.map((tag, index) => (
    <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
  ));

  return (
    <div className="pt-[80px]">
      <div className="flex justify-between mx-6 my-2 flex-row">
        <div className="flex overflow-x-auto items-center justify-center">{tagElements}</div>
        <CircleBtn onClick={openModal} image={filter} bgColor="bg-white" />
      </div>

      {isOpen && (
        <FilterModal
          onClose={closeModal}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          mode="filter"
        />
      )}

      <div>
        {loading ? (
          <p className="text-center my-10">불러오는 중...</p>
        ) : (
          <>
            <List linkTo="restaurants" items={PaginatedItems} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
