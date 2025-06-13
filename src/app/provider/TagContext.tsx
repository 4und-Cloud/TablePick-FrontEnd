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
export const TagProvider = ({children} : {children: React.ReactNode}) => {
    //  태그 데이터 상태 관리
    const [isTags, setIsTags] = useState<TagProps[]>([]);

    // 태그 데이터 불러오기
    const tags = async() => {
        try{
            const data = await fetchTag();
            setIsTags(data);
        } catch (error) {
            console.log('데이터 가져오기 실패');
        }
    };

    useEffect(() => {
        tags();
    }, []);
        
    return(
        <TagContext.Provider value={{tagsItem: isTags, tags }}>
            {children}
        </TagContext.Provider>
    );
};
export const useTagContext = () => {
    const context = useContext(TagContext);
    if(!context) {
        throw new Error('useTagContext must be userd within a TagProvider');
    }
    return context;
    
}
    
