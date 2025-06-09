import { createRoot } from 'react-dom/client'
import App from './App'
import  AuthProvider  from './store/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { TagProvider } from './store/TagContext'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <TagProvider>
                <App />
            </TagProvider>
        </AuthProvider>
    </BrowserRouter>
)
