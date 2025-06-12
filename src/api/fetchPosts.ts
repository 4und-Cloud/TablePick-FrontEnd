import api from "@/@shared/api/api";

export interface Post{
    id: number;
    content: string;
    restaurantName: string;
    restaurantAddress: string;
    //tagNames: string[];
    restaurantCategoryName?: string;
    memberNickname?: string;
    memberProfileImage?: string;
    imageUrl?: string;
}

interface FetchPostsParams {
  restaurantId?: string | number;
  page?: number;
  size?: number;
}

interface FetchPostResponse {
    data: Post[];
    totalPages: number;
};

export const fetchPosts = async ({ restaurantId, page = 0, size = 6, }: FetchPostsParams): Promise<FetchPostResponse> => {
    let url: string;

    if (restaurantId) {
        url = `/api/boards/restaurant/${restaurantId}`;
    } else {
        url = `/api/boards/list?page=${page}&size=${size}`;
    }

    const response = await api.get(url);

    if (restaurantId) {
        const posts = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
        return {
            data: posts, totalPages: 1,
        };
    }

    return {
        data: response.data.boardList || [],
        totalPages: response.data.totalPages || 1,
    };
};