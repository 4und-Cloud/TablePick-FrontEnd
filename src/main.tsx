import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import  AuthProvider  from './store/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserExtraInfoProvider } from './store/UserInfoContext.tsx'
//import {GoogleOAuthProvider} from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
    //<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
            <UserExtraInfoProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </UserExtraInfoProvider>
        </AuthProvider>
    //</GoogleOAuthProvider>

)
