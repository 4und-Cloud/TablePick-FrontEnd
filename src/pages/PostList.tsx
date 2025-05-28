import { CardItemProps } from "../components/CardItem";
import place from '@/assets/images/place.png';
import CircleBtn from "../components/Button/CircleBtn";
import filter from '@/assets/images/filter.png';
import List from "../components/List";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useModal from "../hooks/useModal";
import FilterModal from "../components/Modal/FilterModal";
import { useEffect, useState } from "react";
import defaultProfile from '@/assets/images/user.png';
import axios from "axios";

export default function PostList(){
    // const mockData: CardItemProps[] = Array.from({length:23}, (_, i) => ({
    //     id : i + 1,
    //     image: place,
    //     restaurantName: `센시티브 서울 ${i+1}`,
    //     description: '서울특별시 용산구 대사관로11길 49 2f',
    //     tags: ['조용해요', '주차 편해요', '분위기 좋아요', '데이트 장소', '느좋'],
    //     // reservationInfo: '2025.05.08 (목) 2명 13:37',
    //     //button: <RoundedBtn text='게시글 작성하러 가기' width="w-[350px]" bgColor="bg-main" height="h-[30px]" textColor="text-white" hoverBorderColor="hover:border-accent" hoverColor="hover:bg-white" hoverTextColor="hover:text-main"/>,
    //     // buttonPosition: 'bottom'
    // }));
  const [postList, setPostList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);


    // const itemsPerPage = 6;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { currentPage, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage } = usePagination(totalPages);

  const tagElements = selectedTags.map((tag, index) => (
    <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
  ));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL || 'http://localhost:8080';
        const res = await axios.get(`${apiUrl}/api/boards/list?page=${currentPage}&size=6`, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
          },
        });
        const posts = res.data.boardList || [];
        const totalPagesFromBackend = res.data.totalPages || 1;
        setTotalPages(totalPagesFromBackend);

        const convertedData = posts.map((item: any, i: number) => ({
          id: item.id || i + 1,
          description: item.content || '내용 없음',
          restaurantName: item.restaurantName || '정보 없음',
          restaurantAddress: item.restaurantAddress || '정보 없음',
          restaurantCategoryName: item.restaurantCategoryName || '정보 없음',
          memberNickname: item.memberNickname || '정보 없음',
          memberProfileImage: item.memberProfileImage || defaultProfile,
          tagNames: item.tagNames || [],
          image: item.imageUrl || '정보 없음'
        }));

        setPostList(convertedData);
      } catch (error) {
        console.log('게시글 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);


    return(
          <div>
            <div className="flex justify-between mx-6 my-2 flex-row">
                <div className="flex overflow-x-auto items-center justify-center">
                    {tagElements}
                </div>
            </div>

            <div>
                <List linkTo="posts" items={postList}/>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onNextPage={goToNextPage} onPrevPage={goToPrevPage} onFirstPage={goToFirstPage} onLastPage={goToLastPage} onPageChange={setPage}/>
                </div>
            </div>
        </div>



    )
}
