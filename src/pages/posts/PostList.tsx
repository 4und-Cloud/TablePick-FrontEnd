import { CardItemProps } from "@/@shared/components/CardItem";
import Pagination from "@/@shared/components/Pagination";
import usePagination from "@/@shared/hook/usePagination";
import React, { useEffect, useState, Suspense } from "react";
import defaultProfile from "@/@shared/images/user.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/@shared/api/api";

const LazyList = React.lazy(() => import('@/@shared/components/List'));

interface PostData {
  id: number;
  content: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCategoryName: string;
  memberNickname: string; 
  memberProfileImage: string;
  imageUrl: string;
}

export default function PostList() {
  const [postList, setPostList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPagesFromAPI, setTotalPagesFromAPI] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { currentPage, setPage, goToNextPage, goToPrevPage, goToFirstPage, goToLastPage } =
    usePagination(totalPagesFromAPI);

  const [selectedTags] = useState<string[]>([]);

  const tagElements = selectedTags.map((tag, index) => (
    <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
  ));

  useEffect(() => {
  const urlPage = parseInt(searchParams.get("page") || "1");
  const safeUrlPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
  const zeroBasedPage = safeUrlPage - 1;

  // URL에서 가져온 페이지와 다를 경우만 설정
  setPage(zeroBasedPage);
  // 의존성 배열에서 currentPage 제거
}, [searchParams, setPage]);

// 2. currentPage가 바뀔 때 API 요청
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const restaurantId = searchParams.get("restaurantId");

      let reqUrl: string;

      if (restaurantId) {
        reqUrl = `/api/boards/restaurant/${restaurantId}`;
      } else {
        reqUrl = `/api/boards/list?page=${currentPage}&size=6`;
      }

      const res = await api.get(reqUrl);

      const postsToSet = restaurantId
        ? Array.isArray(res.data)
          ? res.data
          : res.data
          ? [res.data]
          : []
        : res.data.boardList || [];

      const totalPages = restaurantId ? 1 : res.data.totalPages || 1;

      const convertedData: CardItemProps[] = postsToSet.map((item: PostData, i: number) => ({
        id: item.id || i + 1,
        description: item.content || "내용 없음",
        restaurantName: item.restaurantName || "정보 없음",
        restaurantAddress: item.restaurantAddress || "정보 없음",
        restaurantCategoryName: item.restaurantCategoryName || "정보 없음",
        memberNickname: item.memberNickname || "정보 없음",
        memberProfileImage: item.memberProfileImage || defaultProfile,
        image: item.imageUrl,
        linkTo: `/posts/${item.id}`
      }));

      setPostList(convertedData);
      setTotalPagesFromAPI(totalPages);
    } catch (error) {
      console.error("게시글 리스트 불러오기 실패:", error);
      setPostList([]);
      setTotalPagesFromAPI(1);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [currentPage, searchParams.get("restaurantId")]);

  const updateUrlPage = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString()); // 1-based로 URL 설정
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  return (
    <div>
      <div className="flex justify-between mx-6 my-2 flex-row">
        <div className="flex overflow-x-auto items-center justify-center">{tagElements}</div>
      </div>

      <div>
        {loading ? (
          <p className="text-center my-10">불러오는 중...</p>
        ) : (
          <>
            {postList.length === 0 && (
              <p className="text-center my-10 text-gray-500">게시글이 없습니다.</p>
              )}
              <Suspense fallback>
                <LazyList  items={postList} />
              </Suspense>
           
            <Pagination
              currentPage={currentPage + 1} // 0-based -> 1-based로 변환하여 UI에 표시
              totalPages={totalPagesFromAPI}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              onPageChange={(pageNumberFromPagination) => {
                updateUrlPage(pageNumberFromPagination); // 1-based 페이지로 URL 업데이트
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}