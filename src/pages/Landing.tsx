import TextBtn from "../components/Button/TextBtn";
import place from '@/assets/images/place.png';
import loc from '@/assets/images/location.png';
import chqkq from '@/assets/images/chqkq.jpg';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import FilterModal from "../components/FilterModal";
import 'react-calendar/dist/Calendar.css';
import RoundedBtn from "../components/Button/RoundedBtn";
import { useNavigate } from "react-router-dom";
import { useUserExtraInfo } from "../store/UserInfoContext";

const dummy = [
    {restaurantName: '센시티브서울' ,image: place, id:1},
    {restaurantName: '센시티브서울' ,image: chqkq, id:2},
    {restaurantName: '센시티브서울' ,image: place, id:3},  
    {restaurantName: '센시티브서울' ,image: place, id:4},    
  
]

export default function Landing(){

    const navigate = useNavigate();

    const handleRes = () => {
        navigate('/restaurants');
    }

    const handlePost = () => {
        navigate('/posts');
    }

    const handleResDetail = (id: number) => {
        navigate(`/restaurants/${id}`);
    }

    const handlePostDetail = (id: number) => {
        navigate(`/posts/${id}`);
    }

    const location = useLocation();
    const {isOpen, closeModal, openModal} = useModal({initialState: false});

    // 선택된 날짜 상태 관리
    const [date, setDate] = useState<Date | null>(null);
    // 캘린더 열림 / 닫힘 관리
    const [calOpen, setCalOpen] = useState(false);

    const toggleCalendar = () => {
        setCalOpen(prev => !prev);
    };

    const handleDateChange = (value: Value, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (value instanceof Date) {
          setDate(value);
          setCalOpen(false);
        }
      };

    // 성별 관리
    const [gender, setGender ] = useState<'male' | 'female'>();

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value as 'male' | 'female');
    }

    // 전화번호 관리
    const[phone, setPhone] = useState('');

    const handlePhoneChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(event.target.value);
        setPhone(formatted);
    }

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return `${numbers.slice(0,3)} - ${numbers.slice(3,7)} - ${numbers.slice(7,11)}`;
    }

    // 태그 추가 모달
    const {isOpen : isFilterOpen, closeModal: closeFilterModal, openModal: openFilterModal} = useModal({initialState: false});

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        if(location.state?.showModal) {
            openModal();

            // URL 상태를 변경하여 모달이 다시 표시되지 않도록 함
            // URL의 state를 확인하여 showModal이 true일 경우만 모달을 띄움
            // useLocation을 사용해 페이지 이동 시 전달된 state 확인
            setTimeout(() => {
                // URL state 값 초기화
                // => 새로고침 하거나 다시 로드 시 모달이 뜨지 않게 하기 위함
                window.history.replaceState({}, document.title);
            }, 0)
        } 
        // location.state는 페이지가 리디렉션될 때 상태값을 전달하는 역할
        // 로그인 후 페이지 이동하면 location.state에 showModal : true 전달
        // useEffect는 컴포너트가 렌더링 된 후 특정 작업을 실행하는 훅으로
        // 빈 배열일 경우 처음 렌더링 시 한 번만 실행
        // 배열에 값 저장 시 지정된 값 변경시 마다 실행 => location.state 변경 시
        // useEffect 다시 실행되어 모달 띄우는 로직 실행
    }, [location.state]);
    
   const {setUserInfo} = useUserExtraInfo();

   const handleApplyInfo = ( ) => {
    if(!gender || !date || !phone) {
        alert('모든 정보를 입력해주세요 ');
        return;
    }
    setUserInfo({
        gender, birthday: date.toISOString().split('T')[0],
        phone, tags:selectedTags,
    });
    closeModal();
   }

    return(
        <>
            {isOpen && <Modal onClose={closeModal} footer = {<RoundedBtn
                          text="적용하기"
                          bgColor="bg-main"
                          textColor="text-white"
                          borderColor="border-main"
                          hoverColor="hover:bg-white"
                          hoverTextColor="hover:text-main"
                          hoverBorderColor="hover:border-main"
                          width="w-full"
                          onClick={handleApplyInfo}
                        />} height="460px">
                <div className="m-3">
                    <div>
                        <p className="text-main font-bold text-2xl">추가 정보 입력</p>
                        <p className="text-gray-500 font-semibold">서비스 이용을 위해 추가 정보를 입력해주세요!</p>
                    </div> 
                    <div className="mt-4">
                        <p className="font-semibold text-lg mb-2">성별</p>
                        <div className="space-x-2 flex flex-row">
                            <div className="flex items-center space-x-2">
                                <input onChange={handleGenderChange} className="text-main border-main focus:ring-main" type="radio" id="male" name="gender" value='male' checked={gender === 'male'} />
                                <label htmlFor="male">남성</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input onChange={handleGenderChange} className="text-main border-main focus:ring-main" type="radio" id="female" name="gender" value='female' checked={gender === 'female'} />
                                <label htmlFor="female">여성</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="mb-2 font-semibold text-lg">생년월일</p>
                        <div>
                            <input onChange={handleGenderChange} id="birthday" type="text" value={date ? date.toLocaleDateString() : ''} readOnly onClick={toggleCalendar}
                            placeholder="생일을 선택하세요" />
                            {calOpen && (
                                <Modal onClose={toggleCalendar} width="300px" height="300px">
                                    <Calendar onChange={handleDateChange} value={date} selectRange={false} maxDate={new Date()} />
                                </Modal>)}
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="mb-2 font-semibold text-lg">전화번호</p>
                        <div>
                            <input id="phone" placeholder="010-0000-0000" value={phone} onChange={handlePhoneChange} maxLength={13}/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <RoundedBtn text="+" width="w-[50px]" height="h-[30px]"
                          bgColor="bg-white"
                          textColor="text-black"
                          borderColor="border-main"
                          hoverColor="hover:bg-white"
                          hoverTextColor="hover:text-main"
                          hoverBorderColor="hover:border-main" onClick={openFilterModal}/>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedTags.map((tag, index) => (
                                <span key={index} className="px-4 py-2 font-semibold bg-main text-white rounded-20  text-sm">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div> 
            </Modal>}
            {isFilterOpen && (
                <FilterModal mode='tag' selectedTags={selectedTags} setSelectedTags={setSelectedTags} onClose={closeFilterModal}/>
            )}
            <div className="mt-[80px] p-3">
            <div className="mb-10 mt-8">
                <div className="flex flex-row justify-between m-4">
                    <p className="font-bold text-2xl text-gray-500 ml-2">고객님이 좋아할 매장</p>
                    <TextBtn onClick={handleRes} fontSize="text-xl" text="식당 더 보기 ->" />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="flex flex-row justify-between gap-10">
                        {dummy.map((item, idx) => (
                            <div onClick={() => handleResDetail(item.id)} key={idx}>
                                <img src={item.image} className="w-[250px] h-[250px] rounded-20"/>
                                <div className="mt-1 flex flex-row gap-2 items-center">
                                    <img src={loc} className="w-[18px] h-[18px]"  />
                                    <span className="text-lg font-semibold">{item.restaurantName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-row justify-between m-4 mb-2">
                    <p className="font-bold text-2xl text-gray-500 ml-2">고객님이 좋아할 게시글</p>
                    <TextBtn onClick={handlePost} fontSize="text-xl" text="게시글 더 보기 ->" />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="flex flex-row justify-between gap-10 mt-2">
                        {dummy.map((item, idx) => (
                            <div onClick={() => handlePostDetail(item.id)} key={idx}>
                                <img src={item.image} className="w-[250px] h-[250px] rounded-20"/>
                                <div className="mt-1 flex flex-row gap-2 items-center">
                                    <img src={loc} className="w-[18px] h-[18px]"  />
                                    <span className="text-lg font-semibold">{item.restaurantName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </>
        
    )
}