import { useLocation } from "react-router-dom";
import TextBtn from "../Button/TextBtn";

interface DropdownProps {
    isOpen : boolean;
}

export default function Dropdown( {isOpen} : DropdownProps){
    const location = useLocation();

    if(!isOpen) return null;

    return(
        <div className="absolute top-[60px] mt-2 right-[50px]
        bg-white border shadow-lg rounded-[10px]
        w-48 py-2 flex flex-col items-center z-50 border-main gap-[10px]"
        >
                <TextBtn text = "마이페이지 ->"
                hoverFontWeight={location.pathname === '/mypage' ? 'font-extrabold' : 'font-medium'} />
                <TextBtn text = "예약 확인 ->" 
                hoverFontWeight={location.pathname === '/reservation-check' ? 'font-extrabold' : 'font-medium'} />
                <TextBtn text = "내가 작성한 게시글 ->" 
                hoverFontWeight={location.pathname === '/my-posts' ? 'font-extrabold' : 'font-medium'}/>
            
        </div>
    )
}