import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

export interface Category {
    id: number;
    name: string;
}

interface CategoryContextType {
    category: Category[];
    fetchCategory: () => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({children} : {children: React.ReactNode}) => {
    const [category, setCategory] = useState<Category[]>([]);

    const fetchCategory = async() => {
        try{
            const {data} = await api.get('http://localhost:8080/api/category', {
                headers: {
                    Accept: 'Application/json'
                },
                withCredentials: true
            });
            setCategory(data);
        } catch (error) {
            console.log('데이터 가져오기 실패');
        }
    };
    useEffect(() => {
        fetchCategory();
    }, []);

    return(
        <CategoryContext.Provider value={{category, fetchCategory}}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if(!context) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
}