import location from '@/assets/images/location.png';
import chqkq from '@/assets/images/chqkq.jpg'; // 이미지 경로를 정확히 import

export default function PostDetail() {
    // 이미지 경로 배열
    const img = [chqkq, chqkq, chqkq];

    // 임시 데이터
    const tags = ["맛집", "서울", "조용한"];
    const content = "센시티브서울은 분위기가 아주 좋고, 음식도 정말 맛있습니다. 강력히 추천드려요!";

    return (
        <div className="mt-[80px] p-5">
            {/* 상단 정보 (위치 + 작성일자) */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center">
                    <img src={location} className="w-[16px] h-[16px]" alt="Location Icon"/>
                    <p className="ml-2">센시티브서울</p>
                </div>
                <div>
                    <p>2025-05-13</p> {/* 임시 작성일자 */}
                </div>
            </div>

            {/* 이미지 영역 */}
            <div className="flex flex-row gap-2 my-4">
                {img.map((src, i) => (
                    <div key={i} className="my-2">
                        <img
                            src={src}
                            alt={`Restaurant Image ${i + 1}`}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                ))}
            </div>

            {/* 태그 영역 */}
            <div className="my-4">
                <p className="font-semibold text-gray-800">태그</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className="bg-blue-100 text-blue-500 py-1 px-3 rounded-full text-sm"
                        >
              {tag}
            </span>
                    ))}
                </div>
            </div>

            {/* 내용 영역 */}
            <div className="my-4">
                <p className="font-semibold text-gray-800">내용</p>
                <p className="text-gray-600">{content}</p>
            </div>
        </div>
    );
}
