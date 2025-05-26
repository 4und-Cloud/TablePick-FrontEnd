import { createRoot } from 'react-dom/client'
import App from './App'
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
)
