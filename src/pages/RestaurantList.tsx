import type { CardItemProps } from "../components/CardItem";
import List from "../components/List";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTagContext } from "../store/TagContext";
import { debounce } from 'lodash';
import api from "../lib/api";
import defaultImg from '@/assets/images/logo.png';


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
  const { tags: allAvailableTags } = useTagContext();

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

        // 검색 조건에 따라 API 엔드포인트 선택
        let url: string;
        const queryParams: string[] = [];
        queryParams.push(`page=${currentPage}`);
        queryParams.push(`size=6`);

        if (currentKeyword || currentTagIds.length > 0) {
          // 검색 조건이 있을 경우 /search 호출
          url = `/api/restaurants/search`;
          if (currentKeyword) {
            queryParams.push(`keyword=${encodeURIComponent(currentKeyword)}`);
          }
          if (currentTagIds.length > 0) {
            queryParams.push(`tagIds=${currentTagIds.join(",")}`);
          }
        } else {
          // 검색 조건이 없으면 /list 호출
          url = `/api/restaurants/list`;
        }

        url += `?${queryParams.join("&")}`;

        const res = await api.get(url);

        const restaurants: RestaurantData[] = res.data.restaurants || [];
        const totalPagesFromBackend = res.data.totalPages || 1;
        setTotalPages(totalPagesFromBackend);

        const convertedData: CardItemProps[] = restaurants.map((item: RestaurantData, i: number) => ({
          id: item.id || i + 1,
          image: item.restaurantImage || defaultImg,
          restaurantName: item.name || `식당 ${i + 1}`,
          description: item.address || "주소 없음",
          tags: item.restaurantTags || [],
          linkTo: `/restaurants/${item.id}`
        }));

        setRestaurantList(convertedData);
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
    const tag = allAvailableTags.find((t) => t.id === tagId);
    return tag ? (
      <span key={tag.id} className="bg-main text-white py-1 px-4 rounded-full mr-2">
        {tag.name}
      </span>
    ) : null;
  });

  return (
    <div>
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