import { CardItemProps } from "../components/CardItem";
import List from "../components/List";
import { useEffect, useState } from "react";
import api from "../lib/api";

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
        const res = await api.delete(`/api/boards/${id}`);
        fetchMypost();
      } catch (error) {
        console.error('삭제 중 오류 발생', error);
        alert('게시글 삭제 실패');
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
            <List linkTo="posts" onDelete={handleDeletePost} items={post} />
          ) : (
            <p className="text-center text-gray-500 mt-10">게시글 내역이 없습니다.</p>
          )}
  
          <div>
          </div>
        </div>
        
      </div>
    );
  }
