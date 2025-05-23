import { createRoot } from 'react-dom/client'
import App from './App'
import  AuthProvider  from './store/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { UserExtraInfoProvider } from './store/UserInfoContext'
import { TagProvider } from './store/TagContext'
import { CategoryProvider } from './store/CategoryContext'
//import {GoogleOAuthProvider} from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
    //<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
            <UserExtraInfoProvider>
                
                <CategoryProvider>
                    <TagProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </TagProvider>
                </CategoryProvider>
               
            </UserExtraInfoProvider>
        </AuthProvider>
    //</GoogleOAuthProvider>

)
