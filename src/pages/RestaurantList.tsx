import type { CardItemProps } from '../components/CardItem';
import place from '@/assets/images/place.png';
import CircleBtn from '../components/Button/CircleBtn';
import filter from '@/assets/images/filter.png';
import List from '../components/List';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';
import FilterModal from '../components/Modal/FilterModal';
import useModal from '../hooks/useModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function RestaurantList() {
  const [restaurantList, setRestaurantList] = useState<CardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  // const [backendPage, setBackendPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const itemsPerPage = 6;

  const { isOpen, openModal, closeModal } = useModal({ initialState: false });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    currentPage,
    goToNextPage,
    goToPrevPage,
    setPage,
    goToFirstPage,
    goToLastPage,
  } = usePagination(totalPages);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

  // ✅ fetch restaurant data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'http://localhost:8080';
        let url = '';
        if (keyword) {
          url = `${apiUrl}/api/restaurants/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}`;
        } else {
          url = `${apiUrl}/api/restaurants/list?page=${currentPage}`;
        }

        const res = await axios.get(url, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
          },
        });

        const restaurants = res.data.restaurants || [];
        const totalPagesFromBackend = res.data.totalPages || 1;
        setTotalPages(totalPagesFromBackend);

        const convertedData = restaurants.map((item: any, i: number) => ({
          id: item.id || i + 1,
          image: item.restaurantImage || place,
          restaurantName: item.name || `식당 ${i + 1}`,
          description: item.address || '주소 없음',
          tags: [item.restaurantCategory?.name || '기본 태그'],
        }));

        setRestaurantList(convertedData);
      } catch (error) {
        console.error('식당 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, keyword]);

  const PaginatedItems = restaurantList;

  const tagElements = selectedTags.map((tag, index) => (
    <span
      key={index}
      className="bg-main text-white py-1 px-4 rounded-full mr-2"
    >
      {tag}
    </span>
  ));

  return (
    <div className="pt-[80px]">
      <div className="flex justify-between mx-6 my-2 flex-row">
        <div className="flex overflow-x-auto items-center justify-center">
          {tagElements}
        </div>
        <CircleBtn onClick={openModal} image={filter} bgColor="bg-white" />
      </div>

      {isOpen && (
        <FilterModal
          onClose={closeModal}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
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

// import { CardItemProps } from "../components/CardItem";
// import place from '@/assets/images/place.png';
// import CircleBtn from "../components/Button/CircleBtn";
// import filter from '@/assets/images/filter.png';
// import List from "../components/List";
// import Pagination from "../components/Pagination";
// import usePagination from "../hooks/usePagination";
// import FilterModal from "../components/Modal/FilterModal";
// import useModal from "../hooks/useModal";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {useSearchParams } from "react-router-dom";
//
//
//
// export default function RestaurantList() {
//   const [restaurantList, setRestaurantList] = useState<CardItemProps[]>([]);
//   const [loading, setLoading] = useState(true);
//   // const [backendPage, setBackendPage] = useState(1);
//   const [totalPages, setTotalPages ] = useState(1);
//
//   // const itemsPerPage = 6;
//
//   const { isOpen, openModal, closeModal } = useModal({ initialState: false });
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//
//   const { currentPage,  goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage } =
//     usePagination(totalPages );
//
//   const [searchParams] = useSearchParams();
//   const keyword = searchParams.get('keyword');
//
//   // ✅ fetch restaurant data
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let url = '';
//         if (keyword) {
//           url = `http://localhost:8080/api/restaurants/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}`;
//         } else {
//           url = `http://localhost:8080/api/restaurants/list?page=${currentPage}`;
//         }
//
//         const res = await axios.get(url, {
//           withCredentials: true,
//           headers: {
//             Accept: 'application/json',
//           },
//         });
//
//         const restaurants = res.data.restaurants || [];
//         const totalPagesFromBackend = res.data.totalPages || 1;
//         setTotalPages(totalPagesFromBackend);
//
//         const convertedData = restaurants.map((item: any, i: number) => ({
//           id: item.id || i + 1,
//           image: item.restaurantImage || place,
//           restaurantName: item.name || `식당 ${i + 1}`,
//           description: item.address || '주소 없음',
//           tags: [item.restaurantCategory?.name || '기본 태그'],
//         }));
//
//         setRestaurantList(convertedData);
//       } catch (error) {
//         console.error('식당 리스트 불러오기 실패:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchData();
//   }, [currentPage, keyword]);
//
//
//   const PaginatedItems = restaurantList;
//
//   const tagElements = selectedTags.map((tag, index) => (
//     <span key={index} className="bg-main text-white py-1 px-4 rounded-full mr-2">{tag}</span>
//   ));
//
//   return (
//     <div className="pt-[80px]">
//       <div className="flex justify-between mx-6 my-2 flex-row">
//         <div className="flex overflow-x-auto items-center justify-center">{tagElements}</div>
//         <CircleBtn onClick={openModal} image={filter} bgColor="bg-white" />
//       </div>
//
//       {isOpen && (
//         <FilterModal
//           onClose={closeModal}
//           selectedTags={selectedTags}
//           setSelectedTags={setSelectedTags}
//           mode="filter"
//         />
//       )}
//
//       <div>
//         {loading ? (
//           <p className="text-center my-10">불러오는 중...</p>
//         ) : (
//           <>
//             <List linkTo="restaurants" items={PaginatedItems} />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onNextPage={goToNextPage}
//               onPrevPage={goToPrevPage}
//               onFirstPage={goToFirstPage}
//               onLastPage={goToLastPage}
//               onPageChange={setPage}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
