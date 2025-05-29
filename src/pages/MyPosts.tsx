import { CardItemProps } from "../components/CardItem";
import List from "../components/List";
import { useEffect, useState } from "react";

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
        const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
        const res = await fetch(`${apiUrl}/api/boards/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.log('게시글 삭제 실패 응답 :', res.status, errorText);
          throw new Error('게시글 삭제 실패');
        }
        console.log(`${id}  삭제 성공 `);
        fetchMypost();
      } catch (error) {
        console.error('삭제 중 오류 발생', error);
        alert('게시글 삭제 실패');
      }
    }
  };

  const fetchMypost = async () => {
    try {
      const apiUrl = import.meta.env.VITE_TABLE_PICK_API_URL;
      const res = await fetch(`${apiUrl}/api/members/boards`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('응답 실패 :', errorText);
        throw new Error('내 게시글 정보 불러오기');
      }
      const data: Mypost[] = await res.json();
      console.log('게시글 데이터 : ', data);

      const formattedMypost: CardItemProps[] = data.map(post => ({
        id: post.id,
        image:post.boardImage,
        description: post.content,
        restaurantName: post.restaurantName,
        tagNames: post.tagNames,
      }));
      setPost(formattedMypost);
    } catch (error) {
      console.log(error)
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
