export interface CardItemProps{
  id: number;
  linkTo? : string;
  image? :string; // 이미지
  restaurantName?: string; // 식당명
  description : string; // 주소, 게시글 내용
  tags? : string[]; // 태그
  eservationInfo? : React.ReactNode; // 예약 관련 정보
  button? : React.ReactNode; // 버튼
  buttonPosition? : 'bottom'; // 버튼 위치
  containerStyle? : string; // 카드 전체 wrapper 커스텀
  imageStyle? : string; // 이미지 커스텀
  restaurantNameStyle?: string; // 식당명 커스텀
    reservationInfo?: string;
  onClick?: () => void;
  onDelete?: (id: number) => void;
};