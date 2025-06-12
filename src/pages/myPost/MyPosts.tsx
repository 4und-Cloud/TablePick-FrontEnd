import { CardItemProps } from "../../@shared/components/CardItem";
import List from "../../@shared/components/List";
import { useEffect, useState } from "react";
import api from "../../@shared/api/api";

interface Mypost{
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  nickName: string;
  boardImage: string;
  restaurantName: string;
  tagNames: string[];
}

export default function MyPosts() {
  const [post, setPost] = useState<CardItemProps[]>([]);


  useEffect(() => {
    fetchMypost();
  }, []);

  const handleDeletePost = async (id: number) => {
  if (window.confirm('정말 삭제하시겠습니까?')) {
    try {
      console.log('Deleting post ID:', id, 'URL:', `/api/boards/${id}`);
      const response = await api.delete(`/api/boards/${id}`);
      console.log('삭제 성공:', response.data);
      alert('게시글이 성공적으로 삭제되었습니다.');
      fetchMypost();
    } catch (error: any) {
      console.error('삭제 중 오류:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        `게시글 삭제 실패: ${
          error.response?.data?.message || error.message || '서버와 연결할 수 없습니다.'
        }`
      );
    }
  }
};

  const fetchMypost = async () => {
    try {
      const res = await api.get(`/api/members/boards`);

      const data: Mypost[] = await res.data;

      const formattedMypost: CardItemProps[] = data.map(post => ({
        id: post.id,
        image:post.boardImage,
        description: post.content,
        restaurantName: post.restaurantName,
        tagNames: post.tagNames,
        linkTo: `/posts/${post.id}`
      }));
      setPost(formattedMypost);
    } catch (error) {
      //console.log(error)
    }
  };

  return (
      <div className="m-4">
        <div>
          {post.length > 0 ? (
            <List onDelete={handleDeletePost} items={post} />
          ) : (
            <p className="text-center text-gray-500 mt-10">게시글 내역이 없습니다.</p>
          )}
  
          <div>
          </div>
        </div>
        
      </div>
    );
  }
