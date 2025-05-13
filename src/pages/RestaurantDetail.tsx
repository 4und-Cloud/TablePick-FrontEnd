import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';  // 좌표 타입을 위한 임포트
import 'leaflet/dist/leaflet.css';
import chqkq from '@/assets/images/chqkq.jpg';
import useModal from '../hooks/useModal';
import ReservationCheck from './ReservationCheck';
import ReservationModal from '../components/ReservationModal';

export default function RestaurantDetail() {
  const restaurantLocation: LatLngExpression = [37.5665, 126.978]; // 예시 좌표 (서울)

    const {isOpen, openModal, closeModal} = useModal({initialState: false});

  const images = [
    chqkq, chqkq, chqkq,    
  ];

  return (
    <div className="pt-4 p-2 mt-[80px] min-h-screen flex flex-col">
  {/* 상단 이미지, 지도, 정보 섹션 */}
  <div className="flex flex-row gap-2 mb-8 flex-1">
    {/* 이미지 영역 */}
    <div className="flex flex-wrap gap-4 w-full">
  {images.map((src, i) => (
    <div
      key={i}
      className="w-[calc(33.333%-1rem)] aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
    >
      <img
        src={src}
        alt={`Restaurant Image ${i + 1}`}
        className="object-cover w-full h-full rounded-lg"
      />
    </div>
  ))}
</div>

    {/* 식당 정보 */}
    <div className="space-y-4 w-1/3 ml-2 items-center flex flex-col justify-between">
        <div>
            <h2 className="text-2xl font-semibold text-gray-800">센시티브서울</h2>
            <p className="text-sm text-gray-600">
            <a href="#" className="text-blue-500">월 - 일 · 09:00 - 18:00</a>
            </p>
            <p className="text-sm text-gray-600">
            전화번호: <a href="#" className="text-blue-500">전화번호</a>
            </p>
            <p className="text-sm text-gray-600">조용해요, 분위기가 좋아요, 음식이 맛있어요</p>
        </div>

        {/* 예약 버튼 */}
        <button onClick={openModal} className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            예약하기
        </button>
        <ReservationModal />
    </div>

  </div>

  {/* 지도 영역 */}
  <div className="bg-gray-200 w-full h-96 rounded-lg mb-6 z-0">
    <MapContainer center={restaurantLocation} zoom={13} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={restaurantLocation}>
        <Popup>이곳은 식당 위치입니다.</Popup>
      </Marker>
    </MapContainer>
  </div>

  <div className="bg-gray-200 p-4 rounded-lg text-gray-800 mb-6">주소주소주소주소주소주소주소주소</div>

  {/* 메뉴와 방문자 평가 영역 */}
  <div className="flex items-center justify-center flex-row gap-6">
    {/* 메뉴 섹션 */}
    <div className="w-1/2 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">메뉴</h3>
      {[...Array(10)].map((_, i) => (
        <p key={i} className="text-sm text-gray-600">메뉴명 ------------------------ 가격</p>
      ))}
    </div>

    {/* 방문자 평가 섹션 */}
    <div className="w-full mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">방문자 평가</h3>
        <div className="flex gap-4 justify-between">
            <div className="bg-gray-200 w-1/3 h-40 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={chqkq} alt="User Review 1" className="object-cover w-full h-full rounded-lg" />
            </div>
            <div className="bg-gray-200 w-1/3 h-40 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={chqkq} alt="User Review 2" className="object-cover w-full h-full rounded-lg" />
            </div>
            <div className="bg-gray-200 w-1/3 h-40 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={chqkq} alt="User Review 3" className="object-cover w-full h-full rounded-lg" />
            </div>
        </div>
    </div>
  </div>

  
</div>

  );
}
