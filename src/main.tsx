import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import  AuthProvider  from './store/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
<AuthProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</AuthProvider>
)
