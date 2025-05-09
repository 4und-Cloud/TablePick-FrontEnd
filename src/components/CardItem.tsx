import location from '@/assets/images/location.png'

export interface CardItemProps{
    image? :string; // 이미지
    restaurantName?: string; // 식당명
    description? : string; // 주소, 게시글 내용
    tags? : string[]; // 태그
    reservationInfo? : React.ReactNode; // 예약 관련 정보
    button? : React.ReactNode; // 버튼
    buttonPosition? : 'bottom'; // 버튼 위치
    containerStyle? : string; // 카드 전체 wrapper 커스텀
    imageStyle? : string; // 이미지 커스텀
    restaurantNameStyle?: string; // 식당명 커스텀
}

export default function CardItem({
    image,
    containerStyle,
    imageStyle,
    restaurantNameStyle,
    restaurantName,
    description,
    tags = [],
    reservationInfo,
    button,
    buttonPosition,

  }: CardItemProps) {
    return (
<div className={`relative flex flex-col p-3 mx-2 my-2 overflow-hidden ${containerStyle ?? 'border w-[370px] rounded-xl shadow-xl h-[335px] bg-card'}`}>
        {image && (
          <img
            src={image}
            alt={restaurantName}
            className={`w-full h-[200px] rounded-md object-cover mb-2 ${imageStyle}`}
          />
        )}
  
        <div className="flex flex-col justify-between w-full overflow-hidden">
          <div className="flex flex-col overflow-hidden w-full">
            <div className="flex flex-col justify-between w-full">
              <div className='flex flex-row items-center gap-2'>
                <img src={location} className='w-[16px] h-[16px]' />
                <span className={`text-lg font-bold w-full ${restaurantNameStyle}`}>
                  {restaurantName}
                </span>
              </div>
              
              {description && (
                <span className="text-sm text-gray-600 w-full mt-[2px] truncate">
                  {description}
                </span>
              )}
            </div>
  
            {reservationInfo && (
              <div className="text-main text-medium font-bold">
                {reservationInfo}
              </div>
            )}
  
            {tags.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide w-full">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-main text-white font-semibold text-sm px-3 py-2 rounded-full whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
  
          {/* 버튼 (절대 위치) */}
          {button && buttonPosition === 'bottom' && (
            <div className="absolute bottom-2">
              {button}
            </div>
          )}
        </div>
      </div>
    );
  }
  