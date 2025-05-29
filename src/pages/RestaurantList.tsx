import type { CardItemProps } from '../components/CardItem';
import place from '@/assets/images/place.png';
import List from '../components/List';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTagContext } from '../store/TagContext'; 

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

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tags: allAvailableTags } = useTagContext(); 
  
  const {
    currentPage,
    goToNextPage,
    goToPrevPage,
    setPage, 
    goToFirstPage,
    goToLastPage,
  } = usePagination(totalPages);

  useEffect(() => {
     const fetchData = async () => {
       setLoading(true);
       try {
         const apiUrl = 'http://localhost:8080';
         let url = `${apiUrl}/api/restaurants/search`;

         const currentKeyword = searchParams.get('keyword') || '';
         const currentTagIds = searchParams.get('tagIds')
           ? searchParams.get('tagIds')?.split(',').map(Number).filter(id => !isNaN(id)) || []
           : [];

        
         const urlPage = parseInt(searchParams.get('page') || '1'); 
         const safeUrlPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage; 

         if (safeUrlPage - 1 !== currentPage) {
             setPage(safeUrlPage - 1); 
         }

         const queryParams: string[] = [];
         queryParams.push(`page=${safeUrlPage}`); 

         if (currentKeyword) {
           queryParams.push(`keyword=${encodeURIComponent(currentKeyword)}`);
         }
         if (currentTagIds.length > 0) {
           queryParams.push(`tagIds=${currentTagIds.join(',')}`);
         }

         url += `?${queryParams.join('&')}`;

         console.log("RestaurantList Fetching URL:", url);

         const res = await axios.get(url, {
           withCredentials: true,
           headers: {
             Accept: 'application/json',
           },
         });

         const restaurants: RestaurantData[] = res.data.restaurants || [];
         const totalPagesFromBackend = res.data.totalPages || 1;
         setTotalPages(totalPagesFromBackend);

         const convertedData: CardItemProps[] = restaurants.map((item: RestaurantData, i: number) => ({
           id: item.id || i + 1,
           image: item.restaurantImage || place,
           restaurantName: item.name || `식당 ${i + 1}`,
           description: item.address || '주소 없음',
           tags: item.restaurantTags,
         }));

         setRestaurantList(convertedData);
       } catch (error) {
         console.error('식당 리스트 불러오기 실패:', error);
         setRestaurantList([]);
         setTotalPages(1);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, [searchParams]);

  const currentKeyword = searchParams.get('keyword') || '';
  const currentTagIds = searchParams.get('tagIds')
    ? searchParams.get('tagIds')?.split(',').map(Number).filter(id => !isNaN(id)) || []
    : [];

  const displayedTagElements = currentTagIds.map(tagId => {
    const tag = allAvailableTags.find(t => t.id === tagId);
    return tag ? (
      <span
        key={tag.id}
        className="bg-main text-white py-1 px-4 rounded-full mr-2"
      >
        {tag.name}
      </span>
    ) : null;
  });

  return (
    <div >
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
            <List linkTo="restaurants" items={restaurantList} /> 
            <Pagination
               currentPage={currentPage} 
               totalPages={totalPages}
               onNextPage={() => {
                 const newPage = currentPage + 1 + 1; 
                 const newSearchParams = new URLSearchParams(searchParams);
                 newSearchParams.set('page', newPage.toString());
                 navigate(`?${newSearchParams.toString()}`, { replace: true });
               }}
               onPrevPage={() => {
                 const newPage = currentPage - 1 + 1; 
                 const newSearchParams = new URLSearchParams(searchParams);
                 newSearchParams.set('page', newPage.toString());
                 navigate(`?${newSearchParams.toString()}`, { replace: true });
               }}
               onFirstPage={() => {
                 const newSearchParams = new URLSearchParams(searchParams);
                 newSearchParams.set('page', '1'); 
                 navigate(`?${newSearchParams.toString()}`, { replace: true });
               }}
               onLastPage={() => {
                 const newSearchParams = new URLSearchParams(searchParams);
                 newSearchParams.set('page', totalPages.toString());
                 navigate(`?${newSearchParams.toString()}`, { replace: true });
               }}
               onPageChange={(pageNumber) => { 
                 const newSearchParams = new URLSearchParams(searchParams);
                 newSearchParams.set('page', (pageNumber + 1).toString()); 
                 navigate(`?${newSearchParams.toString()}`, { replace: true });
               }}
             />
          </>
        )}
      </div>
    </div>
  );
}