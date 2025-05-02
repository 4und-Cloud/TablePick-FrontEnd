import useAuth  from "../../hooks/useAuth";

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
            ) : <button onClick={() => login({name: 'go5rae', image: '/images/profile_img.jpg'})}>로그인</button>}
        </header>
    );
};