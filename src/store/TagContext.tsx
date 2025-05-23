import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";

// 태그 타입 
export interface Tag {
    id: number;
    name: string;
}

// Context에 저장할 데이터 타입
interface TagContextType {
    tags: Tag[];
    fetchTags: () => Promise<void>
}

// Context 생성
const TagContext = createContext<TagContextType | undefined>(undefined);

// Provider 정의
export const TagProvider = ({children}: { children: React.ReactNode }) => {
    //  태그 데이터 상태 관리
    const [tags, setTags] = useState<Tag[]>([]);

    // 태그 데이터 불러오기
    const fetchTags = async () => {
        try {
            const {data} = await axios.get('http://localhost:8080/api/tags', {
                headers: {
                    Accept: 'Application/json'
                },
                withCredentials: true
            });
            setTags(data);
            //console.log(data);
        } catch (error) {
            console.log('데이터 가져오기 실패');
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return (
        <TagContext.Provider value={{tags, fetchTags}}>
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
