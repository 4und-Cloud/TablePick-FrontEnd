import React, {createContext, useContext} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: {
        name: string;
        image? : string;
    };
    login: ( user: {name: string; image: string}) => void;
    logout: () => void;

}