import { CardItemProps } from "@/@shared/types/cardItemsType";
import List from "@/@shared/components/List";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useTagQuery } from "@/entities/tag/hook/useTagQuery";
import defaultImg from "@/@shared/images/logo.png";
import { fetchRestaurantsList } from "@/entities/restaurants/api/fetchRestaurants";
import { RestaurantListData } from "@/entities/restaurants/types/restaurantType";
import useIntersectionObserver from "@/@shared/hook/useIntersectionObserver";

export default function RestaurantList() {
  const [restaurantList, setRestaurantList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams] = useSearchParams();

  const { data: tagsItem, isLoading, isError } = useTagQuery();
  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>태그 데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!tagsItem) return null;

  const getCurrentSearchParams = () => {
    const currentKeyword = searchParams.get("keyword") || "";
    const currentTagIds = searchParams.get("tagIds")
      ? searchParams.get("tagIds")?.split(",").map(Number).filter((id) => !isNaN(id)) || []
      : [];
    return { currentKeyword, currentTagIds };
  };

  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (fetchPage: number, keyword: string, tagIds: number[], isInitialLoad: boolean) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setLoading(true);
      try {
        const { restaurants, totalPages: fetchedTotalPages } = await fetchRestaurantsList(fetchPage, keyword, tagIds);
        console.log("Fetched restaurants:", restaurants);
        console.log("Total pages:", fetchedTotalPages);
        const converted: CardItemProps[] = restaurants.map(
          (item: RestaurantListData): CardItemProps => ({
            id: item.id,
            image: item.restaurantImage || defaultImg,
            restaurantName: item.name,
            description: item.address,
            tags: item.restaurantTags || [],
            linkTo: `/restaurants/${item.id}`,
          })
        );

        setRestaurantList((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = converted.filter((item) => !existingIds.has(item.id));
          console.log("Adding items:", newItems);
          return isInitialLoad ? newItems : [...prev, ...newItems];
        });
        setHasMore(fetchPage < fetchedTotalPages - 1);
      } catch (error) {
        console.error("Fetch error:", error);
        setHasMore(false);
      } finally {
        isFetching.current = false;
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    console.log("Search params changed:", searchParams.toString());
    setPage(0);
    setRestaurantList([]);
    setHasMore(true);
    setLoading(true);
    isFetching.current = false;
    const { currentKeyword, currentTagIds } = getCurrentSearchParams();
    fetchData(0, currentKeyword, currentTagIds, true);
  }, [searchParams, fetchData]);

  useEffect(() => {
    if (page === 0) return;
    console.log("Page changed:", page);
    const { currentKeyword, currentTagIds } = getCurrentSearchParams();
    fetchData(page, currentKeyword, currentTagIds, false);
  }, [page, fetchData]);

  const sentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (!loading && hasMore && !isFetching.current) {
        console.log("Intersection Observer triggered, incrementing page");
        setPage((p) => {
          const nextPage = p + 1;
          console.log(`New page: ${nextPage}`);
          return nextPage;
        });
      }
    }, [loading, hasMore])
  );

  const { currentKeyword, currentTagIds } = getCurrentSearchParams();

  const displayedTagElements = currentTagIds.map((tagId) => {
    const tag = tagsItem.find((t) => t.id === tagId);
    return tag ? (
      <span key={tag.id} className="bg-main text-white py-1 px-4 rounded-full mr-2">
        {tag.name}
      </span>
    ) : null;
  });

  useEffect(() => {
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
      if (!loading && hasMore && !isFetching.current) {
        console.log("Scroll event triggered, incrementing page");
        setPage((p) => {
          const nextPage = p + 1;
          console.log(`New page: ${nextPage}`);
          return nextPage;
        });
      }
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [loading, hasMore]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between my-2">
        <div className="flex overflow-x-auto items-center">
          {displayedTagElements}
          {currentKeyword && (
            <span className="bg-gray-200 text-gray-800 py-1 px-4 rounded-full mr-2">
              검색어: {currentKeyword}
            </span>
          )}
        </div>
      </div>

      {restaurantList.length === 0 && !loading ? (
        <p className="text-center my-10 text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <>
          <List items={restaurantList} />
          {hasMore && (
            <div ref={sentinelRef} id="sentinel" className="my-4">
              {loading ? (
                <p className="text-center text-gray-500">더 많은 식당을 불러오는 중...</p>
              ) : (
                <div className="w-full h-[100px]" />
              )}
            </div>
          )}
          {loading && <p className="text-center my-4 text-gray-500">불러오는 중...</p>}
          {!hasMore && !loading && (
            <p className="text-center my-4 text-gray-500">모든 식당을 불러왔습니다.</p>
          )}
        </>
      )}
    </div>
  );
}