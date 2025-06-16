import { CardItemProps } from "@/@shared/types/cardItemsType";
import List from "@/@shared/components/List";
import Pagination from "@/@shared/components/Pagination";
import usePagination from "@/@shared/hook/usePagination";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTagQuery } from "@/entities/tag/hook/useTagQuery";
import { debounce } from 'lodash';
import defaultImg from '@/@shared/images/logo.png';
import { fetchRestaurantsList } from "@/entities/restaurants/api/fetchRestaurants";


interface RestaurantData {
  id: number;
  name: string;
  address: string;
  restaurantPhoneNumber: string;
  restaurantCategory: {
    id: number;
    name: string;
  };
  restaurantImage: string;
  restaurantOperatingHours: Array<{
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    holiday: boolean;
  }>;
  restaurantTags: string[];
}

export default function RestaurantList() {
  const [restaurantList, setRestaurantList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: tagsItem, isLoading, isError } = useTagQuery();
  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>태그 데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!tagsItem) return null;

  const { currentPage, setPage, goToNextPage, goToPrevPage, goToFirstPage, goToLastPage } =
    usePagination(totalPages);

  // URL 동기화
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1");
    const safeUrlPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
    const zeroBasedPage = safeUrlPage - 1; // URL은 1-based, 훅은 0-based

    setPage(zeroBasedPage);
  }, [searchParams, setPage]);

  // 데이터 가져오기 (debounce 적용)
  const fetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const currentKeyword = searchParams.get("keyword") || "";
        const currentTagIds = searchParams.get("tagIds")
          ? searchParams.get("tagIds")?.split(",").map(Number).filter((id) => !isNaN(id)) || []
          : [];

        const { restaurants, totalPages } = await fetchRestaurantsList(currentPage, currentKeyword, currentTagIds);

        const convertedData: CardItemProps[] = restaurants.map((item: RestaurantData, i: number) => ({
          id: item.id || i + 1,
          image: item.restaurantImage || defaultImg,
          restaurantName: item.name || `식당 ${i + 1}`,
          description: item.address || "주소 없음",
          tags: item.restaurantTags || [],
          linkTo: `/restaurants/${item.id}`
        }));

        setRestaurantList(convertedData);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("식당 리스트 불러오기 실패:", error);
        setRestaurantList([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }, 300),
    [currentPage, searchParams]
  );

  useEffect(() => {
    fetchData();
    return () => fetchData.cancel(); // 클린업
  }, [fetchData]);

  const updateUrlPage = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString()); // 1-based로 URL 설정
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  const currentKeyword = searchParams.get("keyword") || "";
  const currentTagIds = searchParams.get("tagIds")
    ? searchParams.get("tagIds")?.split(",").map(Number).filter((id) => !isNaN(id)) || []
    : [];

  const displayedTagElements = currentTagIds.map((tagId) => {
    const tag = tagsItem.find((t) => t.id === tagId);
    return tag ? (
      <span key={tag.id} className="bg-main text-white py-1 px-4 rounded-full mr-2">
        {tag.name}
      </span>
    ) : null;
  });

  return (
    <div className="mx-[300px]">
      <div className="flex justify-between mx-6 my-2 flex-row">
        <div className="flex overflow-x-auto items-center justify-center">
          {displayedTagElements}
          {currentKeyword && (
            <span className="bg-gray-200 text-gray-800 py-1 px-4 rounded-full mr-2">
              검색어: {currentKeyword}
            </span>
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <p className="text-center my-10">불러오는 중...</p>
        ) : (
          <>
            {restaurantList.length === 0 && (
              <p className="text-center my-10 text-gray-500">검색 결과가 없습니다.</p>
            )}
            <List items={restaurantList} />
            <Pagination
              currentPage={currentPage + 1} // 0-based -> 1-based로 UI 표시
              totalPages={totalPages}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              onPageChange={(pageNumberFromPagination) => {
                updateUrlPage(pageNumberFromPagination); // 1-based로 URL 업데이트
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}