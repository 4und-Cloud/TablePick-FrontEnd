import {Route, Routes} from "react-router-dom";

import React, { Suspense } from 'react'

const Landing = React.lazy(() => import('@/pages/landing/Landing'));
    const OAuthSuccess = React.lazy(() => import('@/pages/oauth2/OAuthSuccessPage'));
    const RestaurantList = React.lazy(() => import('@/pages/restaurants/RestaurantList'));
    const RestaurantDetail = React.lazy(() => import("@/pages/restaurants/RestaurantDetail"));
    const PostList = React.lazy(() => import('@/pages/posts/PostList'));
    const PostDetail = React.lazy(() => import('@/pages/posts/PostDetail'));
    const Mypage = React.lazy(() => import('@/pages/myPage/Mypage'));
    const MyPosts = React.lazy(() => import('@/pages/myPost/MyPosts'));   
    const ReservationCheck = React.lazy(() => import('@/pages/reservation/ReservationCheck'));    
    const NotificationsPage = React.lazy(() => import('@/pages/notification/NotificationsPage')); 

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
