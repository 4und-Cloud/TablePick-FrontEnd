import useAuth  from "../../hooks/useAuth";
import profile from '@/assets/images/profile_img.jpg';

export default function Header() {
    const {isAuthenticated, user, logout, login} = useAuth();

    return(
        <header>
            {isAuthenticated? (
                <>
                    <img src={user.image} />
                    <span>{user.name}</span>
                    <button onClick={logout}>로그아웃</button>
                </>
            ) : <button onClick={() => login({name: 'go5rae', image: profile})}>로그인</button>}
        </header>
    );
};