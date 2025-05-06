import logo from '@/assets/images/logo_text.png'
import search from '@/assets/images/magnifying-glass.png'
import useAuth from '../../hooks/useAuth'
import profile from '@/assets/images/profile_img.jpg';
<<<<<<< HEAD
import RoundedBtn from '../Button/RoundedBtn';
=======
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)

export default function UnAuthHeader(){
    const { login } = useAuth();
    return(
<<<<<<< HEAD
        <header className="fixed top-0 left-0 z-50 bg-main w-full h-[80px] flex items-center justify-between px-6">
=======
        <header className="bg-bg-main w-full h-[80px] flex items-center justify-between px-6">
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
            {/* logo */}
            <div className="flex items-center">
                <img src={logo} className='h-[40px]'/>
            </div>
            {/* 서치바 + 검색 버튼 */}
            <div className="flex items-center gap-1">
                <input 
                    type="text" 
                    placeholder="조용한 식당을 검색해보세요!"
                    className="px-4 py-2 rounded-md h-[40px] w-[400px]"/>
                {/* 로그인 버튼 */}
                <button>
                    <img src={search} className="bg-white rounded-md w-[40px] h-[40px]"/>
                </button>
            </div>
<<<<<<< HEAD
            <RoundedBtn onClick={() => login({name: 'go5rae', image: profile
            })} text = 'Login' />
=======
            <button onClick={() => login({name: 'go5rae', image: profile
            })} className='shadow-xl border-[2px] border-transparent h-[40px] px-[24px] py-[8px] rounded-[16px] bg-white hover:bg-bg-main hover:border-white hover:text-white'>Login</button>
>>>>>>> bacdb6f (feat : 로그인용 헤더, 비로그인용 헤더 컴포넌트 구현)
        </header>
    )
}