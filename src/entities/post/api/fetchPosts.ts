import api from "@/@shared/api/api";
import { CardItemProps } from "@/@shared/types/cardItemsType";
import { Post, FetchPostsParams, PostData, RestaurantReviewPost, FetchPostResponse } from "../types/postType";

export const convertedPostListData = (posts: Post[], defaultProfile: string): CardItemProps[] => {
    return posts.map((item, i) => ({
        id: item.id || i + 1,
        description: item.content || "내용 없음",
        restaurantName: item.restaurantName || "정보 없음",
        restaurantAddress: item.restaurantAddress || "정보 없음",
        restaurantCategoryName: item.restaurantCategoryName || "정보 없음",
        memberNickname: item.memberNickname || "정보 없음",
        memberProfileImage: item.memberProfileImage || defaultProfile,
        image: item.imageUrl,
        linkTo: `/posts/${item.id}`
    }));
};

export const fetchRestaurantPost = async (id: string) : Promise<RestaurantReviewPost[]> => {
    const response = await api.get(`/api/boards/restaurant/${id}`);
    return response.data;
}

export const fetchPostDetail = async (id: string): Promise<PostData> => {
    const response = await api.get(`/api/boards/${id}`);
    return response.data;
};

export const fetchPosts = async ({ restaurantId, page = 0, size = 6, }: FetchPostsParams): Promise<FetchPostResponse> => {
    let url: string;

    if (restaurantId) {
        url = `/api/boards/restaurant/${restaurantId}`;
    } else {
        url = `/api/boards/list?page=${page}&size=${size}`;
    }

    try {
        const response = await api.get(url);

        if (restaurantId) {
            const posts = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
            return {
                data: posts, totalPages: 1,
            };
        };

        return {
            data: response.data.boardList ?? [],
            totalPages: response.data.totalPages ?? 1,
        };
    } catch (error) {
        console.error('게시글 목록 불러오기 실패 : ', error);
        throw error;
    }
};

export const fetchCreatePost = async (formData : FormData) => {
    const response = await api.post('api/boards', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export const fetchDeletePost = async (id: number) => {
    const response = await api.delete(`/api/boards/${id}`);
    return response.data;
}