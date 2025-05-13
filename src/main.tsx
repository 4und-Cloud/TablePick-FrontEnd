import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import  AuthProvider  from './store/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserExtraInfoProvider } from './store/UserInfoContext.tsx'

createRoot(document.getElementById('root')!).render(
<AuthProvider>
    <UserExtraInfoProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </UserExtraInfoProvider>
</AuthProvider>
)
