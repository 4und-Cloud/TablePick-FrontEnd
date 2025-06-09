import {Route, Routes} from "react-router-dom";
// import Landing from "../pages/Landing";

// import MyPosts from "../pages/MyPosts";
// import Mypage from "../pages/Mypage";
// import PostDetail from "../pages/PostDetail";
// import PostList from "../pages/PostList";
// import ReservationCheck from "../pages/ReservationCheck";
// import RestaurantDetail from "../pages/RestaurantDetail";
// import RestaurantList from "../pages/RestaurantList";
// import KakaoRedirect from "../pages/oauth2/KakaoRedirect";
// import GoogleRedirect from "../pages/oauth2/GoogleRedirect";
// import OAuthSuccess from "../pages/oauth2/OAuthSuccessPage";
// import NotificationsPage from "../pages/NotificationsPage";

import React, { Suspense } from 'react'

const Landing = React.lazy(() => import('../pages/Landing'));
    const OAuthSuccess = React.lazy(() => import('../pages/oauth2/OAuthSuccessPage'));
    const RestaurantList = React.lazy(() => import('../pages/RestaurantList'));
    const RestaurantDetail = React.lazy(() => import("../pages/RestaurantDetail"));
    const PostList = React.lazy(() => import('../pages/PostList'));
    const PostDetail = React.lazy(() => import('../pages/PostDetail'));
    const Mypage = React.lazy(() => import('../pages/Mypage'));
    const MyPosts = React.lazy(() => import('../pages/MyPosts'));   
    const ReservationCheck = React.lazy(() => import('../pages/ReservationCheck'));    
    const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage')); 

export default function PageRouter() {

    console.log('pageRouter')
    return (
        <Suspense fallback={<div>...Loading</div>}>
        <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path="/oauth2/success" element={<OAuthSuccess/>}/>
            <Route path="/restaurants" element={<RestaurantList/>}/>
            <Route path="/restaurants/:id" element={<RestaurantDetail/>}/>
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail/>}/>
            <Route path="/mypage" element={<Mypage/>}/>
            <Route path="/my-posts" element={<MyPosts/>} />
            <Route path="/reservation-check" element={<ReservationCheck/>} />
            <Route path="/notifications" element={<NotificationsPage/>}/>
        </Routes>
        </Suspense>
    );
};
