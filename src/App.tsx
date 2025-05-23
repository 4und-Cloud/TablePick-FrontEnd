// App.tsx
import './App.css'
import PageRouter from "./routes/pageRouter"
import Header from './components/Header/Header'

function App() {
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-white">
      {/* 전체 상단 보더 (헤더 높이만큼, 예: 64px) */}
      <div className="absolute top-0 left-0 w-full h-[97px] border-b border-main z-0" />

      {/* 실제 콘텐츠 영역 */}
      <div className="h-[97px] border-b border-main relative z-10 w-[1200px] min-h-screen bg-white">
        <Header />
        <PageRouter />
      </div>
    </div>
  )
}

export default App;
