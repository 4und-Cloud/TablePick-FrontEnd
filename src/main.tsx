import { createRoot } from 'react-dom/client'
import App from './App'
import  AuthProvider  from './store/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { TagProvider } from './store/TagContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TagProvider>
          <App />
        </TagProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
