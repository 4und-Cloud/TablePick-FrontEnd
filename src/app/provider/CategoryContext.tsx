import { createContext, useContext, useEffect, useState } from "react";
import { fetchCategory } from "@/entities/category/api/fetchCategory";
import { CategoryProps } from "@/entities/category/types/categoryType";

interface CategoryContextType {
    categoryItem: CategoryProps[];
    category: () => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({children} : {children: React.ReactNode}) => {
    const [isCategory, setIsCategory] = useState<CategoryProps[]>([]);

    const category = async() => {
        try{
            const data = await fetchCategory();
            setIsCategory(data);
        } catch (error) {
            console.log('데이터 가져오기 실패');
        }
    };
    useEffect(() => {
        category();
    }, []);

    return(
        <CategoryContext.Provider value={{categoryItem: isCategory, category}}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
}
