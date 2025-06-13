import api from "@/@shared/api/api";
import { Mypost } from "../types/postType";
import { CardItemProps } from "@/@shared/types/cardItemsType";

export const formatteddMypost = (posts: Mypost[]): CardItemProps[] => {
  return posts.map(post => ({
    id: post.id,
    image: post.boardImage,
    description: post.content,
    restaurantName: post.restaurantName,
    tagNames: post.tagNames,
    linkTo: `/posts/${post.id}`
  }));
};

export const fetchMypost = async (): Promise<CardItemProps[]> => {
  try {
    const response = await api.get('/api/members/boards');
    const data: Mypost[] = response.data;

    if (!Array.isArray(data)) {
      throw new Error('API 응답이 배열 형식이 아님');
    }

    return formatteddMypost(data);
  } catch (error) {
    console.error('내 게시글 가져오기 실패: ', error);
    throw error;
  }
}