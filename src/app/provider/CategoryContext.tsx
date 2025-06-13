<<<<<<< HEAD
import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";
=======
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCategory } from "@/entities/category/api/fetchCategory";
import { CategoryProps } from "@/entities/category/types/categoryType";

interface CategoryContextType {
    categoryItem: CategoryProps[];
    category: () => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

<<<<<<< HEAD:src/store/CategoryContext.tsx
export const CategoryProvider = ({children}: { children: React.ReactNode }) => {
    const [category, setCategory] = useState<Category[]>([]);

<<<<<<< HEAD
    const fetchCategory = async () => {
        try {
            const {data} = await axios.get('http://localhost:8080/api/category', {
=======
    const fetchCategory = async() => {
        try{
            const {data} = await api.get('http://localhost:8080/api/category', {
>>>>>>> e37c848 (창 닫았을 때 로그아웃 처리 수정)
                headers: {
                    Accept: 'Application/json'
                },
                withCredentials: true
            });
            setCategory(data);
=======
export const CategoryProvider = ({children} : {children: React.ReactNode}) => {
    const [isCategory, setIsCategory] = useState<CategoryProps[]>([]);

    const category = async() => {
        try{
            const data = await fetchCategory();
            setIsCategory(data);
>>>>>>> 54d2742 (폴더 구조 수정 및 api 로직 분리):src/app/provider/CategoryContext.tsx
        } catch (error) {
            console.log('데이터 가져오기 실패');
        }
    };
    useEffect(() => {
        category();
    }, []);

<<<<<<< HEAD:src/store/CategoryContext.tsx
    return (
        <CategoryContext.Provider value={{category, fetchCategory}}>
=======
    return(
        <CategoryContext.Provider value={{categoryItem: isCategory, category}}>
>>>>>>> 54d2742 (폴더 구조 수정 및 api 로직 분리):src/app/provider/CategoryContext.tsx
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
