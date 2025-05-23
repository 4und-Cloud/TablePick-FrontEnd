// App.tsx
import './App.css'
import PageRouter from "./routes/pageRouter"
import Header from './components/Header/Header'

function App() {
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-white">
      {/* 전체 상단 보더 */}
      <div className="absolute top-0 left-0 w-full h-[97px] z-20 border-b border-main" />

      {/* 실제 콘텐츠 영역 */}
      <div className="relative z-10 w-[1200px] min-h-screen bg-white">
        <Header />
        <PageRouter />
      </div>
    </div>
  )
}

export default App;
