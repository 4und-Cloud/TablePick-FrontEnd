export interface Mypost{
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  nickName: string;
  boardImage: string;
  restaurantName: string;
  tagNames: string[];
};

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
};

export interface FetchPostsParams {
  restaurantId?: number | null;
  page?: number;
  size?: number;
};

export interface FetchPostResponse {
    data: Post[];
    totalPages: number;
};

export interface PostData {
  id: number;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCategoryName: { id: number; name: string }
  memberNickname: string;
  memberProfileImage: string;
  content: string;
  tagNames: string[];
  imageUrls: string[];
  createdAt: string;
};

export interface RestaurantReviewPost {
  boardId: number;
  imageUrl: string;
};


