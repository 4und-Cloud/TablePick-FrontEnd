import location from '@/assets/images/location.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useModal from '../hooks/useModal';

type PostData = {
  id: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCategoryName: { id: number; name: string }
  memberNickname: string;
  memberProfileImage: string;
  content: string;
  tagNames: string[];
  imageUrls: { imageUrl: string }
  createdAt: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData ] = useState<PostData | null>(null);
  //const { isOpen, openModal, closeModal } = useModal({ initialState: false });
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/boards/${id}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.log('게시글 데이터 불러오기 실패 ');
      }
    }
    if (id) fetchPost();
  }, [id]);

  return (
    <div className="p-5">
      {/* 상단 정보 (위치 + 작성일자) */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <img src={location} className="w-[16px] h-[16px]" alt="Location Icon" />
          <p className="ml-2">{data?.restaurantName}</p>
        </div>
        <div>
          <p>{ data?.createdAt}</p> {/* 임시 작성일자 */}
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="flex flex-row gap-2 my-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-[calc(33.333%-1rem)] aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={data?.imageUrls.imageUrl} className="object-cover w-full h-full rounded-lg"
                                referrerPolicy="no-referrer"/>
          </div>
        ))}
      </div>

      {/* 태그 영역 */}
      {/* <div className="my-4">
        <p className="font-semibold text-gray-800">태그</p>
        <div className="flex flex-wrap gap-2">
          {data..map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-500 py-1 px-3 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div> */}

      {/* 내용 영역 */}
      <div className="my-4">
        <p className="font-semibold text-gray-800">내용</p>
        <p className="text-gray-600">{data?.content}</p>
      </div>
    </div>
  );
}
