import { CardItemProps } from "../components/CardItem";
import List from "../components/List";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useEffect, useState } from "react";
import defaultProfile from "@/assets/images/user.png";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    const zeroBasedPage = safeUrlPage - 1; // URL은 1-based, 훅은 0-based

    if (zeroBasedPage !== currentPage) {
      setPage(zeroBasedPage);
    }
  }, [searchParams, currentPage, setPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
        const restaurantId = searchParams.get("restaurantId");

        let reqUrl: string;

        if (restaurantId) {
          reqUrl = `${apiUrl}/api/boards/restaurant/${restaurantId}`;
        } else {
          reqUrl = `${apiUrl}/api/boards/list?page=${currentPage}&size=6`; // 0-based page
        }

        const res = await axios.get(reqUrl, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
          },
        });

        if (restaurantId) {
          const postData = res.data;
          const postsToSet = Array.isArray(postData) ? postData : postData ? [postData] : [];
          const convertedData: CardItemProps[] = postsToSet.map((item: PostData, i: number) => ({
            id: item.id || i + 1,
            description: item.content || "내용 없음",
            restaurantName: item.restaurantName || "정보 없음",
            restaurantAddress: item.restaurantAddress || "정보 없음",
            restaurantCategoryName: item.restaurantCategoryName || "정보 없음",
            memberNickname: item.memberNickname || "정보 없음",
            memberProfileImage: item.memberProfileImage || defaultProfile,
            image: item.imageUrl,
          }));
          setPostList(convertedData);
          setTotalPagesFromAPI(1); // restaurantId로 조회 시 페이지네이션 없음
        } else {
          const posts: PostData[] = res.data.boardList || [];
          const totalPagesFromBackend = res.data.totalPages || 1; // 백엔드에서 1-based totalPages 반환 가정
          setTotalPagesFromAPI(totalPagesFromBackend);

          const convertedData: CardItemProps[] = posts.map((item: PostData, i: number) => ({
            id: item.id || i + 1,
            description: item.content || "내용 없음",
            restaurantName: item.restaurantName || "정보 없음",
            restaurantAddress: item.restaurantAddress || "정보 없음",
            restaurantCategoryName: item.restaurantCategoryName || "정보 없음",
            memberNickname: item.memberNickname || "정보 없음",
            memberProfileImage: item.memberProfileImage || defaultProfile,
            image: item.imageUrl,
          }));
          setPostList(convertedData);
        }
      } catch (error) {
        console.error("게시글 리스트 불러오기 실패:", error);
        setPostList([]);
        setTotalPagesFromAPI(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchParams]);

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
            <List linkTo="posts" items={postList} />
            <Pagination
              currentPage={currentPage + 1} // 0-based -> 1-based로 변환하여 UI에 표시
              totalPages={totalPagesFromAPI}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              onPageChange={(pageNumberFromPagination) => {
                updateUrlPage(pageNumberFromPagination); // 1-based 페이지로 URL 업데이트
                setPage(pageNumberFromPagination - 1); // 0-based로 훅에 설정
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}