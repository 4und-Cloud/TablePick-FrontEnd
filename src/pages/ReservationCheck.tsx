import { useEffect, useState } from "react";
import { CardItemProps } from "../components/CardItem";
import place from '@/assets/images/place.png';
import List from "../components/List";
import RoundedBtn from "../components/Button/RoundedBtn";
import { PostWriteModal } from "../components/Modal/PostWriteModal";

interface ReservationData {
  id: number;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  reservationStatus: string;
}

export default function ReservationCheck(){
  // const mockData: CardItemProps[] = Array.from({length:23}, (_, i) => ({
    //     id : i + 1,
    //     image: place,
    //     restaurantName: `센시티브 서울 ${i+1}`,
    //     description: '서울특별시 용산구 대사관로11길 49 2f',
    //     reservationInfo: '2025.05.08 (목) 2명 13:37',
    //     button: <RoundedBtn text='게시글 작성하러 가기' width="w-[350px]" bgColor="bg-main" height="h-[30px]" textColor="text-white" hoverBorderColor="hover:border-accent" hoverColor="hover:bg-white" hoverTextColor="hover:text-main" onClick={() => setIsModalOpen(true)} />,
    //     buttonPosition: 'bottom'
    // }));

    // const itemsPerPage = 6;
    //const {currentPage, totalPages, goToNextPage, goToPrevPage, setPage, goToFirstPage, goToLastPage} = usePagination(mockData.length, itemsPerPage);
    //const startIdx = (currentPage - 1) * itemsPerPage;
    //const PaginaetedItems = mockData.slice(startIdx, startIdx + itemsPerPage);

    // PostWriteModal 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState<CardItemProps[]>([]);

  useEffect(() => {
    fetchReservationCheck();
  }, []);

  const fetchReservationCheck = async () => {
    try {
      const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
      const res = await fetch(`${apiUrl}/api/members/reservations`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log('응답 실패 :', errorText);
        throw new Error('예약 정보 불러오기 실패');
      };

      const data: ReservationData[] = await res.json();
      console.log('data : ', data);

      // const formattedReservations: CardItemProps[] = data.map(reservations => ({
      //   id: reservations.id,
        
      // }))
    } catch (error) {
      console.log('데이터 불러오기 실패');
      }
    }

    return(
        <div className="pt-[80px] m-4">
            <div>
                {/* <List items={PaginaetedItems}/> */}
                <div>
                    {/* <Pagination currentPage={currentPage} totalPages={totalPages} onNextPage={goToNextPage} onPrevPage={goToPrevPage} onFirstPage={goToFirstPage} onLastPage={goToLastPage} onPageChange={setPage}/> */}
                </div>
            </div>
            {/* PostWriteModal 열기 */}
            {isModalOpen && <PostWriteModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    )
}
