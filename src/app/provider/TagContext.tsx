import {createContext, useContext, useEffect, useState } from "react";
import { fetchTag } from "@/entities/tag/api/fetchTag";
import { TagProps } from "@/entities/tag/types/tagType";

// Context에 저장할 데이터 타입
interface TagContextType {
    tagsItem: TagProps[];
    tags: () => Promise<void>
}

// Context 생성
const TagContext = createContext<TagContextType | undefined>(undefined);

// Provider 정의
export const TagProvider = ({children}: { children: React.ReactNode }) => {
    //  태그 데이터 상태 관리
    const [isTags, setIsTags] = useState<TagProps[]>([]);

    // 태그 데이터 불러오기
<<<<<<< HEAD:src/store/TagContext.tsx
<<<<<<< HEAD
    const fetchTags = async () => {
        try {
            const {data} = await axios.get('http://localhost:8080/api/tags', {
=======
    const fetchTags = async() => {
        try{
            const {data} = await api.get('http://localhost:8080/api/tags',{
>>>>>>> e37c848 (창 닫았을 때 로그아웃 처리 수정)
                headers: {
                    Accept: 'Application/json'
                },
                withCredentials: true
            });
            setTags(data);
=======
    const tags = async() => {
        try{
            const data = await fetchTag();
            setIsTags(data);
>>>>>>> 54d2742 (폴더 구조 수정 및 api 로직 분리):src/app/provider/TagContext.tsx
        } catch (error) {
            console.log('데이터 가져오기 실패');
        }
    };

    useEffect(() => {
        tags();
    }, []);
<<<<<<< HEAD:src/store/TagContext.tsx

    return (
        <TagContext.Provider value={{tags, fetchTags}}>
=======
        
    return(
        <TagContext.Provider value={{tagsItem: isTags, tags }}>
>>>>>>> 54d2742 (폴더 구조 수정 및 api 로직 분리):src/app/provider/TagContext.tsx
            {children}
        </TagContext.Provider>
    );
};
export const useTagContext = () => {
    const context = useContext(TagContext);
    if (!context) {
        throw new Error('useTagContext must be userd within a TagProvider');
    }
    return context;

}
