import './App.css'
import PageRouter from "./routes/pageRouter"
import UnAuthHeader from './components/Header/Header'

function App() {
  

  return (
      <div className="bg-background w-full min-h-screen flex justify-center items-center">
        <div className='relative bg-white w-[1200px] min-h-screen mx-auto'>
          <UnAuthHeader />
          <PageRouter />
        </div>
      </div>
    
    
    
  )
}

export default App
