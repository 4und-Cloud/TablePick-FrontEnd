// import { CardItemProps } from "../components/CardItem";
// import place from '@/assets/images/place.png';
// import List from "../components/List";
// import Pagination from "../components/Pagination";
// import usePagination from "../hooks/usePagination";
// import RoundedBtn from "../components/Button/RoundedBtn";
// import { useState } from "react";
// import { PostWriteModal } from "../components/Modal/PostWriteModal";
//
// export default function MyPosts() {
//   const mockData: CardItemProps[] = Array.from({ length: 23 }, (_, i) => ({
//     id: i + 1,
//     image: place,
//     restaurantName: `센시티브 서울 ${i + 1}`,
//     description: '서울특별시 용산구 대사관로11길 49 2f',
//     button: (
//       <RoundedBtn
//         text="게시글 수정하기"
//         width="w-[350px]"
//         bgColor="bg-main"
//         height="h-[30px]"
//         textColor="text-white"
//         hoverBorderColor="hover:border-accent"
//         hoverColor="hover:bg-white"
//         hoverTextColor="hover:text-main"
//       />
//     ),
//     buttonPosition: 'bottom',
//   }));
//
//   // initialData 정의 (예시로 초기값 설정)
//   const initialData = {
//     restaurant: "초기 식당명", // 기본값
//     content: "초기 내용", // 기본값
//   };
//
//   // 상태 설정 (기본값 처리)
// // 상태를 `string | undefined`로 정의
// const [restaurant, setRestaurant] = useState<string>('');
// const [content, setContent] = useState<string>('');
//
//
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<CardItemProps | null>(null);
//
//   const itemsPerPage = 6;
//
//   const { currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage } = usePagination(mockData.length, itemsPerPage);
//
//    const startIdx = (currentPage - 1) * itemsPerPage;
//    const PaginatedItems = mockData.slice(startIdx, startIdx + itemsPerPage);
//
//   const handleEditClick = (post: CardItemProps) => {
//     setSelectedPost(post); // 클릭된 게시글의 데이터를 설정
//     setIsModalOpen(true); // 모달을 엶
//   };
//
//   return (
//     <div className="pt-[80px] m-4">
//       <div>
//         <List
//           items={PaginatedItems.map((post) => ({
//             ...post,
//             button: (
//               <RoundedBtn
//                 text="게시글 수정하기"
//                 width="w-[350px]"
//                 bgColor="bg-main"
//                 height="h-[30px]"
//                 textColor="text-white"
//                 hoverBorderColor="hover:border-accent"
//                 hoverColor="hover:bg-white"
//                 hoverTextColor="hover:text-main"
//                 onClick={() => handleEditClick(post)} // 수정 버튼 클릭 시 모달 열기
//               />
//             ),
//           }))}
//         />
//         <div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onNextPage={goToNextPage}
//             onPrevPage={goToPrevPage}
//             onFirstPage={goToFirstPage}
//             onLastPage={goToLastPage}
//             onPageChange={setPage}
//           />
//         </div>
//       </div>
//
//       {/* 수정 모드로 PostWriteModal 열기 */}
//       {isModalOpen && selectedPost && (
//         <PostWriteModal
//           closeModal={() => setIsModalOpen(false)}
//           initialData={{
//             restaurant: selectedPost.restaurantName, // 식당명
//             content: selectedPost.description, // 내용
//             selectedTags: [], // 태그 초기화, 필요한 데이터로 수정 가능
//           }}
//         />
//       )}
//     </div>
//   );
// }
