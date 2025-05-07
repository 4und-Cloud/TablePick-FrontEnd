interface CardItemProps{
    image? :string; // 이미지
    restaurantName: string; // 식당명
    description? : string; // 주소, 게시글 내용
    tags? : string[]; // 태그
    reservationInfo? : React.ReactNode; // 예약 관련 정보
    button? : React.ReactNode; // 버튼
    buttonPosition? : 'topRight' | 'middleRight' // 버튼 위치
}

export default function CardItem( { image, restaurantName, description, 
    tags = [], reservationInfo, button, buttonPosition
 } : CardItemProps ){
    return (
        <div className="relative flex border rounded-xl shadow-xl p-2 bg-card mx-2 h-[120px] justify-center items-center">
          {image && (
            <img
              src={image}
              alt={restaurantName}
              className="w-[100px] h-[100px] rounded-md mr-4"
            />
          )}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h2 className="text-lg font-bold">{restaurantName}</h2>
              {description && <p className="text-sm text-gray-600 mt-1 truncate max-w-full">{description}</p>}
              {reservationInfo && <div className="text-xl text-main mt-2 font-semibold">{reservationInfo}</div>}
              {tags.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                  {tags.map((tag, i) => (
                    <span key={i} className="bg-main text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {button && buttonPosition === 'topRight' && (
  <div className="absolute right-4 top-4">
    {button}
  </div>
)}
{button && buttonPosition === 'middleRight' && (
  <div className="absolute right-4 top-1/2 -translate-y-1/2">
    {button}
  </div>
)}
          </div>
        </div>
      );
}