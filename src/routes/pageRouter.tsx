import {Route, Routes} from "react-router-dom";
import Landing from "../pages/Landing";

//import MyPosts from "../pages/MyPosts";
import Mypage from "../pages/Mypage";
import PostDetail from "../pages/PostDetail";
import PostList from "../pages/PostList";
import ReservationCheck from "../pages/ReservationCheck";
import RestaurantDetail from "../pages/RestaurantDetail";
import RestaurantList from "../pages/RestaurantList";
// import KakaoRedirect from "../pages/oauth2/KakaoRedirect";
// import GoogleRedirect from "../pages/oauth2/GoogleRedirect";
import OAuthSuccess from "../pages/oauth2/OAuthSuccessPage";
import NotificationsPage from "../pages/NotificationsPage";

export default function PageRouter() {
    return (
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path="/oauth2/success" element={<OAuthSuccess/>}/>
            <Route path="/restaurants" element={<RestaurantList/>}/>
            <Route path="/restaurants/:id" element={<RestaurantDetail/>}/>
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail/>}/>
            <Route path="/mypage" element={<Mypage/>}/>
            {/*<Route path="/my-posts" element={<MyPosts/>} />*/}
            <Route path="/reservation-check" element={<ReservationCheck/>} />
            <Route path="/notifications" element={<NotificationsPage/>}/>
        </Routes>
    );
};
