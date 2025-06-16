import { createRoot } from 'react-dom/client'
import App from './App'
import  AuthProvider  from './provider/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
          <App />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
