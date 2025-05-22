import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import type {LatLngExpression} from "leaflet"
import "leaflet/dist/leaflet.css"
import useModal from "../hooks/useModal"
import ReservationModal from "../components/Modal/ReservationModal"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

type RestaurantData = {
    id: number
    name: string
    address: string
    restaurantPhoneNumber: string
    restaurantCategory: { id: number; name: string }
    restaurantImage: { imageUrl: string }
    restaurantOperatingHours: {
        dayOfWeek: string
        openTime: string | null
        closeTime: string | null
        holiday: boolean
    }[]
    restaurantTags: string[]
    menus: { name: string; price: number }[]
}

export default function RestaurantDetail() {
    const {id} = useParams<{ id: string }>()
    const [data, setData] = useState<RestaurantData | null>(null)
    const {isOpen, openModal, closeModal} = useModal({initialState: false})
    const [, setReservationSuccess] = useState(false)

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await fetch(`/api/restaurants/${id}`)
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error("식당 데이터를 불러오는데 실패했습니다.", err)
            }
        }

        if (id) fetchRestaurant()
    }, [id])

    // 예약 성공 처리 함수
    const handleReservationSuccess = () => {
        setReservationSuccess(true)
        closeModal()

        // 예약 성공 메시지 표시
        alert("예약이 완료되었습니다! 예약 시간에 맞춰 알림을 보내드립니다.")
    }

    if (!data) return <div className="mt-20 text-center">로딩 중...</div>

    const restaurantLocation: LatLngExpression = [37.5665, 126.978] // 예시 좌표

    return (
        <div className="pt-4 p-2 mt-[80px] min-h-screen flex flex-col">
            {/* 이미지 + 정보 */}
            <div className="flex flex-row gap-2 mb-8 flex-1">
                {/* 이미지 */}
                <div className="flex flex-wrap gap-4 w-full">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-[calc(33.333%-1rem)] aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
                        >
                            <img
                                src={data.restaurantImage.imageUrl || "/placeholder.svg"}
                                alt={`식당 이미지 ${i + 1}`}
                                className="object-cover w-full h-full rounded-lg"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ))}
                </div>

                {/* 정보 */}
                <div className="space-y-4 w-1/3 ml-2 items-center flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{data.name}</h2>
                        <p className="text-sm text-gray-600">{data.address}</p>
                        <p className="text-sm text-gray-600">전화번호: {data.restaurantPhoneNumber}</p>
                        <p className="text-sm text-gray-600">카테고리: {data.restaurantCategory.name}</p>
                        <p className="text-sm text-gray-600">{data.restaurantTags.slice(0, 5).join(", ")}</p>
                    </div>

                    <button
                        onClick={openModal}
                        className="w-full py-3 bg-main text-white rounded-lg hover:bg-opacity-90 transition"
                    >
                        예약하기
                    </button>
                </div>
            </div>

            {/* 지도 */}
            <div className="bg-gray-200 w-full h-96 rounded-lg mb-6 z-0">
                <MapContainer center={restaurantLocation} zoom={13} style={{width: "100%", height: "100%"}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={restaurantLocation}>
                        <Popup>{data.name} 위치입니다.</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* 주소 */}
            <div className="bg-gray-200 p-4 rounded-lg text-gray-800 mb-6">{data.address}</div>

            {/* 메뉴 + 리뷰 */}
            <div className="flex items-center justify-center flex-row gap-6">
                {/* 메뉴 */}
                <div className="w-1/2 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">메뉴</h3>
                    {data.menus.map((menu, i) => (
                        <p key={i} className="text-sm text-gray-600">
                            {menu.name} ------------------------ {menu.price}₩
                        </p>
                    ))}
                </div>

                {/* 방문자 평가 (임시) */}
                <div className="w-full mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">방문자 평가</h3>
                    <div className="flex gap-4 justify-between">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-gray-200 w-1/3 h-40 rounded-lg flex items-center justify-center overflow-hidden"
                            >
                                <img
                                    src={data.restaurantImage.imageUrl || "/placeholder.svg"}
                                    alt={`리뷰 이미지 ${i}`}
                                    className="object-cover w-full h-full rounded-lg"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 예약 모달 */}
            {isOpen && (
                <ReservationModal closeModal={closeModal} onSuccess={handleReservationSuccess}
                                  restaurantId={Number(id)}/>
            )}
        </div>
    )
}


// import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
// import {LatLngExpression} from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import useModal from '../hooks/useModal';
// import ReservationModal from '../components/Modal/ReservationModal';
// import {useState, useEffect} from 'react';
// import {useParams} from 'react-router-dom';
//
// type RestaurantData = {
//     id: number;
//     name: string;
//     address: string;
//     restaurantPhoneNumber: string;
//     restaurantCategory: { id: number; name: string };
//     restaurantImage: { imageUrl: string };
//     restaurantOperatingHours: {
//         dayOfWeek: string;
//         openTime: string | null;
//         closeTime: string | null;
//         holiday: boolean;
//     }[];
//     restaurantTags: string[];
//     menus: { name: string; price: number }[];
// };
//
// export default function RestaurantDetail() {
//     const {id} = useParams<{ id: string }>();
//     const [data, setData] = useState<RestaurantData | null>(null);
//     const {isOpen, openModal, closeModal} = useModal({initialState: false});
//
//     useEffect(() => {
//         const fetchRestaurant = async () => {
//             try {
//                 const res = await fetch(`/api/restaurants/${id}`);
//                 const json = await res.json();
//                 setData(json);
//             } catch (err) {
//                 console.error('식당 데이터를 불러오는데 실패했습니다.', err);
//             }
//         };
//
//         if (id) fetchRestaurant();
//     }, [id]);
//
//     if (!data) return <div className="mt-20 text-center">로딩 중...</div>;
//
//     const restaurantLocation: LatLngExpression = [37.5665, 126.978]; // 예시 좌표
//
//
//     return (
//         <div className="pt-4 p-2 mt-[80px] min-h-screen flex flex-col">
//             {/* 이미지 + 정보 */}
//             <div className="flex flex-row gap-2 mb-8 flex-1">
//                 {/* 이미지 */}
//                 <div className="flex flex-wrap gap-4 w-full">
//                     {[...Array(3)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="w-[calc(33.333%-1rem)] aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
//                         >
//                             <img
//                                 src={data.restaurantImage.imageUrl}
//                                 alt={`식당 이미지 ${i + 1}`}
//                                 className="object-cover w-full h-full rounded-lg"
//                                 referrerPolicy='no-referrer'
//                             />
//                         </div>
//                     ))}
//                 </div>
//
//                 {/* 정보 */}
//                 <div className="space-y-4 w-1/3 ml-2 items-center flex flex-col justify-between">
//                     <div>
//                         <h2 className="text-2xl font-semibold text-gray-800">{data.name}</h2>
//                         <p className="text-sm text-gray-600">{data.address}</p>
//                         <p className="text-sm text-gray-600">전화번호: {data.restaurantPhoneNumber}</p>
//                         <p className="text-sm text-gray-600">카테고리: {data.restaurantCategory.name}</p>
//                         <p className="text-sm text-gray-600">
//                             {data.restaurantTags.slice(0, 5).join(', ')}
//                         </p>
//                     </div>
//
//                     <button
//                         onClick={openModal}
//                         className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//                     >
//                         예약하기
//                     </button>
//                 </div>
//             </div>
//
//             {/* 지도 */}
//             <div className="bg-gray-200 w-full h-96 rounded-lg mb-6 z-0">
//                 <MapContainer center={restaurantLocation} zoom={13} style={{width: '100%', height: '100%'}}>
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
//                     <Marker position={restaurantLocation}>
//                         <Popup>{data.name} 위치입니다.</Popup>
//                     </Marker>
//                 </MapContainer>
//             </div>
//
//             {/* 주소 */}
//             <div className="bg-gray-200 p-4 rounded-lg text-gray-800 mb-6">{data.address}</div>
//
//             {/* 메뉴 + 리뷰 */}
//             <div className="flex items-center justify-center flex-row gap-6">
//                 {/* 메뉴 */}
//                 <div className="w-1/2 mb-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">메뉴</h3>
//                     {data.menus.map((menu, i) => (
//                         <p key={i} className="text-sm text-gray-600">
//                             {menu.name} ------------------------ {menu.price}₩
//                         </p>
//                     ))}
//                 </div>
//
//                 {/* 방문자 평가 (임시) */}
//                 <div className="w-full mb-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">방문자 평가</h3>
//                     <div className="flex gap-4 justify-between">
//                         {[1, 2, 3].map((i) => (
//                             <div
//                                 key={i}
//                                 className="bg-gray-200 w-1/3 h-40 rounded-lg flex items-center justify-center overflow-hidden"
//                             >
//                                 <img
//                                     src={data.restaurantImage.imageUrl}
//                                     alt={`리뷰 이미지 ${i}`}
//                                     className="object-cover w-full h-full rounded-lg"
//                                     referrerPolicy='no-referrer'
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//
//             {/* 예약 모달 */}
//             {isOpen && <ReservationModal closeModal={closeModal}/>}
//         </div>
//     );
// }
