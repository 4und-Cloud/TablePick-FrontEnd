import './App.css'
import { BrowserRouter } from "react-router-dom"
import PageRouter from "./routes/pageRouter"
import UnAuthHeader from './components/Header/UnAuthHeader'
import AuthHeader from './components/Header/AuthHeader'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="bg-background w-full min-h-screen flex justify-center items-center">
        <div className='bg-white w-[1200px] min-h-screen mx-auto'>
          {isAuthenticated ? <AuthHeader /> : <UnAuthHeader />}
          <PageRouter />
        </div>
      </div>
    </BrowserRouter>
    
    
    
  )
}

export default App
