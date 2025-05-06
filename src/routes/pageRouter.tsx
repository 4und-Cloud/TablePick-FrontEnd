import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import MyPosts from "../pages/MyPosts";
import Mypage from "../pages/Mypage";
import PostDetail from "../pages/PostDetail";
import PostList from "../pages/PostList";
import ReservationCheck from "../pages/ReservationCheck";
import RestaurantDetail from "../pages/RestaurantDetail";
import RestaurantList from "../pages/RestaurantList";

export default function PageRouter(){
    return(
        <Routes>
            <Route path='/' element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail/>} />
            <Route path="/mypage" element={<Mypage/>} />
            <Route path="/my-posts" element={<MyPosts/>} />
            <Route path="/reservation-check" element={<ReservationCheck/>} /> 
        </Routes>
    );
};