import {createRoot} from 'react-dom/client'
import App from './App'
<<<<<<< HEAD
import AuthProvider from './store/AuthContext'
import {BrowserRouter} from 'react-router-dom'
import {UserExtraInfoProvider} from './store/UserInfoContext'
import {TagProvider} from './store/TagContext'
import {CategoryProvider} from './store/CategoryContext'
//import {GoogleOAuthProvider} from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
    //<GoogleOAuthProvider clientId={import.meta..env.VITE_GOOGLE_CLIENT_ID!}>
    <AuthProvider>
        <UserExtraInfoProvider>

            <CategoryProvider>
                <TagProvider>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </TagProvider>
            </CategoryProvider>

        </UserExtraInfoProvider>
    </AuthProvider>
    //</GoogleOAuthProvider>

=======
import  AuthProvider  from './store/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { UserExtraInfoProvider } from './store/UserInfoContext'
import { TagProvider } from './store/TagContext'

createRoot(document.getElementById('root')!).render(
        <AuthProvider>
            <UserExtraInfoProvider>
                    <TagProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                </TagProvider>
            </UserExtraInfoProvider>
        </AuthProvider>
>>>>>>> 3ecc3f3 (fix : 로그아웃 문제 해결 및 전반적인 수정)
)
