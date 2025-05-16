import { useState } from "react";
import useAuth  from "../../hooks/useAuth";
import profile from '@/assets/images/profile_img.jpg';
import logo from '@/assets/images/logo_text.png';
import search from '@/assets/images/magnifying-glass.png';
import RoundedBtn from "../Button/RoundedBtn";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";

export default function AuthHeader() {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        if(!keyword.trim()) return;
        navigate(`/restaurants/search?keyword=${encodeURIComponent(keyword)}&page=1`);
        setKeyword('');
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      };

    const {logout, user} = useAuth();
    const [isOpen, setIsOpen ] = useState(false);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/')
    }

    const toggleDd = () => {
        setIsOpen(prev => !prev);
    };

    return(
        <header className="fixed top-0 z-50 bg-main w-[1200px] h-[80px] flex items-center justify-between px-4 gap-4">
                    {/* logo */}
                    <div onClick={handleClick} className="flex items-center">
                        <img src={logo} className='h-[40px]'/>
                    </div>
                    {/* 서치바 + 검색 버튼 */}
                    <div className="flex items-center gap-1">
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="식당을 검색해보세요!"
                            className="px-4 py-2 rounded-md h-[40px] w-[750px]"/>
                        <button onClick={handleSearch}>
                            <img src={search} className="bg-white rounded-md w-[40px] h-[40px]"/>
                        </button>
                    </div>
                    {/* 프로필 + 로그아웃 버튼 */}
                    <div className="flex items-center gap-4">
                        <img src={user.image || profile} onClick={toggleDd}
                        className="w-[40px] h-[40px] rounded-full"/>
                        <Dropdown isOpen={isOpen}/>
                        <RoundedBtn 
                            text="Logout" 
                            onClick={logout}
                             />
                    </div>
                    
                </header>
    )
};