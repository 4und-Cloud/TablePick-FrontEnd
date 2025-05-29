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

interface PostData {
  id: number;
  content: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCategoryName: string;
  memberNickname: string;
  memberProfileImage: string;
  //tagNames: string[];
  imageUrl: string;
}

export default function PostList(){

  const [postList, setPostList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { currentPage, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage } = usePagination(totalPages);

  const tagElements = selectedTags.map((tag, index) => (
    <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
  ));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
        const res = await axios.get(`${apiUrl}/api/boards/list?page=${currentPage}&size=6`, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
          },
        });
        const posts: PostData[] = res.data.boardList || [];
        const totalPagesFromBackend = res.data.totalPages || 1;
        setTotalPages(totalPagesFromBackend);

        const convertedData : CardItemProps[] = posts.map((item: PostData, i: number) => ({
          id: item.id || i + 1,
          description: item.content || '내용 없음',
          restaurantName: item.restaurantName || '정보 없음',
          restaurantAddress: item.restaurantAddress || '정보 없음',
          restaurantCategoryName: item.restaurantCategoryName || '정보 없음',
          memberNickname: item.memberNickname || '정보 없음',
          memberProfileImage: item.memberProfileImage || defaultProfile,
          //tagNames: item.tagNames || [],
          image:item.imageUrl,
        }));

        setPostList(convertedData);
      } catch (error) {
        console.log('게시글 리스트 불러오기 실패:', error);
        setPostList([]);
        setTotalPages(1);
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
